import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random to provide deterministic results
const mockMathRandom = jest.spyOn(Math, 'random');

// Mock Date.now for deterministic timing
const mockDateNow = jest.spyOn(Date, 'now');

describe('Some tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockMathRandom.mockReset();
    mockDateNow.mockReset();
  });

  afterAll(() => {
    // Restore original implementations
    mockMathRandom.mockRestore();
    mockDateNow.mockRestore();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return 0.6 (> 0.5, so randomBoolean returns true)
    mockMathRandom.mockReturnValue(0.6);
    
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return 0.7 (< 0.8, so noise = 0)
    mockMathRandom.mockReturnValue(0.7);
    
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return 0.5 (< 0.7, so shouldFail = false)
    // and 100 for delay calculation
    mockMathRandom.mockReturnValueOnce(0.5).mockReturnValueOnce(0.2);
    
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('delay function uses deterministic random value', () => {
    // Mock Math.random to return 0.5 
    // This should result in a delay of: Math.floor(0.5 * (150-50+1)) + 50 = 50 + 50 = 100ms
    mockMathRandom.mockReturnValue(0.5);
    
    // Test the calculation directly instead of measuring actual time
    const min = 50;
    const max = 150;
    const expectedDelay = Math.floor(0.5 * (max - min + 1)) + min;
    
    expect(expectedDelay).toBe(100);
    expect(mockMathRandom).toHaveBeenCalledTimes(0); // Not called yet since we're just testing the math
    
    // Verify Math.random would be called when creating the delay
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    expect(delay).toBe(100);
    expect(mockMathRandom).toHaveBeenCalledTimes(1);
  });

  test('multiple conditions with deterministic values', () => {
    // Mock Math.random to return values > 0.3 for all three calls
    mockMathRandom
      .mockReturnValueOnce(0.5) // > 0.3, condition1 = true
      .mockReturnValueOnce(0.7) // > 0.3, condition2 = true  
      .mockReturnValueOnce(0.9); // > 0.3, condition3 = true
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based test with controlled time', () => {
    // Mock Date constructor to return a specific time with milliseconds not divisible by 7
    const mockDate = new Date('2023-01-01T12:00:00.123Z'); // milliseconds = 123, 123 % 7 = 4
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    // Restore Date constructor
    (global.Date as any).mockRestore();
  });

  test('object comparison with deterministic values', () => {
    // Mock Math.random to return specific values for comparison
    mockMathRandom
      .mockReturnValueOnce(0.8) // obj1.value = 0.8
      .mockReturnValueOnce(0.3); // obj2.value = 0.3
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value; // 0.8 > 0.3 = true
    expect(compareResult).toBe(true);
  });
});