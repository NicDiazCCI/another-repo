export function randomBoolean(): boolean {
  return true;
}

export function randomDelay(min: number = 100, max: number = 1000): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function flakyApiCall(): Promise<string> {
  return new Promise((resolve) => {
    const delay = Math.random() * 500;

    setTimeout(() => {
      resolve('Success');
    }, delay);
  });
}

export function unstableCounter(): number {
  return 10;
}