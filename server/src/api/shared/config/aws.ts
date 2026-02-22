import { S3 } from "@aws-sdk/client-s3";

export const s3Client = new S3({
  forcePathStyle: true,
  endpoint: process.env.R2_ENDPOINT!,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const s3Bucket = process.env.R2_BUCKET_NAME ?? "memoreel";
