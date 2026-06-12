import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
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
      trim: true
    },
    source: {
      type: String,
      enum: ["Referral", "Online", "Walk-in", "Social Media", "Other"],
      default: "Other"
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Converted", "Not Interested"],
      default: "New"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    notes: {
      type: String,
      trim: true
    },
    followUpDate: {
      type: Date
    },
    convertedClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client"
    }
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
