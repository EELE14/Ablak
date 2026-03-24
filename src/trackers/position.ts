/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type { PositionData } from "../types";
import { VelocityBuffer } from "../utils/velocity";

export interface PositionTracker {
  tick(): void;
  getData(): PositionData;
}

export function createPositionTracker(
  velocityBufferSize: number,
): PositionTracker {
  let lastX = window.screenX ?? 0;
  let lastY = window.screenY ?? 0;
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  let lastVelX = 0;
  let lastVelY = 0;
  let changed = false;

  const velX = new VelocityBuffer(velocityBufferSize);
  const velY = new VelocityBuffer(velocityBufferSize);

  function tick(): void {
    changed = false;

    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;

    const currX = window.screenX ?? 0;
    const currY = window.screenY ?? 0;

    velX.push(currX - lastX);
    velY.push(currY - lastY);

    const meanX = velX.getMean();
    const meanY = velY.getMean();

    // Position changed
    if (currX !== lastX) {
      lastX = currX;
      changed = true;
    }
    if (currY !== lastY) {
      lastY = currY;
      changed = true;
    }

    if (meanX !== lastVelX) {
      lastVelX = meanX;
      changed = true;
    }
    if (meanY !== lastVelY) {
      lastVelY = meanY;
      changed = true;
    }
  }

  function getData(): PositionData {
    return {
      changed,
      left: Math.floor(lastX),
      right: Math.floor(lastX + lastWidth),
      top: Math.floor(lastY),
      bottom: Math.floor(lastY + lastHeight),
      velocity: { x: lastVelX, y: lastVelY },
    };
  }

  return { tick, getData };
}
