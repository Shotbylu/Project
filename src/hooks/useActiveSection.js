import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tracks the currently active section based on scroll position using a throttled listener.
 * Runs the calculation at most once per `throttleMs` interval to reduce scroll thrash.
 */
const useActiveSection = (
  menuItems,
  offset = 100,
  throttleMs = 100
) => {
  const [activeSection, setActiveSection] = useState(menuItems[0]?.id ?? '');
  const timeoutRef = useRef(null);
  const lastRunRef = useRef(0);

  const computeActiveSection = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollPosition = window.scrollY + offset;
    let nextActive = menuItems[0]?.id ?? '';

    for (const item of menuItems) {
      const section = document.getElementById(item.id);
      if (!section) continue;

      const { offsetTop, offsetHeight } = section;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        nextActive = item.id;
        break;
      }
    }

    setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
  }, [menuItems, offset]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleScroll = () => {
      const now = performance.now();
      const elapsed = now - lastRunRef.current;

      if (elapsed < throttleMs) {
        if (timeoutRef.current !== null) return;

        timeoutRef.current = window.setTimeout(() => {
          lastRunRef.current = performance.now();
          timeoutRef.current = null;
          computeActiveSection();
        }, throttleMs - elapsed);
        return;
      }

      lastRunRef.current = now;
      computeActiveSection();
    };

    computeActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [computeActiveSection, throttleMs]);

  return activeSection;
};

export default useActiveSection;
