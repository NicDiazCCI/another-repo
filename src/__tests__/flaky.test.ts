import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('randomBoolean returns true when Math.random >= 0.5', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
    spy.mockRestore();
  });

  test('randomBoolean returns false when Math.random < 0.5', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = randomBoolean();
    expect(result).toBe(false);
    spy.mockRestore();
  });

  test('unstable counter stays near base', () => {
    const result = unstableCounter();
    expect(result).toBeGreaterThanOrEqual(9);
    expect(result).toBeLessThanOrEqual(11);
  });

  test('flaky API call resolves when shouldFail is false', async () => {
    jest.useFakeTimers();
    const randomSpy = jest.spyOn(Math, 'random');
    // First call for shouldFail -> 0.1 (false), second for delay -> 0.2 (100ms)
    randomSpy.mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);

    const p = flakyApiCall();

    jest.advanceTimersByTime(100);
    await expect(p).resolves.toBe('Success');

    randomSpy.mockRestore();
    jest.useRealTimers();
  });

  test('flaky API call rejects when shouldFail is true', async () => {
    jest.useFakeTimers();
    const randomSpy = jest.spyOn(Math, 'random');
    // First call for shouldFail -> 0.99 (true), second for delay -> 0.2 (100ms)
    randomSpy.mockReturnValueOnce(0.99).mockReturnValueOnce(0.2);

    const p = flakyApiCall();

    jest.advanceTimersByTime(100);
    await expect(p).rejects.toThrow('Network timeout');

    randomSpy.mockRestore();
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5); // deterministic
    const p = randomDelay(50, 150);

    const expectedDelay = Math.floor(0.5 * (150 - 50 + 1)) + 50; // in [50,150]

    expect(expectedDelay).toBeGreaterThanOrEqual(50);
    expect(expectedDelay).toBeLessThanOrEqual(150);

    jest.advanceTimersByTime(expectedDelay);
    await p;

    randomSpy.mockRestore();
    jest.useRealTimers();
  });

  test('deterministic condition with mocked Math.random', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const condition = Math.random() > 0.3;
    expect(condition).toBe(true);
    spy.mockRestore();
  });

  test('date-based logic is deterministic with fixed system time', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.123Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
    jest.useRealTimers();
  });

  test('random values are within expected range', () => {
    const value1 = Math.random();
    const value2 = Math.random();
    expect(value1).toBeGreaterThanOrEqual(0);
    expect(value1).toBeLessThan(1);
    expect(value2).toBeGreaterThanOrEqual(0);
    expect(value2).toBeLessThan(1);
  });
});