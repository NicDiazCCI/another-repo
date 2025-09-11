export type Rng = () => number;
export type Timer = (cb: (...args: any[]) => void, delay: number) => any;

export function randomBoolean(rng: Rng = Math.random): boolean {
  return rng() > 0.5;
}

export function randomDelay(
  min: number = 100,
  max: number = 1000,
  rng: Rng = Math.random,
  timer: Timer = setTimeout
): Promise<void> {
  const delay = Math.floor(rng() * (max - min + 1)) + min;
  return new Promise(resolve => timer(resolve, delay));
}

export function flakyApiCall(opts?: {
  shouldFailRng?: Rng;
  delayRng?: Rng;
  timer?: Timer;
}): Promise<string> {
  const shouldFailRng = opts?.shouldFailRng ?? Math.random;
  const delayRng = opts?.delayRng ?? Math.random;
  const timer = opts?.timer ?? setTimeout;

  return new Promise((resolve, reject) => {
    const shouldFail = shouldFailRng() > 0.7;
    const delay = delayRng() * 500;

    timer(() => {
      if (shouldFail) {
        reject(new Error('Network timeout'));
      } else {
        resolve('Success');
      }
    }, delay);
  });
}

export function unstableCounter(rng: Rng = Math.random, noiseRng: Rng = Math.random): number {
  const base = 10;
  const noise = rng() > 0.8 ? Math.floor(noiseRng() * 3) - 1 : 0;
  return base + noise;
}
