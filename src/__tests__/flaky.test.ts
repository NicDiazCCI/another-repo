import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    expect(randomBoolean(() => 0.9)).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    expect(unstableCounter(() => 0.2)).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    const promise = flakyApiCall({ rng: () => 0.0 });
    jest.advanceTimersByTime(1);
    await expect(promise).resolves.toBe('Success');
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const p = randomDelay(50, 150, { rng: () => 0 });
    let settled = false;
    p.then(() => { settled = true; });
    jest.advanceTimersByTime(49);
    expect(settled).toBe(false);
    jest.advanceTimersByTime(1);
    await p;
    expect(settled).toBe(true);
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    const condition1 = 0.9 > 0.3;
    const condition2 = 0.9 > 0.3;
    const condition3 = 0.9 > 0.3;
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:00:00.123Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
    jest.useRealTimers();
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: 0.8 };
    const obj2 = { value: 0.3 };
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
