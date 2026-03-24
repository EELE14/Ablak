/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useState } from "react";
import { ScrollProgressBar, ParallaxOrbs } from "../components/ui";
import type { OrbDef } from "../components/ui";
import { Header, Footer } from "../components/layout";
import {
  HeroSection,
  StorySection,
  ParallaxSection,
  CursorSection,
  ScrollAnimSection,
  TiltSection,
  VelocitySection,
  WindowPositionSection,
  ApiReferenceSection,
} from "../components/sections";
import { useMobile } from "../hooks";

const ORBS: OrbDef[] = [
  {
    top: "10%",
    left: "75%",
    size: 500,
    color: "rgba(99,102,241,0.12)",
    speed: 0.04,
  },
  {
    top: "35%",
    left: "5%",
    size: 400,
    color: "rgba(34,211,238,0.09)",
    speed: 0.07,
  },
  {
    top: "60%",
    left: "60%",
    size: 600,
    color: "rgba(99,102,241,0.08)",
    speed: 0.03,
  },
  {
    top: "90%",
    left: "20%",
    size: 450,
    color: "rgba(34,211,238,0.10)",
    speed: 0.06,
  },
  {
    top: "120%",
    left: "70%",
    size: 500,
    color: "rgba(139,92,246,0.09)",
    speed: 0.05,
  },
  {
    top: "155%",
    left: "10%",
    size: 550,
    color: "rgba(99,102,241,0.07)",
    speed: 0.08,
  },
  {
    top: "190%",
    left: "55%",
    size: 400,
    color: "rgba(34,211,238,0.08)",
    speed: 0.04,
  },
  {
    top: "230%",
    left: "30%",
    size: 500,
    color: "rgba(139,92,246,0.10)",
    speed: 0.06,
  },
];

export default function AblakDemo() {
  const isMobile = useMobile();
  const [showFull, setShowFull] = useState(false);

  const mobileOnly = isMobile && !showFull;

  return (
    <div className="min-h-screen bg-surface text-zinc-100">
      <ParallaxOrbs orbs={ORBS} />
      <ScrollProgressBar />
      <Header mobileOnly={mobileOnly} />

      <main>
        <HeroSection />
        <StorySection />

        {!mobileOnly && (
          <>
            <ParallaxSection />
            <CursorSection />
            <ScrollAnimSection />
          </>
        )}

        <TiltSection />

        {!mobileOnly && (
          <>
            <VelocitySection />
            <WindowPositionSection />
            <ApiReferenceSection />
          </>
        )}
      </main>

      <Footer onShowFull={mobileOnly ? () => setShowFull(true) : undefined} />
    </div>
  );
}
