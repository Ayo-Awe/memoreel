import express from "express";
import controller from "../controllers/upload";

const router = express.Router();

router.get("/presigned-url", controller.getPresignedUploadUrl);

export default router;
