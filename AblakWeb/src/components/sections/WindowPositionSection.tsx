/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef, useState } from "react";
import { watchViewport } from "ablak";
import { useSectionInView } from "../../hooks/useSectionInView";
import { LiveBadge, CodeBlock } from "../ui";
import { POSITION_CODE } from "../../data";

export function WindowPositionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const miniWindowRef = useRef<HTMLDivElement>(null);
  const velXArrowRef = useRef<SVGLineElement>(null);
  const velYArrowRef = useRef<SVGLineElement>(null);
  const posLeftRef = useRef<HTMLSpanElement>(null);
  const posTopRef = useRef<HTMLSpanElement>(null);
  const posRightRef = useRef<HTMLSpanElement>(null);
  const posBottomRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const inView = useSectionInView(sectionRef);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!inView) return;

    let idleTimer: ReturnType<typeof setTimeout>;

    const stop = watchViewport(
      ({ position, size }) => {
        const screenW = window.screen.width || 1920;
        const screenH = window.screen.height || 1080;

        const nw = Math.max(0.05, Math.min(1, size.x / screenW));
        const nh = Math.max(0.05, Math.min(1, size.y / screenH));
        const nx = position.left / screenW;
        const ny = position.top / screenH;

        if (miniWindowRef.current) {
          miniWindowRef.current.style.left = `${nx * 100}%`;
          miniWindowRef.current.style.top = `${ny * 100}%`;
          miniWindowRef.current.style.width = `${nw * 100}%`;
          miniWindowRef.current.style.height = `${nh * 100}%`;
        }

        const arrowScale = 3;
        const cx = 50;
        const cy = 50;

        if (velXArrowRef.current) {
          velXArrowRef.current.setAttribute(
            "x2",
            String(cx + position.velocity.x * arrowScale),
          );
          velXArrowRef.current.setAttribute("y2", String(cy));
        }
        if (velYArrowRef.current) {
          velYArrowRef.current.setAttribute("x2", String(cx));
          velYArrowRef.current.setAttribute(
            "y2",
            String(cy + position.velocity.y * arrowScale),
          );
        }

        if (posLeftRef.current)
          posLeftRef.current.textContent = String(position.left);
        if (posTopRef.current)
          posTopRef.current.textContent = String(position.top);
        if (posRightRef.current)
          posRightRef.current.textContent = String(position.right);
        if (posBottomRef.current)
          posBottomRef.current.textContent = String(position.bottom);

        clearTimeout(idleTimer);
        setIdle(false);
        idleTimer = setTimeout(() => setIdle(true), 2000);
      },
      { only: ["position", "size"] },
    );

    const stopScroll = watchViewport(
      ({ scroll }) => {
        if (codeRef.current && sectionRef.current) {
          const sectionTop =
            scroll.top + sectionRef.current.getBoundingClientRect().top;
          const offset = scroll.top - sectionTop;
          codeRef.current.style.transform = `translateY(${offset * 0.15}px)`;
        }
      },
      { only: ["scroll"] },
    );

    return () => {
      stop();
      stopScroll();
      clearTimeout(idleTimer);
    };
  }, [inView]);

  return (
    <section id="position" ref={sectionRef} className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <LiveBadge className="mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Window <span className="text-gradient">Position</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            ablak tracks your browser window's position on screen via{" "}
            <code className="text-indigo-300 text-sm">window.screenX/Y</code>.
            Move the window to see it update.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Desktop mockup */}
          <div className="glass rounded-2xl p-6 aspect-video relative overflow-hidden">
            <div className="absolute inset-3 rounded-lg bg-zinc-950/80 border border-zinc-700 overflow-hidden">
              {/* Screen content mockup */}
              <div className="absolute inset-0 opacity-20">
                <div className="h-1 bg-zinc-600 rounded mt-3 mx-3" />
                <div className="grid grid-cols-3 gap-1 m-3 mt-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-8 bg-zinc-700 rounded" />
                  ))}
                </div>
              </div>

              {/* Mini window */}
              <div
                ref={miniWindowRef}
                className="absolute rounded glass border border-indigo-400/40 bg-indigo-500/10 flex items-center justify-center transition-none"
                style={{ willChange: "left, top, width, height" }}
              >
                <div className="text-[6px] text-indigo-300 font-mono">
                  ablak
                </div>
              </div>

              {/* Velocity arrows */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line
                  ref={velXArrowRef}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="50"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                />
                <line
                  ref={velYArrowRef}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="50"
                  stroke="#22d3ee"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-zinc-600 text-center">
              {idle ? "Move your browser window" : "Tracking..."}
            </div>
          </div>

          {/* Readouts */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "left (screenX)", ref: posLeftRef },
              { label: "top (screenY)", ref: posTopRef },
              { label: "right", ref: posRightRef },
              { label: "bottom", ref: posBottomRef },
            ].map(({ label, ref: r }) => (
              <div key={label} className="glass rounded-xl p-4">
                <div className="text-xs text-zinc-500 font-mono mb-1">
                  {label}
                </div>
                <div className="text-xl font-bold font-mono text-data">
                  <span ref={r}>0</span>
                  <span className="text-xs text-zinc-600 ml-1">px</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={codeRef}
          className="max-w-xl mx-auto"
          style={{ willChange: "transform", position: "relative", zIndex: 10 }}
        >
          <CodeBlock code={POSITION_CODE} language="typescript" />
        </div>
      </div>
    </section>
  );
}
