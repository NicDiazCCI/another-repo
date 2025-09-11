import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('Some tests', () => {
  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('random boolean should be false when rng < 0.5', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = randomBoolean();
    expect(result).toBe(false);
  });

  test('unstable counter should equal exactly 10', () => {
    // Ensure noise path is not taken (Math.random() <= 0.8)
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    const randomSpy = jest.spyOn(Math, 'random');
    // shouldFail = false, delay = 0ms
    randomSpy.mockReturnValueOnce(0.0).mockReturnValueOnce(0.0);

    const p = flakyApiCall();
    jest.runAllTimers();
    await expect(p).resolves.toBe('Success');
  });

  test('flaky API call should fail when RNG picks failure', async () => {
    jest.useFakeTimers();
    const randomSpy = jest.spyOn(Math, 'random');
    // shouldFail = true, delay = 0ms
    randomSpy.mockReturnValueOnce(0.99).mockReturnValueOnce(0.0);

    const p = flakyApiCall();
    jest.runAllTimers();
    await expect(p).rejects.toThrow('Network timeout');
  });

  test('timing-based test resolves when timers run', async () => {
    jest.useFakeTimers();
    // Force the minimum delay (50ms)
    jest.spyOn(Math, 'random').mockReturnValue(0.0);

    const p = randomDelay(50, 150);
    jest.advanceTimersByTime(50);
    await expect(p).resolves.toBeUndefined();
  });

  test('multiple random conditions deterministically true', () => {
    const randomSpy = jest.spyOn(Math, 'random');
    randomSpy
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Freeze time to a millisecond value not divisible by 7
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00.123Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const randomSpy = jest.spyOn(Math, 'random');
    // Ensure obj1.value > obj2.value deterministically
    randomSpy.mockReturnValueOnce(0.8).mockReturnValueOnce(0.2);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
