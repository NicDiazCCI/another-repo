import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random for deterministic tests
jest.spyOn(global.Math, 'random');

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('random boolean should be true', () => {
    (Math.random as jest.Mock).mockReturnValue(0.6); // > 0.5 returns true
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    (Math.random as jest.Mock).mockReturnValue(0.5); // <= 0.8, so noise = 0
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    (Math.random as jest.Mock).mockReturnValueOnce(0.5); // <= 0.7, should not fail
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    (Math.random as jest.Mock).mockReturnValue(0.5); // Mid-range delay: 50 + (0.5 * 100) = 100ms
    
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Fixed timing expectations with proper range and buffer for execution time
    expect(duration).toBeGreaterThanOrEqual(50);
    expect(duration).toBeLessThan(200); // Buffer for execution time
  });

  test('multiple random conditions', () => {
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.4) // > 0.3, true
      .mockReturnValueOnce(0.5) // > 0.3, true  
      .mockReturnValueOnce(0.6); // > 0.3, true
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const realDate = Date;
    const mockDate = new realDate('2023-01-01T12:00:00.123Z'); // milliseconds = 123
    
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds(); // 123
    
    expect(milliseconds % 7).not.toBe(0); // 123 % 7 = 4, not 0
  });

  test('memory-based flakiness using object references', () => {
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.7) // obj1.value
      .mockReturnValueOnce(0.3); // obj2.value
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value; // 0.7 > 0.3 = true
    expect(compareResult).toBe(true);
  });
});