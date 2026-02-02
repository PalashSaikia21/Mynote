import React from "react";
import { Globe, Users, Lock, Trash2 } from "lucide-react";

export default function Privacyicons({ note, callBack, setView, setTagNotes }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const PRIVACY_MAP = {
    public: {
      label: "Public",
      icon: <Globe size={14} />,
      activeColor: "text-[#D97706]", // Bright Amber
    },
    follower: {
      label: "Followers only",
      icon: <Users size={14} />,
      activeColor: "text-[#D97706]",
    },
    private: {
      label: "Private",
      icon: <Lock size={14} />,
      activeColor: "text-[#D97706]",
    },
    trash: {
      label: "Delete Note",
      icon: <Trash2 size={14} />,
      color: "text-[#991B1B] hover:text-[#7F1D1D]", // Deep Madder Red
    },
  };

  const deleteNote = async () => {
    if (!window.confirm("Archive this thought permanently?")) return;
    try {
      const response = await fetch(
        `http://localhost:3400/notes/deleteNote/${note._id}/${user._id}`
      );
      if (!response.ok) throw new Error("Deletion failed.");
      setView("home");
      callBack();
    } catch (error) {
      console.error(error);
    }
  };

  const removeTag = async () => {
    if (!window.confirm("Remove your association with this note?")) return;
    try {
      const response = await fetch(
        `http://localhost:3400/user/removeTag/${user.username}/${note._id}/${note.userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Tag removal failed.");
      const data = await response.json();
      console.log("Tag removed:", data);
      setTagNotes(data.note);
      setView("home");

      callBack();
    } catch (error) {
      console.error(error);
    }
  };

  const changePrivacy = async (e, label) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3400/notes/updateNote/${note._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: note.title,
            content: note.content,
            privacy: label,
          }),
        }
      );
      if (!response.ok) throw new Error("Update failed.");
      callBack(); // Refresh to show new state
    } catch (error) {
      alert(error.message);
    }
  };

  const isOwner = user?._id === note?.userId;

  return (
    <div className="flex items-center gap-3">
      {isOwner ? (
        <>
          {/* Private Icon */}
          <button
            onClick={(e) => changePrivacy(e, "private")}
            className={`transition-all duration-200 hover:scale-110 ${
              note.privacy === "private" || note.privacy === "applied"
                ? PRIVACY_MAP.private.activeColor
                : "text-[#92400E]/30"
            }`}
            title={PRIVACY_MAP.private.label}
          >
            {PRIVACY_MAP.private.icon}
          </button>

          {/* Follower Icon */}
          <button
            onClick={(e) => changePrivacy(e, "follower")}
            className={`transition-all duration-200 hover:scale-110 ${
              note.privacy === "follower"
                ? PRIVACY_MAP.follower.activeColor
                : "text-[#92400E]/30"
            }`}
            title={PRIVACY_MAP.follower.label}
          >
            {PRIVACY_MAP.follower.icon}
          </button>

          {/* Public Icon */}
          <button
            onClick={(e) => changePrivacy(e, "applied")}
            className={`transition-all duration-200 hover:scale-110 ${
              note.privacy === "public"
                ? PRIVACY_MAP.public.activeColor
                : "text-[#92400E]/30"
            }`}
            title={PRIVACY_MAP.public.label}
          >
            {PRIVACY_MAP.public.icon}
          </button>

          {/* Trash Icon */}
          <button
            onClick={deleteNote}
            className={`transition-all duration-200 hover:scale-110 ml-1 ${PRIVACY_MAP.trash.color}`}
            title="Delete"
          >
            {PRIVACY_MAP.trash.icon}
          </button>
        </>
      ) : (
        /* Remove Tag for non-owners */
        <button
          onClick={removeTag}
          className={`transition-all duration-200 hover:scale-110 ${PRIVACY_MAP.trash.color}`}
          title="Remove Tag"
        >
          {PRIVACY_MAP.trash.icon}
        </button>
      )}
    </div>
  );
}
