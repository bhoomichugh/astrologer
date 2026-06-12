import express from "express";

import { generateSummary } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-summary", protect, generateSummary);

export default router;
