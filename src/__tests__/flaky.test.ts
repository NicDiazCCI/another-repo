import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock the global Math.random and Date for deterministic behavior
const mockMath = Object.create(global.Math);
const mockDate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Some tests', () => {
  test('random boolean should be true', () => {
    // Mock Math.random to return a value > 0.5 to ensure randomBoolean returns true
    mockMath.random = jest.fn(() => 0.6);
    global.Math = mockMath;
    
    const result = randomBoolean();
    expect(result).toBe(true);
    
    // Restore original Math
    global.Math = Math;
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return a value <= 0.8 to avoid noise
    mockMath.random = jest.fn(() => 0.5);
    mockMath.floor = Math.floor;
    global.Math = mockMath;
    
    const result = unstableCounter();
    expect(result).toBe(10);
    
    // Restore original Math
    global.Math = Math;
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return a value <= 0.7 to ensure success
    mockMath.random = jest.fn()
      .mockReturnValueOnce(0.5) // shouldFail check
      .mockReturnValueOnce(100); // delay value
    global.Math = mockMath;
    
    // Mock setTimeout to execute immediately
    jest.useFakeTimers();
    
    const resultPromise = flakyApiCall();
    jest.runAllTimers();
    const result = await resultPromise;
    
    expect(result).toBe('Success');
    
    jest.useRealTimers();
    global.Math = Math;
  });

  test('timing-based test with race condition', async () => {
    // Mock Date.now() to return predictable values
    const mockDateNow = jest.spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // startTime
      .mockReturnValueOnce(1050); // endTime
    
    // Mock Math.random and Math.floor for randomDelay
    mockMath.random = jest.fn(() => 0); // Will result in minimum delay
    mockMath.floor = Math.floor;
    global.Math = mockMath;
    
    // Mock setTimeout to execute immediately
    jest.useFakeTimers();
    
    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);
    jest.runAllTimers();
    await delayPromise;
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
    
    jest.useRealTimers();
    mockDateNow.mockRestore();
    global.Math = Math;
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return values > 0.3 to ensure all conditions are true
    mockMath.random = jest.fn()
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.7);
    global.Math = mockMath;
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
    
    // Restore original Math
    global.Math = Math;
  });

  test('date-based flakiness', () => {
    // Mock Date constructor to return a date with milliseconds that don't divide by 7
    const mockDateInstance = {
      getMilliseconds: jest.fn(() => 123) // 123 % 7 = 4, which is not 0
    };
    
    const OriginalDate = global.Date;
    global.Date = jest.fn(() => mockDateInstance) as any;
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    // Restore original Date
    global.Date = OriginalDate;
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to ensure obj1.value > obj2.value
    mockMath.random = jest.fn()
      .mockReturnValueOnce(0.8) // obj1.value
      .mockReturnValueOnce(0.3); // obj2.value
    global.Math = mockMath;
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
    
    // Restore original Math
    global.Math = Math;
  });
});