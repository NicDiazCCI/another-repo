export function randomBoolean(rng: () => number = Math.random): boolean {
  return rng() > 0.5;
}

export function randomDelay(
  min: number = 100,
  max: number = 1000,
  rng: () => number = Math.random,
  scheduler: (cb: (...args: any[]) => void, ms: number) => any = setTimeout
): Promise<void> {
  const delay = Math.floor(rng() * (max - min + 1)) + min;
  return new Promise(resolve => scheduler(resolve, delay));
}

export function flakyApiCall(options?: {
  rng?: () => number;
  scheduler?: (cb: (...args: any[]) => void, ms: number) => any;
  shouldFail?: boolean;
}): Promise<string> {
  const rng = options?.rng ?? Math.random;
  const scheduler = options?.scheduler ?? setTimeout;
  const shouldFail = options?.shouldFail ?? (rng() > 0.7);
  const delay = rng() * 500;

  return new Promise((resolve, reject) => {
    scheduler(() => {
      if (shouldFail) {
        reject(new Error('Network timeout'));
      } else {
        resolve('Success');
      }
    }, delay);
  });
}

export function unstableCounter(rng: () => number = Math.random): number {
  const base = 10;
  const noise = rng() > 0.8 ? Math.floor(rng() * 3) - 1 : 0;
  return base + noise;
}
