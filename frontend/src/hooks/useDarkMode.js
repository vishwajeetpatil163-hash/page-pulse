import { useEffect, useState } from "react";

const STORAGE_KEY = "pagepulse:theme";

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch (err) {
    // Ignore storage access issues and fall through to system preference.
  }
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/**
 * Tracks and applies the dark/light theme, toggling the `.dark` class on
 * <html> that Tailwind's darkMode: "class" strategy reads from.
 */
export function useDarkMode() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      // Non-fatal; theme just won't persist across reloads.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
