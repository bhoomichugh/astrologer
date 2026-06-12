import express from "express";

import {
  getAppointmentReport,
  getCustomerReport,
  getLeadReport,
  getRevenueReport
} from "../controllers/reportController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("admin"));

router.get("/revenue", getRevenueReport);
router.get("/appointments", getAppointmentReport);
router.get("/customers", getCustomerReport);
router.get("/leads", getLeadReport);

export default router;
