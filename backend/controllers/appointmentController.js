import Appointment from "../models/Appointment.js";

const getAstrologerFilter = (user) => {
  return user.role === "admin" ? {} : { astrologerId: user._id };
};

export const getAppointments = async (req, res, next) => {
  try {
    const filter = { ...getAstrologerFilter(req.user) };

    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }

    const appointments = await Appointment.find(filter)
      .populate("clientId", "name phone")
      .populate("astrologerId", "name email")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getCalendarData = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const filter = {
      ...getAstrologerFilter(req.user),
      date: { $gte: startDate, $lte: endDate }
    };

    const appointments = await Appointment.find(filter)
      .populate("clientId", "name phone")
      .populate("astrologerId", "name email")
      .sort({ date: 1 });

    const grouped = {};
    for (const appt of appointments) {
      const dayKey = appt.date.toISOString().split("T")[0];
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(appt);
    }

    res.json({ month, year, appointments: grouped });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      astrologerId: req.user.role === "admin" ? req.body.astrologerId : req.user._id
    };

    const appointment = await Appointment.create(payload);
    const populatedAppointment = await appointment.populate([
      { path: "clientId", select: "name phone" },
      { path: "astrologerId", select: "name email" }
    ]);

    res.status(201).json(populatedAppointment);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const appointment = await Appointment.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    })
      .populate("clientId", "name phone")
      .populate("astrologerId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const appointment = await Appointment.findOneAndUpdate(
      filter,
      { status: "Cancelled" },
      { new: true, runValidators: true }
    )
      .populate("clientId", "name phone")
      .populate("astrologerId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const completeAppointment = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const updateData = {
      status: "Completed",
      ...(req.body.consultationNotes && { consultationNotes: req.body.consultationNotes }),
      ...(req.body.predictions && { predictions: req.body.predictions })
    };

    const appointment = await Appointment.findOneAndUpdate(filter, updateData, {
      new: true,
      runValidators: true
    })
      .populate("clientId", "name phone")
      .populate("astrologerId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const appointment = await Appointment.findOneAndDelete(filter);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted" });
  } catch (error) {
    next(error);
  }
};
