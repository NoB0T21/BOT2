//Handles stop recording button interaction

import { getVoiceConnection } from "@discordjs/voice";
import { userStreams} from "../states/state.js"
import { handleNoRecording } from "../modules/exceptionHandlers.js";
import { stopUserRecording } from "../modules/recorder/stopUserRecorder.js";

export const handleStopRecording =  async (interaction) => {
      if (!interaction.isButton() || interaction.customId !== "stop_recording") return;

      const guild = interaction.guild;
      const connection = getVoiceConnection(guild.id);

      if (!connection)
        return interaction.reply({
          content: "❌ Bot is not connected to a voice channel.",
          flags: 1 << 6,
        });

      const userId = interaction.user.id;
      const streamData = userStreams.get(userId);

      if (!streamData) return handleNoRecording(interaction, userId)

      

      await stopUserRecording(interaction, userId, streamData, connection);
}