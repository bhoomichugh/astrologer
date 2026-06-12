import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },
    type: {
      type: String,
      enum: ["Call", "Email", "WhatsApp", "SMS"],
      default: "Call"
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    completedDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Skipped"],
      default: "Pending"
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const FollowUp = mongoose.model("FollowUp", followUpSchema);

export default FollowUp;
