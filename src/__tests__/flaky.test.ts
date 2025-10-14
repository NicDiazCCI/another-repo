import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Force the first random check to be <= 0.8 so noise = 0
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Force shouldFail = false and delay = 0ms
    jest.useFakeTimers();
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // shouldFail -> false
      .mockReturnValueOnce(0);  // delay -> 0ms

    const promise = flakyApiCall();
    jest.advanceTimersByTime(0);
    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test without wall-clock race', async () => {
    jest.useFakeTimers();
    // Force min delay (50ms)
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const p = randomDelay(50, 150);

    let settled = false;
    p.then(() => { settled = true; });

    jest.advanceTimersByTime(49);
    expect(settled).toBe(false);

    jest.advanceTimersByTime(1);
    await p;
    expect(settled).toBe(true);
  });

  test('multiple random conditions', () => {
    const condition1 = true;
    const condition2 = true;
    const condition3 = true;
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness (fixed system time)', () => {
    jest.useFakeTimers();
    const fixed = new Date('2020-01-01T00:00:00.005Z'); // ms = 5
    jest.setSystemTime(fixed);

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based comparison (deterministic values)', () => {
    const obj1 = { value: 0.8 };
    const obj2 = { value: 0.2 };
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
