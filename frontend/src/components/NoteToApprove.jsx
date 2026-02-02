import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Shownote from "./ShowNote";
import Closebutton from "./CloseButton";
import { BookOpenCheck, Inbox, ArrowRight } from "lucide-react";

import config from "../config";

export default function Notetoapprove({ setNoteToApprove }) {
  const [noteList, setNoteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null); // Simplified state
  const [showNote, setShowNote] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const getListOfNote = useCallback(async () => {
    if (!user?._id) return;
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${config.apiUrl}/user/noteToApprove/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setNoteList(response.data.noteList || []);
    } catch (error) {
      console.error("Error fetching review queue:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, user?.token]);

  useEffect(() => {
    getListOfNote();
  }, [getListOfNote]);

  const handleOpenNote = (note) => {
    setSelectedNote(note);
    setShowNote(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCF9F1] space-y-4">
        <div className="w-12 h-12 border-4 border-[#D97706]/20 border-t-[#D97706] rounded-full animate-spin"></div>
        <p className="text-[#B45309] font-bold italic animate-pulse">
          Consulting the Archives...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F1EDE4] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-end mb-10 border-b border-[#D97706]/20 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpenCheck className="text-[#D97706]" size={24} />
              <h1 className="text-3xl font-black text-[#451A03] tracking-tight">
                Review Queue
              </h1>
            </div>
            <p className="text-[10px] text-[#92400E] uppercase tracking-[0.3em] font-bold">
              Cognitive Approvals Required • {noteList.length} Pending
            </p>
          </div>
          <Closebutton onClose={() => setNoteToApprove(false)} />
        </header>

        {showNote && selectedNote && (
          <Shownote
            title={selectedNote.title}
            content={selectedNote.content}
            setShowNote={setShowNote}
            setNoteToApprove={setNoteToApprove} // Note: Check logic here (see review)
            userId={selectedNote.userId}
            noteId={selectedNote._id}
          />
        )}

        {noteList.length === 0 ? (
          <div className="bg-[#FCF9F1] p-20 rounded-3xl border border-[#E8E2D2] shadow-inner text-center">
            <Inbox className="mx-auto mb-4 text-[#D97706]/20" size={48} />
            <p className="text-[#92400E]/60 font-serif text-lg italic">
              The queue is clear. All thoughts have been processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {noteList.map((note) => (
              <div
                key={note._id}
                className="bg-[#FCF9F1] p-6 rounded-2xl border border-[#E8E2D2] flex justify-between items-center 
                           hover:border-[#D97706] hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handleOpenNote(note)}
              >
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-black text-[#451A03] group-hover:text-[#B45309] transition-colors truncate">
                    {note.title || "Untitled Fragment"}
                  </h3>
                  <div
                    className="text-sm text-[#78350F]/70 line-clamp-1 italic mt-1"
                    dangerouslySetInnerHTML={{
                      __html: note.content?.substring(0, 150),
                    }}
                  />
                </div>
                <div className="ml-6 flex items-center gap-2 text-[#D97706] font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  Review <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
