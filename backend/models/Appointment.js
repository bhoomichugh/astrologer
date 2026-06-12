import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },
    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      default: 30
    },
    type: {
      type: String,
      enum: ["Video Call", "Phone", "In-Person"],
      default: "Phone"
    },
    status: {
      type: String,
      enum: ["Scheduled", "Confirmed", "Completed", "Cancelled", "Rescheduled"],
      default: "Scheduled"
    },
    notes: {
      type: String,
      trim: true
    },
    consultationNotes: {
      type: String,
      trim: true
    },
    predictions: {
      type: String,
      trim: true
    },
    followUpRecommendations: {
      type: String,
      trim: true
    },
    aiSummary: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
