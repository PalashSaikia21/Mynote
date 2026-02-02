import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  securityQuestion: {
    type: String,
    required: false,
    default: "no question",
    enum: [
      "no question",
      "What is the name of your place of origin (Birthplace)?",
      "What was the name of your first animal companion (Pet)?",
      "What was the name of your primary house of learning (First School)?",
      "What is your mother's maiden surname?",
      "In what city did your parents first meet?",
      "What was the make of your first mechanical vessel (First Car)?",
      "What was the name of your favorite childhood educator?",
      "What was the first concert or performance you attended?",
      "What is the name of the street where you first resided?",
      "What was your childhood nickname among kin?",
    ],
    select: false,
  },
  securityAnswer: {
    type: String,
    required: false,
    select: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    lowercase: true,
  },
  userType: {
    type: String,
    enum: ["user", "trusted", "admin", "administrator"],
    default: "user",
  },
  isUserVerified: { type: Boolean, default: false },
  trustIndex: {
    type: Number,
    default: 0,
  },
  // --- SOCIAL METRICS (Denormalized for performance) ---
  // We store counts here so we don't have to count the Follows collection every time
  metrics: {
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    noteCount: { type: Number, default: 0 },
  },

  // --- PREFERENCES & SETTINGS ---
  settings: {
    isPrivate: { type: Boolean, default: false }, // If true, followers need approval
    allowTagging: { type: Boolean, default: true },
    theme: { type: String, default: "light" },
  },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
