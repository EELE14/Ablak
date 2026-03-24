/* Copyright (c) 2026 eele14. All Rights Reserved. */
import type {
  ViewportState,
  ScrollData,
  SizeData,
  MouseData,
  PositionData,
  OrientationData,
  DevicePixelRatioData,
} from "./types";

export interface Store {
  assemble(
    scroll: ScrollData,
    size: SizeData,
    mouse: MouseData,
    position: PositionData,
    orientation: OrientationData,
    dpr: DevicePixelRatioData,
  ): ViewportState;

  withAllChanged(state: ViewportState): ViewportState;
}

export function createStore(): Store {
  function assemble(
    scroll: ScrollData,
    size: SizeData,
    mouse: MouseData,
    position: PositionData,
    orientation: OrientationData,
    dpr: DevicePixelRatioData,
  ): ViewportState {
    return {
      scroll,
      size,
      mouse,
      position,
      orientation,
      devicePixelRatio: dpr,
    };
  }

  function withAllChanged(state: ViewportState): ViewportState {
    return {
      scroll: { ...state.scroll, changed: true },
      size: { ...state.size, changed: true },
      mouse: { ...state.mouse, changed: true },
      position: { ...state.position, changed: true },
      orientation: { ...state.orientation, changed: true },
      devicePixelRatio: { ...state.devicePixelRatio, changed: true },
    };
  }

  return { assemble, withAllChanged };
}
