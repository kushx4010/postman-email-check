import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-lora)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        accent: "#2c5f4f",
        neutral: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#e8e2d8",
          300: "#d4ccc0",
          400: "#a39e94",
          500: "#6b6560",
          600: "#4a4542",
          700: "#3a3634",
          800: "#2c2a28",
          900: "#1c1b1a",
        },
        risk: {
          low: "#2c5f4f",
          medium: "#b8860b",
          high: "#a63d3d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
