/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: { DEFAULT: "#0B132B", deep: "#050814", light: "#1C2541" },
        obsidian: { DEFAULT: "#070B19", card: "#0E162D" },
        royal: { DEFAULT: "#1D4ED8", light: "#3B82F6", deep: "#1E3A8A" },
        gold: { DEFAULT: "#E5C158", soft: "#FBE697", deep: "#D4AF37", metallic: "#B8860B" },
        lavender: { DEFAULT: "#C9B8F5", soft: "#E4DBFF" },
        azure: "#00F2FE",
        ivory: "#F8FAFC",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        handwriting: ["'Caveat'", "'Dancing Script'", "cursive"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(229, 193, 88, 0.35)",
        "glow-gold": "0 0 50px rgba(229, 193, 88, 0.5)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.35)",
        "glow-lavender": "0 0 40px rgba(201, 184, 245, 0.35)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

