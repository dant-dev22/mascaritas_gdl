'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  readonly threshold?: number;
  readonly rootMargin?: string;
  readonly once?: boolean;
}

interface UseScrollRevealReturn {
  readonly ref: React.RefObject<HTMLElement | null>;
  readonly isVisible: boolean;
}

function getInitialVisibility(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof IntersectionObserver === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useScrollReveal(
  options: UseScrollRevealOptions = {},
): UseScrollRevealReturn {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => getInitialVisibility());

  useEffect(() => {
    if (isVisible && once) return undefined;

    const node = ref.current;
    if (typeof IntersectionObserver === 'undefined' || !node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, once, rootMargin, threshold]);

  return { ref, isVisible };
}
