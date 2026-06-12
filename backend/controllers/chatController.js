import Booking from "../models/Booking.js";
import ChatMessage from "../models/ChatMessage.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { bookingId, receiverId, message } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isParticipant =
      String(booking.userId) === String(req.user._id) ||
      String(booking.astrologerId) === String(req.user._id);

    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const chatMessage = await ChatMessage.create({
      bookingId,
      senderId: req.user._id,
      receiverId,
      message
    });

    const populated = await chatMessage.populate([
      { path: "senderId", select: "name role" },
      { path: "receiverId", select: "name role" }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isParticipant =
      String(booking.userId) === String(req.user._id) ||
      String(booking.astrologerId) === String(req.user._id) ||
      req.user.role === "admin";

    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await ChatMessage.find({ bookingId: req.params.bookingId })
      .populate("senderId", "name role")
      .populate("receiverId", "name role")
      .sort({ createdAt: 1 });

    // Mark messages as read for the current user
    await ChatMessage.updateMany(
      {
        bookingId: req.params.bookingId,
        receiverId: req.user._id,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "user"
        ? { userId: req.user._id }
        : req.user.role === "astrologer"
          ? { astrologerId: req.user._id }
          : {};

    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .populate("astrologerId", "name email specialization")
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(
      bookings.map(async (booking) => {
        const lastMessage = await ChatMessage.findOne({ bookingId: booking._id })
          .sort({ createdAt: -1 })
          .populate("senderId", "name");

        const unreadCount = await ChatMessage.countDocuments({
          bookingId: booking._id,
          receiverId: req.user._id,
          read: false
        });

        return {
          booking,
          lastMessage,
          unreadCount
        };
      })
    );

    res.json(conversations.filter((c) => c.lastMessage));
  } catch (error) {
    next(error);
  }
};
