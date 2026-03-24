/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return watchViewport(
      ({ scroll, size }) => {
        const bar = barRef.current;
        if (!bar) return;
        const docScrollable = size.docY - size.y;
        const progress =
          docScrollable > 0 ? (scroll.top / docScrollable) * 100 : 0;
        bar.style.width = `${progress}%`;
      },
      { only: ["scroll", "size"] },
    );
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-0"
        style={{ background: "linear-gradient(90deg, #6366f1, #22d3ee)" }}
      />
    </div>
  );
}
