//Stops all active recordings and disconnects the bot from the voice channel.

import { getVoiceConnection } from "@discordjs/voice";
import { userStreams} from "../states/state.js"

export const Leave = async (interaction) => {
    const guildId = interaction.guildId;
    const connection = getVoiceConnection(guildId);

    if (!guildId)
        return interaction.reply({
            content: "❌ This command can only be used in a server.",
            flags: 1 << 6,
        });

    if (!connection){
        return interaction.reply({
            content: "❌ Bot is not connected to a voice channel.",
            flags: 1 << 6,
        });
    }

    for (const [userId, { ffmpeg, opusStream, username }] of userStreams.entries()) {
        try {
            opusStream.unpipe();
            ffmpeg.stdin.end();
            console.log(`🛑 Force stopped ${username}`);
        } catch (err) {
            console.error(`⚠️ Error stopping ${username}:`, err);
        }
    }

    userStreams.clear();
    connection.destroy();
    await interaction.reply({
        content:"👋 Bot left the voice channel and stopped all recordings.",
        ephemeral: true,
    });
}