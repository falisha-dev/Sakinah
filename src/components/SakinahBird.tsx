import React from 'react';

interface SakinahBirdProps {
  className?: string;
  size?: number;
}

export const SakinahBird: React.FC<SakinahBirdProps> = ({
  className = '',
  size = 110,
}) => {
  return (
    <div
      className={`inline-block select-none relative ${className}`}
      style={{ width: size, height: size }}
      title="Tayr as-Sakinah (Bird of Peace)"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Tiny playful blue hat */}
        <g transform="translate(42, 10) rotate(-6)">
          {/* Hat brim */}
          <path
            d="M2 24 C14 21, 38 21, 48 24 C40 25, 10 25, 2 24 Z"
            fill="#3B82F6"
            stroke="#2C1810"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Hat crown */}
          <path
            d="M10 22 L14 8 C15 5, 33 5, 34 8 L38 22 Z"
            fill="#60A5FA"
            stroke="#2C1810"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Hat band */}
          <path
            d="M11 18 C20 17, 28 17, 37 18"
            stroke="#1D4ED8"
            strokeWidth="3"
          />
        </g>

        {/* Bird Body (Round cream/butter yellow chick) */}
        <ellipse
          cx="60"
          cy="68"
          rx="38"
          ry="36"
          fill="#FFFDF0"
          stroke="#2C1810"
          strokeWidth="4"
        />

        {/* Small folded wing */}
        <path
          d="M34 68 C34 76, 44 84, 52 82 C48 76, 44 68, 38 66 Z"
          fill="#FDE68A"
          stroke="#2C1810"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Cheerful big eyes */}
        {/* Left eye */}
        <ellipse
          cx="52"
          cy="60"
          rx="6.5"
          ry="10"
          fill="#2C1810"
        />
        <circle cx="50" cy="56" r="2.5" fill="#FFFFFF" />

        {/* Right eye */}
        <ellipse
          cx="72"
          cy="60"
          rx="6.5"
          ry="10"
          fill="#2C1810"
        />
        <circle cx="70" cy="56" r="2.5" fill="#FFFFFF" />

        {/* Soft blush cheeks */}
        <ellipse cx="42" cy="69" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="80" cy="69" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.8" />

        {/* Cute orange beak */}
        <path
          d="M59 65 L66 65 L62.5 73 Z"
          fill="#F59E0B"
          stroke="#2C1810"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Peaceful belly feather strokes */}
        <path
          d="M56 82 C59 85, 65 85, 68 82"
          stroke="#2C1810"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M53 87 C58 91, 66 91, 71 87"
          stroke="#2C1810"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Little feet */}
        <path
          d="M48 103 L50 109 M52 103 L55 109 M70 103 L68 109 M74 103 L73 109"
          stroke="#2C1810"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
