/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type { DevicePixelRatioData } from "../types";

export interface DprTracker {
  tick(): void;
  getData(): DevicePixelRatioData;
}

export function createDprTracker(): DprTracker {
  let lastRatio = Math.max(window.devicePixelRatio || 1, 1);
  let changed = false;

  function tick(): void {
    changed = false;

    const curr = Math.max(window.devicePixelRatio || 1, 1);
    if (curr !== lastRatio) {
      lastRatio = curr;
      changed = true;
    }
  }

  function getData(): DevicePixelRatioData {
    return {
      changed,
      ratio: lastRatio,
    };
  }

  return { tick, getData };
}
