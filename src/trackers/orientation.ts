/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type { OrientationData } from "../types";

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission(): Promise<PermissionState>;
};

export async function requestOrientationPermission(): Promise<boolean> {
  if (
    typeof DeviceOrientationEvent === "undefined" ||
    typeof (DeviceOrientationEvent as unknown as IOSDeviceOrientationEvent)
      .requestPermission !== "function"
  ) {
    return true;
  }
  const result = await (
    DeviceOrientationEvent as unknown as IOSDeviceOrientationEvent
  ).requestPermission();
  return result === "granted";
}

export interface OrientationCalibration {
  prev: { alpha: number; beta: number; gamma: number };
  current: { alpha: number; beta: number; gamma: number };
}

export interface OrientationTracker {
  tick(): void;
  getData(): OrientationData;
  recalibrate(): OrientationCalibration;
  destroy(): void;
}

export function createOrientationTracker(): OrientationTracker {
  let lastAlpha = 0;
  let lastBeta = 0;
  let lastGamma = 0;
  let currAlpha = 0;
  let currBeta = 0;
  let currGamma = 0;
  let initialAlpha = 0;
  let initialBeta = 0;
  let initialGamma = 0;
  let calibrated = false;
  let changed = false;

  function onOrientation(e: DeviceOrientationEvent): void {
    const alpha = e.alpha ?? 0;
    const beta = e.beta ?? 0;
    const gamma = e.gamma ?? 0;

    if (!calibrated) {
      initialAlpha = alpha;
      initialBeta = beta;
      initialGamma = gamma;
      calibrated = true;
    }

    currAlpha = alpha;
    currBeta = beta;
    currGamma = gamma;
  }

  window.addEventListener("deviceorientation", onOrientation);

  function tick(): void {
    changed = false;

    if (currAlpha !== lastAlpha) {
      lastAlpha = currAlpha;
      changed = true;
    }
    if (currBeta !== lastBeta) {
      lastBeta = currBeta;
      changed = true;
    }
    if (currGamma !== lastGamma) {
      lastGamma = currGamma;
      changed = true;
    }
  }

  function getData(): OrientationData {
    return {
      changed,
      alpha: Math.floor(lastAlpha - initialAlpha),
      beta: Math.floor(lastBeta - initialBeta),
      gamma: Math.floor(lastGamma - initialGamma),
    };
  }

  function recalibrate(): OrientationCalibration {
    const prev = {
      alpha: initialAlpha,
      beta: initialBeta,
      gamma: initialGamma,
    };
    initialAlpha = lastAlpha;
    initialBeta = lastBeta;
    initialGamma = lastGamma;
    const current = {
      alpha: initialAlpha,
      beta: initialBeta,
      gamma: initialGamma,
    };
    return { prev, current };
  }

  function destroy(): void {
    window.removeEventListener("deviceorientation", onOrientation);
  }

  return { tick, getData, recalibrate, destroy };
}
