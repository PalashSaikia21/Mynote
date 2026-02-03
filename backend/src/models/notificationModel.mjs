import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // The Verb: What happened?
    // action: { type: String, enum: ['LIKE', 'COMMENT', 'MENTION'], required: true },

    // The Object: What was it done to?
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetModel",
      required: false,
    },
    targetModel: {
      type: String,
      required: false,
      enum: ["Notes", "Comments", "User"],
    },

    // Optimization: Don't store the full string. Store a template key or metadata.
    // If you MUST store text, call it 'content' or 'preview'.
    content: { type: String },

    isRead: { type: Boolean, default: false },
    isSeen: { type: Boolean, default: false }, // Useful for "new notification" badges
  },
  { timestamps: true }
);

// Crucial for performance:
notificationSchema.index({ targetModel: 1, targetId: 1, actorId: 1 });

export default mongoose.model("Notification", notificationSchema);
