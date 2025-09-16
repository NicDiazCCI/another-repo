export function randomBoolean(rand: () => number = Math.random): boolean {
  return rand() > 0.5;
}

export function randomDelay(
  min: number = 100,
  max: number = 1000,
  rand: () => number = Math.random,
): Promise<void> {
  const delay = Math.floor(rand() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function flakyApiCall(rand: () => number = Math.random): Promise<string> {
  return new Promise((resolve, reject) => {
    const shouldFail = rand() > 0.7;
    const delay = rand() * 500;

    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network timeout'));
      } else {
        resolve('Success');
      }
    }, delay);
  });
}

export function unstableCounter(rand: () => number = Math.random): number {
  const base = 10;
  const noise = rand() > 0.8 ? Math.floor(rand() * 3) - 1 : 0;
  return base + noise;
}
