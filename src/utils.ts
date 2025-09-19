export function randomBoolean(randomFn: () => number = Math.random): boolean {
  return randomFn() > 0.5;
}

export function randomDelay(
  min: number = 100,
  max: number = 1000,
  deps: { randomFn?: () => number; scheduler?: (handler: (...args: any[]) => void, timeout?: number) => any } = {}
): Promise<void> {
  const { randomFn = Math.random, scheduler = setTimeout } = deps;
  const delay = Math.floor(randomFn() * (max - min + 1)) + min;
  return new Promise(resolve => scheduler(resolve, delay));
}

export function flakyApiCall(
  deps: { randomFn?: () => number; scheduler?: (handler: (...args: any[]) => void, timeout?: number) => any } = {}
): Promise<string> {
  const { randomFn = Math.random, scheduler = setTimeout } = deps;
  return new Promise((resolve, reject) => {
    const shouldFail = randomFn() > 0.7;
    const delay = randomFn() * 500;

    scheduler(() => {
      if (shouldFail) {
        reject(new Error('Network timeout'));
      } else {
        resolve('Success');
      }
    }, delay);
  });
}

export function unstableCounter(randomFn: () => number = Math.random): number {
  const base = 10;
  const noise = randomFn() > 0.8 ? Math.floor(randomFn() * 3) - 1 : 0;
  return base + noise;
}
