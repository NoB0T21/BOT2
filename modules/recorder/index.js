//Sets up the voice connection and calls user-level recorders.

import { joinVoiceChannel } from "@discordjs/voice";
import fs from "fs";
import path from "path";
import { startUserRecording } from "./userRecorder.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

    connection.receiver.speaking.on("start", async (userId) => {
        startUserRecording(channel, receiver, userId, outputDir, connection);
    });
}