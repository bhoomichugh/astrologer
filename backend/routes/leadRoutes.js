import express from "express";

import {
  convertLead,
  createLead,
  deleteLead,
  getLeads,
  updateLead
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getLeads);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.put("/:id/convert", convertLead);

export default router;
