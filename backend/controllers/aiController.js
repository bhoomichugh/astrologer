import { GoogleGenerativeAI } from "@google/generative-ai";

import Consultation from "../models/Consultation.js";

export const generateSummary = async (req, res, next) => {
  try {
    const { consultationId, notes } = req.body;

    if (!notes?.trim()) {
      return res.status(400).json({ message: "Consultation notes are required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "GEMINI_API_KEY is not configured" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize the following consultation notes professionally. Include the client's main concern and a practical follow-up recommendation:\n\n${notes}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    if (consultationId) {
      const filter = { _id: consultationId };
      if (req.user.role !== "admin") {
        filter.astrologerId = req.user._id;
      }

      await Consultation.findOneAndUpdate(filter, { aiSummary: summary });
    }

    res.json({ summary });
  } catch (error) {
    next(error);
  }
};
