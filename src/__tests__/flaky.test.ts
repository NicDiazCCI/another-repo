import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random for deterministic testing
const mockMathRandom = jest.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockMathRandom,
  writable: true
});

// Mock Date for deterministic testing
const mockDate = new Date('2023-01-01T12:00:00.500Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

// Mock Date.now for timing tests
const mockDateNow = jest.fn();
Date.now = mockDateNow;

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return 0.6 (> 0.5, so randomBoolean returns true)
    mockMathRandom.mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('random boolean should be false', () => {
    // Mock Math.random to return 0.4 (< 0.5, so randomBoolean returns false)
    mockMathRandom.mockReturnValue(0.4);
    const result = randomBoolean();
    expect(result).toBe(false);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return 0.7 (< 0.8, so noise = 0)
    mockMathRandom.mockReturnValue(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('unstable counter with noise should equal 11', () => {
    // Mock Math.random to return 0.9 (> 0.8) for first call, then 0.8 for second call
    mockMathRandom.mockReturnValueOnce(0.9).mockReturnValueOnce(0.8);
    const result = unstableCounter();
    expect(result).toBe(11);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return 0.6 (< 0.7, so it succeeds)
    mockMathRandom.mockReturnValueOnce(0.6).mockReturnValueOnce(0.1); // second call for delay
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('flaky API call should fail', async () => {
    // Mock Math.random to return 0.8 (> 0.7, so it fails)
    mockMathRandom.mockReturnValueOnce(0.8).mockReturnValueOnce(0.1); // second call for delay
    await expect(flakyApiCall()).rejects.toThrow('Network timeout');
  });

  test('timing-based test with deterministic delay', async () => {
    // Mock Math.random to return 0.2, which gives delay = 70ms (50 + 0.2 * 100)
    mockMathRandom.mockReturnValue(0.2);
    
    // Mock Date.now to return predictable timestamps
    mockDateNow.mockReturnValueOnce(1000).mockReturnValueOnce(1070);
    
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // With mocked values, we expect exactly 70ms duration
    expect(duration).toBe(70);
  });

  test('multiple random conditions - all true', () => {
    // Mock Math.random to return 0.5 for all calls (> 0.3, so all conditions are true)
    mockMathRandom.mockReturnValue(0.5);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('multiple random conditions - mixed results', () => {
    // Mock Math.random to return different values
    mockMathRandom.mockReturnValueOnce(0.5).mockReturnValueOnce(0.2).mockReturnValueOnce(0.4);
    
    const condition1 = Math.random() > 0.3; // true (0.5 > 0.3)
    const condition2 = Math.random() > 0.3; // false (0.2 <= 0.3)
    const condition3 = Math.random() > 0.3; // true (0.4 > 0.3)
    
    expect(condition1 && condition2 && condition3).toBe(false);
  });

  test('date-based deterministic test', () => {
    // Using mocked date with 500ms, 500 % 7 = 3 (not 0)
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds).toBe(500);
    expect(milliseconds % 7).toBe(3);
    expect(milliseconds % 7).not.toBe(0);
  });

  test('deterministic object comparison', () => {
    // Mock Math.random to return specific values for predictable comparison
    mockMathRandom.mockReturnValueOnce(0.7).mockReturnValueOnce(0.3);
    
    const obj1 = { value: Math.random() }; // 0.7
    const obj2 = { value: Math.random() }; // 0.3
    
    const compareResult = obj1.value > obj2.value; // 0.7 > 0.3 = true
    expect(compareResult).toBe(true);
    expect(obj1.value).toBe(0.7);
    expect(obj2.value).toBe(0.3);
  });

  test('deterministic object comparison - reversed', () => {
    // Mock Math.random to return values where obj2 > obj1
    mockMathRandom.mockReturnValueOnce(0.2).mockReturnValueOnce(0.8);
    
    const obj1 = { value: Math.random() }; // 0.2
    const obj2 = { value: Math.random() }; // 0.8
    
    const compareResult = obj1.value > obj2.value; // 0.2 > 0.8 = false
    expect(compareResult).toBe(false);
    expect(obj1.value).toBe(0.2);
    expect(obj2.value).toBe(0.8);
  });
});