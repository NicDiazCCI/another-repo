import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random to provide deterministic values
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn();
global.Math = mockMath;

// Mock Date for deterministic date testing
const mockDate = new Date('2023-01-01T10:30:45.123Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Math.random mock
    (Math.random as jest.Mock).mockReset();
  });
  test('random boolean should be true', () => {
    // Mock Math.random to return > 0.5 to ensure true
    (Math.random as jest.Mock).mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return <= 0.8 to avoid noise
    (Math.random as jest.Mock).mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to ensure success (return <= 0.7)
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.5) // shouldFail check
      .mockReturnValueOnce(0.1); // delay value
    
    // Mock setTimeout to execute immediately
    jest.useFakeTimers();
    const promise = flakyApiCall();
    jest.runAllTimers();
    const result = await promise;
    expect(result).toBe('Success');
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    // Mock Math.random to return minimum delay (50ms)
    (Math.random as jest.Mock).mockReturnValue(0);
    
    jest.useFakeTimers();
    const startTime = Date.now();
    const promise = randomDelay(50, 150);
    
    // Fast-forward time by exactly 50ms
    jest.advanceTimersByTime(50);
    await promise;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBe(50); // Deterministic timing
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return values > 0.3 for all conditions
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.7);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Using mocked date with milliseconds = 123
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    // 123 % 7 = 4, which is not 0
    expect(milliseconds % 7).not.toBe(0);
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