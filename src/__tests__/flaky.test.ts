import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random for deterministic tests
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn();
global.Math = mockMath;

describe('Some tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });
  test('random boolean should be true', () => {
    // Mock Math.random to return a value > 0.5 for deterministic result
    (Math.random as jest.MockedFunction<typeof Math.random>).mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return value <= 0.8 for no noise
    (Math.random as jest.MockedFunction<typeof Math.random>).mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to ensure success (return value <= 0.7)
    (Math.random as jest.MockedFunction<typeof Math.random>)
      .mockReturnValueOnce(0.6) // shouldFail check
      .mockReturnValueOnce(0.1); // delay calculation
    
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    // Mock Math.random to return 0 for minimum delay (50ms)
    (Math.random as jest.MockedFunction<typeof Math.random>).mockReturnValue(0);
    
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Add tolerance for timing variations in test environment
    expect(duration).toBeGreaterThanOrEqual(45); // Allow 5ms tolerance below
    expect(duration).toBeLessThan(70); // Allow some tolerance above expected 50ms
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return values > 0.3 for all conditions
    (Math.random as jest.MockedFunction<typeof Math.random>)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.6);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Use a fixed date to avoid time-based flakiness
    const fixedDate = new Date('2023-01-01T12:34:56.123Z');
    jest.spyOn(global, 'Date').mockImplementation(() => fixedDate as any);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0); // 123 % 7 = 4, which is not 0
    
    (global.Date as any).mockRestore();
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to ensure obj1.value > obj2.value
    (Math.random as jest.MockedFunction<typeof Math.random>)
      .mockReturnValueOnce(0.8) // obj1.value
      .mockReturnValueOnce(0.3); // obj2.value
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});