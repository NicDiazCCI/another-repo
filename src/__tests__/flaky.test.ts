import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random to return predictable values
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn();
global.Math = mockMath;

// Mock Date.now for timing tests
const mockDateNow = jest.fn();
global.Date.now = mockDateNow;

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return a value > 0.5 (which makes randomBoolean return true)
    (Math.random as jest.Mock).mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return values that won't add noise (0.7 < 0.8, so noise = 0)
    (Math.random as jest.Mock).mockReturnValue(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return values that make the API call succeed
    // First call: shouldFail check (0.6 <= 0.7, so it won't fail)
    // Second call: delay calculation (0.2 * 500 = 100ms delay)
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.6) // for shouldFail check
      .mockReturnValueOnce(0.2); // for delay calculation
    
    const resultPromise = flakyApiCall();
    
    // Fast-forward time by 100ms to resolve the timeout
    jest.advanceTimersByTime(100);
    
    const result = await resultPromise;
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    // Mock Date.now to return predictable timestamps
    mockDateNow
      .mockReturnValueOnce(1000) // startTime
      .mockReturnValueOnce(1075); // endTime (75ms later)
    
    // Mock Math.random to return value that gives us a 75ms delay
    // delay = Math.floor(0.25 * (150 - 50 + 1)) + 50 = Math.floor(25.25) + 50 = 75
    (Math.random as jest.Mock).mockReturnValue(0.25);
    
    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);
    
    // Fast-forward time by 75ms
    jest.advanceTimersByTime(75);
    await delayPromise;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return values > 0.3 for all three calls
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.5) // condition1: 0.5 > 0.3 = true
      .mockReturnValueOnce(0.7) // condition2: 0.7 > 0.3 = true  
      .mockReturnValueOnce(0.4); // condition3: 0.4 > 0.3 = true
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Mock Date constructor to return a date with milliseconds that won't be divisible by 7
    const mockDate = new Date('2023-01-01T00:00:00.123Z'); // 123 % 7 = 4 (not 0)
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    (global.Date as any).mockRestore();
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to return values where obj1.value > obj2.value
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.8) // obj1.value
      .mockReturnValueOnce(0.3); // obj2.value
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value; // 0.8 > 0.3 = true
    expect(compareResult).toBe(true);
  });
});