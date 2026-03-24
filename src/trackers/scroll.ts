/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type { ScrollData } from "../types";

export interface ScrollTracker {
  tick(): void;
  getData(): ScrollData;
}

export function createScrollTracker(): ScrollTracker {
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;
  let changed = false;

  let viewportWidth = 0;
  let viewportHeight = 0;

  function tick(): void {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;

    const currX = window.scrollX;
    const currY = window.scrollY;

    changed = false;

    if (currX === lastX && velX !== 0) {
      velX = 0;
      changed = true;
    }
    if (currY === lastY && velY !== 0) {
      velY = 0;
      changed = true;
    }

    if (currX !== lastX) {
      velX = Math.floor(currX - lastX);
      lastX = currX;
      changed = true;
    }
    if (currY !== lastY) {
      velY = Math.floor(currY - lastY);
      lastY = currY;
      changed = true;
    }
  }

  function getData(): ScrollData {
    return {
      changed,
      left: Math.floor(lastX),
      right: Math.floor(lastX + viewportWidth),
      top: Math.floor(lastY),
      bottom: Math.floor(lastY + viewportHeight),
      velocity: { x: velX, y: velY },
    };
  }

  return { tick, getData };
}
