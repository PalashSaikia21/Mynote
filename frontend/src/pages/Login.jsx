import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Lock, Mail, BookOpen, X, HelpCircle } from "lucide-react";
import Changepassword from "../components/ChangePassword";
import Securityquestion from "../components/SecurityQuestion";
import config from "../config";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // New State for Modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const [recoveryAllowed, setRecoveryAllowed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const userFromUrl = searchParams.get("username");
    if (userFromUrl) {
      setEmail(userFromUrl);
    }
  }, [searchParams]);

  const noInputInEmail = () => {
    alert(
      "Please enter your email or username in the Identity field before proceeding with password recovery."
    );
    document.querySelector("#emailInput").focus();
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { email, password };
      const data = await axios.post(`${config.apiUrl}/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.status === 200) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#451A03] p-4 font-serif">
      <div className="max-w-md w-full bg-[#FCF9F1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#E8E2D2] p-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-[#D97706] opacity-5">
          <BookOpen size={200} />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-[#451A03] text-center mb-2 tracking-tight">
            My Notes
          </h2>
          <p className="text-center text-[#92400E] text-xs uppercase tracking-widest font-bold mb-8">
            Access your intellect
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm italic">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#78350F] uppercase tracking-wide ml-1">
                Identity
              </label>
              <div className="relative">
                <input
                  value={email}
                  id="emailInput"
                  type="text"
                  placeholder="scholar@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none transition-all text-[#451A03]"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail
                  className="absolute left-3 top-3.5 text-[#92400E]/40"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#78350F] uppercase tracking-wide ml-1">
                Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none transition-all text-[#451A03]"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock
                  className="absolute left-3 top-3.5 text-[#92400E]/40"
                  size={18}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  email.length < 3
                    ? noInputInEmail()
                    : setIsSecurityModalOpen(true);
                }}
                className="text-xs font-bold text-[#B45309] hover:text-[#92400E] transition-colors"
              >
                Forgotten your key?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E8E2D2] text-center">
            <p className="text-sm text-[#78350F]/70">
              New to the MyNote?{" "}
              <Link
                to="/register"
                className="text-[#B45309] font-black hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {recoveryAllowed && (
        <Changepassword
          occassion="forgetPassword"
          setIsPassModalOpen={setRecoveryAllowed}
          email={email}
        />
      )}
      {/* --- FORGOT PASSWORD MODAL --- */}
      {isSecurityModalOpen && (
        <Securityquestion
          setRecoveryAllowed={setRecoveryAllowed}
          setIsSecurityModalOpen={setIsSecurityModalOpen}
          occassion={"recovery"}
          email={email}
        />
      )}
    </div>
  );
}
