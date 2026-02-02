import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "../config";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

export default function Message({ setActiveView, otherUserId, isNested }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  let { userId } = useParams();
  if (otherUserId) userId = otherUserId;

  const user = JSON.parse(localStorage.getItem("user"));

  const { data: messages, isLoading } = useQuery({
    queryKey: ["chat", userId],
    queryFn: () =>
      axios
        .get(`${config.apiUrl}/user/message/${userId}/${user._id}`)
        .then((res) => res.data),
    refetchInterval: 3000,
  });

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const response = await fetch(`${config.apiUrl}/user/message/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message, senderId: user._id }),
      });
      if (!response.ok) throw new Error("Failed to send.");
      setMessage("");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FCF9F1]">
      {" "}
      {/* Parchment Background */}
      {!isNested && <Navigation name={user.name} id={user._id} />}
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages?.oldMsg?.map((msg) => (
          <div
            key={msg._id}
            className={`flex w-full ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-[80%] px-3 py-2 shadow-sm border ${
                msg.senderId === user._id
                  ? "bg-[#FEF3C7] border-[#FDE68A] text-[#78350F] rounded-l-xl rounded-br-xl"
                  : "bg-white border-[#E8E2D2] text-[#451A03] rounded-r-xl rounded-bl-xl"
              }`}
            >
              <div className="flex flex-col">
                <span className="leading-relaxed break-words text-[14px]">
                  {msg.message}
                </span>
                <div className="flex items-center justify-end space-x-1 mt-1 opacity-60">
                  <span className="text-[9px] font-bold uppercase tracking-tighter">
                    {/* Placeholder for real time logic */}
                    12:45
                  </span>
                  {msg.senderId === user._id && (
                    <span className="text-[12px]">
                      {msg.isRead ? "●" : "○"}{" "}
                      {/* Minimalist read indicators */}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Input Area */}
      <div className="p-4 bg-[#F7F2E7] border-t border-[#E8E2D2]">
        <textarea
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your thoughts..."
          className="w-full px-4 py-3 bg-[#FFFBEB] border border-[#D97706]/30 rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none transition-all resize-none text-[#451A03] placeholder:text-[#D97706]/40"
        />

        <div className="flex justify-end gap-3 mt-3">
          <button
            type="button"
            className="px-6 py-2 rounded-lg text-sm font-bold text-[#92400E] hover:bg-[#FEF3C7] transition-all"
            onClick={() =>
              !isNested
                ? navigate(`/othersProfile/${userId}`)
                : setActiveView("createNote")
            }
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-8 py-2 rounded-lg text-sm font-bold bg-[#B45309] hover:bg-[#92400E] text-white shadow-md transition-all active:scale-95"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
