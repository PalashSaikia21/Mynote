import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platform: {
    type: String,
    enum: ["internal", "twitter", "whatsapp", "facebook"],
    default: "internal",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Share", shareSchema);
