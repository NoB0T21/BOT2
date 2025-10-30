//Sets up the voice connection and calls user-level recorders.

import { joinVoiceChannel } from "@discordjs/voice";
import fs from "fs";
import path from "path";
import { startUserRecording } from "./userRecorder.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const startRecording = async (channel) => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
    });

    const receiver = connection.receiver;
    const outputDir = path.join(__dirname, "../../recordings");
    fs.mkdirSync(outputDir, { recursive: true });

    connection.receiver.speaking.on("start", (userId) => startUserRecording(channel, receiver, userId, outputDir));
}