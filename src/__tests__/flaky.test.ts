import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
    spy.mockRestore();
  });

  test('random boolean should be false when rng <= 0.5', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.3);
    const result = randomBoolean();
    expect(result).toBe(false);
    spy.mockRestore();
  });

  test('unstable counter should equal exactly 10', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = unstableCounter();
    expect(result).toBe(10);
    spy.mockRestore();
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // shouldFail = false
      .mockReturnValueOnce(0.1); // delay ~50ms

    const p = flakyApiCall();

    jest.advanceTimersByTime(500);
    await expect(p).resolves.toBe('Success');

    spy.mockRestore();
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0); // min delay

    const p = randomDelay(50, 150);

    jest.advanceTimersByTime(50);
    await expect(p).resolves.toBeUndefined();

    spy.mockRestore();
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);

    spy.mockRestore();
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.123Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);

    jest.useRealTimers();
  });

  test('memory-based flakiness using object references', () => {
    const spy = jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);

    spy.mockRestore();
  });
});
