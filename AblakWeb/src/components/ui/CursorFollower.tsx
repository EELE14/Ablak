/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMouseMove(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY;

      const dot = dotRef.current;
      if (dot) dot.style.transform = `translate3d(${x - 4}px,${y - 4}px,0)`;

      const ring = ringRef.current;
      if (ring) ring.style.transform = `translate3d(${x - 16}px,${y - 16}px,0)`;

      const blob = blobRef.current;
      if (blob) blob.style.transform = `translate3d(${x - 100}px,${y - 100}px,0)`;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-indigo-400 rounded-full pointer-events-none z-[9999]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-400/60 pointer-events-none z-[9998]"
        style={{ willChange: "transform", transition: "transform 100ms linear" }}
      />
      <div
        ref={blobRef}
        className="fixed top-0 left-0 w-[200px] h-[200px] rounded-full pointer-events-none z-[9997]"
        style={{
          willChange: "transform",
          transition: "transform 600ms linear",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
