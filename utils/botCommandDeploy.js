 import { Routes } from "discord.js";
import { commands } from "./utils.js";

 export async function registerCommands(CLIENT_ID,rest) {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands.map((cmd) => cmd.toJSON()),
    });
    console.log("✅ Slash commands registered!");
  } catch (err) {
    console.error(err);
  }
}