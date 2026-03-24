/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";

export interface OrbDef {
  top: string;
  left: string;
  size: number;
  color: string;
  speed: number;
}

interface ParallaxOrbsProps {
  orbs: OrbDef[];
}

export function ParallaxOrbs({ orbs }: ParallaxOrbsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return watchViewport(
      ({ scroll }) => {
        const container = containerRef.current;
        if (!container) return;
        const children = container.children;
        orbs.forEach((orb, i) => {
          const el = children[i] as HTMLElement | undefined;
          if (el)
            el.style.transform = `translateY(${scroll.top * -orb.speed}px)`;
        });
      },
      { only: ["scroll"] },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${Math.round(orb.size * 0.22)}px)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
