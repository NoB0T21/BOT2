
import fs from "fs";
import { EmbedBuilder } from "discord.js";
import {stoppedUsers, userStreams} from "../../states/state.js"
import { uploadAudioToS3} from "../uploadToAWS.js"


export const  stopUserRecording = async(interaction, userId, streamData, connection) => {
  const { ffmpeg, opusStream, oggPath, username, startTime } = streamData;

  opusStream.unpipe();
  if (!ffmpeg.killed) {
    ffmpeg.stdin.end();
    ffmpeg.kill("SIGINT"); // Ensures file is finalized and written properly
  }
    
  ffmpeg.on("close", async () => {
    const durationSec = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const formattedDuration = `${mins}m ${secs}s`;

    console.log(`🛑 Stopped recording ${username} (${formattedDuration})`);

    const embed = new EmbedBuilder()
    .setColor("Green")
    .setTitle("🎧 Recording Completed")
    .setDescription(
        `**User:** ${username}\n**Duration:** ${formattedDuration}\n\nYour recording is ready!`
    )
    .setTimestamp();

    if (fs.existsSync(oggPath)) {
        await interaction.channel.send({
            embeds: [embed],
            files: [oggPath],
        });
    }

    stoppedUsers.add(userId);
    userStreams.delete(userId);

    if (userStreams.size === 0) {
      connection.destroy();
      await interaction.channel.send("👋 All recordings stopped. Bot left the voice channel.");
    }

    const feedbackEmbed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("🛑 Recording Stopped")
    .setDescription(`Your recording has been stopped, **${username}**.`)
    .setTimestamp();

    await interaction.reply({ embeds: [feedbackEmbed], ephemeral: true });
  })

   const s3Url = await uploadAudioToS3(oggPath, username);

   if (s3Url) {
     await interaction.channel.send({
       content: `🎧 Recording uploaded to S3: ${s3Url}`,
     });
   }
}