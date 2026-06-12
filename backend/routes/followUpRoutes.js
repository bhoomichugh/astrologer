import express from "express";

import {
  createFollowUp,
  deleteFollowUp,
  getFollowUps,
  updateFollowUp
} from "../controllers/followUpController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getFollowUps);
router.post("/", createFollowUp);
router.put("/:id", updateFollowUp);
router.delete("/:id", deleteFollowUp);

export default router;
