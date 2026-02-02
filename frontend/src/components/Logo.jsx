import React from "react";

export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 121.5 50"
      width="112.5"
      height="50"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="gradMain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>

      <rect
        x="5"
        y="5"
        rx="3.5"
        ry="3.5"
        width="27.5"
        height="27.5"
        fill="url(#gradMain)"
      />

      <rect
        x="11.25"
        y="10"
        rx="1.25"
        ry="1.25"
        width="15"
        height="20"
        fill="#ffffff"
      />
      <line
        x1="16.25"
        y1="10"
        x2="16.25"
        y2="30"
        stroke="#4F46E5"
        strokeWidth="0.5"
      />

      <polygon
        points="23.1,13.1 26.25,10 28.75,12.5 25.6,15.6"
        fill="#F59E0B"
      />
      <rect x="20" y="15" width="2" height="8.75" rx="0.75" fill="#F59E0B" />
      <polygon points="20,23.75 22,23.75 21,26.875" fill="#92400E" />

      <circle cx="23.75" cy="8.75" r="0.75" fill="#FACC15" />
      <line
        x1="23.75"
        y1="6.25"
        x2="23.75"
        y2="3.75"
        stroke="#FACC15"
        strokeWidth="0.5"
      />
      <line
        x1="21.25"
        y1="7.5"
        x2="18.75"
        y2="5.6"
        stroke="#FACC15"
        strokeWidth="0.5"
      />
      <line
        x1="26.25"
        y1="7.5"
        x2="28.75"
        y2="5.6"
        stroke="#FACC15"
        strokeWidth="0.5"
      />

      <text
        x="37.5"
        y="15.75"
        fontSize="11.5"
        fontFamily="Poppins, Arial, Helvetica, sans-serif"
        fontWeight="700"
      >
        <tspan fill="#1F2933">my</tspan>
        <tspan fill="#14B8A6">Note</tspan>
      </text>

      <text
        x="37.8"
        y="25"
        fontSize="5.25"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#6B7280"
      >
        Smart Notes for
      </text>
      <text
        x="37.8"
        y="30"
        fontSize="5.25"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#6B7280"
      >
        Smarter Learning
      </text>
    </svg>
  );
}
