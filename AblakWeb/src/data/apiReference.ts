/* Copyright (c) 2026 eele14. All Rights Reserved. */

export interface ApiFunction {
  name: string;
  signature: string;
  description: string;
  code: string;
}

export interface ApiType {
  name: string;
  fields: { name: string; type: string; description: string }[];
}

export const API_FUNCTIONS: ApiFunction[] = [
  {
    name: "watchViewport",
    signature: "watchViewport(callback, options?) → Unsubscribe",
    description:
      "Subscribe to viewport changes on the shared singleton. Returns an unsubscribe function. The callback fires every animation frame when any tracked value changes.",
    code: `const stop = watchViewport(({ scroll, mouse, size }) => {
  if (scroll.changed) {
    element.style.transform = \`translateY(\${scroll.top * -0.3}px)\`;
  }
});

// Unsubscribe when done
stop();`,
  },
  {
    name: "getViewportState",
    signature: "getViewportState() → ViewportState",
    description:
      "Returns a one-time snapshot of the current viewport state without subscribing to updates.",
    code: `const state = getViewportState();
console.log(state.scroll.top);     // current scroll position
console.log(state.size.x);         // viewport width
console.log(state.mouse.x);        // mouse X`,
  },
  {
    name: "createAblak",
    signature: "createAblak(config?) → Tracker",
    description:
      "Creates an independent Tracker instance. Use this when you need isolated tracking with custom configuration, separate from the global singleton.",
    code: `const tracker = createAblak({
  throttleMouse: 50,       // ms between mouse updates
  velocityBufferSize: 8,   // rolling average samples
});

const stop = tracker.watch(({ scroll }) => {
  console.log(scroll.velocity.y);
});`,
  },
  {
    name: "requestOrientationPermission",
    signature: "requestOrientationPermission() → Promise<boolean>",
    description:
      "Requests device orientation permission on iOS 13+. Must be called from a user gesture (button click). Returns true if granted or if no permission is required (Android, desktop).",
    code: `button.addEventListener("click", async () => {
  const granted = await requestOrientationPermission();
  if (granted) {
    watchViewport(({ orientation }) => {
      card.style.transform =
        \`rotateX(\${orientation.beta * 0.5}deg) rotateY(\${orientation.gamma * 0.5}deg)\`;
    });
  }
});`,
  },
  {
    name: "recalibrateOrientation",
    signature: "recalibrateOrientation() → OrientationCalibration | null",
    description:
      "Resets the device orientation calibration baseline to the current position. All subsequent orientation values are relative to this new baseline.",
    code: `// Current tilt becomes the new "neutral" position
const calibration = recalibrateOrientation();
console.log(calibration?.prev);    // old baseline
console.log(calibration?.current); // new baseline`,
  },
  {
    name: "destroyAblak",
    signature: "destroyAblak() → void",
    description:
      "Destroys the singleton tracker: cancels the rAF loop, removes all event listeners, and clears all subscribers. The singleton resets so the next call creates a fresh instance.",
    code: `// Clean up completely (e.g. on SPA route change)
destroyAblak();`,
  },
];

export const API_TYPES: ApiType[] = [
  {
    name: "ScrollData",
    fields: [
      { name: "changed", type: "boolean", description: "True if any value changed this frame" },
      { name: "left", type: "number", description: "window.scrollX (left edge)" },
      { name: "right", type: "number", description: "scrollX + viewport width (right edge)" },
      { name: "top", type: "number", description: "window.scrollY (top edge)" },
      { name: "bottom", type: "number", description: "scrollY + viewport height (bottom edge)" },
      { name: "velocity", type: "VelocityData", description: "Raw per-frame scroll delta in px" },
    ],
  },
  {
    name: "SizeData",
    fields: [
      { name: "changed", type: "boolean", description: "True if viewport size changed" },
      { name: "x", type: "number", description: "Viewport width (window.innerWidth)" },
      { name: "y", type: "number", description: "Viewport height (window.innerHeight)" },
      { name: "docY", type: "number", description: "Document scroll height (document.body.scrollHeight)" },
    ],
  },
  {
    name: "MouseData",
    fields: [
      { name: "changed", type: "boolean", description: "True if mouse moved or velocity changed" },
      { name: "x", type: "number", description: "Mouse X relative to viewport" },
      { name: "y", type: "number", description: "Mouse Y relative to viewport" },
      { name: "velocity", type: "VelocityData", description: "Rolling average velocity in px/frame" },
    ],
  },
  {
    name: "PositionData",
    fields: [
      { name: "changed", type: "boolean", description: "True if window position or velocity changed" },
      { name: "left", type: "number", description: "window.screenX" },
      { name: "right", type: "number", description: "screenX + viewport width" },
      { name: "top", type: "number", description: "window.screenY" },
      { name: "bottom", type: "number", description: "screenY + viewport height" },
      { name: "velocity", type: "VelocityData", description: "Rolling average window movement velocity" },
    ],
  },
  {
    name: "OrientationData",
    fields: [
      { name: "changed", type: "boolean", description: "True if device orientation changed" },
      { name: "alpha", type: "number", description: "Z-axis rotation (relative to calibration)" },
      { name: "beta", type: "number", description: "X-axis tilt (relative to calibration)" },
      { name: "gamma", type: "number", description: "Y-axis tilt (relative to calibration)" },
    ],
  },
  {
    name: "VelocityData",
    fields: [
      { name: "x", type: "number", description: "Horizontal velocity in px/frame" },
      { name: "y", type: "number", description: "Vertical velocity in px/frame" },
    ],
  },
  {
    name: "WatchOptions",
    fields: [
      { name: "only?", type: "WatchKey[]", description: 'Filter callbacks to specific keys: "scroll" | "size" | "mouse" | "position" | "orientation" | "devicePixelRatio"' },
      { name: "once?", type: "boolean", description: "Unsubscribe automatically after first invocation" },
    ],
  },
];
