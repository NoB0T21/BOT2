import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../DB/awsConnection.js";

export const uploadAudioToS3 = async (filePath, username) => {
  try {
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `recordings/${username}-${Date.now()}.wav`, // file path inside S3
      Body: fileStream,
      ContentType: "audio/wav",
    };

    const data = await s3.send(new PutObjectCommand(uploadParams));

    console.log("✅ Uploaded to S3:", uploadParams.Key);
    return `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
  } catch (err) {
    console.error("❌ S3 Upload Error:", err);
    return null;
  }
};
