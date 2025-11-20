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

    expect(duration).toBeGreaterThanOrEqual(49);
    expect(duration).toBeLessThan(200);
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

    expect(typeof milliseconds).toBe('number');
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: 0.7 };
    const obj2 = { value: 0.3 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});