import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        primary: "var(--primary-shadow)",
      },
      keyframes: {
        swing: {
          "0%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(3deg)" },
          "40%": { transform: "rotate(-3deg)" },
          "60%": { transform: "rotate(2deg)" },
          "80%": { transform: "rotate(-2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        auroraMove: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-50px) translateX(50px)" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "scale(0.98)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        swing: "swing 1s ease-in-out infinite",
        "aurora-slow": "auroraMove 20s infinite ease-in-out",
        "aurora-medium": "auroraMove 15s infinite ease-in-out",
        "aurora-fast": "auroraMove 10s infinite ease-in-out",
        "fade-in-up": "fadeInUp 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
