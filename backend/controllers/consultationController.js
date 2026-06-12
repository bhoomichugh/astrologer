import Consultation from "../models/Consultation.js";

const getAstrologerFilter = (user) => {
  return user.role === "admin" ? {} : { astrologerId: user._id };
};

export const getConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find(getAstrologerFilter(req.user))
      .populate("clientId", "name phone zodiacSign")
      .populate("astrologerId", "name email role")
      .sort({ date: 1 });

    res.json(consultations);
  } catch (error) {
    next(error);
  }
};

export const createConsultation = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      astrologerId: req.user.role === "admin" ? req.body.astrologerId : req.user._id
    };

    const consultation = await Consultation.create(payload);
    const populatedConsultation = await consultation.populate([
      { path: "clientId", select: "name phone zodiacSign" },
      { path: "astrologerId", select: "name email role" }
    ]);

    res.status(201).json(populatedConsultation);
  } catch (error) {
    next(error);
  }
};

export const updateConsultation = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const consultation = await Consultation.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    })
      .populate("clientId", "name phone zodiacSign")
      .populate("astrologerId", "name email role");

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json(consultation);
  } catch (error) {
    next(error);
  }
};

export const deleteConsultation = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const consultation = await Consultation.findOneAndDelete(filter);

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({ message: "Consultation deleted" });
  } catch (error) {
    next(error);
  }
};
