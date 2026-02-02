import React from "react";

export default function Skeletonloader() {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-[#FCF9F1] rounded-xl shadow-sm border border-[#E8E2D2] animate-pulse">
      <div className="flex items-center space-x-4">
        {/* Circle Avatar Skeleton - Deep Amber base */}
        <div className="h-16 w-16 bg-[#E8E2D2] rounded-full"></div>

        <div className="flex-1 space-y-3">
          {/* Name line - Warm Ochre */}
          <div className="h-6 bg-[#E8E2D2] rounded w-1/3 opacity-80"></div>
          {/* Username line - Lighter Parchment */}
          <div className="h-4 bg-[#E8E2D2] rounded w-1/4 opacity-50"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="mt-6 pt-6 border-t border-[#E8E2D2] flex gap-4">
        <div className="h-10 w-24 bg-[#FEF3C7] rounded-lg"></div>
        <div className="h-10 w-24 bg-[#FEF3C7] rounded-lg"></div>
      </div>
    </div>
  );
}
