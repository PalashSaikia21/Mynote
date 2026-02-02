import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Efficiently find "Who am I following?"
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Efficiently find "Who is following me?"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user cannot follow the same person twice
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.model("Follow", followSchema);
