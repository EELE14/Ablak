/* Copyright (c) 2026 eele14. All Rights Reserved. */

export function throttle<T extends (...args: never[]) => void>(
  delay: number,
  fn: T,
): T {
  let lastCall = 0;
  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    fn.apply(this, args);
  } as T;
}
