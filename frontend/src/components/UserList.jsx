import React, { useState, useEffect } from "react";
import Closebutton from "./CloseButton";

import config from "../config";

export default function Userlist({ onClose, listType, handleUserLabel }) {
  const [users, setUsers] = useState([]);
  const [userLabel, setUserLabel] = useState(listType);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchUserList = async () => {
    try {
      if (!user?._id) return;
      const response = await fetch(
        `${config.apiUrl}/user/getUserList/${listType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [listType]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-stone-900/60 backdrop-blur-md">
      {/* Container with Amber Accents */}
      <div className="bg-[#FFFBEB] rounded-2xl shadow-2xl w-[50rem] border-2 border-[#F59E0B]/30 overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#FEF3C7] px-2 py-2 flex justify-between items-center border-b border-[#FDE68A]">
          <h2 className="text-[#92400E] font-bold text-lg capitalize tracking-tight">
            {listType} Directory
          </h2>
          <Closebutton onClose={onClose} />
        </div>
        {/* Table Content */}
        <div className="p-4">
          <div className="max-h-80 overflow-y-auto rounded-lg border border-[#FEF3C7]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FDE68A] sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-[#92400E] text-xs uppercase font-bold">
                    User
                  </th>
                  <th className="px-4 py-2 text-[#92400E] text-xs uppercase font-bold">
                    Verification
                  </th>
                  <th className="px-4 py-2 text-[#92400E] text-xs uppercase font-bold text-right">
                    Trust Index
                  </th>
                  <th className="px-4 py-2 text-[#92400E] text-xs uppercase font-bold text-right">
                    Public Notes
                  </th>
                  <th className="px-4 py-2 text-[#92400E] text-xs uppercase font-bold">
                    User Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-[#FEF9E7] transition-colors border-b border-[#FEF3C7] last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#78350F]">
                          {user.name}
                        </div>

                        <div className="text-xs text-[#B45309]">
                          @{user.username}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-[#F59E0B] text-white px-2 py-1 rounded-full text-xs font-mono">
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-[#F59E0B] text-white px-2 py-1 rounded-full text-xs font-mono">
                          {user.trustIndex}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-[#F59E0B] text-white px-2 py-1 rounded-full text-xs font-mono">
                          {user.metrics.noteCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          onClick={() => {
                            setUserLabel("user");
                            handleUserLabel("user", user._id);
                          }}
                          className={`${
                            userLabel == "user"
                              ? "bg-[#AA9E2B]"
                              : "bg-[#F59E0B]"
                          } text-white px-2 py-1 rounded-full text-xs font-mono`}
                        >
                          User
                        </span>
                        <span
                          onClick={() => {
                            setUserLabel("trusted");
                            handleUserLabel("trusted", user._id);
                          }}
                          className={`${
                            userLabel == "trusted"
                              ? "bg-[#AA9E2B]"
                              : "bg-[#F59E0B]"
                          } text-white px-2 py-1 rounded-full text-xs font-mono`}
                        >
                          Trusted
                        </span>
                        <span
                          onClick={() => {
                            setUserLabel("admin");
                            handleUserLabel("admin", user._id);
                          }}
                          className={`${
                            userLabel == "admin"
                              ? "bg-[#AA9E2B]"
                              : "bg-[#F59E0B]"
                          } text-white px-2 py-1 rounded-full text-xs font-mono`}
                        >
                          Admin
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-[#B45309] text-center py-8 italic"
                    >
                      No users found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
