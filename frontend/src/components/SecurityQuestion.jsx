import React, { useState } from "react";
import axios from "axios";
import { X, HelpCircle, Send } from "lucide-react";

export default function Securityquestion({
  setRecoveryAllowed,
  setIsSecurityModalOpen,
  occassion,
  email,
  setProfileData,
}) {
  const questions = [
    "What is the name of your place of origin (Birthplace)?",
    "What was the name of your first animal companion (Pet)?",
    "What was the name of your primary house of learning (First School)?",
    "What is your mother's maiden surname?",
    "In what city did your parents first meet?",
    "What was the make of your first mechanical vessel (First Car)?",
    "What was the name of your favorite childhood educator?",
    "What was the first concert or performance you attended?",
    "What is the name of the street where you first resided?",
    "What was your childhood nickname among kin?",
  ];
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [recoveryData, setRecoveryData] = useState({
    question: "",
    answer: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const handleChangeSecurity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: user.username, // Assuming they typed it in the login field first
        question: recoveryData.question,
        answer: recoveryData.answer,
      };

      const data = await axios.post(
        "https://mynotebackend-qmqy.onrender.com/changeSecurity",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(data.data.user.securityQuestion);
      await setProfileData(data.data.user);
      if (data.status === 200) {
        setIsSecurityModalOpen(false); // Update profile data with new security question
        alert("Your security question has been updated successfully.");
      }
    } catch (err) {
      alert("From handle security change");
    }
  };

  const sendOtp = async () => {
    try {
      setOtpSent(true); // Show input field immediately for feedback
      await axios.post(
        "https://mynotebackend-qmqy.onrender.com/requestOTPForPassword",
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Verification code sent to your email.");
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setOtpSent(false);
    }
  };

  const verifyOtp = async () => {
    alert(otpCode);
    if (!otpCode) return alert("Please enter the code");
    setVerifying(true);
    try {
      await axios.post(
        "https://mynotebackend-qmqy.onrender.com/verifyOTPForPassword",
        { email, otp: otpCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Email verified successfully!");
      setIsSecurityModalOpen(false);
      setRecoveryAllowed(true);
      // Refresh profile data
    } catch (error) {
      alert("Invalid or expired code.");
    } finally {
      setVerifying(false);
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();

    // Opinion: You should include the user's email in this payload
    // so the backend knows *whose* security question is being answered.
    const payload = {
      email: email, // Assuming they typed it in the login field first
      question: recoveryData.question,
      answer: recoveryData.answer,
    };

    try {
      const data = await axios.post(
        "https://mynotebackend-qmqy.onrender.com/recoveryPassword",
        payload,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.status === 200) {
        setIsSecurityModalOpen(false);
        setRecoveryAllowed(true);
      }
    } catch (err) {
      alert("The archives do not match your claim.");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#451A03]/80 backdrop-blur-sm">
      <div className="bg-[#FCF9F1] w-full max-w-sm rounded-2xl p-8 border border-[#E8E2D2] shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setIsSecurityModalOpen(false)}
          className="absolute top-4 right-4 text-[#92400E]/50 hover:text-[#451A03]"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-[#FFFBEB] rounded-full mb-3 text-[#D97706]">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-xl font-black text-[#451A03]">
            Identity Recovery
          </h3>
          <p className="text-xs text-[#92400E]/70">
            Answer your chosen security riddle
          </p>
        </div>

        <form
          onSubmit={
            occassion == "recovery"
              ? handleRecoverySubmit
              : handleChangeSecurity
          }
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#78350F] uppercase tracking-widest">
              Select Question
            </label>
            <select
              className="w-full p-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl text-sm text-[#451A03] outline-none focus:ring-2 focus:ring-[#D97706]"
              onChange={(e) =>
                setRecoveryData({
                  ...recoveryData,
                  question: e.target.value,
                })
              }
              required
            >
              <option value="">Choose from the records...</option>
              {questions.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#78350F] uppercase tracking-widest">
              Your Answer
            </label>
            <input
              type="text"
              placeholder="The lost knowledge..."
              className="w-full p-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl text-sm text-[#451A03] outline-none focus:ring-2 focus:ring-[#D97706]"
              onChange={(e) =>
                setRecoveryData({ ...recoveryData, answer: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                sendOtp();
              }}
              className="text-xs font-bold text-[#B45309] hover:text-[#92400E] transition-colors"
            >
              Verify using OTP!
            </button>
            {otpSent && (
              <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="text-sm border border-[#D4A373] bg-[#FDFBF7] px-3 py-1 rounded-lg w-32 focus:outline-[#8B4513]"
                />
                <button
                  onClick={verifyOtp}
                  disabled={verifying}
                  className="bg-[#8B4513] text-white p-1 rounded-lg hover:bg-[#6F3710] disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#B45309] text-white font-bold py-3 rounded-xl hover:bg-[#92400E] transition-all"
          >
            {occassion == "recovery"
              ? "Verify Identity"
              : "Update Security Question"}
          </button>
        </form>
      </div>
    </div>
  );
}
