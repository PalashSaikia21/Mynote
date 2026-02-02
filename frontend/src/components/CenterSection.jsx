import React, { useState, useEffect } from "react";
import Leftcentersection from "./LeftCenterSection";
import Rightcentersection from "./RightCenterSection";
import Createnote from "./CreateNotes";
import Editnotes from "./EditNotes";
import { useNavigate } from "react-router-dom";
import Messageindex from "./MessageIndex";
import Message from "./Message";
import { ChevronLeft } from "lucide-react";

import config from "../config";

export default function Centersection({ activeView, setActiveView }) {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [tagNotes, setTagNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [thisNote, setThisNote] = useState({});
  const [otherUserId, setOtherUserId] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);

  let user = JSON.parse(localStorage.getItem("user")) || "";

  const allNotes = async () => {
    setNoteLoading(true);
    const currentUser = JSON.parse(localStorage.getItem("user")) || "";
    if (currentUser) {
      try {
        const response = await fetch(
          `${config.apiUrl}/notes/getAllNotes/${currentUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${currentUser.token}`,
            },
          }
        );

        if (response.status === 401) navigate("/login");
        if (!response.ok) throw new Error("Failed to fetch notes.");
        const data = await response.json();
        setNotes(data.notes);
        setArchivedNotes(data.deletedNote);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setNoteLoading(false);
      }
    }
  };

  useEffect(() => {
    allNotes();
  }, [activeView]);

  useEffect(() => {
    const tagNoteFun = async () => {
      const currentUser = JSON.parse(localStorage.getItem("user")) || "";
      if (currentUser) {
        try {
          const response = await fetch(
            `${config.apiUrl}/user/tagNotes/${currentUser.username}`,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${currentUser.token}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch tag notes.");
          const data = await response.json();
          setTagNotes(data.notes);
        } catch (error) {
          console.error("Error fetching tag notes:", error);
        }
      }
    };
    tagNoteFun();
  }, []);

  const handleViewChange = (view) => {
    setActiveView(view);
    setShowMobileList(false);
  };

  const NoteSkeleton = () => (
    <div className="p-6 space-y-6 bg-[#FDFBF7]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="h-3 w-3/4 bg-[#E5E1DA] rounded"></div>
          <div className="h-2 w-1/2 bg-[#F5F2ED] rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen flex flex-col md:flex-row w-full max-h-screen overflow-hidden bg-[#FDFBF7]">
      {/* LEFT SECTION (Sidebar) */}
      <div
        className={`${
          showMobileList ? "block w-full" : "hidden"
        } md:block md:w-1/3 lg:w-1/4 border-r border-[#E5E1DA] overflow-y-auto bg-[#FDFBF7]`}
      >
        {noteLoading ? (
          <NoteSkeleton />
        ) : (
          <Leftcentersection
            setView={handleViewChange}
            notes={notes}
            tagNotes={tagNotes}
            setTagNotes={setTagNotes}
            callBack={allNotes}
            archivedNotes={archivedNotes}
          />
        )}
      </div>
      {/* RIGHT SECTION (Content) */}
      <div
        className={`${
          !showMobileList ? "block w-full" : "hidden"
        } md:block md:flex-1 overflow-y-auto flex flex-col`}
      >
        {/* Mobile Navigation Header */}
        {!showMobileList && (
          <div className="md:hidden p-4 bg-[#F5F2ED] border-b border-[#E5E1DA] flex items-center">
            <button
              onClick={() => setShowMobileList(true)}
              className="flex items-center gap-2 text-[#8B4513] font-bold text-sm"
            >
              <ChevronLeft size={18} /> Library
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {activeView === "createNote" || activeView === "home" ? (
            <Createnote setActiveView={handleViewChange} />
          ) : activeView === "editNote" ? (
            <Editnotes
              thisNote={thisNote}
              setActiveView={handleViewChange}
              activeView={activeView}
            />
          ) : activeView === "messageIndex" ? (
            <Messageindex
              setActiveView={handleViewChange}
              setOtherUserId={setOtherUserId}
            />
          ) : activeView === "message" ? (
            <Message
              setActiveView={handleViewChange}
              otherUserId={otherUserId}
              isNested={true}
            />
          ) : (
            <Rightcentersection
              id={activeView}
              setActiveView={handleViewChange}
              setNotes={setNotes}
              notes={notes}
              callBack={allNotes}
              setThisNote={setThisNote}
            />
          )}
        </main>
      </div>
    </div>
  );
}
