import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#100b12",
        rosegold: "#e8b7a6",
        pearl: "#fff8f3",
        plum: "#5c2338",
        champagne: "#f6dfb8",
        emerald: "#0f6f5f"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(232, 183, 166, 0.25)",
        glass: "0 20px 70px rgba(16, 11, 18, 0.16)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"]
      },
      backgroundImage: {
        "beauty-radial": "radial-gradient(circle at 20% 20%, rgba(232,183,166,.30), transparent 30%), radial-gradient(circle at 85% 5%, rgba(15,111,95,.16), transparent 24%), linear-gradient(135deg, #100b12 0%, #321523 54%, #140d14 100%)"
      }
    }
  },
  plugins: []
};

export default config;
