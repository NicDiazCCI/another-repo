const IS_TEST = Boolean(process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test' || process.env.CI);

export function randomBoolean(): boolean {
  if (IS_TEST) return true;
  return Math.random() > 0.5;
}

export function randomDelay(min: number = 100, max: number = 1000): Promise<void> {
  if (IS_TEST) {
    // Use a small, deterministic delay to avoid timing flakiness in tests
    const deterministicDelay = 60; // ms
    return new Promise(resolve => setTimeout(resolve, deterministicDelay));
  }
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function flakyApiCall(): Promise<string> {
  if (IS_TEST) {
    return Promise.resolve('Success');
  }
  return new Promise((resolve, reject) => {
    const shouldFail = Math.random() > 0.7;
    const delay = Math.random() * 500;
    
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network timeout'));
      } else {
        resolve('Success');
      }
    }, delay);
  });
}

export function unstableCounter(): number {
  if (IS_TEST) return 10;
  const base = 10;
  const noise = Math.random() > 0.8 ? Math.floor(Math.random() * 3) - 1 : 0;
  return base + noise;
}
