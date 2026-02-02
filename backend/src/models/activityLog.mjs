import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: String, // Denormalized for faster Admin viewing
  userType: String, // user, trusted, or admin
  action: {
    type: String,
    enum: ["login", "comment", "create_note", "promote", "change_password"],
  }, // 'login', 'create_note', 'promote'
  timestamp: { type: Date, default: Date.now, expires: 2678400 },
});

// Optimization: Index the timestamp so the Admin dashboard loads fast
ActivityLogSchema.index({ timestamp: -1 });

export default mongoose.model("ActivityLog", ActivityLogSchema);
