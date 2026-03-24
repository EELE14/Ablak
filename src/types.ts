/* Copyright (c) 2026 eele14. All Rights Reserved. */
export interface VelocityData {
  x: number;
  y: number;
}

export interface ScrollData {
  changed: boolean;
  left: number;
  right: number;
  top: number;
  bottom: number;
  velocity: VelocityData;
}

export interface SizeData {
  changed: boolean;
  /** Viewport width */
  x: number;
  /** Viewport height */
  y: number;
  /** document.body.scrollHeight */
  docY: number;
}

export interface MouseData {
  changed: boolean;
  x: number;
  y: number;
  velocity: VelocityData;
}

export interface PositionData {
  changed: boolean;
  /** window.screenX */
  left: number;
  /** window.screenX + viewport width */
  right: number;
  /** window.screenY */
  top: number;
  /** window.screenY + viewport height */
  bottom: number;
  velocity: VelocityData;
}

export interface OrientationData {
  changed: boolean;
  /** Relative to calibration baseline */
  alpha: number;
  beta: number;
  gamma: number;
}

export interface DevicePixelRatioData {
  changed: boolean;
  ratio: number;
}

export interface ViewportState {
  scroll: ScrollData;
  size: SizeData;
  mouse: MouseData;
  position: PositionData;
  orientation: OrientationData;
  devicePixelRatio: DevicePixelRatioData;
}

export type WatchKey = keyof ViewportState;

export interface WatchOptions {
  /** Only fire when at least one of these categories changed */
  only?: WatchKey[];
  once?: boolean;
}

export interface AblakConfig {
  // Throttle delay for mousemove
  throttleMouse?: number;
  velocityBufferSize?: number;
}

export type ViewportCallback = (state: ViewportState) => void;
export type Unsubscribe = () => void;
