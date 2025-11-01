//Handles individual user’s audio recording

import { EndBehaviorType } from "@discordjs/voice";
import path from "path";
import { spawn } from "child_process";
import prism from "prism-media";
import {stoppedUsers, userStreams} from "../../states/state.js"

export const startUserRecording =  (channel, receiver, userId, outputDir) => {
    const member = channel.members.get(userId);
    if (!member || member.user.bot) return;
    if (stoppedUsers.has(userId)) return;

    // Skip if already recording this user
    if (userStreams.has(userId)) return;

    const username = member.user.username;
    //const oggPath = path.join(outputDir, `${username}-${Date.now()}.ogg`);
    const wavPath = path.join(outputDir, `${username}-${Date.now()}.wav`);
    const startTime = Date.now();

    console.log(`🎤 ${username} started speaking, recording...`);

    const opusStream = receiver.subscribe(userId, {
        end: { behavior: EndBehaviorType.Manual},
    });

    const decoder = new prism.opus.Decoder({
        rate: 48000,
        channels: 1,
        frameSize: 960,
    });

    // const ffmpeg = spawn("ffmpeg", [
    //     "-f","s16le",
    //     "-ar","48000",
    //     "-ac","1",
    //     "-i","pipe:0",
    //     "-acodec", "libopus",
    //     "-b:a", "128k", 
    //     "-vbr", "on",          
    //     "-compression_level", "10",
    //     "-f","ogg",
    //     oggPath,
    // ]);

    const ffmpeg = spawn("ffmpeg", [
        "-f", "s16le",       
        "-ar", "48000",      
        "-ac", "1",          
        "-i", "pipe:0",      
        "-acodec", "pcm_s16le",
        "-f", "wav",         
        wavPath,
    ]);

    opusStream.pipe(decoder).pipe(ffmpeg.stdin);

    ffmpeg.on("close", () => {
        const durationSec = Math.floor((Date.now() - startTime) / 1000);
        console.log(`✅ Saved ${username}'s recording (${durationSec}s)`);
    });

    userStreams.set(userId, { ffmpeg, opusStream, oggPath, username, startTime });
}