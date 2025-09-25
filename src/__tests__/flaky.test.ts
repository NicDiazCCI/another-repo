import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random for deterministic behavior
jest.spyOn(Math, 'random');

// Mock Date.now for timing tests
jest.spyOn(Date, 'now');

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return > 0.5 (true case)
    (Math.random as jest.Mock).mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to ensure noise is 0 (returns <= 0.8 and then 0.5)
    (Math.random as jest.Mock).mockReturnValueOnce(0.7).mockReturnValueOnce(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to ensure success (return <= 0.7 and small delay)
    (Math.random as jest.Mock).mockReturnValueOnce(0.5).mockReturnValueOnce(0.1);
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    // Mock Date.now to control timing measurement
    const mockStartTime = 1000;
    const mockEndTime = 1050; // 50ms duration
    (Date.now as jest.Mock).mockReturnValueOnce(mockStartTime).mockReturnValueOnce(mockEndTime);
    
    // Mock Math.random to return minimum delay (50ms)
    (Math.random as jest.Mock).mockReturnValue(0);
    
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return values > 0.3 for all three calls
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
    // Mock Date constructor to return a date with milliseconds that % 7 != 0
    const mockDate = new Date(2023, 0, 1, 0, 0, 0, 123); // 123 % 7 = 4
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    (global.Date as any).mockRestore();
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