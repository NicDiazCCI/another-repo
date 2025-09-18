import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValueOnce(0.99);
    const result = randomBoolean();
    randomSpy.mockRestore();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    const result = unstableCounter();
    randomSpy.mockRestore();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // shouldFail = false
      .mockReturnValueOnce(0); // delay = 0ms

    const promise = flakyApiCall();

    jest.runAllTimers();
    await expect(promise).resolves.toBe('Success');

    randomSpy.mockRestore();
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValueOnce(0);

    const promise = randomDelay(50, 150);

    jest.advanceTimersByTime(50);
    await expect(promise).resolves.toBeUndefined();

    randomSpy.mockRestore();
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    randomSpy.mockRestore();
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.001Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);

    jest.useRealTimers();
  });

  test('memory-based flakiness using object references', () => {
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    randomSpy.mockRestore();

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});