import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        moss: "#4f6f52",
        coral: "#d56b4a",
        gold: "#d8a748",
        mist: "#eef3f2"
      }
    }
  },
  plugins: []
};

export default config;
