import { SlashCommandBuilder } from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join your voice channel and start recording everyone"),
  new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Force the bot to leave the channel and stop all recordings"),
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Show your speaking time and earnings'),
  new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Request a payout (manual, $5 minimum)')
].map((cmd) => cmd.toJSON());