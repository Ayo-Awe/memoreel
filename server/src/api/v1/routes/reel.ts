import express from "express";

import controller from "../controllers/reel";

const router = express.Router();

router.post("/", controller.createReelHandler);
router.post("/:token/confirm", controller.reelConfirmationHandler);
router.get("/:token", controller.getReel);
router.get("/:token/video", controller.getReelVideo);
router.post(
  "/:id(\\d+)/resend-confirmation",
  controller.resendConfirmationEmail
);

export default router;
