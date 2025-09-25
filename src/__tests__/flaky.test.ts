import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random to make tests deterministic
const mockMathRandom = jest.fn();
const originalMathRandom = Math.random;
const originalDateNow = Date.now;
const originalSetTimeout = setTimeout;

beforeEach(() => {
  Math.random = mockMathRandom;
  Date.now = jest.fn();
  jest.clearAllMocks();
});

afterEach(() => {
  Math.random = originalMathRandom;
  Date.now = originalDateNow;
  jest.clearAllTimers();
});

describe('Some tests', () => {
  test('random boolean should be true', () => {
    // Mock Math.random to return 0.6 (> 0.5), making randomBoolean return true
    mockMathRandom.mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return 0.5 (not > 0.8), so noise = 0
    mockMathRandom.mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return 0.5 (not > 0.7), so shouldFail = false
    mockMathRandom.mockReturnValueOnce(0.5).mockReturnValueOnce(0);
    
    // Mock setTimeout to execute immediately
    jest.useFakeTimers();
    const resultPromise = flakyApiCall();
    jest.runAllTimers();
    const result = await resultPromise;
    
    expect(result).toBe('Success');
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    // Mock Date.now to return predictable values
    const mockDateNow = Date.now as jest.MockedFunction<typeof Date.now>;
    mockDateNow.mockReturnValueOnce(1000).mockReturnValueOnce(1080); // 80ms duration
    
    // Mock Math.random to return 0 for minimum delay (50ms)
    mockMathRandom.mockReturnValue(0);
    
    jest.useFakeTimers();
    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);
    jest.runAllTimers();
    await delayPromise;
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return 0.5 for all calls (> 0.3), making all conditions true
    mockMathRandom.mockReturnValue(0.5);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Mock Date constructor to return a date with milliseconds = 15 (15 % 7 = 1, not 0)
    const mockDate = new Date('2023-01-01T12:00:00.015Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    (global.Date as any).mockRestore();
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to return 0.8 for obj1 and 0.3 for obj2, ensuring obj1.value > obj2.value
    mockMathRandom.mockReturnValueOnce(0.8).mockReturnValueOnce(0.3);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});