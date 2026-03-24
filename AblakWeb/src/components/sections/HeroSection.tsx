/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef, useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { watchViewport } from "ablak";
import { CodeBlock } from "../ui";
import { HERO_CODE } from "../../data";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId: number;
    let mouseX = -9999;
    let mouseY = -9999;

    function resizeCanvas() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    }

    resizeCanvas();

    function drawGrid() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const spacing = 40;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      ctx.clearRect(0, 0, w, h);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * spacing;
          const by = r * spacing;
          const dx = bx - mouseX;
          const dy = by - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;
          const factor = Math.max(0, 1 - dist / maxDist);
          const angle = Math.atan2(dy, dx);
          const displacement = factor * 10;
          const x = bx - Math.cos(angle) * displacement;
          const y = by - Math.sin(angle) * displacement;
          const opacity = 0.08 + factor * 0.25;

          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${opacity})`;
          ctx.fill();
        }
      }
    }

    function loop() {
      drawGrid();
      rafId = requestAnimationFrame(loop);
    }

    loop();

    const stopAblak = watchViewport(
      ({ mouse, scroll }) => {
        mouseX = mouse.x;
        mouseY = mouse.y;
        const t = scroll.top;

        // Each layer moves at a progressively faster speed
        if (badgeRef.current)
          badgeRef.current.style.transform = `translateY(${t * -0.04}px)`;
        if (headlineRef.current)
          headlineRef.current.style.transform = `translateY(${t * -0.12}px)`;
        if (subtextRef.current)
          subtextRef.current.style.transform = `translateY(${t * 0.08}px)`;
        if (buttonsRef.current)
          buttonsRef.current.style.transform = `translateY(${t * -0.06}px)`;
        if (codeRef.current)
          codeRef.current.style.transform = `translateY(${t * 0.08}px)`;
      },
      { only: ["mouse", "scroll"] },
    );

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      stopAblak();
      resizeObserver.disconnect();
    };
  }, []);

  function handleCopy() {
    void navigator.clipboard.writeText("npm install ablak-ts").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start md:justify-center pt-28 md:pt-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/80 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-4xl">
        <div ref={headlineRef} style={{ willChange: "transform" }}>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            <span className="text-gradient">ablak</span>
          </h1>
        </div>

        <div ref={subtextRef} style={{ willChange: "transform" }}>
          <p className="text-lg md:text-2xl text-zinc-400 mb-4 max-w-2xl leading-relaxed">
            A zero-dependency viewport tracker that fires once per animation
            frame. Scroll, mouse, position, orientation, all in one callback.
          </p>
          <p className="text-zinc-500 mb-10">
            Framework-agnostic · TypeScript · 2 kB gzipped
          </p>
        </div>

        <div
          ref={buttonsRef}
          className="mb-12"
          style={{ willChange: "transform" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-sm hover:bg-indigo-500/20 transition-all glow-ablak"
            >
              {copied ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} />
              )}
              npm install ablak-ts
            </button>
            <a
              href="https://github.com/eele14/ablak"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass text-zinc-300 text-sm hover:text-white transition-colors"
            >
              <ExternalLink size={14} />
              GitHub
            </a>
          </div>
        </div>

        <div
          ref={codeRef}
          className="w-full max-w-xl"
          style={{ willChange: "transform", position: "relative", zIndex: 10 }}
        >
          <CodeBlock code={HERO_CODE} language="typescript" />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 text-xs animate-bounce">
        <span>Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  );
}
