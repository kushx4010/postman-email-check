"use client";

interface PostmanIllustrationProps {
  className?: string;
  variant?: "hero" | "compact";
}

/**
 * Postman-themed SVG: mail carrier with letters and envelope.
 * Stylized, editorial-friendly illustration for the Alms-inspired layout.
 */
export function PostmanIllustration({ className = "", variant = "hero" }: PostmanIllustrationProps) {
  const size = variant === "hero" ? 320 : 160;
  return (
    <svg
      viewBox="0 0 280 240"
      width={variant === "hero" ? "100%" : size}
      height={variant === "hero" ? "auto" : size * 0.75}
      className={className}
      aria-hidden
    >
      {/* Sky / background shape */}
      <defs>
        <linearGradient id="postman-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#ebe4d9" />
        </linearGradient>
        <linearGradient id="postman-cap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2c2c2c" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="postman-envelope" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#faf8f5" />
          <stop offset="100%" stopColor="#e8e4dc" />
        </linearGradient>
        <linearGradient id="postman-letter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffefc" />
          <stop offset="100%" stopColor="#f0ede8" />
        </linearGradient>
      </defs>
      {/* Ground / path */}
      <ellipse cx="140" cy="220" rx="120" ry="24" fill="#e0dcd4" opacity={0.8} />
      {/* Postman figure - simplified, friendly */}
      <g transform="translate(140, 140)">
        {/* Legs */}
        <path d="M -18 42 L -14 52 L -8 52 L -12 42 Z" fill="#4a4a4a" />
        <path d="M 8 42 L 12 52 L 18 52 L 14 42 Z" fill="#4a4a4a" />
        {/* Body / coat */}
        <path
          d="M -22 8 L -24 42 L 24 42 L 22 8 L 18 -4 Q 18 -12 8 -12 L -8 -12 Q -18 -12 -18 -4 Z"
          fill="#3d5a6c"
        />
        {/* Cap */}
        <ellipse cx="0" cy="-22" rx="20" ry="10" fill="url(#postman-cap)" />
        <path d="M -20 -22 L -18 -32 L 18 -32 L 20 -22 Z" fill="url(#postman-cap)" />
        {/* Face */}
        <circle cx="0" cy="-18" r="8" fill="#e8d5c4" />
        {/* Arm holding letters */}
        <path
          d="M 22 12 L 48 0 L 52 8 L 26 18 Z"
          fill="#e8d5c4"
          stroke="#d4c4b4"
          strokeWidth="0.5"
        />
        {/* Envelope in hand */}
        <g transform="translate(38, 2)">
          <path
            d="M 0 0 L 20 0 L 20 14 L 0 14 Z"
            fill="url(#postman-envelope)"
            stroke="#c9c0b5"
            strokeWidth="0.8"
          />
          <path d="M 0 0 L 10 7 L 20 0" fill="none" stroke="#c9c0b5" strokeWidth="0.6" />
        </g>
        {/* Letters under arm */}
        <g transform="translate(26, 14)">
          <rect x="0" y="0" width="14" height="18" rx="0.5" fill="url(#postman-letter)" stroke="#d0cbc2" strokeWidth="0.5" />
          <rect x="4" y="4" width="14" height="18" rx="0.5" fill="url(#postman-letter)" stroke="#d0cbc2" strokeWidth="0.5" />
          <rect x="8" y="8" width="14" height="18" rx="0.5" fill="url(#postman-letter)" stroke="#d0cbc2" strokeWidth="0.5" />
        </g>
      </g>
      {/* Floating envelope - decorative */}
      <g transform="translate(50, 60)" opacity={0.9}>
        <path
          d="M 0 0 L 24 0 L 24 16 L 0 16 Z"
          fill="url(#postman-envelope)"
          stroke="#c9c0b5"
          strokeWidth="0.6"
          transform="rotate(-12 12 8)"
        />
        <path
          d="M 0 0 L 12 8 L 24 0"
          fill="none"
          stroke="#c9c0b5"
          strokeWidth="0.5"
          transform="rotate(-12 12 8)"
          transformOrigin="12px 8px"
        />
      </g>
      {/* Second small envelope */}
      <g transform="translate(200, 80)" opacity={0.7}>
        <path
          d="M 0 0 L 18 0 L 18 12 L 0 12 Z"
          fill="url(#postman-letter)"
          stroke="#d0cbc2"
          strokeWidth="0.5"
          transform="rotate(8 9 6)"
        />
      </g>
    </svg>
  );
}
