import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation.jsx";
import Skeletonloader from "../components/SkeletonLoader.jsx";
import { MessageSquare, UserPlus, BookOpen } from "lucide-react";

import config from "../config";
export default function Othersprofile() {
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || "";

  const fetchProfile = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch(
        `${config.apiUrl}/user/othersProfile/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error("Profile retrieval failed.");
      setUserDetail(data.user);
      setIsFollowing(data.isFollowing);
      setFollowed(data.followed || []);
      setFollowing(data.following || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const followUser = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/user/followUser/${user._id}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
    fetchProfile();
  };
  const unfollowUser = async () => {
    alert("You have unfollowed this scholar!");
    try {
      const response = await fetch(
        `${config.apiUrl}/user/unfollowUser/${user._id}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
    fetchProfile();
  };
  if (loading) return <Skeletonloader />;
  if (!userDetail)
    return (
      <div className="p-10 text-center text-[#92400E]">Scholar not found.</div>
    );

  return (
    <div className="min-h-screen bg-[#F1EDE4]">
      <Navigation name={user.name} id={user._id} />

      <div className="max-w-2xl mx-auto mt-12 p-8 bg-[#FCF9F1] rounded-2xl shadow-xl border border-[#E8E2D2] relative overflow-hidden">
        {/* Aesthetic Corner Stamp */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D97706]/5 rounded-bl-full flex items-center justify-center p-4">
          <BookOpen className="text-[#D97706]/20" size={40} />
        </div>

        <div className="flex items-center space-x-6 relative z-10">
          <div className="h-20 w-20 bg-[#451A03] rounded-2xl rotate-3 flex items-center justify-center text-[#FDE68A] text-3xl font-black shadow-lg border-2 border-[#D97706]/30">
            <span className="-rotate-3">
              {userDetail.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-[#451A03] tracking-tight">
              {userDetail.name}
            </h2>
            <p className="text-sm font-bold text-[#D97706] uppercase tracking-widest">
              @{userDetail.username}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E8E2D2] flex flex-wrap gap-3">
          {/* Metrics as "Stamps" */}
          <div className="px-4 py-2 bg-[#F7F2E7] border border-[#E8E2D2] rounded-lg text-center">
            <p className="text-[10px] uppercase font-bold text-[#92400E]/60">
              Followers
            </p>
            <p className="text-lg font-black text-[#451A03]">
              {followed.length || 0}
            </p>
          </div>

          <div className="px-4 py-2 bg-[#F7F2E7] border border-[#E8E2D2] rounded-lg text-center">
            <p className="text-[10px] uppercase font-bold text-[#92400E]/60">
              Following
            </p>
            <p className="text-lg font-black text-[#451A03]">
              {following.length || 0}
            </p>
          </div>

          <div className="px-4 py-2 bg-[#F7F2E7] border border-[#E8E2D2] rounded-lg text-center">
            <p className="text-[10px] uppercase font-bold text-[#92400E]/60">
              Notes
            </p>
            <p className="text-lg font-black text-[#451A03]">
              {userDetail.metrics?.noteCount || 0}
            </p>
          </div>

          {/* Action Row */}
          {userDetail._id !== user._id && (
            <div className="flex gap-3 w-full mt-4">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#B45309] text-white rounded-xl text-sm font-bold hover:bg-[#92400E] transition-all shadow-md active:scale-95"
                onClick={isFollowing ? unfollowUser : followUser}
              >
                <UserPlus size={16} />
                {isFollowing ? "Unfollow" : "Follow"}
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#451A03] text-[#451A03] rounded-xl text-sm font-bold hover:bg-[#451A03] hover:text-white transition-all active:scale-95"
                onClick={() => navigate(`/message/${userDetail._id}`)}
              >
                <MessageSquare size={16} /> Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
