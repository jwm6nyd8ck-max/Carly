import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        indigo: {
          deep: "#2D1B69",
          mid: "#5B3FBF",
          soft: "#9B7FE8",
          light: "#C8B8FF",
        },
        success: "#2DB87A",
        warning: "#E8A733",
        danger: "#E84433",
        "bg-light": "#F7F5FF",
        "bg-dark": "#0F0A1E",
        "text-primary": "#1A1030",
        grade: {
          aplus: "#2DB87A",
          a: "#52C994",
          b: "#E8C733",
          c: "#E8A733",
          d: "#E87033",
          f: "#E84433",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["Space Mono", "Courier New", "monospace"],
      },
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fade-up 0.4s ease-out forwards",
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
