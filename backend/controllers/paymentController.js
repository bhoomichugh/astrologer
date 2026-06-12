import Payment from "../models/Payment.js";

export const getPayments = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const payments = await Payment.find(filter)
      .populate("clientId", "name phone")
      .populate("appointmentId", "date")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (payload.status === "Paid") {
      payload.paidAt = new Date();
    }

    const payment = await Payment.create(payload);
    const populatedPayment = await payment.populate([
      { path: "clientId", select: "name phone" },
      { path: "appointmentId", select: "date" }
    ]);

    res.status(201).json(populatedPayment);
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (req.body.status === "Paid" && payment.status !== "Paid") {
      req.body.paidAt = new Date();
    }

    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate("clientId", "name phone")
      .populate("appointmentId", "date");

    res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("clientId", "name email phone")
      .populate({
        path: "appointmentId",
        select: "date type duration amount",
        populate: { path: "astrologerId", select: "name email" }
      });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      invoiceNumber: payment.invoiceNumber,
      client: payment.clientId,
      appointment: payment.appointmentId,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt
    });
  } catch (error) {
    next(error);
  }
};
