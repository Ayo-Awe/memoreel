import express from "express";

import controller from "../controllers/me";
import { auth } from "../middlewares/authMiddleware";
import { awsUpload } from "../middlewares/awsUpload";

const router = express.Router();

router.get("/", auth, controller.getProfile);
router.patch("/", auth, controller.editProfile);
router.get("/reels", auth, controller.getUserReelsHandler);
router.post(
  "/reels",
  auth,
  awsUpload.single("video"),
  controller.createReelHandler
);
router.put(
  "/reels/:id(\\d+)/public-url",
  auth,
  controller.regenerateReelPublicUrl
);
router.get("/reels/:id(\\d+)/public-url", auth, controller.getReelPublicUrl);
router.delete("/reels/:id(\\d+)", auth, controller.cancelUserReelHandler);

export default router;
