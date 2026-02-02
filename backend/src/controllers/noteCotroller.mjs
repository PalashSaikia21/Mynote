import Notes from "../models/notesModel.mjs";
import Comments from "../models/commentsModel.mjs";
import Likes from "../models/likesModel.mjs";
import User from "../models/userModel.mjs";
import Notification from "../models/notificationModel.mjs";

import { notificationHandlers, logUserActivity } from "./userControllers.mjs";

const createNote = async (req, res) => {
  console.log("createNoteWorker");
  try {
    const userId = req.params.userId;
    console.log("Worker");
    const { title, content } = req.body;

    const newNote = new Notes({
      title,
      content,
      userId,
    });
    const note = await Notes.create(newNote);
    const user = await User.findById(userId);
    const currentTrust = Number(user.trustIndex) || 0;
    console.log("✅ before trustIndex:", user.trustIndex);
    // 3. Save the new number value
    user.trustIndex = currentTrust + 2;
    await user.save();
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx", note);
    return res
      .status(201)
      .json({ message: "Note created successfully", note: note });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const SearchNote = async (req, res) => {
  try {
    // In a real application, you would fetch notes from the database using the userId
    // For demonstration, we are returning static data

    const publicNotes = await Notes.find({
      privacy: "public",
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    if (!publicNotes || publicNotes.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }
    return res.status(200).json({ notes: publicNotes });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch ALL notes for this user regardless of delete status
    const allUserNotes = await Notes.find({ userId }).sort({ createdAt: -1 });

    if (!allUserNotes || allUserNotes.length === 0) {
      return res
        .status(200)
        .json({ notes: [], deletedNote: [], message: "No notes found" });
    }

    // Split into two arrays based on the isDeleted flag
    const notes = allUserNotes.filter((note) => note.isDeleted === false);
    const deletedNote = allUserNotes.filter((note) => note.isDeleted === true);

    return res.status(200).json({
      notes,
      deletedNote,
    });
  } catch (error) {
    console.error("Fetch Notes Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    if (!noteId)
      return res.status(400).json({ message: "Note ID is required" });

    // 1. Optimization: Use findByIdAndUpdate immediately to save a DB round-trip
    // If the user IS the owner, $addToSet won't change anything (logic handled below)
    const note = await Notes.findByIdAndUpdate(
      noteId,
      { $addToSet: { viewId: req.user.id } },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });

    // 2. Fetch User with _id and username
    // Note: Mongoose includes _id by default unless you do "-_id"
    const [noteOwner, likes, likeStatusDoc, noteWithReports] =
      await Promise.all([
        User.findById(note.userId).select("username _id"),
        Likes.countDocuments({ targetId: noteId }),
        Likes.findOne({ targetId: noteId, userId: req.user.id }),
        Notes.findById(noteId).select("reported"),
      ]);
    const isReportedByUser = noteWithReports?.reported.some(
      (report) => report.by.toString() === req.user.id.toString()
    );
    return res.status(200).json({
      note,
      likes,
      likeStatus: !!likeStatusDoc,
      isReportedByUser: !!isReportedByUser,
      noteOwner, // This now explicitly contains username and _id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, privacy } = req.body;

    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      { title, content, privacy },
      { new: true } // Returns the modified document rather than the original
    );
    console.log("working");
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
    if (privacy === "private") {
      await User.findByIdAndUpdate(updatedNote.userId, {
        $inc: { "metrics.noteCount": -1 },
      });
    }
    return res.status(200).json(updatedNote);
  } catch (error) {
    return res.status(500).json({ message: "Error updating note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId, userId } = req.params;

    // 1. Find the note first
    const note = await Notes.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // 2. Check Ownership
    // Note: Use .toString() because MongoDB IDs are Objects
    if (note.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden: You are not the creator of this note",
      });
    }

    // 3. Authorized delete
    const isDeleted = true;
    await Notes.findByIdAndUpdate(
      noteId,
      { isDeleted },
      { new: true } // Returns the modified document rather than the original
    );
    await Notification.deleteMany({
      targetId: noteId,
      targetModel: "Notes",
    });

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting note" });
  }
};
const restoreNote = async (req, res) => {
  console.log("restoreNoteWorker");
  try {
    const { noteId, userId } = req.params;
    await Notes.findByIdAndUpdate(
      { _id: noteId, userId: userId },
      { isDeleted: false },
      { new: true } // Returns the modified document rather than the original
    );

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting note" });
  }
};

const deleteNotePermanently = async (req, res) => {
  try {
    const { noteId, userId } = req.params;

    // 1. Find the note first
    const note = await Notes.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // 2. Check Ownership
    // Note: Use .toString() because MongoDB IDs are Objects
    if (note.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden: You are not the creator of this note",
      });
    }

    // 3. Authorized delete
    await Notes.findByIdAndDelete(noteId);

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting note" });
  }
};

const postComments = async (req, res) => {
  const noteId = req.params.noteId;
  const { comment, userId, parentComment } = req.body;

  const newComments = new Comments({
    noteId,
    comment,
    userId,
    parentComment,
  });
  const postedComments = await Comments.create(newComments);
  //const user = await User.findById(userId).select("userName userType");

  const userName = req.user.username;
  const userType = req.user.userType;
  console.log("userName from post coment", req.user);
  logUserActivity(userId, userName, userType, "comment");
  return res.status(200).json({ message: "Okay" });
};

const getComments = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    // In a real application, you would fetch notes from the database using the noteId
    // For demonstration, we are returning static data
    if (!noteId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let allComments = await Comments.find({ noteId: noteId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .lean(); // .lean() makes them plain JS objects

    // 2. Use Promise.all to wait for all counts to finish

    await Promise.all(
      allComments.map(async (comment) => {
        comment.likeCount = await Likes.countDocuments({
          targetId: comment._id,
          targetModel: "Comments",
        });
      })
    );
    console.log("allComments before like count", allComments);
    return res.status(200).json({ comments: allComments });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getLikes = async (req, res) => {
  console.log("likesWorking" + req.params.status);
  const { id, typeOn, status } = req.params; // status is likely "true" or "false" (string)
  const userId = req.user.id;

  if (status === "true") {
    // User wants to remove their like
    try {
      await Likes.findOneAndDelete({
        targetId: id,
        targetModel: typeOn,
        userId: userId,
      });
      return res.status(200).json({ message: "Like removed" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
  const newLikes = new Likes({
    targetId: req.params.id,
    targetModel: req.params.typeOn,
    userId: req.user.id,
  });

  const postLike = await Likes.create(newLikes);
  // Create notification for the like action
  //const username = await User.findById(req.user.id).select("name");

  const content = `${req.user.name} liked your ${typeOn.toLowerCase()}.`;
  notificationHandlers(
    typeOn === "Notes"
      ? (await Notes.findById(id)).userId
      : (await Comments.findById(id)).userId,
    req.user.id,
    id,

    typeOn,
    content
  );
  return res.status(200).json({ message: "Like" });
};

const reportNote = async (req, res) => {
  console.log("reportWorking");
  const noteId = req.params.noteId;
  const { reason } = req.body;
  const userId = req.user.id;

  console.log(`User ${userId} reported note ${noteId} for reason: ${reason}`);
  const note = await Notes.findById(noteId);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  if (note.reported.some((report) => report.by.toString() === userId)) {
    return res
      .status(400)
      .json({ message: "You have already reported this note" });
  }
  const reportedNote = await Notes.findByIdAndUpdate(
    noteId,
    {
      $push: {
        reported: {
          by: userId,
          reason,
        },
      },
    },
    { new: true }
  );
  // Here you would typically save the report to the database
  // For demonstration, we are just returning a success message

  return res.status(200).json({ message: "Note reported successfully" });
};

export {
  createNote,
  getAllNotes,
  getNote,
  SearchNote,
  postComments,
  getComments,
  getLikes,
  reportNote,
  deleteNote,
  updateNote,
  deleteNotePermanently,
  restoreNote,
};
