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
      },
      animation: {
        swing: "swing 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
