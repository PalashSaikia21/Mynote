import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notes",
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  parentComment: {
    type: String,
    default: "",
  },
  isQuestion: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Comments", commentSchema);
