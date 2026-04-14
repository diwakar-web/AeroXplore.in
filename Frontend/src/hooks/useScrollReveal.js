import { useEffect } from 'react';

/**
 * useScrollReveal
 * ───────────────
 * Observes every element that carries a [data-reveal] attribute.
 * When an element crosses into the viewport it gets the `.revealed`
 * class, triggering the CSS transition defined in animations.css.
 * Each element is only revealed once (observer stops watching it).
 *
 * Usage: call `useScrollReveal()` once inside any page component.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // animate once, then stop watching
          }
        });
      },
      {
        threshold: 0.1,          // fire when 10 % of the element is visible
        rootMargin: '0px 0px -50px 0px', // trigger slightly before fully in view
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
