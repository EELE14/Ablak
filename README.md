# ablak

> The Hungarian word for *window*.

A zero-dependency viewport tracker that fires once per animation frame. Scroll, mouse, window position, orientation, device pixel ratio — all in one callback. 2 kB gzipped.

```ts
import { watchViewport } from "ablak-ts";

const stop = watchViewport(({ scroll, mouse }) => {
  element.style.transform = `translateY(${scroll.top * -0.3}px)`;
  cursor.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
});

// Later:
stop();
```

## Why ablak

Most viewport effects bind directly to `scroll`, `resize`, and `mousemove` events — which can fire dozens of times per frame, trigger layout thrashing, and run even when nothing visible has changed.

ablak takes a different approach: it captures the latest values from every source and delivers them together inside a single `requestAnimationFrame` loop. Your callback runs at most once per frame, only when something actually changed.

- **One loop** — all data sources share a single rAF tick
- **Change-filtered** — callbacks only fire when at least one tracked value changed
- **Selective subscriptions** — `only: ["scroll"]` means you never pay for mouse or orientation updates you don't need
- **SSR-safe** — no-ops on the server, no `window` access at import time
- **Zero dependencies** — 2 kB gzipped

---

## Installation

```bash
npm install ablak-ts
```

---

## API

### `watchViewport(callback, options?): Unsubscribe`

Subscribe to viewport changes. The callback receives the full `ViewportState` on every frame that something changed.

```ts
const stop = watchViewport((state) => {
  console.log(state.scroll.top, state.mouse.x);
});

stop(); // unsubscribe
```

**Options**

| Option | Type | Description |
|--------|------|-------------|
| `only` | `WatchKey[]` | Only fire when at least one of these categories changed |
| `once` | `boolean` | Fire immediately with the current state, then unsubscribe |

```ts
// Only fires when scroll or size changes — mouse updates are ignored
watchViewport(({ scroll, size }) => { ... }, { only: ["scroll", "size"] });

// Fires once with the current state
watchViewport((state) => { ... }, { once: true });
```

---

### `getViewportState(): ViewportState`

Returns the current viewport state snapshot without subscribing.

```ts
const state = getViewportState();
console.log(state.scroll.top);
```

---

### `recalibrateOrientation(): OrientationCalibration | null`

Sets the current device orientation as the new zero baseline. Useful for tilt-based UI where the user's resting position is unknown.

```ts
button.addEventListener("click", () => {
  recalibrateOrientation();
});
```

---

### `requestOrientationPermission(): Promise<boolean>`

Requests `DeviceOrientationEvent` permission on iOS 13+. Must be called from a user gesture (e.g. a button click). Returns `true` if granted.

```ts
button.addEventListener("click", async () => {
  const granted = await requestOrientationPermission();
  if (granted) console.log("orientation active");
});
```

---

### `destroyAblak(): void`

Stops the global rAF loop and removes all subscribers. Useful in single-page apps when you need a full teardown.

```ts
destroyAblak();
```

---

### `createAblak(config?): Tracker`

Creates an independent `Tracker` instance with its own rAF loop. Use this instead of the global singleton when you need multiple isolated instances or custom configuration.

```ts
import { createAblak } from "ablak-ts";

const tracker = createAblak({ throttleMouse: 32, velocityBufferSize: 8 });
const stop = tracker.watch(({ scroll }) => { ... });

tracker.destroy(); // tears down this instance only
```

**Config**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `throttleMouse` | `number` | `75` | Mousemove throttle in ms |
| `velocityBufferSize` | `number` | `5` | Frames used to average velocity |

---

## ViewportState

Every callback and `getViewportState()` returns this object:

```ts
interface ViewportState {
  scroll:          ScrollData;
  size:            SizeData;
  mouse:           MouseData;
  position:        PositionData;
  orientation:     OrientationData;
  devicePixelRatio: DevicePixelRatioData;
}
```

Every sub-object has a `changed: boolean` field that is `true` only on frames where that category's values actually changed.

### `scroll`

| Field | Type | Description |
|-------|------|-------------|
| `top` | `number` | `window.scrollY` |
| `left` | `number` | `window.scrollX` |
| `bottom` | `number` | `scrollY + innerHeight` |
| `right` | `number` | `scrollX + innerWidth` |
| `velocity.x` | `number` | Horizontal scroll speed (px/frame) |
| `velocity.y` | `number` | Vertical scroll speed (px/frame) |

### `size`

| Field | Type | Description |
|-------|------|-------------|
| `x` | `number` | Viewport width (`window.innerWidth`) |
| `y` | `number` | Viewport height (`window.innerHeight`) |
| `docY` | `number` | Full document height (`document.body.scrollHeight`) |

### `mouse`

| Field | Type | Description |
|-------|------|-------------|
| `x` | `number` | Cursor X (relative to viewport) |
| `y` | `number` | Cursor Y (relative to viewport) |
| `velocity.x` | `number` | Horizontal cursor speed (px/frame) |
| `velocity.y` | `number` | Vertical cursor speed (px/frame) |

### `position`

Window position on the physical screen, useful for multi-monitor setups.

| Field | Type | Description |
|-------|------|-------------|
| `left` | `number` | `window.screenX` |
| `top` | `number` | `window.screenY` |
| `right` | `number` | `screenX + innerWidth` |
| `bottom` | `number` | `screenY + innerHeight` |
| `velocity.x` | `number` | Horizontal window movement speed (px/frame) |
| `velocity.y` | `number` | Vertical window movement speed (px/frame) |

### `orientation`

Device orientation, relative to the calibration baseline set by `recalibrateOrientation()`.

| Field | Type | Description |
|-------|------|-------------|
| `alpha` | `number` | Rotation around Z axis (compass heading, 0–360°) |
| `beta` | `number` | Rotation around X axis (front-to-back tilt, -180–180°) |
| `gamma` | `number` | Rotation around Y axis (left-to-right tilt, -90–90°) |

### `devicePixelRatio`

| Field | Type | Description |
|-------|------|-------------|
| `ratio` | `number` | `window.devicePixelRatio` |

---

## Usage with React

ablak is framework-agnostic. For React, use `useEffect` + the unsubscribe return value:

```ts
import { useEffect, useRef } from "react";
import { watchViewport } from "ablak-ts";

function ParallaxCard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return watchViewport(({ scroll }) => {
      if (ref.current) {
        ref.current.style.transform = `translateY(${scroll.top * 0.2}px)`;
      }
    }, { only: ["scroll"] });
  }, []);

  return <div ref={ref}>...</div>;
}
```

> For effects that update the DOM directly (animations, canvas, transforms), **never** put ablak data into React state — it causes unnecessary re-renders. Use refs and direct style mutations instead.

---

## Usage with Vue

```ts
import { onMounted, onUnmounted, ref } from "vue";
import { watchViewport } from "ablak-ts";

export function useScrollTop() {
  const scrollTop = ref(0);
  let stop: (() => void) | undefined;

  onMounted(() => {
    stop = watchViewport(({ scroll }) => {
      scrollTop.value = scroll.top;
    }, { only: ["scroll"] });
  });

  onUnmounted(() => stop?.());

  return scrollTop;
}
```

---

## License

AGPL-3.0-only — © 2026 eele14
