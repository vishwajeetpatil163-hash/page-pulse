/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        line: "var(--line)",
        pulse: "var(--pulse)",
        warn: "var(--warn)",
        crit: "var(--crit)",
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["\"Inter\"", "sans-serif"],
        mono: ["\"IBM Plex Mono\"", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 23, 26, 0.04), 0 8px 24px rgba(16, 23, 26, 0.06)",
      },
    },
  },
  plugins: [],
};
