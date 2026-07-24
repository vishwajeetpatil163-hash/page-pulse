import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pagepulse:recent-searches";
const MAX_ENTRIES = 6;

/**
 * Persists a small list of recently audited URLs to localStorage so the
 * user can quickly re-run a past audit.
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (err) {
      // Corrupt or inaccessible storage shouldn't break the app.
      console.warn("Could not read recent searches from localStorage.", err);
    }
  }, []);

  const addRecentSearch = useCallback((url) => {
    setRecentSearches((prev) => {
      const next = [url, ...prev.filter((entry) => entry !== url)].slice(0, MAX_ENTRIES);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn("Could not save recent searches to localStorage.", err);
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Could not clear recent searches from localStorage.", err);
    }
  }, []);

  return { recentSearches, addRecentSearch, clearRecentSearches };
}
