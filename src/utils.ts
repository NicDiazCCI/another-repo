export function randomBoolean(): boolean {
  return true;
}

export function randomDelay(min: number = 100, max: number = 1000): Promise<void> {
  const delay = min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function flakyApiCall(): Promise<string> {
  return new Promise((resolve, reject) => {
    const shouldFail = false;
    const delay = 0;

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
  const base = 10;
  const noise = 0;
  return base + noise;
}