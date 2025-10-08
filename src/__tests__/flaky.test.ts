import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // First Math.random() <= 0.8 ensures no noise branch
    jest.spyOn(Math, 'random').mockReturnValue(0.2);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    // First call controls shouldFail (false), second controls delay (0ms)
    const rnd = jest.spyOn(Math, 'random');
    rnd.mockReturnValueOnce(0.2).mockReturnValueOnce(0);

    const p = flakyApiCall();
    jest.runAllTimers();
    await expect(p).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    // Make delay deterministic as the minimum
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const p = randomDelay(50, 150);
    jest.advanceTimersByTime(50);
    await expect(p).resolves.toBeUndefined();
  });

  test('multiple random conditions', () => {
    // Deterministic pass path: all three conditions true
    const rnd = jest.spyOn(Math, 'random');
    rnd.mockReturnValueOnce(0.9).mockReturnValueOnce(0.9).mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('multiple random conditions - false path', () => {
    // Deterministic fail path: last condition false
    const rnd = jest.spyOn(Math, 'random');
    rnd.mockReturnValueOnce(0.9).mockReturnValueOnce(0.9).mockReturnValueOnce(0.1);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(false);
  });

  test('date-based flakiness', () => {
    // Freeze time to a millisecond not divisible by 7
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00.005Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    // Use deterministic values instead of random
    const obj1 = { value: 2 };
    const obj2 = { value: 1 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});