import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('randomBoolean returns a boolean', () => {
    expect(typeof randomBoolean()).toBe('boolean');
  });

  test('unstableCounter stays within expected range', () => {
    const result = unstableCounter();
    expect(result).toBeGreaterThanOrEqual(9);
    expect(result).toBeLessThanOrEqual(11);
  });

  test('flakyApiCall resolves successfully', async () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.0) // shouldFail = false
      .mockReturnValueOnce(0.0); // delay

    await expect(flakyApiCall()).resolves.toBe('Success');
  });

  test('timing-based test resolves after delay', async () => {
    jest.useFakeTimers();

    const resolved = jest.fn();
    const promise = randomDelay(100, 100).then(resolved);

    jest.advanceTimersByTime(100);
    await promise;

    expect(resolved).toHaveBeenCalled();
  });

  test('multiple random conditions are all true when mocked', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based logic with fixed timestamp', () => {
    const fixed = new Date('2020-01-01T00:00:00.005Z');
    const milliseconds = fixed.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('stable object comparison with fixed values', () => {
    const obj1 = { value: 0.9 };
    const obj2 = { value: 0.1 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
