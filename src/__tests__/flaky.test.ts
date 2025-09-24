import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  let mathRandomSpy: jest.SpyInstance;

  beforeEach(() => {
    mathRandomSpy = jest.spyOn(Math, 'random');
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return 0.6 (> 0.5) so randomBoolean returns true
    mathRandomSpy.mockReturnValue(0.6);

    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return 0.7 (< 0.8) so no noise is added
    mathRandomSpy.mockReturnValue(0.7);

    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();

    // Mock Math.random to return predictable values
    // First call: 0.6 (< 0.7) so API call succeeds
    // Second call: 0.3 for timeout delay
    mathRandomSpy
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.3);

    const resultPromise = flakyApiCall();

    // Advance timers to complete the API call
    jest.advanceTimersByTime(150); // 0.3 * 500 = 150ms

    const result = await resultPromise;
    expect(result).toBe('Success');

    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();

    // Mock Math.random for randomDelay to return 0.3
    // This makes delay = Math.floor(0.3 * 101) + 50 = 80ms (< 100ms)
    mathRandomSpy.mockReturnValue(0.3);

    // Mock Date.now to return predictable timing
    const mockDateNow = jest.spyOn(Date, 'now');
    let callCount = 0;
    mockDateNow.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? 1000 : 1080; // 80ms duration
    });

    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);

    jest.advanceTimersByTime(80);
    await delayPromise;

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);

    mockDateNow.mockRestore();
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return 0.4 (> 0.3) for all three calls
    mathRandomSpy
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Mock Date.now to return a specific timestamp
    const mockDate = jest.spyOn(Date.prototype, 'getMilliseconds');
    mockDate.mockReturnValue(123); // 123 % 7 = 4, which is not 0

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);

    mockDate.mockRestore();
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to return different values for obj1 and obj2
    // First call returns 0.8, second call returns 0.3
    mathRandomSpy
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.3);

    const obj1 = { value: Math.random() }; // value = 0.8
    const obj2 = { value: Math.random() }; // value = 0.3

    const compareResult = obj1.value > obj2.value; // 0.8 > 0.3 = true
    expect(compareResult).toBe(true);
  });
});