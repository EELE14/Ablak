/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type { SizeData } from "../types";

export interface SizeTracker {
  tick(): void;
  getData(): SizeData;
  destroy(): void;
}

export function createSizeTracker(): SizeTracker {
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  let changed = false;

  function tick(): void {
    changed = false;

    const currWidth = window.innerWidth;
    const currHeight = window.innerHeight;

    if (currWidth !== lastWidth) {
      lastWidth = currWidth;
      changed = true;
    }

    if (currHeight !== lastHeight) {
      lastHeight = currHeight;
      changed = true;
    }
  }

  function getData(): SizeData {
    return {
      changed,
      x: lastWidth,
      y: lastHeight,
      docY: Math.floor(document.body.scrollHeight),
    };
  }

  // No external resources to release
  function destroy(): void {}

  return { tick, getData, destroy };
}
