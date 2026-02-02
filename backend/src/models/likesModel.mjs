import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["Notes", "Comments"], // This tells Mongoose which collection to look in
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent a user from liking the same post twice
likeSchema.index({ targetId: 1, userId: 1, targetModel: 1 }, { unique: true });

export default mongoose.model("Likes", likeSchema);
