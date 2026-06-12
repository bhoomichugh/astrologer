import express from "express";

import {
  createBooking,
  getBookingById,
  getBookings,
  markPayment,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id/status", updateBookingStatus);
router.put("/:id/pay", markPayment);

export default router;
