import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08090c",
        cloud: "#f5f7fb",
        electric: "#8ba7ff",
        lime: "#c8f36a"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
