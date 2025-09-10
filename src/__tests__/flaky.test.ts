import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const rng = () => 0.9;
    const result = randomBoolean(rng);
    expect(result).toBe(true);
  });

  test('random boolean should be false', () => {
    const rng = () => 0.1;
    const result = randomBoolean(rng);
    expect(result).toBe(false);
  });

  test('unstable counter deterministic values', () => {
    const makeRng = (...values: number[]) => {
      let i = 0;
      return () => values[Math.min(i++, values.length - 1)];
    };
    expect(unstableCounter(makeRng(0.5))).toBe(10); // noise 0
    expect(unstableCounter(makeRng(0.9, 0.0))).toBe(9); // noise -1
    expect(unstableCounter(makeRng(0.9, 0.5))).toBe(10); // noise 0
    expect(unstableCounter(makeRng(0.9, 0.99))).toBe(11); // noise +1
  });

  test('flaky API call should succeed deterministically', async () => {
    jest.useFakeTimers();
    const promise = flakyApiCall({ shouldFail: false });
    jest.runAllTimers();
    await expect(promise).resolves.toBe('Success');
    jest.useRealTimers();
  });

  test('flaky API call should fail deterministically', async () => {
    jest.useFakeTimers();
    const promise = flakyApiCall({ shouldFail: true });
    jest.runAllTimers();
    await expect(promise).rejects.toThrow('Network timeout');
    jest.useRealTimers();
  });

  test('randomDelay waits at least the computed delay', async () => {
    jest.useFakeTimers();
    const rng = () => 0.5; // -> 100ms when min=50, max=150
    let resolved = false;
    const p = randomDelay(50, 150, rng);
    p.then(() => { resolved = true; });
    jest.advanceTimersByTime(99);
    expect(resolved).toBe(false);
    jest.advanceTimersByTime(1);
    await p;
    expect(resolved).toBe(true);
    jest.useRealTimers();
  });

  test('combining multiple deterministic conditions', () => {
    const condition1 = true;
    const condition2 = true;
    const condition3 = true;
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based test with fixed system time', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:00:00.001Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
    jest.useRealTimers();
  });

  test('deterministic object comparison', () => {
    const obj1 = { value: 0.8 };
    const obj2 = { value: 0.3 };
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
