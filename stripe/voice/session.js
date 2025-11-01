import { EndBehaviorType } from '@discordjs/voice';
import prism from 'prism-media';
import { UserStat } from '../../models/userState.js';

const sessions = new Map();
const guildId = process.env.GUILD_ID; // guildId -> { connection, listeners map }

const SILENCE_TIMEOUT_MS = 5000; // if no data for ~5s, consider stopped speaking

export async function startSession(channel,userId,receiver,connection) {

  const listeners = new Map(); // userId -> { lastActiveTs, speaking, timer }

  // avoid bots
  const member = channel.members.get(userId);
  if (!member || member.user.bot) return;

  // If already listening to this user, return
  if (listeners.has(userId) && listeners.get(userId).listening) return;

  // Subscribe to opus
  const opusStream = receiver.subscribe(userId, { end: { behavior: EndBehaviorType.Manual } });

  // Decoder -> gives PCM buffers
  const decoder = new prism.opus.Decoder({ rate: 48000, channels: 1, frameSize: 960 });

  // Attach data listener to detect actual audio
  const onData = async (chunk) => {
    // Mark as speaking: start timer if not speaking
    const now = Date.now();
    let info = listeners.get(userId);
    if (!info) {
      info = { listening: true, speaking: false, lastActiveTs: now, accrued: 0, startTs: null, opusStream, decoder };
      listeners.set(userId, info);
    }

    // If not currently speaking, mark start
    if (!info.speaking) {
      info.speaking = true;
      info.startTs = now;
    }
    info.lastActiveTs = now;

    // clear/refresh silence timer
    if (info.silenceTimeout) clearTimeout(info.silenceTimeout);
    info.silenceTimeout = setTimeout(async () => {
      // ended speaking
      const endTs = Date.now();
      const delta = Math.floor((endTs - (info.startTs || endTs)) / 1000); // seconds
      if (delta > 0) {
        await addSecondsToUser(userId, delta);
      }
      info.speaking = false;
      info.startTs = null;
    }, SILENCE_TIMEOUT_MS);
  };

    // Pipe opus -> decoder -> use 'data' events
    opusStream.pipe(decoder);
    decoder.on('data', onData);

    listeners.set(userId, {
      listening: true,
      opusStream,
      decoder,
      onData,
      silenceTimeout: null,
      speaking: false,
      startTs: null
    });


  // Clean up when users stop speaking entirely (maybe leave)
  // receiver.speaking.on('end', (userId) => {
  //   const info = listeners.get(userId);
  //   if (!info) return;
  //   // Allow silence timeout to finalize the last segment
  //   if (info.silenceTimeout) {
  //     // when silence timeout fires it will call accumulation
  //   }
  //   // we still keep 'listeners' for subsequent speaks; optionally remove after a while
  // });

  sessions.set(guildId, { connection, listeners });
  console.log(`Tracking voice activity in guild ${guildId}`);
}

async function addSecondsToUser(userId, secondsToAdd) {
  // add seconds to DB (atomic)
  await UserStat.updateOne(
    { userId },
    { $inc: { totalSeconds: secondsToAdd }, $set: { updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function stopSession(guildId) {
  const s = sessions.get(guildId);
  if (!s) return;
  try {
    s.connection.destroy();
  } catch {}
  // flush any remaining silence timers and accumulate
  for (const [userId, info] of s.listeners.entries()) {
    if (info.speaking && info.startTs) {
      const delta = Math.floor((Date.now() - info.startTs) / 1000);
      if (delta > 0) await addSecondsToUser(userId, delta);
    }
    if (info.opusStream) {
      try { info.opusStream.destroy(); } catch {}
    }
    if (info.decoder) {
      try { info.decoder.removeAllListeners(); } catch {}
    }
    if (info.silenceTimeout) clearTimeout(info.silenceTimeout);
  }
  sessions.delete(guildId);
}
export function isRecording(guildId) {
  return sessions.has(guildId);
}
