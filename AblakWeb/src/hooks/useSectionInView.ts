/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef, useState } from "react";

export function useSectionInView(
  ref: React.RefObject<HTMLElement | null>,
): boolean {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(ref.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref]);

  return inView;
}
