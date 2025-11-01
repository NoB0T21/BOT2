 import { Routes } from "discord.js";
import { commands } from "./utils.js";

 export async function registerCommands(CLIENT_ID, GUILD_ID,rest) {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID), {
      body: commands,
    });
    console.log("✅ Slash commands registered!");
  } catch (err) {
    console.error(err);
  }
}