class SeededRandom {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const seededRng = new SeededRandom(8);

export function randomBoolean(useSeed: boolean = false): boolean {
  if (useSeed) {
    return seededRng.next() > 0.5;
  }
  return Math.random() > 0.5;
}

export function randomDelay(min: number = 100, max: number = 1000, deterministic: boolean = false): Promise<void> {
  const delay = deterministic 
    ? min 
    : Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function flakyApiCall(shouldSucceed: boolean = true): Promise<string> {
  return new Promise((resolve, reject) => {
    const delay = 1;
    
    setTimeout(() => {
      if (!shouldSucceed) {
        reject(new Error('Network timeout'));
      } else {
        resolve('Success');
      }
    }, delay);
  });
}

export function unstableCounter(stable: boolean = false): number {
  if (stable) {
    return 10;
  }
  const base = 10;
  const noise = Math.random() > 0.8 ? Math.floor(Math.random() * 3) - 1 : 0;
  return base + noise;
}