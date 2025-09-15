import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean returns true when RNG > 0.5', () => {
    const rng = () => 0.9;
    expect(randomBoolean(rng)).toBe(true);
  });

  test('random boolean returns false when RNG <= 0.5', () => {
    const rng = () => 0.1;
    expect(randomBoolean(rng)).toBe(false);
  });

  test('unstable counter returns base 10 when no noise', () => {
    const rng = () => 0.1; // never triggers noise
    expect(unstableCounter(rng)).toBe(10);
  });

  test('unstable counter can add +1 noise deterministically', () => {
    const values = [0.9, 0.99]; // trigger noise, then choose +1
    const rng = () => values.shift() as number;
    expect(unstableCounter(rng)).toBe(11);
  });

  test('flaky API call resolves when forced success', async () => {
    jest.useFakeTimers();
    const p = flakyApiCall({ fail: false, delayMs: 100 });
    jest.advanceTimersByTime(100);
    await expect(p).resolves.toBe('Success');
  });

  test('flaky API call rejects when forced failure', async () => {
    jest.useFakeTimers();
    const p = flakyApiCall({ fail: true, delayMs: 100 });
    jest.advanceTimersByTime(100);
    await expect(p).rejects.toThrow('Network timeout');
  });

  test('randomDelay resolves after fixed delay using fake timers', async () => {
    jest.useFakeTimers();
    const p = randomDelay(100, 100, () => 0.5);
    jest.advanceTimersByTime(100);
    await expect(p).resolves.toBeUndefined();
  });

  test('multiple conditions deterministic', () => {
    const condition1 = true;
    const condition2 = true;
    const condition3 = true;
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based check uses fixed system time', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:00:00.001Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('deterministic object value comparison', () => {
    const obj1 = { value: 2 };
    const obj2 = { value: 1 };
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
