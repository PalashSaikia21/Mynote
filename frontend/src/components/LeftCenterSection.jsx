import React, { useState } from "react";
import Privacyicons from "./PrivacyIcons";

import config from "../config";
import {
  Plus,
  MessageSquare,
  Book,
  Hash,
  FolderArchive,
  Search,
  ChevronRight,
  ChevronDown,
  Radio,
  RotateCcw,
  Trash2,
} from "lucide-react";

export default function Leftcentersection({
  setView,
  notes = [],
  callBack,
  archivedNotes = [],
  tagNotes = [],
  setTagNotes,
}) {
  const [expandMyNote, setExpandMyNote] = useState(false);
  const [expandTagNote, setExpandTagNote] = useState(false);
  const [expandEncryptedNote, setExpandEncryptedNote] = useState(false);
  const [expandPublic, setExpandPublic] = useState(false);
  const [expandArchived, setExpandArchived] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [publicNotes, setPublicNotes] = useState([]);

  const [requiredString, setRequiredString] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || "";
  const fetchPublicNotes = async () => {
    if (publicNotes.length > 0) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/notes/SearchNote`);
      if (!response.ok) throw new Error("Failed to fetch notes.");
      const data = await response.json();
      setPublicNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const restoreNote = async (noteId) => {
    if (!window.confirm("Note restored to your Personal Notes.")) return;
    try {
      const response = await fetch(
        `${config.apiUrl}/notes/restoreNote/${noteId}/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Deletion failed.");
      setView("home");
      callBack();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("Archive this thought permanently?")) return;
    try {
      const response = await fetch(
        `${config.apiUrl}/notes/deleteNotePermanently/${noteId}/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Deletion failed.");
      setView("home");
      callBack();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpandPublic = () => {
    const newState = !expandPublic;
    setExpandPublic(newState);
    setExpandArchived(false);
    setExpandMyNote(false);
    setExpandTagNote(false);
    setExpandEncryptedNote(false);

    if (newState) fetchPublicNotes();
  };

  const findReqNote = (e) => {
    const inputValue = e.target.value;
    setSearchString(inputValue);
    if (!inputValue.trim()) {
      setRequiredString([]);
      return;
    }
    const filtered = publicNotes.filter((note) =>
      note.title?.toLowerCase().includes(inputValue.toLowerCase())
    );
    setRequiredString(filtered);
  };

  return (
    <div className="flex flex-col h-full bg-[#FCF9F1] border-r border-[#E8E2D2] select-none">
      {/* 1. Header Actions - High Contrast Amber */}
      <div className="p-4 flex gap-2 border-b border-[#E8E2D2] bg-[#F7F2E7]">
        <button
          onClick={() => setView("createNote")}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#B45309] hover:bg-[#92400E] text-[#FFFBEB] rounded-lg transition-all text-xs font-bold shadow-md"
        >
          <Plus size={14} /> New Note
        </button>
        <button
          onClick={() => setView("messageIndex")}
          className="flex items-center justify-center p-2 border border-[#D97706] text-[#B45309] hover:bg-[#FEF3C7] rounded-lg transition-all"
        >
          <MessageSquare size={18} />
        </button>
      </div>

      {/* 2. Scrollable Library Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        <h2 className="px-3 pt-2 pb-1 font-bold text-[10px] uppercase tracking-[0.2em] text-[#92400E]/60">
          Intellect Base
        </h2>

        {/* --- PERSONAL NOTES --- */}
        <section>
          <button
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm font-bold ${
              expandMyNote
                ? "text-[#92400E] bg-[#FEF3C7]"
                : "text-[#78350F]/80 hover:bg-[#F7F2E7]"
            }`}
            onClick={() => {
              setExpandMyNote(!expandMyNote);
              setExpandArchived(false);
              setExpandPublic(false);
              setExpandTagNote(false);
              setExpandEncryptedNote(false);
            }}
          >
            {expandMyNote ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <Book size={16} className="shrink-0 opacity-80" />
            <span>Personal</span>
          </button>

          {expandMyNote && (
            <div className="mt-1 ml-4 border-l border-[#D97706]/30 space-y-0.5">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="group flex items-center hover:bg-[#FEF3C7]/50 rounded-r-md transition-all"
                >
                  <button
                    onClick={() => setView(note._id)}
                    className="flex-1 text-left py-1.5 px-3 truncate text-xs text-[#78350F] group-hover:text-[#B45309]"
                  >
                    {note.title}
                  </button>
                  <div className="flex px-2 opacity-20 group-hover:opacity-100 transition-opacity scale-75">
                    <Privacyicons
                      note={note}
                      callBack={callBack}
                      setView={setView}
                      setTagNotes={setTagNotes}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- TAGGED NOTES --- */}
        <section>
          <button
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm font-bold ${
              expandTagNote
                ? "text-[#92400E] bg-[#FEF3C7]"
                : "text-[#78350F]/80 hover:bg-[#F7F2E7]"
            }`}
            onClick={() => {
              setExpandMyNote(false);
              setExpandArchived(false);
              setExpandPublic(false);
              setExpandTagNote(!expandTagNote);
              setExpandEncryptedNote(false);
            }}
          >
            {expandTagNote ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <Hash size={16} className="shrink-0 opacity-80" />
            <span>Tagged</span>
          </button>

          {expandTagNote && (
            <div className="mt-1 ml-4 border-l border-[#D97706]/30 space-y-0.5">
              {tagNotes.map((note) => (
                <div
                  key={note._id}
                  className="group flex items-center hover:bg-[#FEF3C7]/50 rounded-r-md transition-all"
                >
                  <button
                    onClick={() => setView(note._id)}
                    className="flex-1 text-left py-1.5 px-3 truncate text-xs text-[#78350F] group-hover:text-[#B45309]"
                  >
                    {note.title}
                  </button>
                  <div className="flex px-2 opacity-20 group-hover:opacity-100 transition-opacity scale-75">
                    <Privacyicons
                      note={note}
                      callBack={callBack}
                      setView={setView}
                      setTagNotes={setTagNotes}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- Encrypted NOTES --- */}
        <section>
          <button
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm font-bold ${
              expandEncryptedNote
                ? "text-[#92400E] bg-[#FEF3C7]"
                : "text-[#78350F]/80 hover:bg-[#F7F2E7]"
            }`}
            onClick={() => {
              setExpandMyNote(false);
              setExpandArchived(false);
              setExpandPublic(false);
              setExpandEncryptedNote(!expandEncryptedNote);
              setExpandTagNote(false);
            }}
          >
            {expandEncryptedNote ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <Hash size={16} className="shrink-0 opacity-80" />
            <span>Encrypted</span>
          </button>

          {expandEncryptedNote && (
            <div className="mt-1 ml-4 border-l border-[#D97706]/30 space-y-0.5">
              {/* {tagNotes.map((note) => (
                <div
                  key={note._id}
                  className="group flex items-center hover:bg-[#FEF3C7]/50 rounded-r-md transition-all"
                >
                  <button
                    onClick={() => setView(note._id)}
                    className="flex-1 text-left py-1.5 px-3 truncate text-xs text-[#78350F] group-hover:text-[#B45309]"
                  >
                    {note.title}
                  </button>
                  <div className="flex px-2 opacity-20 group-hover:opacity-100 transition-opacity scale-75">
                    <Privacyicons
                      note={note}
                      callBack={callBack}
                      setView={setView}
                      setTagNotes={setTagNotes}
                    />
                  </div>
                </div>
              ))} */}
              <button
                onClick={() => alert("This feature is coming soon!")}
                className="flex-1 text-left py-1.5 px-3 truncate text-xs text-[#78350F] group-hover:text-[#B45309]"
              >
                {" "}
                Coming Soon: Encrypted Notes Management
              </button>
            </div>
          )}
        </section>
        {/* --- Deleted NOTES --- */}
        <section>
          <button
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm font-bold ${
              expandArchived
                ? "text-[#92400E] bg-[#FEF3C7]"
                : "text-[#78350F]/80 hover:bg-[#F7F2E7]"
            }`}
            onClick={() => {
              setExpandArchived(!expandArchived);
              setExpandMyNote(false);
              setExpandPublic(false);
              setExpandTagNote(false);
              setExpandEncryptedNote(false);
            }}
          >
            {expandArchived ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <FolderArchive size={16} className="shrink-0 opacity-80" />
            <span>Archive</span>
          </button>

          {expandArchived && (
            <div className="mt-1 ml-4 border-l border-[#D97706]/30 space-y-0.5">
              {archivedNotes.map((note) => (
                <div
                  key={note._id}
                  className="group flex items-center hover:bg-[#FEF3C7]/50 rounded-r-md transition-all"
                >
                  <button
                    onClick={() => setView(note._id)}
                    className="flex-1 text-left py-1.5 px-3 truncate text-xs text-[#78350F] group-hover:text-[#B45309]"
                  >
                    {note.title}
                  </button>
                  <div
                    className="flex px-2 opacity-20 group-hover:opacity-100 transition-opacity scale-75"
                    title="Restore Note"
                    onClick={() => restoreNote(note._id)}
                  >
                    <RotateCcw size={16} className="shrink-0 opacity-80" />
                  </div>
                  <div
                    onClick={() => deleteNote(note._id)}
                    className="flex px-2 opacity-20 group-hover:opacity-100 transition-opacity scale-75"
                    title="Delete Permanently"
                  >
                    <Trash2 size={16} className="shrink-0 opacity-80" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* --- COMMUNITY NOTES --- */}
        <section>
          <button
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm font-bold ${
              expandPublic
                ? "text-[#92400E] bg-[#FEF3C7]"
                : "text-[#78350F]/80 hover:bg-[#F7F2E7]"
            }`}
            onClick={handleExpandPublic}
          >
            {expandPublic ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            <Radio size={16} className="shrink-0 opacity-80" />
            <span>Public Notes</span>
          </button>

          {expandPublic && (
            <div className="ml-4 border-l border-[#D97706]/30 flex flex-col gap-2">
              <div className="px-2 pt-1">
                <div className="relative">
                  <Search
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-[#D97706]"
                    size={12}
                  />
                  <input
                    className="w-full bg-[#FFFBEB] border border-[#E8E2D2] rounded-md pl-7 pr-2 py-1.5 text-[11px] text-[#451A03] focus:ring-1 focus:ring-[#D97706] outline-none"
                    value={searchString}
                    onChange={findReqNote}
                    placeholder="Search public notes..."
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-0.5">
                {/* Loader & Result styles updated to match amber theme */}
                {isLoading ? (
                  <div className="p-3 text-[10px] text-[#B45309]/50 animate-pulse font-medium">
                    Consulting records...
                  </div>
                ) : (
                  (searchString.trim() !== "" ? requiredString : publicNotes)
                    .slice(0, 10)
                    .map((note) => (
                      <button
                        key={note._id}
                        onClick={() => setView(note._id)}
                        className="w-full text-left px-3 py-1 truncate text-[11px] text-[#78350F] hover:bg-[#FEF3C7] hover:text-[#B45309] rounded-r-md"
                      >
                        {note.title}
                      </button>
                    ))
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
