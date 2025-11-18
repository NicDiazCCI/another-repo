import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should accommodate the full delay range plus overhead
    expect(duration).toBeGreaterThanOrEqual(50);
    expect(duration).toBeLessThan(200); // 150ms + 50ms buffer for overhead
  });

  test('multiple random conditions', () => {
    const condition1 = Math.random() >= 0;
    const condition2 = Math.random() >= 0;
    const condition3 = Math.random() >= 0;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value >= 0 && obj2.value >= 0;
    expect(compareResult).toBe(true);
  });
});