import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Navigation({ name, id, page = "other" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const testNoti = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const isLoggedIn = !!name;
  const notificationRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setLoading(true);
    setIsModalOpen(true);

    try {
      // Using your specific backend structure
      const response = await axios.post(
        `http://localhost:3400/user/searchUser/${id}`,
        { username: searchQuery },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );

      // We ensure the result is an array so .map() doesn't crash
      const data = response.data.user;
      console.log("Search results:", data);
      setSearchResults(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const checkNotifications = async () => {
    if (user) {
      try {
        const response = await fetch(
          `http://localhost:3400/user/notifications/${user._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch notes.");
        const data = await response.json();
        setNotification(data.notifications);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the menu is open AND the click is NOT inside the notificationRef
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]); // Re-run whenever showNotifications changes
  useEffect(() => {
    // 1. Call immediately on mount
    checkNotifications();

    // 2. Set up the interval
    const interval = setInterval(() => {
      console.log("Polling for notifications...");
      checkNotifications();
    }, 3000); // 30,000ms = 30 seconds

    // 3. CLEANUP (Crucial)
    // This stops the timer when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          {/* Logo Section */}
          <div>
            <Link to="/" className="flex items-center">
              <svg
                width="140"
                height="25"
                viewBox="0 0 200 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16V4C5 3.1 5.9 2 7 2H15C16.1 2 17 3.1 17 4V16L11 12L5 16Z"
                  fill="#3730A3"
                />
                <path
                  d="M11 12L17 16V8C17 6.9 16.1 6 15 6H11V12Z"
                  fill="#10B981"
                />
                <circle cx="15" cy="4" r="1.5" fill="white" />
                <text
                  x="25"
                  y="16"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontSize="16"
                  fill="#1E293B"
                >
                  My<tspan fill="#10B981">Note</tspan>
                </text>
              </svg>
            </Link>
          </div>
          {/* Search Bar - Press Enter to trigger */}
          {page == "home" && (
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-md hidden sm:block"
            >
              <input
                type="text"
                placeholder="Search user..."
                className="w-full bg-gray-100 border-none rounded-full px-4 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}
          {/* Desktop Links */}
          <ul className="hidden md:flex items-center space-x-6">
            <li>
              <Link
                to="/"
                className="text-sm font-semibold text-gray-600 hover:text-blue-600"
              >
                Home
              </Link>
            </li>
            <li>
              <div
                ref={notificationRef}
                className="text-sm font-semibold flex text-gray-600 hover:text-blue-600"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={24} className="text-gray-600" />
                Notification
                {notification.length > 0 ? ` (${notification.length})` : " "}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex flex-col">
                    <div>
                      {notification.map((noti, ind) => {
                        return (
                          <>
                            <div
                              key={ind}
                              className={`text-black border-b-2 border-gray-400 ${
                                ind % 2 == 0 ? "bg-gray-100" : ""
                              } hover:bg-blue-50 px-2 rounded-lg transition-colors`}
                            >
                              <Link to="/navigation">
                                <p className="text-sm leading-snug text-gray-800 line-clamp-2">
                                  {noti.content}
                                </p>
                              </Link>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link
                to={isLoggedIn ? `/profile/${id}` : "/login"}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isLoggedIn
                    ? "bg-gray-100 text-gray-800 border"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isLoggedIn ? `Hi, ${name.split(" ")[0]}` : "Login"}
              </Link>
            </li>
          </ul>

          {/* Mobile Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b ${
            isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            {page === "home" && (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search user..."
                  className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            )}

            <Link
              to="/"
              className="block text-gray-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <div
              ref={notificationRef}
              className="text-sm font-semibold flex text-gray-600 hover:text-blue-600"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} className="text-gray-600" />
              Notification
              {notification.length > 0 ? ` (${notification.length})` : " "}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex flex-col">
                  <div>
                    {notification.map((noti, ind) => {
                      return (
                        <>
                          <div
                            key={ind}
                            className={`text-black border-b-2 border-gray-400 ${
                              ind % 2 == 0 ? "bg-gray-100" : ""
                            } hover:bg-blue-50 px-2 rounded-lg transition-colors`}
                          >
                            <Link to="/navigation">
                              {" "}
                              <p className="text-sm leading-snug text-gray-800 line-clamp-2">
                                {noti.content}
                              </p>
                            </Link>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to={isLoggedIn ? `/profile/${id}` : "/login"}
              className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg font-bold"
              onClick={() => setIsOpen(false)}
            >
              {isLoggedIn ? `Hi, ${name.split(" ")[0]}` : "Login"}
            </Link>
          </div>
        </div>
      </nav>

      {/* SEARCH POPUP (MODAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-1">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Search Results</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading ? (
                <p className="text-center py-4">
                  Searching for "{searchQuery}"...
                </p>
              ) : searchResults.length > 0 ? (
                searchResults.map((foundUser) => (
                  <div
                    key={foundUser._id}
                    className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl transition-colors mb-2 border border-transparent hover:border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {foundUser.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {foundUser.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {foundUser._id.slice(-6)}...
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/profile/${foundUser._id}`}
                      onClick={() => setIsModalOpen(false)}
                      className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No users found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
