import React from "react";
import axios from "axios";
import { ShieldCheck, User, Star, X } from "lucide-react";

export default function Controlusertype({
  user,
  setIsUserReceived,
  handleUserLabel,
}) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2C2C]/60 backdrop-blur-sm p-4">
      {/* Modal Container: Parchment Aesthetic */}
      <div className="relative w-full max-w-sm bg-[#FDFBF7] border border-[#E5E1DA] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Icon */}
        <button
          onClick={() => setIsUserReceived(false)}
          className="absolute top-4 right-4 text-[#A09B93] hover:text-[#8B4513] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header: Scholarly Profile */}
        <div className="pt-10 pb-6 px-6 text-center border-b border-[#F5F2ED]">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-[#F5F2ED] border-2 border-[#D4A373] text-[#8B4513] text-2xl font-serif font-bold">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-xl font-serif font-bold text-[#5C2E0E] leading-tight">
            {user.username}
          </h2>
          <p className="text-xs font-medium text-[#A09B93] mt-1 italic">
            {user.email}
          </p>
        </div>

        {/* Action Section */}
        <div className="bg-[#FDFBF7] p-6">
          <label className="block text-[10px] font-bold text-[#D4A373] uppercase tracking-[0.2em] mb-4 text-center">
            Designate Authority Level
          </label>

          <div className="flex flex-col gap-3">
            {/* Standard User */}
            <button
              onClick={() => {
                handleUserLabel("user", user._id);
              }}
              className={`flex items-center justify-between w-full py-3 px-4 text-sm font-bold rounded-md border transition-all ${
                user.userType === "user"
                  ? "bg-[#8B4513] text-white border-[#8B4513]"
                  : "bg-white text-[#8B4513] border-[#E5E1DA] hover:border-[#D4A373]"
              }`}
            >
              <span className="flex items-center gap-2">
                <User size={16} /> Reader
              </span>
              {user.userType === "user" && (
                <span className="text-[10px] uppercase">Current</span>
              )}
            </button>

            {/* Trusted Member */}
            <button
              onClick={() => {
                handleUserLabel("trusted", user._id);
              }}
              className={`flex items-center justify-between w-full py-3 px-4 text-sm font-bold rounded-md border transition-all ${
                user.userType === "trusted"
                  ? "bg-[#D4A373] text-white border-[#D4A373]"
                  : "bg-white text-[#D4A373] border-[#E5E1DA] hover:border-[#D4A373]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Star size={16} /> Scribe (Trusted)
              </span>
              {user.userType === "trusted" && (
                <span className="text-[10px] uppercase">Current</span>
              )}
            </button>

            {/* Admin */}
            <button
              onClick={() => {
                handleUserLabel("admin", user._id);
              }}
              className={`flex items-center justify-between w-full py-3 px-4 text-sm font-bold rounded-md border transition-all ${
                user.userType === "admin"
                  ? "bg-[#5C2E0E] text-white border-[#5C2E0E]"
                  : "bg-white text-[#5C2E0E] border-[#E5E1DA] hover:bg-[#F5F2ED]"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} /> Curator (Admin)
              </span>
              {user.userType === "admin" && (
                <span className="text-[10px] uppercase">Current</span>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsUserReceived(false)}
            className="w-full mt-6 text-[11px] font-bold text-[#A09B93] hover:text-[#8B4513] uppercase tracking-widest transition-colors"
          >
            Close Archives
          </button>
        </div>
      </div>
    </div>
  );
}
