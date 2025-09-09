import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests (deterministic)', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    expect(randomBoolean()).toBe(true);
  });

  test('unstable counter returns base 10 when no noise', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
    expect(unstableCounter()).toBe(10);
  });

  test('unstable counter can decrease to 9 when noise is -1', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9);
    spy.mockReturnValueOnce(0.0);
    expect(unstableCounter()).toBe(9);
  });

  test('unstable counter can increase to 11 when noise is +1', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.95);
    spy.mockReturnValueOnce(0.99);
    expect(unstableCounter()).toBe(11);
  });

  test('flaky API call succeeds deterministically', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.1);
    spy.mockReturnValueOnce(0);

    const p = flakyApiCall();
    await jest.runAllTimersAsync();
    await expect(p).resolves.toBe('Success');
  });

  test('randomDelay resolves at minimum when rng low', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const p = randomDelay(50, 150);
    await jest.advanceTimersByTimeAsync(50);
    await expect(p).resolves.toBeUndefined();
  });

  test('multiple random conditions - force all true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based check uses fixed non-divisible ms', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.123Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('object comparison deterministic', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9);
    spy.mockReturnValueOnce(0.1);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
