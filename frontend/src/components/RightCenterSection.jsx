import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  Trash2,
  Edit3,
  Share2,
  Tag as TagIcon,
  Flag,
} from "lucide-react";
import Tagnote from "./TagNote";
import Comments from "./Comments";

export default function Rightcentersection({
  id,
  setActiveView,
  setNotes,
  allNote,
  callback,
  setThisNote,
}) {
  const [showTagNote, setShowTagNote] = useState(false);
  const [note, setNote] = useState(null);
  const [noteWoner, setNoteWoner] = useState(false);
  const [like, setLike] = useState(0);
  const [likeStatus, setLikeStatus] = useState(false);
  const [noteOwner, setNoteOwner] = useState("Loading...");
  const [isReportedByUser, setIsReportedByUser] = useState(false);
  const [likeStatusBefore, setLikeStatusBefore] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || "";

  useEffect(() => {
    const fetchNoteDetails = async () => {
      // Check for user and id validity inside the function
      if (!id || id === "createNote" || !user?.token) return;

      try {
        const response = await fetch(
          `http://localhost:3400/notes/getNote/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch note.");

        const data = await response.json();
        const fetchedNote = data.note;

        if (fetchedNote.userId === user._id) setNoteWoner(true);
        setNote(fetchedNote);
        setThisNote(fetchedNote);
        setLike(data.likes || 0);
        setLikeStatus(data.likeStatus);

        setIsReportedByUser(data.isReportedByUser);
        setNoteOwner(data.noteOwner || "Unknown");
        setLikeStatusBefore(data.likeStatus);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNoteDetails();
  }, [id]); // Only re-run when id changes

  // NOW do the early return for the UI
  if (!id || id === "createNote") {
    return <div className="...">Select a note to view its contents</div>;
  }

  if (!note) {
    return <div className="...">Loading...</div>;
  }

  const deleteNote = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const response = await fetch(
        `http://localhost:3400/notes/deleteNote/${id}/${user._id}`
      );
      setActiveView("createNote");
      if (!response.ok) throw new Error("Failed to delete.");
      callback();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const typeOn = "Notes";
    try {
      await fetch(
        `http://localhost:3400/notes/getLikes/${likeStatus}/${id}/${typeOn}`,
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setLikeStatus(!likeStatus);
      fetchNoteDetails(); // Refresh counts
    } catch (error) {
      console.error(error.message);
    }
  };

  const reportNote = async (noteId) => {
    const reason = window.prompt(
      "Why are you reporting this note? (e.g., Inaccurate, Spam, Outdated)"
    );

    if (!reason) return; // User cancelled
    if (reason.trim().length < 5) {
      return alert("Please provide a more detailed reason.");
    }
    // Implement report functionality here
    try {
      await fetch(`http://localhost:3400/notes/reportNote/${noteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reason }),
      });
      setLikeStatus(!likeStatus);
      setIsReportedByUser(true);
      fetchNoteDetails(); // Refresh counts
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FDFBF7] overflow-hidden">
      {/* Modal Overlay */}
      {showTagNote && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/20 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] p-6 rounded-xl shadow-2xl border border-[#E5E1DA] w-96">
            <Tagnote onClose={() => setShowTagNote(false)} noteId={id} />
          </div>
        </div>
      )}

      {/* Note Header */}
      <div className="sticky top-0 z-10 bg-[#F5F2ED] border-b border-[#E5E1DA] p-6">
        <h1 className="text-3xl font-serif font-bold text-[#5C2E0E] leading-tight">
          {note?.title || "Loading..."}
        </h1>
        <div className="flex gap-4 mt-3 text-[11px] uppercase tracking-widest font-bold text-[#A09B93]">
          {noteOwner.username !== "admin" && (
            <span>
              Owner:{" "}
              <Link
                to={`/othersProfile/${noteOwner._id}`}
                className="font-bold text-xs text-[#8B4513] hover:underline"
              >
                {noteOwner.username}
              </Link>
            </span>
          )}
        </div>
        <div className="flex gap-4 mt-3 text-[11px] uppercase tracking-widest font-bold text-[#A09B93]">
          <span>Views: {note?.viewId?.length || 0}</span>
          <span>
            Likes:{" "}
            {/* at initial load both will same and display likecount, if initial it was liked and now like status is dilike it will reduce it by one and vice versa  */}
            {likeStatus == likeStatusBefore
              ? like
              : likeStatusBefore
              ? like - 1
              : like + 1}
          </span>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div
          className="prose prose-stone max-w-none text-[#2C2C2C] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: note?.content || "" }}
        />
      </div>

      {/* Action Toolbar */}
      <div className="p-4 bg-[#F5F2ED] border-t border-[#E5E1DA] flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold ${
              likeStatus
                ? "bg-[#8B4513] border-[#8B4513] text-white"
                : "bg-white border-[#D4A373] text-[#8B4513] hover:bg-[#FDFBF7]"
            }`}
          >
            <ThumbsUp size={16} fill={likeStatus ? "currentColor" : "none"} />
            {likeStatus ? "Liked" : "Like"}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTagNote(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A373] text-[#8B4513] rounded-lg hover:bg-[#FDFBF7] transition-all text-sm font-bold"
          >
            <TagIcon size={16} /> Tag
          </button>

          {/* <button
            onClick={() => setShowTagNote(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A373] text-[#8B4513] rounded-lg hover:bg-[#FDFBF7] transition-all text-sm font-bold"
          >
            <Share2 size={16} /> Share
          </button> */}
          <button
            onClick={(e) => {
              e.preventDefault();
              isReportedByUser
                ? alert("You have already reported this note.")
                : reportNote(note._id);
            }}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A373] text-[#8B4513] rounded-lg hover:bg-[#FDFBF7] transition-all text-sm font-bold ${
              isReportedByUser
                ? "opacity-50 text-red-600 cursor-not-allowed"
                : "hover:bg-[#FDFBF7]"
            }`}
          >
            <Flag size={16} /> Report
          </button>

          {noteWoner && (
            <>
              <button
                onClick={() => setActiveView("editNote")}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4A373] text-white rounded-lg hover:bg-[#C28B58] transition-all text-sm font-bold"
              >
                <Edit3 size={16} /> Edit
              </button>
              <button
                onClick={deleteNote}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all text-sm font-bold"
              >
                <Trash2 size={16} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[#FDFBF7] p-6 border-t border-[#E5E1DA]">
        <Comments noteId={id} />
      </div>
    </div>
  );
}
