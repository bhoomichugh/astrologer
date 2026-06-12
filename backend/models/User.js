import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["admin", "astrologer", "user"],
      default: "astrologer"
    },
    // Astrologer profile fields
    specialization: {
      type: String,
      trim: true,
      default: "General Astrology"
    },
    experience: {
      type: Number,
      default: 1
    },
    hourlyRate: {
      type: Number,
      default: 500
    },
    bio: {
      type: String,
      trim: true,
      default: "Available for personal astrology consultations."
    },
    rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 5
    },
    languages: {
      type: [{ type: String }],
      default: ["Hindi"]
    },
    available: {
      type: Boolean,
      default: true
    },
    // User/client fields
    phone: {
      type: String,
      trim: true
    },
    dob: {
      type: Date
    },
    zodiacSign: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
