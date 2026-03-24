/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useRef, useState } from "react";
import { watchViewport } from "ablak";
import type { ViewportState, WatchOptions } from "ablak";

const emptyState: ViewportState = {
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

export function useAblakRef(
  options?: WatchOptions,
): React.RefObject<ViewportState> {
  const ref = useRef<ViewportState>(emptyState);

  useEffect(() => {
    return watchViewport((state) => {
      ref.current = state;
    }, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export function useAblakState(options?: WatchOptions): ViewportState {
  const [state, setState] = useState<ViewportState>(emptyState);

  useEffect(() => {
    return watchViewport((s) => {
      setState(s);
    }, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
