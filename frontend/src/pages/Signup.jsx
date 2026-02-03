import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, PenTool, Hash } from "lucide-react";

import config from "../config";
export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      return setError("Passphrases do not match.");
    }

    try {
      const payload = { name, email, password, passwordConfirm, username };
      const response = await axios.post(`${config.apiUrl}/register`, payload);
      setLoading(false);

      if (response.status !== 404) {
        navigate(`/login?username=${encodeURIComponent(username)}`);
        // navigate("/login");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Enrolment failed. Please try again.";
      setError(message);
      console.log("Signup error:", error);
    } finally {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#451A03] p-4">
      <div className="max-w-md w-full bg-[#FCF9F1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#E8E2D2] p-8 relative overflow-hidden">
        {/* Decorative Pen Icon */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFBF7]/60 backdrop-blur-sm">
            {/* The Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-[#D4A373]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* The Text */}
            <p className="mt-4 font-serif font-medium text-[#8B4513] animate-pulse">
              Creating your account...
            </p>
          </div>
        )}
        <div className="absolute -top-6 -left-6 text-[#D97706] opacity-5 -rotate-12">
          <PenTool size={150} />
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl font-black text-[#451A03] text-center mb-1 tracking-tight">
            Begin Your Notes
          </h2>
          <p className="text-center text-[#92400E] text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
            Establish your identity
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-4 py-2 rounded text-xs italic animate-pulse">
                {error}
              </div>
            )}

            {/* Field Group: Identity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#78350F] uppercase ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none text-sm"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User
                    className="absolute left-2.5 top-2.5 text-[#92400E]/40"
                    size={16}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#78350F] uppercase ml-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none text-sm"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Hash
                    className="absolute left-2.5 top-2.5 text-[#92400E]/40"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#78350F] uppercase ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail
                  className="absolute left-3 top-2.5 text-[#92400E]/40"
                  size={18}
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#78350F] uppercase ml-1">
                Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock
                  className="absolute left-3 top-2.5 text-[#92400E]/40"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#78350F] uppercase ml-1">
                Confirm Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none text-sm"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <Lock
                  className="absolute left-3 top-2.5 text-[#92400E]/40"
                  size={18}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]"
            >
              Establish Account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E8E2D2] text-center">
            <p className="text-xs text-[#78350F]/70">
              Already a member of the MyNote?{" "}
              <Link
                to="/login"
                className="text-[#B45309] font-black hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
