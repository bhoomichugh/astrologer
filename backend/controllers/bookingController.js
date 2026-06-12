import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const getBookings = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === "user") {
      filter = { userId: req.user._id };
    } else if (req.user.role === "astrologer") {
      filter = { astrologerId: req.user._id };
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email phone")
      .populate("astrologerId", "name email specialization")
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("astrologerId", "name email specialization hourlyRate");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isOwner =
      String(booking.userId._id) === String(req.user._id) ||
      String(booking.astrologerId._id) === String(req.user._id) ||
      req.user.role === "admin";

    if (!isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { astrologerId, date, timeSlot, duration, notes } = req.body;

    const astrologer = await User.findById(astrologerId);
    if (!astrologer || astrologer.role !== "astrologer") {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    const durationMinutes = duration || 30;
    const amount = Math.round((astrologer.hourlyRate || 500) * (durationMinutes / 60));

    const booking = await Booking.create({
      userId: req.user._id,
      astrologerId,
      date,
      timeSlot,
      duration: durationMinutes,
      notes,
      amount,
      status: "Pending"
    });

    const populatedBooking = await booking.populate([
      { path: "userId", select: "name email phone" },
      { path: "astrologerId", select: "name email specialization" }
    ]);

    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role === "user" && status !== "Cancelled") {
      return res.status(403).json({ message: "Users can only cancel bookings" });
    }

    if (req.user.role === "astrologer") {
      if (String(booking.astrologerId) !== String(req.user._id)) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!["Confirmed", "Completed", "Cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
    }

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("userId", "name email phone")
      .populate("astrologerId", "name email specialization");

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const markPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.userId) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    booking.paymentStatus = "Paid";
    booking.paidAt = new Date();
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("userId", "name email phone")
      .populate("astrologerId", "name email specialization");

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
