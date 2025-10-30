//Handles Discord logic only — permission checks, embed creation, etc.

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import {stoppedUsers, userStreams} from "../states/state.js"
import {startRecording} from "../modules/recorder/index.js";

export const Join = async (interaction) => {
    stoppedUsers.clear();
    userStreams.clear();

    const channel = interaction.member?.voice?.channel;
    if (!channel)
        return interaction.reply({
            content: "❌ You must be in a voice channel!",
            flags: 1 << 6,
        });

        const members = channel.members.filter((m) => !m.user.bot);
        if (members.size === 0)
            return interaction.reply({
                content: "⚠️ No users to record in this channel.",
                flags: 1 << 6,
          });

        const startedAt = new Date().toLocaleTimeString();
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🎙️ Recording Started")
            .setDescription(
                `**Channel:** ${channel.name}\n**Started:** ${startedAt}\n\nActivity:\n${[...members.values()]
                .map((m) => `🎧 ${m.user.username} joined the recording`)
                .join("\n")}`
            )
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("stop_recording")
            .setLabel("⏹️ Stop Recording")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [embed], components: [row] });

        await startRecording(channel);
}