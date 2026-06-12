import express from "express";

import {
  createPayment,
  getInvoice,
  getPayments,
  updatePayment
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getPayments);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.get("/:id/invoice", getInvoice);

export default router;
