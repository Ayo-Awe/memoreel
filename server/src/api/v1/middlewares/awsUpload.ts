import multer from "multer";
import multerS3 from "multer-s3";
import { s3Bucket, s3Client } from "../../shared/config/aws";

export const awsUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: s3Bucket,
  }),
});
