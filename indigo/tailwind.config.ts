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
        earth: {
          deep:   "#18170F",
          mid:    "#222219",
          card:   "#2C2B20",
          raised: "#343328",
        },
        warm: {
          cream:  "#EDE8DC",
          tan:    "#A89B7E",
          muted:  "#6B6150",
          gold:   "#B8A060",
          border: "rgba(180,160,110,0.15)",
        },
        sage:        "#6B8C5F",
        amber:       "#C4974A",
        terracotta:  "#A0513A",
        rust:        "#7A3020",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body:    ["Jost", "system-ui", "sans-serif"],
        mono:    ["Jost", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.15em",
        wide:  "0.08em",
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "2px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
