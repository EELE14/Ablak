/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";
import { useSectionInView } from "../../hooks/useSectionInView";
import { LiveBadge, CodeBlock } from "../ui";
import { PARALLAX_CODE } from "../../data";

const LAYERS = [
  {
    speed: 0.4,
    label: "0.4×",
    color: "from-indigo-500/20 to-indigo-800/10",
    text: "Background",
  },
  {
    speed: 0.65,
    label: "0.65×",
    color: "from-violet-500/20 to-violet-800/10",
    text: "Midground",
  },
  {
    speed: 1.0,
    label: "1.0×",
    color: "from-cyan-500/20 to-cyan-800/10",
    text: "Foreground",
  },
];

export function ParallaxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const velRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const inView = useSectionInView(sectionRef);

  useEffect(() => {
    if (!inView) return;

    return watchViewport(
      ({ scroll }) => {
        const sectionTop = sectionRef.current?.offsetTop ?? 0;
        const offset = scroll.top - sectionTop;

        layerRefs.forEach((ref, i) => {
          if (ref.current) {
            ref.current.style.transform = `translateY(${offset * LAYERS[i].speed * 0.5}px)`;
          }
        });

        if (velRef.current) {
          const vel = Math.abs(scroll.velocity.y);
          velRef.current.textContent = vel.toFixed(0);
          velRef.current.style.color = vel > 15 ? "#f87171" : "#22d3ee";
        }

        if (codeRef.current) {
          codeRef.current.style.transform = `translateY(${offset * 0.15}px)`;
        }
      },
      { only: ["scroll"] },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <section id="parallax" ref={sectionRef} className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LiveBadge />
            <span className="text-zinc-500 text-sm font-mono">
              velocity:{" "}
              <span ref={velRef} className="text-data font-bold">
                0
              </span>{" "}
              px/frame
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Parallax <span className="text-gradient">Scroll</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Three layers moving at different speeds, driven directly by{" "}
            <code className="text-indigo-300 text-sm">scroll.top</code>. No
            libraries, no springs, pure math.
          </p>
        </div>

        <div className="relative h-72 mb-12 rounded-2xl overflow-hidden border border-zinc-800">
          {LAYERS.map((layer, i) => (
            <div
              key={layer.label}
              ref={layerRefs[i]}
              className={`absolute inset-4 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-between px-6`}
              style={{ willChange: "transform" }}
            >
              <div>
                <div className="text-xs text-zinc-500 mb-1 font-mono">
                  {layer.text}
                </div>
                <div className="text-2xl font-bold text-white">
                  {layer.label} speed
                </div>
              </div>
              <div className="text-4xl opacity-20 font-black text-white select-none">
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        <div
          ref={codeRef}
          className="max-w-xl mx-auto"
          style={{ willChange: "transform", position: "relative", zIndex: 10 }}
        >
          <CodeBlock code={PARALLAX_CODE} language="typescript" />
        </div>
      </div>
    </section>
  );
}
