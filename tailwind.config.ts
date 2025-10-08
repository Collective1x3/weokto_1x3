import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        weokto: {
          purple: '#B794F4',
          dark: '#1e1e1e',
          darker: '#0a0a0a',
        },
        stam: {
          primary: '#3B82F6',
          bg: '#F9FAFB',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
