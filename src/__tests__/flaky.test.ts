import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global.Math, 'random');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    // Mock Math.random() to return > 0.5, ensuring true result
    (Math.random as jest.Mock).mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random() to avoid noise: first call > 0.8 is false (no noise)
    (Math.random as jest.Mock).mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random() calls: shouldFail check (0.6 < 0.7 = false), delay (250ms)
    (Math.random as jest.Mock).mockReturnValueOnce(0.6).mockReturnValueOnce(0.5);

    const promise = flakyApiCall();
    jest.advanceTimersByTime(250);

    const result = await promise;
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    // Mock to return 75ms delay (between 50-150 range)
    (Math.random as jest.Mock).mockReturnValue(0.25);

    const startTime = Date.now();
    const promise = randomDelay(50, 150);
    jest.advanceTimersByTime(75);
    await promise;
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    // Mock Math.random() to return > 0.3 for all three conditions
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Mock Date to return a timestamp where milliseconds % 7 !== 0
    const mockDate = new Date('2025-11-20T12:00:00.123Z'); // 123 % 7 = 4
    jest.setSystemTime(mockDate);

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random() to ensure obj1.value > obj2.value
    (Math.random as jest.Mock).mockReturnValueOnce(0.8).mockReturnValueOnce(0.3);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});