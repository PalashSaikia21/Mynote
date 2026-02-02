import React from "react";
import axios from "axios";

export default function Shownote({
  title,
  content,
  userId,
  noteId,
  onReject,
  setShowNote,
  setNoteToApprove,
}) {
  const user = JSON.parse(localStorage.getItem("user")) || "";
  const onApprove = async (e, label) => {
    e.preventDefault();
    if (user) {
      try {
        const payload = { label: label };
        const response = await axios.post(
          `http://localhost:3400/user/approveNote/${noteId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${user.token}`,
            },
          }
        );
        setNoteToApprove(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    // Fixed viewport overlay background
    <div className="fixed inset-10 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ">
      <article className="flex h-full max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header: Actions and Close */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 truncate max-w-xs">
              {title || "Document Preview"}
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              User: {userId}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Primary Actions */}
            <div className="flex border-r border-gray-200 pr-4 gap-2">
              <button
                onClick={(e) => onApprove(e, "reject")}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={(e) => onApprove(e, "public")}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 shadow-sm transition-colors"
              >
                Approve
              </button>
            </div>

            {/* Close/Cancel Action */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowNote(false);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="red"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* The Page Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-12">
          <div className="mx-auto w-full border border-gray-300 bg-white p-16 shadow-lg">
            <div
              className="prose prose-slate max-w-none prose-img:rounded-lg prose-headings:text-gray-900"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </main>
      </article>
    </div>
  );
}
