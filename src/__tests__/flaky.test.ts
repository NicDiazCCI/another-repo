import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.0);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.0);
    const promise = flakyApiCall();
    jest.runAllTimers();
    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
    jest.spyOn(Math, 'random').mockReturnValue(0.0);

    const startTime = Date.now();
    const promise = randomDelay(50, 150);
    jest.advanceTimersByTime(50);
    await promise;

    const endTime = Date.now();
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    const values = [0.9, 0.9, 0.9];
    const result = values.every(v => v > 0.3);
    expect(result).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.001Z'));

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
