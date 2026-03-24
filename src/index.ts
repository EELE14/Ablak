/* Copyright (c) 2026 eele14. All Rights Reserved. */
export type {
  VelocityData,
  ScrollData,
  SizeData,
  MouseData,
  PositionData,
  OrientationData,
  DevicePixelRatioData,
  ViewportState,
  WatchKey,
  WatchOptions,
  AblakConfig,
  ViewportCallback,
  Unsubscribe,
} from "./types";

export { Tracker } from "./tracker";
export { requestOrientationPermission } from "./trackers/orientation";

import { Tracker } from "./tracker";
import { isSSR } from "./utils/ssr";
import type {
  AblakConfig,
  ViewportCallback,
  ViewportState,
  WatchOptions,
  Unsubscribe,
} from "./types";
import type { OrientationCalibration } from "./trackers/orientation";

// creates tracker instance
export function createAblak(config?: AblakConfig): Tracker {
  return new Tracker(config);
}

let _singleton: Tracker | null = null;

function getSingleton(): Tracker {
  if (!_singleton) {
    _singleton = new Tracker();
  }
  return _singleton;
}

export function watchViewport(
  callback: ViewportCallback,
  options?: WatchOptions,
): Unsubscribe {
  if (isSSR) return () => undefined;
  return getSingleton().watch(callback, options);
}

export function getViewportState(): ViewportState {
  if (isSSR) {
    return {
      scroll: {
        changed: false,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        velocity: { x: 0, y: 0 },
      },
      size: { changed: false, x: 0, y: 0, docY: 0 },
      mouse: { changed: false, x: 0, y: 0, velocity: { x: 0, y: 0 } },
      position: {
        changed: false,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        velocity: { x: 0, y: 0 },
      },
      orientation: { changed: false, alpha: 0, beta: 0, gamma: 0 },
      devicePixelRatio: { changed: false, ratio: 1 },
    };
  }
  return getSingleton().getViewportState();
}

export function recalibrateOrientation(): OrientationCalibration | null {
  if (isSSR) return null;
  return getSingleton().recalibrateOrientation();
}

export function destroyAblak(): void {
  if (_singleton) {
    _singleton.destroy();
    _singleton = null;
  }
}
