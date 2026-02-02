import User from "../models/userModel.mjs";
import Notes from "../models/notesModel.mjs";
import Likes from "../models/likesModel.mjs";
import ActivityLog from "../models/activityLog.mjs";
import ReqNotePublic from "../models/reqNotePublicModel.mjs";
import mongoose from "mongoose";
import Message from "../models/messageModel.mjs";
import Notification from "../models/notificationModel.mjs";
import Follow from "../models/followerModel.mjs";

const getProfile = async (req, res) => {
  try {
    const userLogedIn = await User.findById(req.params.userId).select(
      "+securityQuestion +securityAnswer"
    );

    if (!userLogedIn) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Fetching profile for userId:", userLogedIn);
    return res.status(200).json({ user: userLogedIn });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const searchUser = async (req, res) => {
  const username = req.body.username;
  console.log("Fetching profile for username:", username);
  try {
    const searchedUser = await User.findOne({ username });
    if (!searchedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (searchedUser.settings.isPrivate) {
      return res.status(403).json({ message: "User profile is private" });
    }
    console.log("Fetching profile for username:", searchedUser);

    return res.status(200).json({ user: searchedUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const handleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userType },
      { new: true } // Returns the modified document rather than the original
    );

    if (!updatedUser)
      return res.status(404).json({ message: "Note not found" });
    console.log("working");

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Error updating note" });
  }
};

const getNoteToApprove = async (req, res) => {
  try {
    const noteList = await Notes.find({ privacy: "applied" });
    if (!noteList) {
      return res.status(404).json({ message: "No note available for approve" });
    }

    return res
      .status(200)
      .json({ message: "note list found", noteList: noteList });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const postTagNote = async (req, res) => {
  const { userId } = req.params;
  const { userList, noteId } = req.body;
  try {
    // Attempt to update the specific element where taggedBy matches userId
    let note = await Notes.findOneAndUpdate(
      { _id: noteId, "tagged.taggedBy": userId },
      { $addToSet: { "tagged.$.taggedTo": { $each: userList } } },
      { new: true }
    );

    // If 'note' is null, the userId wasn't found in the 'tagged' array
    if (!note) {
      note = await Notes.findByIdAndUpdate(
        noteId,
        {
          $push: {
            tagged: { taggedBy: userId, taggedTo: userList },
          },
        },
        { new: true, runValidators: true }
      );
    }

    if (!note) return res.status(404).json({ message: "Note not found" });
    console.log("user name from tagnote ", req.user.username);
    // const content = `You have been tagged in a note by ${req.user.name}. Check it out!`;
    userList.forEach(async (username) => {
      const recipient = await User.findOne({ username });
      const content = `You have been tagged in a note by ${req.user.name}. Check it out!`;
      // console.log("notification for tag note ", recipientId, noteId);
      try {
        const updatedNotification = await Notification.findOneAndUpdate(
          {
            recipientId: recipient._id,
            targetId: noteId,
            targetModel: "Notes",
          },
          {
            isRead: false,
            isSeen: false,
            content: content,
            createdAt: Date.now(),
          }
        );
        if (!updatedNotification) {
          await Notification.create({
            recipientId: recipient._id,
            content: content,
            targetId: noteId,
            targetModel: "Notes",
            isRead: false,
            isSeen: false,
          });
        }
      } catch (error) {
        console.error("Error creating/updating notification:", error);
      }
    });

    return res.status(200).json(note);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getTagNotes = async (req, res) => {
  const username = req.user.username; // or req.query
  console.log("username from get tagnote ", username);
  try {
    // MongoDB searches inside every object in the 'tagged' array
    // and every string inside the 'taggedTo' array.
    const notes = await Notes.find({
      "tagged.taggedTo": username,
    }).sort({ createdAt: -1 });
    // console.log(notes._id);
    if (notes.length === 0) {
      return res.status(404).json({ message: "No notes found for this user." });
    }

    return res.status(200).json({ notes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const removeTag = async (req, res) => {
  try {
    // 1. Cast BOTH IDs to ObjectIds
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const { username } = req.params;

    // 2. Use a cleaner $pull syntax
    const note = await Notes.findOneAndUpdate(
      { _id: noteId, "tagged.taggedBy": userId },
      { $pull: { "tagged.$.taggedTo": username } },
      { new: true }
    );

    if (!note) {
      // If note is null here, the filter still didn't match
      return res
        .status(404)
        .json({ message: "No match found for this Note/User combo." });
    }
    const allTaggedNotes = await Notes.find({
      "tagged.taggedTo": username,
    }).sort({ createdAt: -1 });
    console.log("all tagged notes after remove tag ", allTaggedNotes);
    return res.status(200).json({ note: allTaggedNotes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const approveNote = async (req, res) => {
  const { noteId } = req.params;
  const { label } = req.body;

  // 1. Start a Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Operations must pass the { session } option
    const note = await Notes.findById(noteId).session(session);
    if (!note) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Note not found" });
    }

    let content = "";
    if (label === "public") {
      content = `Your note has been approved as Public.`;

      const userUpdate = { $inc: { "metrics.noteCount": 1 } };
      if (!note.isPublicOnce) {
        userUpdate.$inc.trustIndex = 10;
      }

      await User.findByIdAndUpdate(note.userId, userUpdate, { session });

      note.privacy = "public";
      note.isPublicOnce = true;
    } else {
      content = "Your note has not been approved and set to Private.";
      note.privacy = "private";
    }

    await note.save({ session });

    await Notification.findOneAndUpdate(
      { recipientId: note.userId, targetId: noteId },
      {
        content,
        isRead: false,
        isSeen: false,
        targetModel: "Notes",
        createdAt: new Date(),
      },
      { upsert: true, session }
    );

    // 3. Commit the changes
    await session.commitTransaction();
    res.status(200).json(note);
  } catch (error) {
    // 4. If anything fails, undo everything
    await session.abortTransaction();
    console.error("Transaction aborted due to error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // 5. Always close the session
    session.endSession();
  }
};

const getOtherProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    const following = await Follow.find({ followerId: userId })
      .populate("followingId", "username avatar") // Fetch the actual user data, not just IDs
      .lean();
    const follower = await Follow.find({ followingId: userId })
      .populate("followingId", "username avatar") // Fetch the actual user data, not just IDs
      .lean();

    const isFollowing = await Follow.findOne({
      followerId: req.user.id,
      followingId: userId,
    });

    return res.status(200).json({
      user: userDetails,
      following,
      followed: follower,
      isFollowing: !!isFollowing,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMessage = async (req, res) => {
  const { senderId, recieverId } = req.params;
  try {
    let oldMsg = await Message.find({
      $or: [
        { senderId: senderId, recieverId: recieverId },
        { senderId: recieverId, recieverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      {
        senderId: recieverId,
        recieverId: senderId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    console.log("all msg from getMsg", oldMsg);
    return res.status(200).json({ mes: "sss", oldMsg: oldMsg });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const postMessage = async (req, res) => {
  try {
    const recieverId = req.params.id;

    const { senderId, message } = req.body;

    const newMsg = new Message({
      recieverId,
      senderId,
      message,
    });
    const note = await Message.create(newMsg);

    return res
      .status(201)
      .json({ message: "Meesage send successfully", msg: newMsg });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMessageList = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const userId = new mongoose.Types.ObjectId(req.params.id);

    const messageList = await Message.aggregate([
      // 1. Filter: Find relevant, non-deleted messages
      {
        $match: {
          $or: [{ senderId: userId }, { recieverId: userId }],
          isDeleted: false,
        },
      },
      // 2. Sort: Newest first so $group picks the latest
      { $sort: { createdAt: -1 } },
      // 3. Group: One entry per conversation partner
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$senderId", userId] }, "$recieverId", "$senderId"],
          },
          lastMessage: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          isRead: { $first: "$isRead" },
          // Useful addition: count unread messages for this specific user
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recieverId", userId] },
                    { $eq: ["$isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      // 4. Join: Get user details
      {
        $lookup: {
          from: "users", // Ensure this matches your ACTUAL collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      // 5. Final Sort: Put the most recent conversation at the top
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 0,
          otherUserId: "$_id",
          username: "$userInfo.username",
          profilePic: "$userInfo.profilePic", // Assuming you have this
          lastMessage: 1,
          createdAt: 1,
          unreadCount: 1,
        },
      },
    ]);
    console.log("Aggregated Message List:", messageList);
    return res.status(200).json({ success: true, messages: messageList });
  } catch (error) {
    console.error("Aggregation Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(20); // Fetch latest 20 notifications

    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const setNotificationIsRead = async (req, res) => {
  console.log("Marking notification as read");
  try {
    const notificationId = req.params.notificationId;

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // Returns the modified document rather than the original
    );

    if (!updatedNotification)
      return res.status(404).json({ message: "Notification not found" });

    return res.status(200).json(updatedNotification);
  } catch (error) {
    return res.status(500).json({ message: "Error updating notification" });
  }
};

const notificationHandlers = async (
  recipientId,
  actorId,
  targetId,
  targetModel,
  content
) => {
  console.log("Notification Handler Invoked ", content);
  try {
    // findOneAndUpdate handles the "Duplicate" logic internally
    const notification = await Notification.findOneAndUpdate(
      {
        recipientId,
        actorId,
        targetId,
        targetModel,
      }, // Find by these (the unique keys)
      {
        content,
        createdAt: Date.now(), // This "updates the time"
      },
      {
        upsert: true, // Create if it doesn't exist
        new: true, // Return the updated document
        runValidators: true,
      }
    );

    console.log("Notification processed (Upserted):", notification._id);
    return notification;
  } catch (error) {
    // You will no longer get E11000 here because we aren't "inserting" a duplicate
    console.error("Error handling notification:", error);
    throw error;
  }
};

const getAdminStats = async (req, res) => {
  const activityThreshold = 6;
  console.log("Admin States is working");
  const startOfToday = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  startOfToday.setUTCHours(0, 0, 0, 0);
  const [
    newUserCount,
    trustedUser,
    adminCount,
    publicCount,
    pendingCount,
    dailyActiveUsers,
  ] = await Promise.all([
    User.countDocuments({ userType: "user" }),
    User.countDocuments({ userType: "trusted" }),
    User.countDocuments({ userType: "admin" }),
    Notes.countDocuments({ privacy: "public" }),
    Notes.countDocuments({ privacy: "applied" }),
    ActivityLog.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      { $group: { _id: "$userId", logCount: { $sum: 1 } } },
      { $match: { logCount: { $gte: activityThreshold } } },
      {
        $lookup: {
          // Optional: Get actual user details
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $match: { "userDetails.userType": { $ne: "administrator" } } },
      {
        $project: {
          _id: "$userDetails._id",
          logCount: 1,
          name: "$userDetails.name",
          trustIndex: "$userDetails.trustIndex",
          userType: "$userDetails.userType",
          username: "$userDetails.username", // Match your case-sensitivity!
        },
      },
    ]),
  ]);

  console.log("Admin Stats fetched successfully", dailyActiveUsers);

  res.json({
    newUsers: newUserCount,
    trustedUsers: trustedUser,
    admin: adminCount,
    totalPublicNotes: publicCount,
    pendingNotes: pendingCount,
    dailyActiveUsers: dailyActiveUsers,
  });
};

// helpers/activityLogger.js

const logUserActivity = async (userId, userName, userType, action) => {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  // 1. Count how many times this specific action was logged TODAY
  const countToday = await ActivityLog.countDocuments({
    userId,
    action,
    createdAt: { $gte: startOfToday },
  });

  // 2. Set your limits
  const LIMIT = 10;

  // 3. Only create the log if they are under the limit
  if (countToday < LIMIT) {
    await ActivityLog.create({
      userId,
      userName,
      userType,
      action,
    });
    return true; // Log created
  }

  return false; // Limit reached, no log created
};

const showAllUsers = async (req, res) => {
  console.log("Show Allouser is working", req.params.userType);
  try {
    const userType = req.params.userType;
    const users = await User.find({ userType: userType }).select(
      "-password -token"
    ); // Exclude sensitive fields
    console.log("from show all users ", users);
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const followUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.params;

    // Logic to follow the target user
    // e.g., update the database to add targetUserId to userId's following list
    await Follow.create({
      followerId: userId,
      followingId: targetUserId,
    });

    return res.status(200).json({ message: "Successfully followed the user." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error following user." });
  }
};
const unfollowUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.params;

    // Logic to follow the target user
    // e.g., update the database to add targetUserId to userId's following list
    await Follow.findOneAndDelete({
      followerId: userId,
      followingId: targetUserId,
    });

    return res.status(200).json({ message: "Successfully followed the user." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error following user." });
  }
};

const getFollowingList = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await Follow.find({ followerId: userId })
      .populate("followingId", "username avatar") // Fetch the actual user data, not just IDs
      .lean();

    // Transform the data so it's a clean list of users
    const users = following.map((f) => f.followingId);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching list" });
  }
};

export {
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
  notificationHandlers,
  getNotifications,
  setNotificationIsRead,
  getAdminStats,
  logUserActivity,
  showAllUsers,
  followUser,
  unfollowUser,
};
