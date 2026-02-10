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
        mint: "#D4F5E9",
        peach: "#FFDAB9",
        sky: "#E0F4FF",
        coral: "#FFB5A7",
        royal: "#5A3E85",
        ink: "#2E2437"
      },
      fontFamily: {
        playful: ["'Baloo 2'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(90, 62, 133, 0.12)",
        glow: "0 0 20px rgba(90, 62, 133, 0.25)",
        "glow-pink": "0 0 20px rgba(253, 226, 228, 0.6)",
        cute: "0 4px 14px rgba(90, 62, 133, 0.15), 0 0 0 3px rgba(255, 230, 153, 0.3)"
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "paw-print": "paw-print 0.5s ease-out forwards",
        "heart-pop": "heart-pop 0.3s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" }
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
          "50%": { opacity: "0.6", transform: "scale(1.2) rotate(180deg)" }
        },
        "paw-print": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "0.3", transform: "scale(1)" }
        },
        "heart-pop": {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
