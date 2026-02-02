import React, { useEffect, useState, useRef, useCallback } from "react";
import Logo from "./Logo";
import {
  Bell,
  Search,
  Menu,
  X,
  Home,
  BookOpen,
  Globe,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navigation({
  name,
  id,
  page = "other",
  setActiveView,
}) {
  // --- SEARCH STATES (Replicated from Leftcentersection) ---
  const [searchString, setSearchString] = useState("");
  const [publicNotes, setPublicNotes] = useState([]); // Cache for the archive
  const [requiredString, setRequiredString] = useState([]); // Filtered results
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // --- NOTIFICATION & UI STATES ---
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notification, setNotification] = useState([]);
  const [isReadCount, setIsReadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // --- REFS & USER ---
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!name && !!user;

  // --- 1. SEARCH LOGIC (Intellect Base Replication) ---
  const fetchPublicNotes = async () => {
    if (publicNotes.length > 0) return;
    setIsLoadingSearch(true);
    try {
      const response = await fetch(`http://localhost:3400/notes/SearchNote`);
      if (!response.ok) throw new Error("Failed to fetch notes.");
      const data = await response.json();
      setPublicNotes(data.notes || []);
    } catch (error) {
      console.error("Archive fetch error:", error);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchString(inputValue);

    if (!inputValue.trim()) {
      setRequiredString([]);
      setShowSearchResults(false);
      return;
    }

    setShowSearchResults(true);
    // Filtering logic exactly like your Leftcentersection
    const filtered = publicNotes.filter((note) =>
      note.title?.toLowerCase().includes(inputValue.toLowerCase())
    );
    setRequiredString(filtered);
  };

  // --- 2. NOTIFICATION LOGIC ---
  const checkNotifications = useCallback(async () => {
    if (!user?._id || !user?.token) return;
    try {
      const response = await fetch(
        `http://localhost:3400/user/notifications/${user._id}`,
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      const data = await response.json();
      if (data?.notifications) {
        setNotification(data.notifications);
        setIsReadCount(data.notifications.filter((n) => !n.isRead).length);
      }
    } catch (e) {
      console.error("Notification Error:", e);
    }
  }, [user?._id, user?.token]);

  useEffect(() => {
    if (page === "home" && isLoggedIn) {
      checkNotifications();
      const interval = setInterval(checkNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [page, isLoggedIn, checkNotifications]);

  const closeNotificationModal = async (notiId) => {
    if (!notiId) return;
    setSelectedNotification(null);
    try {
      await fetch(`http://localhost:3400/user/readNotifications/${notiId}`, {
        method: "PUT",
        headers: { authorization: `Bearer ${user.token}` },
      });
      checkNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  // --- 3. CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-[#FDFBF7] border-b border-[#E5E1DA] px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          {/* LOGO */}
          <Link
            to="/"
            className="shrink-0 font-serif font-bold text-lg text-[#2C2C2C] flex items-center gap-2"
          >
            <Logo />
          </Link>

          {/* REPLICATED SEARCH SECTION */}
          {page == "home" && (
            <div
              className="flex-1 max-w-md hidden sm:block relative"
              ref={searchRef}
            >
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D97706]"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search the archive..."
                  className="w-full bg-[#FFFBEB] border border-[#E8E2D2] rounded-lg pl-10 pr-4 py-1.5 text-sm text-[#451A03] outline-none focus:ring-1 focus:ring-[#D97706]"
                  value={searchString}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    fetchPublicNotes();
                    if (searchString.trim()) setShowSearchResults(true);
                  }}
                />
              </div>

              {/* SEARCH RESULTS POPUP */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#FDFBF7] border border-[#D4A373] rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2 bg-[#F7F2E7] border-b border-[#E8E2D2] text-[10px] font-bold text-[#92400E] uppercase tracking-widest flex items-center gap-2">
                    <Globe size={10} /> Intellect Base Results
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {isLoadingSearch ? (
                      <div className="p-4 text-center text-xs text-[#B45309] animate-pulse font-medium">
                        Consulting records...
                      </div>
                    ) : requiredString.length > 0 ? (
                      requiredString.slice(0, 10).map((note) => (
                        <button
                          key={note._id}
                          onClick={() => {
                            setActiveView(note._id);
                            setShowSearchResults(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#FEF3C7] border-b border-[#E8E2D2] last:border-0 transition-colors"
                        >
                          <BookOpen size={14} className="text-[#D4A373]" />
                          <span className="text-sm text-[#78350F] font-medium truncate">
                            {note.title}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-[#92400E]/50 italic">
                        No records match your inquiry.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DESKTOP NAV ACTIONS */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-bold text-[#5F5D59] hover:text-[#8B4513] transition-colors"
            >
              Home
            </Link>

            {/* NOTIFICATIONS */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-[#5F5D59] hover:text-[#8B4513] flex items-center relative p-1"
              >
                <Bell size={20} />
                {isReadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8B4513] text-white text-[10px] px-1.5 rounded-full font-bold">
                    {isReadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[#FDFBF7] border border-[#E5E1DA] rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 bg-[#F5F2ED] border-b flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#8B4513] uppercase tracking-widest">
                      Notifications
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-[#E5E1DA] rounded-full text-[#8B4513]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notification.length > 0 ? (
                      notification.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => {
                            setSelectedNotification(n);
                            //closeNotificationModal(n._id);
                            setShowNotifications(false);
                          }}
                          className={`p-4 border-b border-[#E5E1DA] text-sm cursor-pointer hover:bg-[#F5F2ED] text-[#5F5D59] ${
                            n.isRead ? "" : "bg-[#FFFBEB]"
                          }`}
                        >
                          {n.content}
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-400 italic text-sm">
                        All caught up!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to={isLoggedIn ? `/profile/${id}` : "/login"}
              className="bg-[#8B4513] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#6F3710] transition-colors"
            >
              {isLoggedIn ? `Hi, ${name?.split(" ")[0] || "User"}` : "Login"}
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-[#8B4513]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 px-2 pb-8 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 p-4 bg-[#F5F2ED] rounded-xl text-[#5F5D59] font-bold"
            >
              <Home size={20} className="text-[#8B4513]" /> Home
            </Link>
            <button
              onClick={() => {
                setView("createNote");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-4 bg-[#F5F2ED] rounded-xl text-[#5F5D59] font-bold"
            >
              <Plus size={20} className="text-[#8B4513]" /> New Note
            </button>
            <Link
              to={isLoggedIn ? `/profile/${id}` : "/login"}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-4 bg-[#8B4513] text-white rounded-xl font-bold shadow-lg"
            >
              {isLoggedIn ? "View My Profile" : "Login"}
            </Link>
          </div>
        </div>
      </nav>

      {/* NOTIFICATION DETAIL MODAL */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E1C19]/70 backdrop-blur-sm p-4">
          <div className="bg-[#FDFBF7] rounded-2xl w-full max-w-md border border-[#D4A373] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-[#F5F2ED] border-b border-[#E5E1DA] font-bold text-[#8B4513] flex justify-between items-center">
              <span>Notification Detail</span>
              <button
                onClick={() => closeNotificationModal(selectedNotification._id)}
                className="p-1 hover:bg-[#E5E1DA] rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 text-[#2C2C2C] italic leading-relaxed">
              "{selectedNotification.content}"
            </div>
            <div className="p-4 bg-[#F5F2ED] flex justify-end gap-3">
              {selectedNotification.targetModel === "Notes" && (
                <button
                  onClick={() => {
                    setActiveView(selectedNotification.targetId);
                    setSelectedNotification(null);
                  }}
                  className="px-6 py-2 bg-[#8B4513] text-white rounded-lg text-sm font-bold hover:bg-[#6F3710]"
                >
                  Go to Note
                </button>
              )}
              <button
                onClick={() => closeNotificationModal(selectedNotification._id)}
                className="px-6 py-2 border border-[#E5E1DA] rounded-lg text-sm text-[#5F5D59] font-bold hover:bg-[#E5E1DA]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
