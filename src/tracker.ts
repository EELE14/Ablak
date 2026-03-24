/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type {
  AblakConfig,
  ViewportCallback,
  ViewportState,
  WatchKey,
  WatchOptions,
  Unsubscribe,
} from "./types";
import { isSSR } from "./utils/ssr";
import { createStore } from "./store";
import type { ScrollTracker } from "./trackers/scroll";
import type { SizeTracker } from "./trackers/size";
import type { MouseTracker } from "./trackers/mouse";
import type { PositionTracker } from "./trackers/position";
import type {
  OrientationTracker,
  OrientationCalibration,
} from "./trackers/orientation";
import type { DprTracker } from "./trackers/dpr";
import { createScrollTracker } from "./trackers/scroll";
import { createSizeTracker } from "./trackers/size";
import { createMouseTracker } from "./trackers/mouse";
import { createPositionTracker } from "./trackers/position";
import {
  createOrientationTracker,
  requestOrientationPermission,
} from "./trackers/orientation";
import { createDprTracker } from "./trackers/dpr";

const DEFAULTS = {
  throttleMouse: 75,
  velocityBufferSize: 5,
} satisfies Required<AblakConfig>;

interface Subscriber {
  callback: ViewportCallback;
  options: WatchOptions;
}

export class Tracker {
  private readonly store = createStore();

  private readonly scroll: ScrollTracker | undefined;
  private readonly size: SizeTracker | undefined;
  private readonly mouse: MouseTracker | undefined;
  private readonly position: PositionTracker | undefined;
  private readonly orientation: OrientationTracker | undefined;
  private readonly dpr: DprTracker | undefined;

  private readonly subscribers: Set<Subscriber> = new Set();
  private rafId = 0;
  private destroyed = false;
  private lastState: ViewportState | null = null;

  constructor(config: AblakConfig = {}) {
    if (isSSR) return;

    const throttleMouse = config.throttleMouse ?? DEFAULTS.throttleMouse;
    const bufferSize = config.velocityBufferSize ?? DEFAULTS.velocityBufferSize;

    this.scroll = createScrollTracker();
    this.size = createSizeTracker();
    this.mouse = createMouseTracker(throttleMouse, bufferSize);
    this.position = createPositionTracker(bufferSize);
    this.orientation = createOrientationTracker();
    this.dpr = createDprTracker();

    this.update = this.update.bind(this);
    this.rafId = requestAnimationFrame(this.update);
  }

  watch(callback: ViewportCallback, options: WatchOptions = {}): Unsubscribe {
    if (typeof callback !== "function") {
      throw new TypeError(
        "ablak: watch() requires a function as its first argument.",
      );
    }

    if (isSSR) return () => undefined;

    if (this.destroyed) {
      throw new Error("ablak: watch() called on a destroyed Tracker instance.");
    }

    const allChanged = this.store.withAllChanged(this.getViewportState());

    if (options.once) {
      callback(allChanged);
      return () => undefined;
    }

    const subscriber: Subscriber = { callback, options };
    callback(allChanged);
    this.subscribers.add(subscriber);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  getViewportState(): ViewportState {
    if (!this.scroll) return this.emptyState();
    return this.lastState ?? this.buildState();
  }

  requestOrientationPermission(): Promise<boolean> {
    return requestOrientationPermission();
  }

  recalibrateOrientation(): OrientationCalibration | null {
    if (!this.orientation) return null;
    return this.orientation.recalibrate();
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;

    if (!isSSR) cancelAnimationFrame(this.rafId);

    this.subscribers.clear();
    this.size?.destroy();
    this.mouse?.destroy();
    this.orientation?.destroy();
  }

  private update(): void {
    if (this.destroyed || !this.scroll) return;

    this.scroll.tick();
    this.size!.tick();
    this.mouse!.tick();
    this.position!.tick();
    this.orientation!.tick();
    this.dpr!.tick();

    const state = this.buildState();
    this.lastState = state;

    const anyChanged =
      state.scroll.changed ||
      state.size.changed ||
      state.mouse.changed ||
      state.position.changed ||
      state.orientation.changed ||
      state.devicePixelRatio.changed;

    if (anyChanged) {
      this.dispatch(state);
    }

    if (!this.destroyed) {
      this.rafId = requestAnimationFrame(this.update);
    }
  }

  private buildState(): ViewportState {
    return this.store.assemble(
      this.scroll!.getData(),
      this.size!.getData(),
      this.mouse!.getData(),
      this.position!.getData(),
      this.orientation!.getData(),
      this.dpr!.getData(),
    );
  }

  private dispatch(state: ViewportState): void {
    for (const subscriber of Array.from(this.subscribers)) {
      const { callback, options } = subscriber;
      if (this.shouldFire(state, options.only)) {
        callback(state);
      }
    }
  }

  private shouldFire(state: ViewportState, only?: WatchKey[]): boolean {
    if (!only || only.length === 0) return true;
    return only.some((key) => state[key].changed);
  }

  private emptyState(): ViewportState {
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
}
