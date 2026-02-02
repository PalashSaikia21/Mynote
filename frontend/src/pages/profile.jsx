import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation.jsx";
import Securityquestion from "../components/SecurityQuestion";
import { useNavigate, useParams } from "react-router-dom";
import {
  LogOut,
  KeyRound,
  UserCircle,
  ShieldCheck,
  ShieldAlert,
  Send,
  Pencil,
  Check,
  X,
} from "lucide-react";

import Administratorprofile from "../components/Administratorprofile.jsx";
import Changepassword from "../components/ChangePassword.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW STATE FOR OTP ---
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [changeEmailMode, setChangeEmailMode] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sendOtp = async () => {
    try {
      setOtpSent(true); // Show input field immediately for feedback
      await axios.post(
        "https://mynotebackend-qmqy.onrender.com/requestOTP",
        { email: user.username },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Verification code sent to your email.");
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setOtpSent(false);
    }
  };

  const handleEmailChange = async () => {
    try {
      setOtpSent(true); // Show input field immediately for feedback
      const response = await axios.post(
        "https://mynotebackend-qmqy.onrender.com/changeEmail",
        { email: emailInput, username: user.username },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        setChangeEmailMode(false);
        setProfileData(response.data.user);
        sendOtp();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError("Email is already in use or invalid.");
      }
      if (error.response?.status === 401) {
        setError("Invalid email format.");
      }
      setOtpSent(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode) return alert("Please enter the code");
    setVerifying(true);
    try {
      await axios.post(
        "https://mynotebackend-qmqy.onrender.com/verifyOTP",
        { email: user.username, otp: otpCode },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Email verified successfully!");
      setOtpSent(false);
      getData(); // Refresh profile data
    } catch (error) {
      alert("Invalid or expired code.");
    } finally {
      setVerifying(false);
    }
  };

  const getData = async () => {
    try {
      if (!user?.token) {
        navigate("/login");
        return;
      }
      const response = await axios.post(
        `https://mynotebackend-qmqy.onrender.com/user/profile/${id}`,
        { userId: user._id, token: user.token },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      setProfileData(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#8B4513] font-bold italic">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navigation name={profileData?.name || "User"} id={user?._id} />

      <div className="max-w-4xl mx-auto p-6">
        {user?.userType === "administrator" && (
          <div className="mb-8">
            <Administratorprofile />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E5E1DA] shadow-sm overflow-hidden">
          <div className="bg-[#8B4513] p-6 text-white flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <UserCircle size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold">User Profile</h1>
              <p className="text-white/80 text-sm">Account details</p>
            </div>
          </div>

          <div className="p-8">
            {profileData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest">
                    Full Name
                  </p>
                  <p className="text-lg font-semibold text-[#2C2C2C]">
                    {profileData.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest">
                    Email Address
                  </p>
                  <div className="flex flex-col gap-2">
                    {!changeEmailMode && (
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-[#2C2C2C]">
                          {profileData.email}
                        </span>

                        <button
                          className={`w-3 h-3 rounded-full ml-2 transition-transform hover:scale-110`}
                          onClick={(e) => {
                            e.preventDefault();
                            setChangeEmailMode(true);
                          }}
                        >
                          <Pencil
                            size={12}
                            className="text-[#8B4513]/50 hover:text-[#8B4513]"
                          />
                        </button>
                        <button
                          onClick={
                            !profileData.isUserVerified ? sendOtp : undefined
                          }
                          className={`w-3 h-3 rounded-full ml-2 transition-transform hover:scale-110 ${
                            profileData.isUserVerified
                              ? "bg-green-500"
                              : "bg-red-500 cursor-pointer"
                          }`}
                          title={
                            profileData.isUserVerified
                              ? "Verified"
                              : "Click to verify email"
                          }
                        />
                      </div>
                    )}
                    {changeEmailMode && (
                      <>
                        <input
                          type="text"
                          placeholder={profileData.email}
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="text-sm w-full border border-[#D4A373] bg-[#FDFBF7] px-3 py-1 rounded-lg focus:outline-[#8B4513]"
                        />
                        {error && (
                          <div className="mt-2 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 animate-in fade-in duration-300">
                            <ShieldAlert size={14} />
                            <span className="text-xs font-bold">{error}</span>
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          {/* Save Button */}
                          <button
                            onClick={handleEmailChange}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-[#D4A373] hover:bg-[#8B4513] rounded-md transition-colors"
                          >
                            <Check size={14} />
                            Save
                          </button>

                          {/* Cancel Button */}
                          <button
                            onClick={() => {
                              setChangeEmailMode(false);
                              setError(null);
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-[#8B4513] border border-[#D4A373] hover:bg-[#FDFBF7] rounded-md transition-colors"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </>
                    )}

                    {/* --- DYNAMIC OTP INPUT --- */}
                    {otpSent && !profileData.isUserVerified && (
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
                </div>

                <div className="w-full md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={
                          profileData.securityQuestion === "no question"
                            ? "bg-amber-100 p-3 rounded-full text-amber-600"
                            : "bg-green-100 p-3 rounded-full text-green-600"
                        }
                      >
                        {profileData.securityQuestion === "no question" ? (
                          <ShieldAlert size={24} />
                        ) : (
                          <ShieldCheck size={24} />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest">
                          Security Status
                        </p>
                        <p className="text-sm font-serif italic text-[#451A03]">
                          {profileData.securityQuestion === "no question"
                            ? "Setup security question."
                            : `Question: ${profileData.securityQuestion}`}
                        </p>
                      </div>
                    </div>

                    {profileData?._id === user?._id && (
                      <button
                        onClick={() => setIsSecurityModalOpen(true)}
                        className="text-xs font-bold text-[#8B4513] underline hover:text-[#D4A373]"
                      >
                        {profileData.securityQuestion === "no question"
                          ? "Setup Now"
                          : "Change Question"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {profileData?._id === user?._id && (
              <div className="flex flex-wrap gap-4 pt-6 border-t border-[#E5E1DA]">
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="flex items-center gap-2 bg-[#FDFBF7] text-[#8B4513] border border-[#D4A373] px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#F5F1E9] transition-all"
                >
                  <KeyRound size={16} /> Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-[#8B4513] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#6F3710] transition-all shadow-md"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSecurityModalOpen && (
        <Securityquestion
          setRecoveryAllowed={setIsSecurityModalOpen}
          setIsSecurityModalOpen={setIsSecurityModalOpen}
          occasion="changeSecurity"
          email={user?.username}
          setProfileData={setProfileData}
        />
      )}
      {isPassModalOpen && (
        <Changepassword
          occassion="regular"
          setIsPassModalOpen={setIsPassModalOpen}
          email={user?.username}
        />
      )}
    </div>
  );
}
