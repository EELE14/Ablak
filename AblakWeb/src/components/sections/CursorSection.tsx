/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";
import { useSectionInView } from "../../hooks/useSectionInView";
import { LiveBadge, CodeBlock } from "../ui";
import { CURSOR_CODE } from "../../data";

const CARDS = [
  { icon: "◈", title: "scroll", desc: "top / bottom / velocity" },
  { icon: "◉", title: "mouse", desc: "x / y / velocity" },
  { icon: "▣", title: "size", desc: "viewport / document" },
  { icon: "◎", title: "position", desc: "screen coords / velocity" },
  { icon: "⊕", title: "orientation", desc: "alpha / beta / gamma" },
  { icon: "◐", title: "devicePixelRatio", desc: "DPR changes" },
  { icon: "⊞", title: "once", desc: "fire & unsubscribe" },
  { icon: "⊟", title: "only", desc: "filter by key" },
];

export function CursorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const codeRef = useRef<HTMLDivElement>(null);
  const inView = useSectionInView(sectionRef);

  useEffect(() => {
    if (!inView) return;

    return watchViewport(
      ({ mouse, scroll }) => {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const lx = mouse.x - rect.left;
          const ly = mouse.y - rect.top;
          container.style.background = `radial-gradient(circle at ${lx}px ${ly}px, rgba(99,102,241,0.12) 0%, transparent 50%)`;
        }

        cardRefs.current.forEach((card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = mouse.x - cx;
          const dy = mouse.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 300;
          const factor = Math.max(0, 1 - dist / maxDist);
          const rx = ((mouse.y - cy) / rect.height) * 12 * factor;
          const ry = ((cx - mouse.x) / rect.width) * 12 * factor;
          card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });

        if (codeRef.current) {
          const sectionTop = sectionRef.current?.offsetTop ?? 0;
          const offset = scroll.top - sectionTop;
          codeRef.current.style.transform = `translateY(${offset * 0.15}px)`;
        }
      },
      { only: ["mouse", "scroll"] },
    );
  }, [inView]);

  return (
    <section id="cursor" ref={sectionRef} className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <LiveBadge className="mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Cursor</span> Awareness
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Move your cursor over the cards. The spotlight tracks your position,
            and each card tilts toward you in 3D.
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 rounded-2xl p-6 border border-zinc-800 transition-colors duration-75"
          style={{ willChange: "background" }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="glass rounded-xl p-4 cursor-default select-none"
              style={{
                willChange: "transform",
                transition: "transform 100ms ease-out",
              }}
            >
              <div className="text-2xl mb-2 text-indigo-400">{card.icon}</div>
              <div className="text-sm font-semibold text-zinc-200 font-mono">
                {card.title}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{card.desc}</div>
            </div>
          ))}
        </div>

        <div
          ref={codeRef}
          className="max-w-xl mx-auto"
          style={{ willChange: "transform", position: "relative", zIndex: 10 }}
        >
          <CodeBlock code={CURSOR_CODE} language="typescript" />
        </div>
      </div>
    </section>
  );
}
