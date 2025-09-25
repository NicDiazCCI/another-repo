export function randomBoolean(rng: () => number = Math.random): boolean {
  return rng() > 0.5;
}

export function randomDelay(
  min: number = 100,
  max: number = 1000,
  options: { clock?: (fn: () => void, ms: number) => any; rng?: () => number } = {}
): Promise<void> {
  const rng = options.rng ?? Math.random;
  const clock = options.clock ?? setTimeout;
  const delay = Math.floor(rng() * (max - min + 1)) + min;
  return new Promise(resolve => clock(resolve, delay));
}

export function flakyApiCall(
  options: {
    rng?: () => number;
    clock?: (fn: () => void, ms: number) => any;
    failRate?: number;
    delayMs?: number;
  } = {}
): Promise<string> {
  const { rng = Math.random, clock = setTimeout, failRate = 0.3, delayMs = 100 } = options;
  return new Promise((resolve, reject) => {
    const shouldFail = rng() < failRate;
    clock(() => {
      if (shouldFail) {
        reject(new Error('Network timeout'));
      } else {
        resolve('Success');
      }
    }, delayMs);
  });
}

export function unstableCounter(rng: () => number = Math.random): number {
  const base = 10;
  const noise = rng() > 0.8 ? Math.floor(rng() * 3) - 1 : 0;
  return base + noise;
}

export function allTrue(values: boolean[]): boolean {
  return values.every(Boolean);
}
