import express from "express";
import {
  getProfile,
  searchUser,
  handleUser,
  getNoteToApprove,
  postTagNote,
  getTagNotes,
  removeTag,
  approveNote,
  getOtherProfile,
  getMessage,
  postMessage,
  getMessageList,
  getNotifications,
  setNotificationIsRead,
  getAdminStats,
  showAllUsers,
  followUser,
  unfollowUser,
} from "../controllers/userControllers.mjs";
import {
  authentication,
  authorization,
} from "../controllers/authControllers.mjs";

const userRouter = express.Router();

userRouter.post("/profile/:userId", authentication, authorization, getProfile);

userRouter.get("/othersProfile/:id", authentication, getOtherProfile);

userRouter.post("/searchUser/:userId", authentication, searchUser);

userRouter.post(
  "/handleUser/:userId",
  authentication,
  authorization,
  handleUser
);

userRouter.get(
  "/noteToApprove/:userId",
  authentication,
  authorization,
  getNoteToApprove
);

userRouter.post(
  "/tagNotes/:userId",
  authentication,
  authorization,
  postTagNote
);

userRouter.get(
  "/tagNotes/:username",
  authentication,
  authorization,
  getTagNotes
);

userRouter.get(
  "/removeTag/:username/:noteId/:userId",
  authentication,
  removeTag
);

userRouter.get("/message/:recieverId/:senderId", getMessage);

userRouter.post("/message/:id", postMessage);

userRouter.get("/message/:id", getMessageList);

userRouter.post(
  "/approveNote/:noteId",
  authentication,
  authorization,
  approveNote
);

userRouter.get("/notifications/:userId", getNotifications);

userRouter.put("/readNotifications/:notificationId", setNotificationIsRead);

userRouter.get("/admin/stats", authentication, authorization, getAdminStats);

userRouter.get(
  "/getUserList/:userType",
  authentication,
  authorization,
  showAllUsers
);

userRouter.get("/followUser/:userId/:targetUserId", authentication, followUser);

userRouter.get(
  "/unfollowUser/:userId/:targetUserId",
  authentication,
  unfollowUser
);
userRouter.get("/test", (req, res) => {
  res.send("Hello from user router!");
});

export default userRouter;
