import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import config from "../config";

export default function Messageindex({ setActiveView, setOtherUserId }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    const user = JSON.parse(localStorage.getItem("user")) || "";
    if (!user) return;

    try {
      const response = await fetch(`${config.apiUrl}/user/message/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch conversations.");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleViewMessage = (messageId) => {
    setOtherUserId(messageId);
    setActiveView("message");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#FCF9F1] min-h-screen border-x border-[#E8E2D2] shadow-inner">
      {/* Header */}
      <div className="p-6 border-b border-[#E8E2D2] bg-[#F7F2E7]">
        <h1 className="text-xl font-black text-[#92400E] tracking-tight">
          Conversations
        </h1>
        <p className="text-xs text-[#78350F]/60">
          Your intellectual exchange history
        </p>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-10 text-center animate-pulse text-[#D97706] font-medium italic">
          Retrieving correspondence...
        </div>
      )}

      {error && (
        <div className="p-4 m-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Message List */}
      <div className="divide-y divide-[#E8E2D2]/50">
        {messages.length === 0 && !loading && (
          <div className="p-10 text-center text-[#A09B93] text-sm italic">
            No active exchanges found.
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.otherUserId}
            onClick={() => handleViewMessage(message.otherUserId)}
            className={`group p-5 cursor-pointer transition-all flex items-center gap-4 hover:bg-[#FEF3C7] ${
              message.unreadCount > 0
                ? "bg-[#FFFBEB] border-l-4 border-[#D97706]"
                : "bg-transparent"
            }`}
          >
            {/* Avatar Placeholder */}
            <div className="h-10 w-10 rounded-full bg-[#E8E2D2] flex items-center justify-center text-[#92400E] font-bold border border-[#D97706]/20">
              {message.username?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3
                  className={`text-sm font-bold truncate ${
                    message.unreadCount > 0
                      ? "text-[#451A03]"
                      : "text-[#78350F]"
                  }`}
                >
                  {message.username}
                </h3>
                {message.unreadCount > 0 && (
                  <span className="bg-[#B45309] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {message.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#92400E]/70 truncate leading-relaxed italic">
                {message.lastMessage}
              </p>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[#D97706]">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
