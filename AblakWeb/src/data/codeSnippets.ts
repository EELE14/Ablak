/* Copyright (c) 2026 eele14. All Rights Reserved. */

export const HERO_CODE = `import { watchViewport } from "ablak-ts";

const stop = watchViewport(({ scroll, mouse }) => {
  hero.style.transform =
    \`translateY(\${scroll.top * -0.3}px)\`;
  spotlight.style.background =
    \`radial-gradient(at \${mouse.x}px \${mouse.y}px, ...)\`;
});`;

export const PARALLAX_CODE = `watchViewport(({ scroll }) => {
  // Each layer moves at a different speed
  slow.style.transform =
    \`translateY(\${(scroll.top - sectionTop) * 0.4}px)\`;
  mid.style.transform =
    \`translateY(\${(scroll.top - sectionTop) * 0.65}px)\`;
  fast.style.transform =
    \`translateY(\${(scroll.top - sectionTop) * 1.0}px)\`;
}, { only: ["scroll"] });`;

export const CURSOR_CODE = `watchViewport(({ mouse }) => {
  // Spotlight follows cursor
  container.style.background =
    \`radial-gradient(circle at \${mouse.x}px \${mouse.y}px,
       rgba(99,102,241,0.15), transparent 400px)\`;

  // Each card tilts based on mouse distance
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = (mouse.y - cy) / 20;
    const ry = (cx - mouse.x) / 20;
    card.style.transform =
      \`rotateX(\${rx}deg) rotateY(\${ry}deg)\`;
  });
}, { only: ["mouse"] });`;

export const SCROLL_ANIM_CODE = `watchViewport(({ scroll, size }) => {
  const sectionTop = section.offsetTop;
  const range = size.y * 1.5;
  const progress = Math.max(0, Math.min(1,
    (scroll.top - sectionTop) / range
  ));

  // Counter scrubs from 0 to 1,000,000
  counter.textContent =
    Math.floor(progress * 1_000_000).toLocaleString();

  // Progress bar width
  bar.style.width = \`\${progress * 100}%\`;

  // Word reveal, fully reversible
  words.forEach((word, i) => {
    word.style.opacity =
      progress > i / words.length ? "1" : "0.1";
  });
}, { only: ["scroll", "size"] });`;

export const TILT_CODE = `// IOS requires permission from user
const granted = await requestOrientationPermission();

watchViewport(({ orientation, mouse, size }) => {
  // Mobile: use device tilt
  let rx = orientation.beta * 0.5;
  let ry = orientation.gamma * 0.5;

  // Desktop fallback: use mouse position
  if (!hasSensor) {
    rx = ((mouse.y / size.y) - 0.5) * -20;
    ry = ((mouse.x / size.x) - 0.5) * 20;
  }

  // Clamp to 15 degrees
  rx = Math.max(-15, Math.min(15, rx));
  ry = Math.max(-15, Math.min(15, ry));

  card.style.transform =
    \`perspective(800px) rotateX(\${rx}deg) rotateY(\${ry}deg)\`;
});`;

export const VELOCITY_CODE = `// Spring-physics blobs driven by scroll velocity
const blobs = [{ x, y, vx: 0, vy: 0, homeX, homeY }];

watchViewport(({ scroll, mouse }) => {
  const scrollVel = scroll.velocity.y;

  blobs.forEach(blob => {
    const fx = (blob.homeX - blob.x) * 0.08;
    const fy = (blob.homeY - blob.y) * 0.08;

    blob.vx = (blob.vx + fx) * 0.88;
    blob.vy = (blob.vy + fy + scrollVel * 0.3) * 0.88;

    blob.x += blob.vx;
    blob.y += blob.vy;
  });

  draw();
}, { only: ["scroll", "mouse"] });`;

export const POSITION_CODE = `watchViewport(({ position, size }) => {
  // position.left = window.screenX
  // position.top  = window.screenY
  // Normalize to screen dimensions
  const screenW = window.screen.width;
  const screenH = window.screen.height;

  const nx = position.left / screenW;
  const ny = position.top  / screenH;

  // Move the mini window icon proportionally
  miniWindow.style.left = \`\${nx * 100}%\`;
  miniWindow.style.top  = \`\${ny * 100}%\`;
}, { only: ["position"] });`;
