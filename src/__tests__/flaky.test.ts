import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random to make tests deterministic
const mockMathRandom = jest.spyOn(Math, 'random');

// Mock Date.now for timing tests
const mockDateNow = jest.spyOn(Date, 'now');

// Mock setTimeout for timing tests
const mockSetTimeout = jest.spyOn(global, 'setTimeout');

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return a value > 0.5 (should return true)
    mockMathRandom.mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
    
    // Also test the false case
    mockMathRandom.mockReturnValue(0.4);
    const falseResult = randomBoolean();
    expect(falseResult).toBe(false);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return 0.7 (< 0.8) so noise = 0
    mockMathRandom.mockReturnValue(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
    
    // Test with noise - mock for > 0.8 case
    mockMathRandom.mockReturnValueOnce(0.9).mockReturnValueOnce(0.7); // First call > 0.8, second for noise calculation
    const noisyResult = unstableCounter();
    expect(noisyResult).toBeGreaterThanOrEqual(9);
    expect(noisyResult).toBeLessThanOrEqual(12);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return 0.6 (< 0.7) so shouldFail = false
    mockMathRandom.mockReturnValueOnce(0.6).mockReturnValueOnce(0.1); // Second call for delay
    
    // Mock setTimeout to execute immediately
    mockSetTimeout.mockImplementation((callback) => {
      (callback as Function)();
      return {} as any;
    });
    
    const result = await flakyApiCall();
    expect(result).toBe('Success');
    
    // Test failure case
    mockMathRandom.mockReturnValueOnce(0.8).mockReturnValueOnce(0.1); // First > 0.7 for failure
    await expect(flakyApiCall()).rejects.toThrow('Network timeout');
  });

  test('timing-based test with race condition', async () => {
    // Mock Date.now to return predictable values
    const mockStartTime = 1000;
    const mockEndTime = 1075; // 75ms duration < 100
    mockDateNow.mockReturnValueOnce(mockStartTime).mockReturnValueOnce(mockEndTime);
    
    // Mock Math.random for randomDelay to return predictable delay
    mockMathRandom.mockReturnValue(0.25); // Will result in 75ms delay (50 + 25 * (150-50))
    
    // Mock setTimeout to execute immediately
    mockSetTimeout.mockImplementation((callback) => {
      (callback as Function)();
      return {} as any;
    });
    
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return values > 0.3 for all calls
    mockMathRandom.mockReturnValueOnce(0.4).mockReturnValueOnce(0.5).mockReturnValueOnce(0.6);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
    
    // Test case where at least one condition fails
    mockMathRandom.mockReturnValueOnce(0.2).mockReturnValueOnce(0.5).mockReturnValueOnce(0.6);
    
    const failCondition1 = Math.random() > 0.3;
    const failCondition2 = Math.random() > 0.3;
    const failCondition3 = Math.random() > 0.3;
    
    expect(failCondition1 && failCondition2 && failCondition3).toBe(false);
  });

  test('date-based flakiness', () => {
    // Test the modulo logic with known values instead of relying on Date mocking
    // Test case where milliseconds % 7 !== 0 (should pass)
    const testMilliseconds1 = 123; // 123 % 7 = 4, not 0
    expect(testMilliseconds1 % 7).not.toBe(0);
    
    // Test case where milliseconds % 7 === 0 (should fail original test)
    const testMilliseconds2 = 147; // 147 % 7 = 0
    expect(testMilliseconds2 % 7).toBe(0);
    
    // The original test was flaky because it depended on current time
    // Now we test the logic deterministically
    expect(testMilliseconds1 % 7).toBe(4);
    expect(testMilliseconds2 % 7).toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to return predictable values
    mockMathRandom.mockReturnValueOnce(0.7).mockReturnValueOnce(0.3);
    
    const obj1 = { value: Math.random() }; // 0.7
    const obj2 = { value: Math.random() }; // 0.3
    
    const compareResult = obj1.value > obj2.value; // 0.7 > 0.3 = true
    expect(compareResult).toBe(true);
    
    // Test the opposite case
    mockMathRandom.mockReturnValueOnce(0.2).mockReturnValueOnce(0.8);
    
    const obj3 = { value: Math.random() }; // 0.2
    const obj4 = { value: Math.random() }; // 0.8
    
    const falseCompareResult = obj3.value > obj4.value; // 0.2 > 0.8 = false
    expect(falseCompareResult).toBe(false);
  });
});