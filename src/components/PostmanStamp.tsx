"use client";

/**
 * Small stamp / postmark motif for accents (e.g. section headers, badges).
 */
export function PostmanStamp({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={40}
      height={40}
      className={className}
      aria-hidden
    >
      <circle cx="20" cy="20" r="18" fill="none" stroke="#2c2c2c" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="#2c2c2c" strokeWidth="0.8" />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fill="#2c2c2c"
        fontSize="8"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
      >
        POST
      </text>
    </svg>
  );
}
