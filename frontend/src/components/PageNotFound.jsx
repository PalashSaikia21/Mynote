import React from "react";

export default function Pagenotfound() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen p-6 font-serif">
        <div className="max-w-md text-center">
          <h1 className="text-9xl font-black opacity-20 mb-4">404</h1>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              The trail has gone cold.
            </h2>

            <p className="text-lg leading-relaxed text-amber-900/80">
              It seems the page you are looking for has been archived, moved, or
              never existed in this particular reality.
            </p>

            <div className="pt-4">
              <a
                href="/"
                className="inline-block px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-300 border-2 border-amber-900 hover:bg-amber-900 hover:text-white"
              >
                Return to Library
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
