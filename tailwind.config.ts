import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ivi: {
          bg: "#FFFFFF",
          surface: "#F9FAFB",
          surfaceLight: "#F3F4F6",
          accent: "#00d4aa",
          warning: "#f59e0b",
          danger: "#ef4444",
          info: "#3b82f6",
          purple: "#a78bfa",
        },
      },
      maxWidth: {
        ivi: "480px",
      },
    },
  },
  plugins: [],
};
export default config;
