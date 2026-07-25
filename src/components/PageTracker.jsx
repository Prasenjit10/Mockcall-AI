import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const VISITED_PAGES_KEY = "visited_pages";

/**
 * Reads the current visited_pages array out of localStorage.
 * Returns an empty array if nothing has been stored yet or the
 * stored value is malformed.
 */
export function getVisitedPages() {
  try {
    const raw = localStorage.getItem(VISITED_PAGES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Clears the recorded visit history. Called after a lead is
 * successfully submitted so the next visitor starts fresh.
 */
export function clearVisitedPages() {
  localStorage.removeItem(VISITED_PAGES_KEY);
}

/**
 * Appends a pathname to the visited_pages list in localStorage,
 * preserving order and skipping duplicates.
 */
function recordVisit(pathname) {
  const visited = getVisitedPages();
  if (!visited.includes(pathname)) {
    visited.push(pathname);
    localStorage.setItem(VISITED_PAGES_KEY, JSON.stringify(visited));
  }
}

/**
 * Mount this once, above the routed pages (e.g. in App.jsx).
 * It watches the router location and records every new pathname
 * visited during the session, with no per-page wiring required.
 */
export default function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    recordVisit(location.pathname);
  }, [location.pathname]);

  return null;
}
