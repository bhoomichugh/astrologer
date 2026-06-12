import express from "express";

import {
  cancelAppointment,
  completeAppointment,
  createAppointment,
  deleteAppointment,
  getAppointments,
  getCalendarData,
  updateAppointment
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAppointments);
router.get("/calendar", getCalendarData);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.put("/:id/cancel", cancelAppointment);
router.put("/:id/complete", completeAppointment);
router.delete("/:id", deleteAppointment);

export default router;
