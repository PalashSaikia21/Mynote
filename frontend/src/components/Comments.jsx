import React, { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  ThumbsUp,
  CornerDownRight,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Closebutton from "./CloseButton";
import { Link } from "react-router-dom";

export default function Comments({ noteId }) {
  const [comment, setComment] = useState("");
  const [oldComments, setOldComments] = useState([]);
  const [viewComment, setViewComment] = useState(false);
  const [parentComment, setParentComment] = useState(null);
  const [subComment, setSubComment] = useState("");
  const [likeStatus, setLikeStatus] = useState(false);

  // NEW: State to track which parent comments have their replies visible
  const [expandedComments, setExpandedComments] = useState({});

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const LoadComments = useCallback(async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    const user = JSON.parse(userData);

    try {
      const response = await fetch(
        `http://localhost:3400/notes/getComment/${noteId}`,
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      if (!response.ok) {
        setOldComments([]);
      }
      const data = await response.json();

      setOldComments(data.comments || []);
    } catch (error) {
      setOldComments([]);
      console.error(error.message);
    }
  }, [noteId]);

  useEffect(() => {
    LoadComments();
  }, [LoadComments]);

  const PostComments = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!comment.trim() && !subComment.trim()) return;

    try {
      const payload = {
        comment: viewComment ? subComment : comment,
        userId: user._id,
        parentComment: viewComment ? parentComment : null,
      };

      const response = await fetch(
        `http://localhost:3400/notes/postComment/${noteId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok)
        throw new Error(`Server responded with ${response.status}`);

      setComment("");
      setSubComment("");
      // Automatically expand the thread if we just replied to it
      if (viewComment && parentComment) {
        setExpandedComments((prev) => ({ ...prev, [parentComment]: true }));
      }
      LoadComments();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLike = async (id, typeOn) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await fetch(
        `http://localhost:3400/notes/getLikes/${likeStatus}/${id}/${typeOn}`,
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setLikeStatus(!likeStatus);
      LoadComments();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="mt-2 pt-8 z-50 border-t border-[#E5E1DA] bg-[#FDFBF7]">
      <h3 className="text-lg font-serif font-bold text-[#5C2E0E] mb-2 flex items-center gap-2">
        <MessageCircle size={20} /> Discussion
      </h3>

      {/* Main Input */}
      <div className="mb-2 flex gap-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add to the discussion..."
          className="flex-1 px-4 py-3 bg-white border border-[#E5E1DA] rounded-xl text-sm focus:ring-1 focus:ring-[#D4A373] outline-none transition-all"
        />
        <button
          onClick={PostComments}
          className="self-end px-6 py-2 bg-[#8B4513] text-white rounded-lg font-bold text-sm hover:bg-[#6F3710] transition-all flex items-center gap-2"
        >
          <Send size={14} /> Post
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {oldComments
          .filter((c) => !c.parentComment)
          .map((c) => {
            const replies = oldComments.filter(
              (sub) => sub.parentComment === c._id
            );
            const isExpanded = expandedComments[c._id];

            return (
              <div
                key={c._id}
                className="group border-b border-[#F5F2ED] pb-4 last:border-0"
              >
                {/* Parent Comment */}
                <div className="flex flex-col gap-.5 p-3 rounded-lg group-hover:bg-[#F5F2ED]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/othersProfile/${c.userId?._id}`}
                      className="font-bold text-xs text-[#8B4513] hover:underline"
                    >
                      @{c.userId?.username || "Scholar"}
                    </Link>
                  </div>
                  <p className="text-[#2C2C2C] text-sm leading-relaxed">
                    {c.comment}
                  </p>

                  <div className="flex gap-4 mt-1">
                    <button
                      onClick={() => handleLike(c._id, "Comments")}
                      className="flex items-center gap-.5 text-[11px] font-bold text-[#A09B93] hover:text-[#8B4513]"
                    >
                      <ThumbsUp size={12} /> {c.likeCount || 0}
                    </button>
                    <button
                      onClick={() => {
                        setParentComment(c._id);
                        setViewComment(true);
                      }}
                      className="flex items-center gap-.5 text-[11px] font-bold text-[#A09B93] hover:text-[#8B4513]"
                    >
                      <MessageCircle size={12} /> Reply
                    </button>

                    {/* NEW: Toggle button for replies */}
                    {replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(c._id)}
                        className="flex items-center gap-.5 text-[11px] font-bold text-[#D4A373] hover:text-[#8B4513]"
                      >
                        {isExpanded ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                        {isExpanded
                          ? "Hide Replies"
                          : `Show Replies (${replies.length})`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Threaded Replies - HIDDEN BY DEFAULT */}
                {isExpanded && (
                  <div className="ml-8 mt-.5 space-y-.5 border-l-2 border-[#F5F2ED] pl-4 animate-in fade-in slide-in-from-top-1">
                    {replies.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex flex-col gap-.5 items-start py-2"
                      >
                        <CornerDownRight
                          size={14}
                          className="text-[#D4A373] shrink-0"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/othersProfile/${sub.userId?._id}`}
                            className="font-bold text-[10px] text-[#A09B93] block mb-1"
                          >
                            @{sub.userId?.username || "Anonymous"}
                          </Link>
                          <p className="text-sm text-[#5F5D59]">
                            {sub.comment}
                          </p>
                        </div>
                        <button
                          onClick={() => handleLike(sub._id, "Comments")}
                          className="flex items-center gap-.5 text-[10px] font-bold text-[#A09B93] hover:text-[#8B4513] transition-colors"
                        >
                          <ThumbsUp size={10} />
                          <span>{sub.likeCount || 0}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Box */}
                {viewComment && parentComment === c._id && (
                  <div className="ml-8 mt-4 flex flex-col gap-.5 bg-[#F5F2ED] p-3 rounded-lg">
                    <textarea
                      value={subComment}
                      onChange={(e) => setSubComment(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-2 bg-white border border-[#E5E1DA] rounded-md text-xs focus:ring-1 focus:ring-[#D4A373] outline-none"
                    />
                    <div className="flex justify-between items-center">
                      <Closebutton
                        onClose={() => {
                          setViewComment(false);
                          setSubComment("");
                        }}
                      />
                      <button
                        onClick={PostComments}
                        className="px-4 py-1.5 bg-[#D4A373] text-white rounded-md text-[11px] font-bold"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
