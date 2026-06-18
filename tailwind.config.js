/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05060b",
        brand: {},
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(34,211,238,0.45)",
        "glow-lg": "0 0 100px rgba(34,211,238,0.25)",
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.12), transparent 60%)",
      },
    },
  },
  plugins: [],
}

