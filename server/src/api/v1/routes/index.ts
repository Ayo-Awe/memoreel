import express from "express";

import { welcomeHandler } from "../controllers";
import authRouter from "./auth";

const router = express.Router();

// Welcome endpoint
router.get("/", welcomeHandler);
router.use("/auth", authRouter);

export default router;
