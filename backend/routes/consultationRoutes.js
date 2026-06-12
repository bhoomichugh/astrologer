import express from "express";

import {
  createConsultation,
  deleteConsultation,
  getConsultations,
  updateConsultation
} from "../controllers/consultationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getConsultations);
router.post("/", createConsultation);
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

export default router;
