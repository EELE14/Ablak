/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";
import { StoryBlock, ELEMENTS } from "./StoryBlock";
import type { StoryBlockContent } from "./StoryBlock";

const BLOCKS: StoryBlockContent[] = [
  {
    label: "The name",
    statement: "The Hungarian word for window.",
    body1:
      "A window is a frame onto something larger. It does not change what lies beyond it: It simply defines what you can see. The browser viewport works the same way: a fixed frame through which the user observes your page.",
    body2:
      "ablak is named for that frame. It watches the viewport and tells you exactly what it contains, so that your code can respond to what the user actually sees.",
  },
  {
    label: "What it gives you",
    statement: "Pure numbers. No opinions.",
    body1:
      "ablak delivers raw viewport data: Scroll position and velocity, mouse coordinates, window size, screen position, device orientation, and pixel ratio. All of it, in one object, on every frame that something changes.",
    body2:
      "What you do with those numbers is your concern. ablak has no idea what an animation is. It just watches and reports.",
  },
  {
    label: "The render loop",
    statement: "One loop. Every frame.",
    body1:
      "Rather than binding to native scroll, resize, or mousemove events directly, ablak takes a deferred approach. It captures the latest values and delivers them together inside a single requestAnimationFrame loop.",
    body2:
      "Your callback runs only when something has actually changed, and only when the browser is ready to render. No redundant work, no layout thrashing, no missed frames.",
  },
  {
    label: "The API",
    statement: "watchViewport().",
    body1:
      "Pass any function to watchViewport() and ablak calls it on every frame that something changes. The full viewport state is the first argument: Scroll, mouse, size, position, orientation, and pixel ratio, all together.",
    body2:
      "The return value is your unsubscribe function. Call it when you are done. That is the entire API.",
  },
];

const N = BLOCKS.length;

const STEP = 2.5;

const EXIT_START = 2.0;

const EXIT_DUR = 0.8;

const REVEAL_DUR = 1.5;

const WRAPPER_VH = ((N - 1) * STEP + EXIT_START + EXIT_DUR + 1) * 100;

function toId(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

export function StorySection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(N).fill(null),
  );
  const elemRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: N }, () => new Array(ELEMENTS.length).fill(null)),
  );

  useEffect(() => {
    return watchViewport(
      ({ scroll, size }) => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const sectionTop = wrapper.offsetTop;

        BLOCKS.forEach((_, bi) => {
          const blockOrigin = sectionTop + bi * STEP * size.y;
          const t = scroll.top - blockOrigin;

          // Staggered element reveal
          const revealProgress = Math.max(
            0,
            Math.min(1, t / (REVEAL_DUR * size.y)),
          );
          elemRefs.current[bi].forEach((el, i) => {
            if (!el) return;
            const { start, dur } = ELEMENTS[i];
            const p = Math.max(0, Math.min(1, (revealProgress - start) / dur));
            const pe = 1 - Math.pow(1 - p, 2);
            el.style.opacity = pe.toFixed(3);
            el.style.transform = `translateY(${((1 - pe) * 80).toFixed(1)}px)`;
          });

          const exitP = Math.max(
            0,
            Math.min(1, (t - EXIT_START * size.y) / (EXIT_DUR * size.y)),
          );
          const content = contentRefs.current[bi];
          if (content) {
            content.style.opacity = (1 - exitP).toFixed(3);
            content.style.transform =
              exitP > 0 ? `translateY(${(exitP * -50).toFixed(1)}px)` : "";
          }
        });
      },
      { only: ["scroll", "size"] },
    );
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${WRAPPER_VH}vh`, position: "relative" }}
    >
      {BLOCKS.map((block, bi) => (
        <div
          key={`anchor-${bi}`}
          id={toId(block.label)}
          style={{ position: "absolute", top: `${bi * STEP * 100}vh` }}
        />
      ))}
      <section
        className="relative overflow-hidden"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {BLOCKS.map((block, bi) => (
          <StoryBlock
            key={bi}
            content={block}
            contentRef={(el) => {
              contentRefs.current[bi] = el;
            }}
            getElemRef={(i) => (el) => {
              elemRefs.current[bi][i] = el;
            }}
          />
        ))}
      </section>
    </div>
  );
}
