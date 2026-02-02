import React, { useState } from "react";
import Closebutton from "./CloseButton";
import axios from "axios";
import { UserPlus, Search, X, Users } from "lucide-react";

export default function Tagnote({ onClose, noteId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsError(false);
    setIsPrivate(false);

    if (!searchQuery.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:3400/user/searchUser/${user._id}`,
        { username: searchQuery },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      const foundUsername = response.data.user.username;
      if (searchUser.includes(foundUsername)) {
        setSearchQuery("");
        return;
      }

      setSearchUser((prev) => [...prev, foundUsername]);
      setSearchQuery("");
    } catch (error) {
      if (error.response?.status === 403) setIsPrivate(true);
      else if (error.response?.status === 404) setIsError(true);
      else console.error("Search failed:", error);
    }
  };

  const tagNote = async (e) => {
    e.preventDefault();
    if (searchUser.length === 0) return;

    try {
      await axios.post(
        `http://localhost:3400/user/tagNote/${user._id}`,
        { userList: searchUser, noteId: noteId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      onClose(false);
    } catch (error) {
      console.error("Tagging failed:", error);
    }
  };

  return (
    <div className="p-1 bg-[#FCF9F1]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black text-[#451A03] flex items-center gap-2">
          <Users size={20} className="text-[#D97706]" /> Tag Collaborators
        </h2>
        <Closebutton onClose={onClose} />
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <div className="relative group">
            <input
              autoFocus
              type="text"
              placeholder="Enter username..."
              className="w-full pl-10 pr-24 py-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:border-transparent outline-none transition-all text-[#451A03] placeholder:text-[#92400E]/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-3.5 text-[#92400E]/40"
              size={18}
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#B45309] rounded-lg hover:bg-[#92400E] transition-all shadow-sm"
            >
              Search
            </button>
          </div>

          {(isError || isPrivate) && (
            <p className="mt-2 text-xs font-bold text-red-700 italic">
              {isError
                ? "◈ User not found."
                : "◈ This profile is set to private."}
            </p>
          )}
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {searchUser.map((u, index) => (
            <span
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] text-xs font-bold rounded-full animate-in zoom-in-95"
            >
              @{u}
              <X
                size={14}
                className="cursor-pointer hover:text-red-700"
                onClick={() =>
                  setSearchUser((prev) => prev.filter((_, i) => i !== index))
                }
              />
            </span>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E2D2]">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-5 py-2 text-xs font-bold text-[#92400E] hover:bg-[#F7F2E7] rounded-lg"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={searchUser.length === 0}
            onClick={tagNote}
            className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-[#451A03] rounded-lg hover:bg-black shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <UserPlus size={14} /> Finalize Tags
          </button>
        </div>
      </form>
    </div>
  );
}
