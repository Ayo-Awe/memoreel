import express from "express";

import * as controller from "../controllers/auth";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", controller.registerHandler);
router.post("/register/verify", controller.verifyEmailHandler);
router.post("/resend-verification", controller.resendVerificationEmail);
router.post("/login", controller.loginHandler);
router.post("/forgot-password", controller.forgotPasswordHandler);
router.post(
  "/forgot-password/confirmation",
  controller.forgotPasswordConfirmation
);
router.post("/reset-password", controller.resetPasswordHandler);
router.post("/change-password", auth, controller.changePasswordHandler);
router.get("/oauth/google", controller.googleOauthUrlHandler);
router.post("/oauth/google/callback", controller.googleOauth);

export default router;
