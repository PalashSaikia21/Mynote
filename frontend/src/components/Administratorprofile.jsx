import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Controlusertype from "./ControlUserType";
import Notetoapprove from "./NoteToApprove";
import { Users, FileText, Clock, ShieldCheck } from "lucide-react";
import Userlist from "./UserList";
import Activeuser from "./ActiveUsers";
import config from "../config";

export default function Administratorprofile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [isUserReceived, setIsUserReceived] = useState(false);
  const [noteToApprove, setNoteToApprove] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [userListType, setUserListType] = useState("");
  const [searchError, setSearchError] = useState("");

  // --- NEW STATS STATE ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPublicNotes: 0,
    pendingNotes: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUserLabel = async (newUserType, userToUpdate) => {
    try {
      if (!user || !user._id) {
        console.error("No authentication found");
        return;
      }

      const payload = { userType: newUserType };

      const response = await axios.post(
        `${config.apiUrl}/user/handleUser/${userToUpdate}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Hierarchy Updated:", newUserType);
        // Important: You should probably trigger a refresh of the user list here
        setIsUserReceived(false);
      }
    } catch (error) {
      console.error("Authority error:", error);
      alert("Failed to update user status. Check permissions.");
    }
  };

  // --- FETCH STATS ON MOUNT ---
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/user/admin/stats`, {
          headers: { authorization: `Bearer ${user.token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    if (user?.token) fetchAdminStats();
  }, [user?.token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    try {
      if (!user?._id) return;
      const payload = { username: searchQuery };
      const response = await axios.post(
        `${config.apiUrl}/user/searchUser/${user._id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      setIsModalOpen(false);
      setSearchUser(response.data.user);
      setIsUserReceived(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setSearchError("User not found.");
        return;
      }
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6">
      {/* 1. TOP ACTION BAR */}
      {/* 1. TOP ACTION BAR */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-[#E5E1DA] shadow-sm">
        <div className="flex items-center gap-2 text-[#8B4513]">
          <ShieldCheck size={24} />
          <h1 className="font-serif font-bold text-xl">Admin Console</h1>
        </div>

        {/* Buttons container: full width on mobile */}
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none bg-[#8B4513] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#6F3710] transition-all shadow-md"
          >
            Promote User
          </button>
          <button
            onClick={() => setNoteToApprove(true)}
            className="flex-1 sm:flex-none bg-[#D4A373] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#bc8a5f] transition-all shadow-md"
          >
            Verify Notes
          </button>
        </div>
      </div>

      {/* 2. STATS GRID (NEW SECTION) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* NEW USERS (Needs Attention) */}
        <div
          onClick={() => {
            setUserListType("user");
            setShowUserList(true);
          }}
          className="bg-white p-5 rounded-2xl border border-[#E5E1DA] shadow-sm"
        >
          <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest mb-1">
            New Signups
          </p>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-[#2C2C2C]">
              {stats.newUsers}
            </h3>
            <span className="text-xs text-amber-600 font-medium">
              Needs Review
            </span>
          </div>
        </div>
        {showUserList &&
          (userListType != "active" ? (
            <Userlist
              listType={userListType}
              onClose={setShowUserList}
              handleUserLabel={handleUserLabel}
            />
          ) : (
            <Activeuser
              onClose={setShowUserList}
              handleUserLabel={handleUserLabel}
              userList={stats.dailyActiveUsers}
            />
          ))}
        {/* TRUSTED USERS (The Core) */}
        <div
          onClick={() => {
            setUserListType("trusted");
            setShowUserList(true);
          }}
          className="bg-white p-5 rounded-2xl border border-[#E5E1DA] shadow-sm"
        >
          <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest mb-1">
            Trusted Members
          </p>
          <h3 className="text-2xl font-bold text-[#8B4513]">
            {stats.trustedUsers}
          </h3>
        </div>

        {/* Admin */}
        <div
          onClick={() => {
            setUserListType("admin");
            setShowUserList(true);
          }}
          className="bg-white p-5 rounded-2xl border border-[#E5E1DA] shadow-sm"
        >
          <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest mb-1">
            Admins
          </p>
          <h3 className="text-2xl font-bold text-[#8B4513]">{stats.admin}</h3>
        </div>

        {/* ACTIVE USERS */}
        <div
          onClick={() => {
            setUserListType("active");
            setShowUserList(true);
          }}
          className="bg-white p-5 rounded-2xl border border-[#E5E1DA] shadow-sm"
        >
          <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest mb-1">
            Active Members
          </p>
          <h3 className="text-2xl font-bold text-[#8B4513]">
            {stats.dailyActiveUsers?.length}
          </h3>
        </div>

        {/* PUBLIC ARCHIVE */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E1DA] shadow-sm">
          <p className="text-[10px] font-bold text-[#A09B93] uppercase tracking-widest mb-1">
            Live Archive
          </p>
          <h3 className="text-2xl font-bold text-[#2C2C2C]">
            {stats.totalPublicNotes}
          </h3>
        </div>

        {/* PENDING APPROVAL (Action Item) */}
        <div
          onClick={() => setNoteToApprove(true)}
          className="bg-white p-5 rounded-2xl border border-[#8B4513]/20 shadow-sm ring-1 ring-[#8B4513]/10"
        >
          <p className="text-[10px] font-bold text-[#8B4513] uppercase tracking-widest mb-1">
            Pending Review
          </p>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#8B4513]" />
            <h3 className="text-2xl font-bold text-[#8B4513]">
              {stats.pendingNotes}
            </h3>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-[#E5E1DA]">
            <h2 className="text-xl font-bold mb-4 text-[#2C2C2C]">
              Search User to Promote
            </h2>
            <form onSubmit={handleSearch}>
              <div className="mb-6">
                {searchError && (
                  <p className="text-red-500 text-xs mb-2">{searchError}</p>
                )}
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter username..."
                  className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E5E1DA] rounded-xl outline-none focus:ring-2 focus:ring-[#D4A373]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8B4513] text-white rounded-lg text-sm font-bold"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUserReceived && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-[#E5E1DA]">
            <h2 className="text-xl font-bold mb-4">
              User Profile: {searchUser.name}
            </h2>
            <Controlusertype
              handleUserLabel={handleUserLabel}
              user={searchUser}
              setIsUserReceived={setIsUserReceived}
            />
          </div>
        </div>
      )}

      {noteToApprove && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Notetoapprove setNoteToApprove={setNoteToApprove} />
          </div>
        </div>
      )}
    </div>
  );
}
