/* Copyright (c) 2026 eele14. All Rights Reserved. */

export interface StoryBlockContent {
  label: string;
  statement: string;
  body1: string;
  body2?: string;
}

export const ELEMENTS: { start: number; dur: number }[] = [
  { start: 0.00, dur: 0.12 },
  { start: 0.10, dur: 0.20 },
  { start: 0.30, dur: 0.15 },
  { start: 0.35, dur: 0.25 },
  { start: 0.55, dur: 0.30 },
];

interface StoryBlockProps {
  content: StoryBlockContent;
  contentRef: (el: HTMLDivElement | null) => void;
  getElemRef: (i: number) => (el: HTMLDivElement | null) => void;
}

export function StoryBlock({ content, contentRef, getElemRef }: StoryBlockProps) {
  return (
    <div
      ref={contentRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="w-full max-w-2xl px-8">
        <div
          ref={getElemRef(0)}
          className="mb-6"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-indigo-400 uppercase">
            {content.label}
          </span>
        </div>

        <div
          ref={getElemRef(1)}
          className="mb-8"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gradient">
            {content.statement}
          </h2>
        </div>

        <div
          ref={getElemRef(2)}
          className="mb-8"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <div className="h-px w-12 bg-indigo-500/50" />
        </div>

        <div
          ref={getElemRef(3)}
          className="mb-6"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <p className="text-lg text-zinc-300 leading-relaxed">{content.body1}</p>
        </div>

        <div
          ref={getElemRef(4)}
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          {content.body2 && (
            <p className="text-lg text-zinc-400 leading-relaxed">{content.body2}</p>
          )}
        </div>
      </div>
    </div>
  );
}
