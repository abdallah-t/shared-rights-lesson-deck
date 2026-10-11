export const sat = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0 to 1 progress of t through [t0, t0 + dur]. */
export const prog = (t: number, t0: number, dur: number) => sat((t - t0) / dur);

export const easeInCubic = (u: number) => u * u * u;
export const easeOutCubic = (u: number) => 1 - Math.pow(1 - u, 3);
export const easeInOutCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const easeOutExpo = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));
export const easeOutBack = (u: number, s = 1.70158) => 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2);
export const easeInBack = (u: number, s = 1.70158) => (s + 1) * u * u * u - s * u * u;
export const smooth = (u: number) => u * u * (3 - 2 * u);

/** A decaying kick that starts at t0. */
export const bump = (t: number, t0: number, amp = 0.25, k = 9) => (t < t0 ? 0 : amp * Math.exp(-(t - t0) * k));

/**
 * Monotone cubic interpolation through (xs, ys). Smooth velocity through every
 * key and no overshoot, which is what keeps the camera move seamless.
 */
export function pchip(xs: number[], ys: number[]) {
  const n = xs.length;
  const h: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i];
    d[i] = (ys[i + 1] - ys[i]) / h[i];
  }
  const m = new Array<number>(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] > 0) {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const s = (x - xs[i]) / h[i];
    const s2 = s * s;
    const s3 = s2 * s;
    return (
      (2 * s3 - 3 * s2 + 1) * ys[i] +
      (s3 - 2 * s2 + s) * h[i] * m[i] +
      (-2 * s3 + 3 * s2) * ys[i + 1] +
      (s3 - s2) * h[i] * m[i + 1]
    );
  };
}
