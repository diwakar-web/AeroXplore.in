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
export default function useScrollReveal(deps = []) {
  useEffect(() => {
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
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px',
      }
    );

    const observeAll = () => {
      const targets = document.querySelectorAll('[data-reveal]:not(.revealed)');
      targets.forEach((el) => {
        observer.observe(el);
      });
    };

    observeAll();

    // Re-check shortly after mount for async child components
    const timer = setTimeout(observeAll, 120);

    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, deps);
}
