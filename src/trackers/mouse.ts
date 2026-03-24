/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type { MouseData } from "../types";
import { throttle } from "../utils/throttle";
import { VelocityBuffer } from "../utils/velocity";

export interface MouseTracker {
  tick(): void;
  getData(): MouseData;
  destroy(): void;
}

export function createMouseTracker(
  throttleDelay: number,
  velocityBufferSize: number,
): MouseTracker {
  let lastX = 0;
  let lastY = 0;
  let currX = 0;
  let currY = 0;
  let lastVelX = 0;
  let lastVelY = 0;
  let changed = false;

  const velX = new VelocityBuffer(velocityBufferSize);
  const velY = new VelocityBuffer(velocityBufferSize);

  const onMouseMove = throttle(throttleDelay, (e: MouseEvent) => {
    currX = e.clientX;
    currY = e.clientY;
  });

  window.addEventListener("mousemove", onMouseMove);

  function tick(): void {
    changed = false;

    // Always push, even if 0
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

    // Velocity mean changed (catches the deceleration frames after stopping)
    if (meanX !== lastVelX) {
      lastVelX = meanX;
      changed = true;
    }
    if (meanY !== lastVelY) {
      lastVelY = meanY;
      changed = true;
    }
  }

  function getData(): MouseData {
    return {
      changed,
      x: Math.floor(lastX),
      y: Math.floor(lastY),
      velocity: { x: lastVelX, y: lastVelY },
    };
  }

  function destroy(): void {
    window.removeEventListener("mousemove", onMouseMove);
  }

  return { tick, getData, destroy };
}
