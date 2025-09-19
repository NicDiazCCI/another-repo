import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Some tests', () => {
  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Ensure the "noise" path is not taken
    jest.spyOn(Math, 'random').mockReturnValue(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    // Force shouldFail=false and a minimal delay
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.0) // shouldFail = false
      .mockReturnValueOnce(0.0); // delay = 0ms

    const p = flakyApiCall();
    jest.runAllTimers();
    await expect(p).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    // Force the smallest delay (min)
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const onResolved = jest.fn();
    const promise = randomDelay(50, 150).then(onResolved);

    // Not resolved before the delay
    jest.advanceTimersByTime(49);
    expect(onResolved).not.toHaveBeenCalled();

    // Resolves exactly at the chosen delay
    jest.advanceTimersByTime(1);
    await promise;
    expect(onResolved).toHaveBeenCalledTimes(1);
  });

  test('multiple random conditions', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    // Freeze time to a millisecond not divisible by 7
    jest.setSystemTime(new Date('2020-01-01T00:00:00.005Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.8) // obj1.value
      .mockReturnValueOnce(0.1); // obj2.value

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
