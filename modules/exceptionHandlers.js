import { EmbedBuilder } from "discord.js";
import { stoppedUsers } from "../states/state.js"

//Handles when user hasn’t spoken yet
export const handleNoRecording = async (interaction, userId) => {
  stoppedUsers.add(userId);
  const embed = new EmbedBuilder()
    .setColor("Yellow")
    .setTitle("⚠️ No Active Recording Found")
    .setDescription("You haven’t spoken yet — no active recording to stop.")
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
};