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
          bg: "#0a0e17",
          surface: "#111827",
          surfaceLight: "#1a2235",
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
