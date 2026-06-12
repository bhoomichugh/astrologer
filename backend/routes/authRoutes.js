import express from "express";

import { getMe, login, register, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-user", registerUser);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
