/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";
import { useSectionInView } from "../../hooks/useSectionInView";
import { CodeBlock } from "../ui";
import { SCROLL_ANIM_CODE } from "../../data";

const REVEAL_TEXT =
  "ablak fires once per animation frame keeping your effects in perfect sync with the browser render loop no jank no missed frames just \npure viewport data";

export function ScrollAnimSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const codeRef = useRef<HTMLDivElement>(null);
  const inView = useSectionInView(sectionRef);

  const words = REVEAL_TEXT.split(" ");

  useEffect(() => {
    if (!inView) return;

    return watchViewport(
      ({ scroll, size }) => {
        const section = sectionRef.current;
        if (!section) return;

        const sectionTop = section.offsetTop;
        const scrolled = scroll.top - sectionTop + size.y * 0.3;
        const progress = Math.max(0, Math.min(1, scrolled / (size.y * 1.5)));
        const wordProgress = Math.max(
          0,
          Math.min(1, scrolled / (size.y * 0.6)),
        );

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${progress * 100}%`;
        }

        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(
            progress * 1_000_000,
          ).toLocaleString();
        }

        wordsRef.current.forEach((word, i) => {
          if (!word) return;
          const threshold = i / words.length;
          word.style.opacity = wordProgress > threshold ? "1" : "0.15";
          word.style.color = wordProgress > threshold ? "#f4f4f5" : "#52525b";
        });

        // Code block drifts at a slightly different speed
        if (codeRef.current) {
          const offset = scroll.top - sectionTop;
          codeRef.current.style.transform = `translateY(${offset * 0.15}px)`;
        }
      },
      { only: ["scroll", "size"] },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <section id="scroll" ref={sectionRef} className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Scroll-Scrubbed <span className="text-gradient">Animations</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Scroll down to animate — scroll back up to rewind. Everything is
            driven by{" "}
            <code className="text-indigo-300 text-sm">scroll.top</code>, no
            timelines needed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Progress bar */}
          <div className="glass rounded-2xl p-6">
            <div className="text-xs text-zinc-500 font-mono mb-4">
              Progress bar
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full w-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #6366f1, #22d3ee)",
                  willChange: "width",
                }}
              />
            </div>
          </div>

          {/* Counter */}
          <div className="glass rounded-2xl p-6">
            <div className="text-xs text-zinc-500 font-mono mb-4">Counter</div>
            <div className="text-4xl font-bold font-mono text-gradient">
              <span ref={counterRef}>0</span>
            </div>
            <div className="text-xs text-zinc-600 mt-1">/ 1,000,000</div>
          </div>

          {/* Word reveal */}
          <div className="glass rounded-2xl p-6 overflow-hidden">
            <div className="text-xs text-zinc-500 font-mono mb-4">
              Word reveal
            </div>
            <p className="text-sm leading-relaxed break-words overflow-hidden">
              {words.map((word, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    wordsRef.current[i] = el;
                  }}
                  className="mr-1 inline"
                  style={{
                    opacity: 0.15,
                    willChange: "opacity, color",
                    transition: "opacity 200ms linear, color 200ms linear",
                  }}
                >
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div
          ref={codeRef}
          className="max-w-xl mx-auto"
          style={{ willChange: "transform", position: "relative", zIndex: 10 }}
        >
          <CodeBlock code={SCROLL_ANIM_CODE} language="typescript" />
        </div>
      </div>
    </section>
  );
}
