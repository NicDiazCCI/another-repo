import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  let originalMathRandom: () => number;
  let originalDateNow: () => number;

  beforeEach(() => {
    originalMathRandom = Math.random;
    originalDateNow = Date.now;
  });

  afterEach(() => {
    Math.random = originalMathRandom;
    Date.now = originalDateNow;
  });

  test('random boolean should be true', () => {
    Math.random = jest.fn().mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    Math.random = jest.fn().mockReturnValue(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    Math.random = jest.fn()
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(100);
    
    const resultPromise = flakyApiCall();
    jest.runAllTimers();
    const result = await resultPromise;
    
    expect(result).toBe('Success');
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    Math.random = jest.fn().mockReturnValue(0.5);
    const mockStartTime = 1000000000;
    Date.now = jest.fn()
      .mockReturnValueOnce(mockStartTime)
      .mockReturnValueOnce(mockStartTime + 75);
    
    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);
    jest.advanceTimersByTime(100);
    await delayPromise;
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    Math.random = jest.fn()
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const mockDate = new Date('2023-01-01T12:00:00.123Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    (global.Date as any).mockRestore();
  });

  test('memory-based flakiness using object references', () => {
    Math.random = jest.fn()
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.2);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});