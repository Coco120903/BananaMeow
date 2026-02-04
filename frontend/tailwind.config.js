/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        banana: {
          50: "#FFF9E6",
          100: "#FFF3CC",
          200: "#FFE699",
          300: "#FFD966",
          400: "#FFCC33",
          500: "#FFBE00"
        },
        cream: "#FFF7F0",
        blush: "#FDE2E4",
        lilac: "#EBDCF9",
        royal: "#5A3E85",
        ink: "#2E2437"
      },
      fontFamily: {
        playful: ["'Baloo 2'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(90, 62, 133, 0.12)"
      }
    }
  },
  plugins: []
};
