import express from "express";

import { welcomeHandler } from "../controllers";
import authRouter from "./auth";
import meRouter from "./me";
import reelRouter from "./reel";

const router = express.Router();

// Welcome endpoint
router.get("/", welcomeHandler);
router.use("/auth", authRouter);
router.use("/me", meRouter);
router.use("/reels", reelRouter);

export default router;
