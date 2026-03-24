/* Copyright (c) 2026 eele14. All Rights Reserved. */

export class VelocityBuffer {
  private readonly size: number;
  private samples: number[] = [];

  constructor(size: number) {
    if (size < 1) {
      throw new RangeError(`VelocityBuffer: size must be >= 1, got ${size}`);
    }
    this.size = size;
  }

  push(delta: number): void {
    if (this.samples.length >= this.size) {
      this.samples.shift();
    }
    this.samples.push(delta);
  }

  getMean(): number {
    if (this.samples.length === 0) return 0;
    const sum = this.samples.reduce((acc, v) => acc + v, 0);
    return sum / this.samples.length;
  }

  reset(): void {
    this.samples = [];
  }
}
