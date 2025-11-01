import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  InteractionType,
} from "discord.js";

import { connectToDB } from './DB/mogodbConnect.js';
connectToDB();
import path from "path";
import { fileURLToPath } from "url";
import { REST } from "@discordjs/rest";
import { registerCommands } from "./utils/botCommandDeploy.js";
import {Join} from "./commands/join.js";
import {Leave} from "./commands/leave.js";
import { handleStopRecording } from "./handler/stopRecordingHandler.js";
import { stopUserRecordingOnLeave } from "./handler/userVoiceHandler.js";
import { Balance } from "./commands/balance.js";
import { Withdraw } from "./commands/withdraw.js";
import { HandleWithdraw } from "./handler/WithdrawHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

 await registerCommands(CLIENT_ID,GUILD_ID, rest)

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    // Slash Commands
    if (interaction.type === InteractionType.ApplicationCommand) {
      const { commandName } = interaction;

      // 🎙️ JOIN
      if (commandName === "join") {
        Join(interaction)
      }

      // 👋 LEAVE (force stop)
      if (commandName === "leave") {
        Leave(interaction);
      }

      // Balance
      if (commandName === 'balance') {
        Balance(interaction);
      }
      if (commandName === 'withdraw') {
        await Withdraw(interaction,client);
      }
    }

    // 🎚️ Button Interaction
    if (interaction.isButton() && interaction.customId === "stop_recording") {
      await handleStopRecording(interaction);
    }
    if (interaction.isButton()) {
      await HandleWithdraw(interaction,client)
    }
  } catch (err) {
    console.error("❌ Interaction Error:", err);
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (oldState.channelId && !newState.channelId) {
    stopUserRecordingOnLeave(oldState);
  }
});


client.login(TOKEN);
