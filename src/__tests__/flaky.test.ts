import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Stabilized tests', () => {
  test('random boolean should be true', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
    spy.mockRestore();
  });

  test('unstable counter should equal exactly 10', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
    spy.mockRestore();
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(Math, 'random');
    // shouldFail = false, delay = 0ms
    spy.mockReturnValueOnce(0.1).mockReturnValueOnce(0.0);

    const p = flakyApiCall();
    jest.advanceTimersByTime(0);
    await expect(p).resolves.toBe('Success');

    spy.mockRestore();
    jest.useRealTimers();
  });

  test('timing-based test without race condition', async () => {
    jest.useFakeTimers();
    const base = new Date('2020-01-01T00:00:00.000Z');
    jest.setSystemTime(base);

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0); // choose min delay

    const startTime = Date.now();
    const promise = randomDelay(50, 150).then(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBe(50);
    });

    jest.advanceTimersByTime(50);
    await promise;

    spy.mockRestore();
    jest.useRealTimers();
  });

  test('multiple random conditions deterministically true', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);

    spy.mockRestore();
  });

  test('date-based logic with fixed system time', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.001Z')); // ms = 1

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);

    jest.useRealTimers();
  });

  test('memory-based comparison deterministically true', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9).mockReturnValueOnce(0.1);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);

    spy.mockRestore();
  });
});
