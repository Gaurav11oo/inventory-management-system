module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f172a",
          card: "#1e293b",
          hover: "#334155",
          text: "#f1f5f9",
          border: "#334155",
        },
      },
    },
  },
  plugins: [],
};
