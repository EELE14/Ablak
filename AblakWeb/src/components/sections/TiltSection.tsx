/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef, useState } from "react";
import {
  watchViewport,
  requestOrientationPermission,
  recalibrateOrientation,
} from "ablak";
import { useSectionInView } from "../../hooks/useSectionInView";
import { LiveBadge, CodeBlock } from "../ui";
import { cn } from "../../lib/utils";
import { TILT_CODE } from "../../data";

export function TiltSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const betaRef = useRef<HTMLSpanElement>(null);
  const gammaRef = useRef<HTMLSpanElement>(null);
  const alphaRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const inView = useSectionInView(sectionRef);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const hasPermissionAPI =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (
        DeviceOrientationEvent as unknown as { requestPermission?: unknown }
      ).requestPermission === "function";
    setIsIOS(hasPermissionAPI);

    if (!hasPermissionAPI) {
      setPermissionGranted(true);
    }
  }, []);

  async function handleRequestPermission() {
    const granted = await requestOrientationPermission();
    setPermissionGranted(granted);
  }

  function handleRecalibrate() {
    recalibrateOrientation();
  }

  useEffect(() => {
    if (!inView || (!permissionGranted && isIOS)) return;

    return watchViewport(
      ({ orientation, mouse, size, scroll }) => {
        const hasSensor = orientation.beta !== 0 || orientation.gamma !== 0;

        let rx: number;
        let ry: number;

        if (hasSensor) {
          rx = orientation.beta * 0.5;
          ry = orientation.gamma * 0.5;
        } else {
          rx = (mouse.y / (size.y || 1) - 0.5) * -20;
          ry = (mouse.x / (size.x || 1) - 0.5) * 20;
        }

        rx = Math.max(-15, Math.min(15, rx));
        ry = Math.max(-15, Math.min(15, ry));

        if (cardRef.current) {
          cardRef.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }

        const normalX = (ry + 15) / 30;
        const normalY = (rx + 15) / 30;
        if (shineRef.current) {
          shineRef.current.style.background = `radial-gradient(circle at ${normalX * 100}% ${normalY * 100}%, rgba(255,255,255,0.12), transparent 60%)`;
        }

        if (betaRef.current)
          betaRef.current.textContent = orientation.beta.toFixed(1);
        if (gammaRef.current)
          gammaRef.current.textContent = orientation.gamma.toFixed(1);
        if (alphaRef.current)
          alphaRef.current.textContent = orientation.alpha.toFixed(1);

        if (codeRef.current && sectionRef.current) {
          const sectionTop =
            scroll.top + sectionRef.current.getBoundingClientRect().top;
          const offset = scroll.top - sectionTop;
          codeRef.current.style.transform = `translateY(${offset * 0.15}px)`;
        }
      },
      { only: ["orientation", "mouse", "size", "scroll"] },
    );
  }, [inView, permissionGranted, isIOS]);

  return (
    <section id="tilt" ref={sectionRef} className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <LiveBadge className="mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            3D <span className="text-gradient">Tilt</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            On mobile, the card tilts with your device orientation. On desktop,
            it follows your cursor.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div
            ref={cardRef}
            className="relative w-72 h-44 rounded-2xl glass glow-ablak select-none"
            style={{ willChange: "transform", transformStyle: "preserve-3d" }}
          >
            <div
              ref={shineRef}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ willChange: "background" }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <span className="text-xs text-zinc-400 font-mono">
                  ablak-ts
                </span>
                <span className="text-xs text-indigo-300">orientation</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient mb-1">
                  Device Tilt
                </div>
                <div className="text-xs text-zinc-500">
                  Tilt your device or move your cursor
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-mono">
            <span className="text-zinc-500">
              alpha:{" "}
              <span ref={alphaRef} className="text-data">
                0.0
              </span>
              °
            </span>
            <span className="text-zinc-500">
              beta:{" "}
              <span ref={betaRef} className="text-data">
                0.0
              </span>
              °
            </span>
            <span className="text-zinc-500">
              gamma:{" "}
              <span ref={gammaRef} className="text-data">
                0.0
              </span>
              °
            </span>
          </div>

          {isIOS && !permissionGranted && (
            <button
              onClick={() => void handleRequestPermission()}
              className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-500/30 transition-colors"
            >
              Enable Orientation (iOS)
            </button>
          )}

          {permissionGranted && (
            <button
              onClick={handleRecalibrate}
              className={cn(
                "px-4 py-2 rounded-xl text-sm transition-colors",
                "glass border-zinc-700 text-zinc-400 hover:text-zinc-200",
              )}
            >
              Recalibrate
            </button>
          )}
        </div>

        <div
          ref={codeRef}
          className="max-w-xl mx-auto mt-12"
          style={{ willChange: "transform", position: "relative", zIndex: 10 }}
        >
          <CodeBlock code={TILT_CODE} language="typescript" />
        </div>
      </div>
    </section>
  );
}
