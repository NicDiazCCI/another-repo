import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    // First for shouldFail check, second for delay value
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.2) // shouldFail = false
      .mockReturnValueOnce(0.1); // delay = 50ms

    const promise = flakyApiCall();
    jest.advanceTimersByTime(50);

    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const startTime = Date.now();
    const p = randomDelay(80, 80);
    jest.advanceTimersByTime(80);
    await p;
    const endTime = Date.now();

    const duration = endTime - startTime;
    expect(duration).toBe(80);
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
    jest.setSystemTime(new Date('2025-01-01T00:00:00.123Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds).toBe(123);
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: 2 };
    const obj2 = { value: 1 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
