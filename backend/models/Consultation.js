import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Scheduled", "Pending", "Completed", "Cancelled"],
      default: "Scheduled"
    },
    notes: {
      type: String,
      trim: true
    },
    aiSummary: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
