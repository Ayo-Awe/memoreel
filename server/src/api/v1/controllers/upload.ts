import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Bucket, s3Client } from "../../shared/config/aws";
import crypto from "crypto";

const PRESIGNED_URL_EXPIRES_IN = 10 * 60;

class UploadController {
  async getPresignedUploadUrl(req: Request, res: Response) {
    const bucketKey = crypto.randomUUID();

    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: bucketKey,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: PRESIGNED_URL_EXPIRES_IN,
    });

    res.ok({ uploadUrl, bucketKey });
  }
}

export default new UploadController();
