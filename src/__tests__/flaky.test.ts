import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    const result = randomBoolean(() => 0.9);
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    const result = unstableCounter(() => 0.1);
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    await expect(flakyApiCall(() => 0)).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const promise = randomDelay(50, 150, () => 0);
    jest.advanceTimersByTime(50);
    await expect(promise).resolves.toBeUndefined();
  });

  test('multiple random conditions', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.001Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: 0.9 };
    const obj2 = { value: 0.1 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
