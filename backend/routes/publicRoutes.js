import express from "express";

import User from "../models/User.js";

const router = express.Router();

router.get("/astrologers", async (_req, res, next) => {
  try {
    const astrologers = await User.find({ role: "astrologer", available: { $ne: false } })
      .select("name specialization experience hourlyRate bio rating languages available createdAt")
      .sort({ createdAt: -1, rating: -1 });

    res.json(
      astrologers.map((astrologer) => ({
        _id: astrologer._id,
        name: astrologer.name,
        specialization: astrologer.specialization || "General Astrology",
        experience: astrologer.experience || 1,
        hourlyRate: astrologer.hourlyRate || 500,
        bio: astrologer.bio || "Available for personal astrology consultations.",
        rating: astrologer.rating || 4,
        languages: astrologer.languages?.length ? astrologer.languages : ["Hindi"],
        available: astrologer.available
      }))
    );
  } catch (error) {
    next(error);
  }
});

export default router;
