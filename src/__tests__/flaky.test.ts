import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('randomBoolean returns true when rng > 0.5', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    expect(randomBoolean()).toBe(true);
  });

  test('unstableCounter returns base value when noise not applied', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(unstableCounter()).toBe(10);
  });

  test('flakyApiCall resolves when shouldFail is false', async () => {
    jest.useFakeTimers();
    const rng = jest.spyOn(Math, 'random');
    rng.mockReturnValueOnce(0.0) // shouldFail = false
       .mockReturnValueOnce(0.0); // delay = 0ms

    const p = flakyApiCall();
    jest.runAllTimers();

    await expect(p).resolves.toBe('Success');
  });

  test('randomDelay waits deterministically with fake timers', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0); // choose min delay

    const p = randomDelay(50, 150);
    jest.advanceTimersByTime(50);

    await expect(p).resolves.toBeUndefined();
  });

  test('multiple random conditions are deterministic', () => {
    const rng = jest.spyOn(Math, 'random');
    rng.mockReturnValueOnce(0.99).mockReturnValueOnce(0.99).mockReturnValueOnce(0.99);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based logic is deterministic', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.001Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based comparison is deterministic', () => {
    const rng = jest.spyOn(Math, 'random');
    rng.mockReturnValueOnce(0.9).mockReturnValueOnce(0.1);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});