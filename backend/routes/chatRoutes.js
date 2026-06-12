import express from "express";

import {
  getConversations,
  getMessages,
  sendMessage
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/send", sendMessage);
router.get("/messages/:bookingId", getMessages);
router.get("/conversations", getConversations);

export default router;
