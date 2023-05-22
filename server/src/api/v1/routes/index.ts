import express from "express";

import { welcomeHandler } from "../controllers";
import authRouter from "./auth";
import profileRouter from "./me";

const router = express.Router();

// Welcome endpoint
router.get("/", welcomeHandler);
router.use("/auth", authRouter);
router.use("/me", profileRouter);

export default router;
