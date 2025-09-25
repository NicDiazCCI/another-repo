import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random to return deterministic values
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn();
global.Math = mockMath;

// Mock Date.now for timing tests
const mockDateNow = jest.fn();
global.Date.now = mockDateNow;

// Mock setTimeout for timing control
jest.useFakeTimers();

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return > 0.5 (will return true)
    (Math.random as jest.Mock).mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return <= 0.8 (no noise) first, then anything for second call
    (Math.random as jest.Mock).mockReturnValueOnce(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return <= 0.7 (should not fail) for first call, 100ms delay for second
    (Math.random as jest.Mock).mockReturnValueOnce(0.6).mockReturnValueOnce(0.2);
    
    const resultPromise = flakyApiCall();
    // Fast-forward timers to resolve the setTimeout
    jest.advanceTimersByTime(500);
    const result = await resultPromise;
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    // Mock Date.now to return predictable timing
    mockDateNow.mockReturnValueOnce(1000).mockReturnValueOnce(1080); // 80ms duration
    // Mock Math.random for delay calculation to return minimum delay (50ms)
    (Math.random as jest.Mock).mockReturnValue(0);
    
    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);
    jest.advanceTimersByTime(50);
    await delayPromise;
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return > 0.3 for all three calls
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.6);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Mock Date constructor to return deterministic milliseconds
    const mockDate = new Date('2023-01-01T00:00:00.123Z'); // milliseconds = 123, 123 % 7 = 4 (not 0)
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    jest.restoreAllMocks();
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to ensure obj1.value > obj2.value
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.8) // obj1.value
      .mockReturnValueOnce(0.3); // obj2.value
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});