/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak";
import { useSectionInView } from "../../hooks/useSectionInView";
import { LiveBadge, CodeBlock } from "../ui";
import { VELOCITY_CODE } from "../../data";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  radius: number;
  hue: number;
}

export function VelocitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const mouseBarRef = useRef<HTMLDivElement>(null);
  const scrollValRef = useRef<HTMLSpanElement>(null);
  const mouseValRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const inView = useSectionInView(sectionRef);

  useEffect(() => {
    if (!inView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const blobs: Blob[] = Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2;
      const r = Math.min(W, H) * 0.28;
      const cx = W / 2 + Math.cos(angle) * r;
      const cy = H / 2 + Math.sin(angle) * r;
      return {
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        homeX: cx,
        homeY: cy,
        radius: 40 + Math.random() * 30,
        hue: 220 + i * 20,
      };
    });

    let scrollVel = 0;
    let mouseVel = 0;
    let rafId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const intensity = Math.min(Math.abs(scrollVel) / 20, 1);
      ctx.fillStyle = `rgba(99, 102, 241, ${intensity * 0.04})`;
      ctx.fillRect(0, 0, W, H);

      blobs.forEach((blob) => {
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius,
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, 70%, 60%, 0.35)`);
        gradient.addColorStop(1, `hsla(${blob.hue}, 70%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    }

    function tick() {
      blobs.forEach((blob) => {
        const fx = (blob.homeX - blob.x) * 0.08;
        const fy = (blob.homeY - blob.y) * 0.08;
        blob.vx = (blob.vx + fx) * 0.88;
        blob.vy = (blob.vy + fy + scrollVel * 0.25) * 0.88;
        blob.x += blob.vx;
        blob.y += blob.vy;
      });
      draw();
      rafId = requestAnimationFrame(tick);
    }

    tick();

    const stop = watchViewport(
      ({ scroll, mouse }) => {
        scrollVel = scroll.velocity.y;
        mouseVel = Math.sqrt(mouse.velocity.x ** 2 + mouse.velocity.y ** 2);

        const sv = Math.abs(scrollVel);
        const mv = mouseVel;

        if (scrollBarRef.current) {
          scrollBarRef.current.style.width = `${Math.min(sv / 30, 1) * 100}%`;
        }
        if (mouseBarRef.current) {
          mouseBarRef.current.style.width = `${Math.min(mv / 15, 1) * 100}%`;
        }
        if (scrollValRef.current) {
          scrollValRef.current.textContent = scrollVel.toFixed(1);
        }
        if (mouseValRef.current) {
          mouseValRef.current.textContent = mv.toFixed(1);
        }

        if (codeRef.current && sectionRef.current) {
          const sectionTop =
            scroll.top + sectionRef.current.getBoundingClientRect().top;
          const offset = scroll.top - sectionTop;
          codeRef.current.style.transform = `translateY(${offset * 0.15}px)`;
        }
      },
      { only: ["scroll", "mouse"] },
    );

    return () => {
      cancelAnimationFrame(rafId);
      stop();
    };
  }, [inView]);

  return (
    <section id="velocity" ref={sectionRef} className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <LiveBadge className="mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Velocity</span> Physics
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Spring-physics blobs driven by scroll velocity. Each blob has a home
            position it returns to, scroll fast to displace them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div
              className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50"
              style={{ height: 320 }}
            >
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass rounded-2xl p-5 flex-1">
              <div className="text-xs text-zinc-500 font-mono mb-3">
                Scroll velocity
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div
                  ref={scrollBarRef}
                  className="h-full w-0 rounded-full transition-none"
                  style={{
                    background: "linear-gradient(90deg, #6366f1, #818cf8)",
                    willChange: "width",
                  }}
                />
              </div>
              <div className="text-sm font-mono text-data">
                <span ref={scrollValRef}>0.0</span> px/frame
              </div>
            </div>

            <div className="glass rounded-2xl p-5 flex-1">
              <div className="text-xs text-zinc-500 font-mono mb-3">
                Mouse velocity
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div
                  ref={mouseBarRef}
                  className="h-full w-0 rounded-full transition-none"
                  style={{
                    background: "linear-gradient(90deg, #22d3ee, #67e8f9)",
                    willChange: "width",
                  }}
                />
              </div>
              <div className="text-sm font-mono text-data">
                <span ref={mouseValRef}>0.0</span> px/frame
              </div>
            </div>

            <div className="glass rounded-2xl p-5 flex-1 flex items-center justify-center text-center">
              <p className="text-xs text-zinc-500">
                Scroll fast to disturb the blobs
              </p>
            </div>
          </div>
        </div>

        <div
          ref={codeRef}
          className="max-w-xl mx-auto mt-10"
          style={{ willChange: "transform", position: "relative", zIndex: 10 }}
        >
          <CodeBlock code={VELOCITY_CODE} language="typescript" />
        </div>
      </div>
    </section>
  );
}
