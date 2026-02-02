import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

export default function Changepassword({
  occassion,
  setIsPassModalOpen,
  email,
}) {
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passData, setPassData] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const [passError, setPassError] = useState("");

  const handlePassChange = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (passData.newPass !== passData.confirmPass) {
      setPassError("New passwords do not match.");
      return;
    }
    if (passData.newPass.length < 8) {
      setPassError("Password must be at least 8 characters.");
      return;
    }

    try {
      //alert("This is a demo. Password change functionality is disabled.");
      const response = await axios.post(
        `http://localhost:3400/changePassword`,
        {
          occassion: occassion,
          email: email, //this can be username or email
          currentPassword: passData.oldPass,
          newPassword: passData.newPass,
          newPasswordConfirm: passData.newPass,
        },
        { headers: { authorization: `Bearer ` } }
      );

      if (response.status === 200) {
        toast.success("Password Updated!", {
          style: {
            border: "1px solid #D4A373",
            padding: "16px",
            color: "#8B4513",
            backgroundColor: "#FDFBF7",
            fontWeight: "bold",
          },
          iconTheme: {
            primary: "#8B4513",
            secondary: "#FDFBF7",
          },
        });
        setIsPassModalOpen(false);
      }
    } catch (error) {
      console.log("Password change error:", error);
      setPassError(
        error.response?.data?.message ||
          error.response?.data ||
          "An error occurred while changing the password."
      );
    }
  };
  const toggleVisibility = (field) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="fixed inset-0 z-[100] flex justify-center items-center bg-[#451A03]/60 backdrop-blur-sm p-4">
        <div className="bg-[#FCF9F1] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#E8E2D2]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-black text-[#451A03]">
              Update Security
            </h2>
            <button
              onClick={() => setIsPassModalOpen(false)}
              className="text-[#92400E]/50 hover:text-[#451A03] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handlePassChange} className="space-y-6">
            {passError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs italic rounded">
                {passError}
              </div>
            )}

            <div className="space-y-4">
              {occassion === "regular" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#78350F] uppercase tracking-widest ml-1">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPass.old ? "text" : "password"}
                      value={passData.oldPass}
                      onChange={(e) =>
                        setPassData({ ...passData, oldPass: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none transition-all pr-12 text-[#451A03]"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility("old")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92400E]/40 hover:text-[#B45309]"
                    >
                      {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#78350F] uppercase tracking-widest ml-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPass.new ? "text" : "password"}
                    value={passData.newPass}
                    onChange={(e) =>
                      setPassData({ ...passData, newPass: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none transition-all pr-12 text-[#451A03]"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92400E]/40 hover:text-[#B45309]"
                  >
                    {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#78350F] uppercase tracking-widest ml-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPass.confirm ? "text" : "password"}
                    value={passData.confirmPass}
                    onChange={(e) =>
                      setPassData({ ...passData, confirmPass: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#FFFBEB] border border-[#E8E2D2] rounded-xl focus:ring-2 focus:ring-[#D97706] outline-none transition-all pr-12 text-[#451A03]"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92400E]/40 hover:text-[#B45309]"
                  >
                    {showPass.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPassModalOpen(false)}
                className="flex-1 px-4 py-3 border border-[#E8E2D2] text-[#78350F] font-bold rounded-xl hover:bg-[#E8E2D2]/30 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#B45309] text-white font-bold rounded-xl hover:bg-[#92400E] shadow-lg shadow-amber-900/20 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
