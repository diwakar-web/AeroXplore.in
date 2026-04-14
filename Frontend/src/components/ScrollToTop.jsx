import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * ───────────
 * Listens for route changes and immediately scrolls the window
 * to the top so every new page always starts at position (0, 0).
 * Place this once inside <Router> in App.jsx.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null; // renders nothing — purely a side-effect component
}
