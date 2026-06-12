import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    dob: {
      type: Date
    },
    zodiacSign: {
      type: String,
      trim: true
    },
    assignedAstrologer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    birthTime: {
      type: String,
      trim: true
    },
    birthPlace: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      enum: ["Referral", "Online", "Walk-in", "Social Media", "Other"],
      default: "Other"
    }
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
