import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  viewId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tagged: [
    {
      taggedBy: {
        type: String,
      },
      taggedTo: [
        {
          type: String,
        },
      ],
    },
  ],
  privacy: {
    type: String,
    enum: ["public", "follower", "private", "applied"],
    default: "private",
  },
  like: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isPublicOnce: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reported: [
    {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reason: {
        type: String,
      },
    },
  ],
});

notesSchema.index({ createdAt: -1 });

export default mongoose.model("Notes", notesSchema);
