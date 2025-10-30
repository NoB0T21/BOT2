// If user leaves the channel or moves to another channel

import { userStreams} from "../states/state.js"

export const stopUserRecordingOnLeave = (oldState) => {
    const userId = oldState.id;
    const streamData = userStreams.get(userId);
    
    if (!streamData) return;

    const { ffmpeg, opusStream, username } = streamData;
    try {
        opusStream.unpipe();
        ffmpeg.stdin.end();
        console.log(`🚪 ${username} left channel — stopped recording.`);
    } catch (err) {
        console.error(`Error stopping ${username}:`, err);
    }

    userStreams.delete(userId);
}