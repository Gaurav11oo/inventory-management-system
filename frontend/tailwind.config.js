module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
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

      /* ✅ Custom Gradient */
      backgroundImage: {
        "inventory-gradient":
          "linear-gradient(90.2deg, rgba(1,47,95,1) -0.4%, rgba(56,141,217,1) 106.1%)",
      },

      backgroundHEADERImage: {
        "header-gradient":
          "linear-gradient(to right, #000046 0%, #1CB5E0 51%, #000046 100%)",
      },
    },
  },
  plugins: [],
};
