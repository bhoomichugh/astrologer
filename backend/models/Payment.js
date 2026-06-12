import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Partial", "Refunded"],
      default: "Pending"
    },
    method: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Bank Transfer", "Other"],
      default: "Cash"
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    notes: {
      type: String,
      trim: true
    },
    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

paymentSchema.pre("save", function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}`;
  }
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
