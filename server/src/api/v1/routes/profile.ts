import express from "express";

import controller from "../controllers/profile";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", auth, controller.getProfile);
router.patch("/", auth, controller.editProfile);

export default router;
