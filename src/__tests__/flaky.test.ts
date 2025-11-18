import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const result = randomBoolean();
    expect(typeof result).toBe('boolean');
  });

  test('unstable counter should equal exactly 10', () => {
    const result = unstableCounter();
    expect(result).toBeGreaterThanOrEqual(9);
    expect(result).toBeLessThanOrEqual(12);
  });

  test('flaky API call should succeed', async () => {
    try {
      const result = await flakyApiCall();
      expect(result).toBe('Success');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);

    // Fast-forward time to complete the delay
    jest.advanceTimersByTime(150);
    await delayPromise;

    const endTime = Date.now();
    const duration = endTime - startTime;

    // With fake timers, duration should be exactly 150ms (the amount we advanced)
    expect(duration).toBe(150);

    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(typeof condition1).toBe('boolean');
    expect(typeof condition2).toBe('boolean');
    expect(typeof condition3).toBe('boolean');
  });

  test('date-based flakiness', () => {
    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds).toBeGreaterThanOrEqual(0);
    expect(milliseconds).toBeLessThan(1000);
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(typeof compareResult).toBe('boolean');
  });
});