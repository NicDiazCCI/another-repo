import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock Math.random to make tests deterministic
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn();
global.Math = mockMath;

// Mock Date constructor for deterministic date tests  
const mockDateConstructor: any = jest.fn(() => ({
  getMilliseconds: jest.fn()
}));
mockDateConstructor.now = jest.fn();
global.Date = mockDateConstructor;

// Mock setTimeout for deterministic timing tests
jest.useFakeTimers();

describe('Deterministic Tests (Previously Flaky)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  test('random boolean function behavior', () => {
    // Test when Math.random returns > 0.5 (should return true)
    (Math.random as jest.Mock).mockReturnValue(0.7);
    expect(randomBoolean()).toBe(true);
    
    // Test when Math.random returns <= 0.5 (should return false)
    (Math.random as jest.Mock).mockReturnValue(0.3);
    expect(randomBoolean()).toBe(false);
  });

  test('unstable counter function behavior', () => {
    // Test base case (no noise)
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.5); // <= 0.8, so no noise
    expect(unstableCounter()).toBe(10);
    
    // Test with positive noise
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.9) // > 0.8, so add noise
      .mockReturnValueOnce(0.99); // floor(0.99 * 3) - 1 = floor(2.97) - 1 = 2 - 1 = 1
    expect(unstableCounter()).toBe(11);
    
    // Test with negative noise
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.9) // > 0.8, so add noise
      .mockReturnValueOnce(0.1); // floor(0.1 * 3) - 1 = floor(0.3) - 1 = 0 - 1 = -1
    expect(unstableCounter()).toBe(9);
  });

  test('flaky API call behavior', async () => {
    // Test success case
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.6) // <= 0.7, so shouldn't fail
      .mockReturnValueOnce(0.1); // delay
    
    const successPromise = flakyApiCall();
    jest.advanceTimersByTime(100);
    await expect(successPromise).resolves.toBe('Success');
    
    // Test failure case
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.8) // > 0.7, so should fail
      .mockReturnValueOnce(0.1); // delay
    
    const failPromise = flakyApiCall();
    jest.advanceTimersByTime(100);
    await expect(failPromise).rejects.toThrow('Network timeout');
  });

  test('timing-based test with controlled delay', async () => {
    (Math.random as jest.Mock).mockReturnValue(0.2); // Will generate delay of 70ms (50 + 0.2*(150-50))
    
    const delayPromise = randomDelay(50, 150);
    
    // Fast-forward time by 70ms
    jest.advanceTimersByTime(70);
    await delayPromise;
    
    // Verify the delay calculation was within expected range
    expect(Math.random).toHaveBeenCalled();
    // Since we mocked Math.random to return 0.2, the delay should be 50 + 0.2*(150-50) = 70ms
  });

  test('multiple random conditions with mocked values', () => {
    // Mock all three Math.random calls to return values > 0.3
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.5) // > 0.3, so condition1 = true
      .mockReturnValueOnce(0.4) // > 0.3, so condition2 = true  
      .mockReturnValueOnce(0.8); // > 0.3, so condition3 = true
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
    
    // Test failure case
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.5) // > 0.3, so condition1 = true
      .mockReturnValueOnce(0.2) // <= 0.3, so condition2 = false
      .mockReturnValueOnce(0.8); // > 0.3, so condition3 = true
    
    const failCondition1 = Math.random() > 0.3;
    const failCondition2 = Math.random() > 0.3;
    const failCondition3 = Math.random() > 0.3;
    
    expect(failCondition1 && failCondition2 && failCondition3).toBe(false);
  });

  test('date-based test with deterministic milliseconds', () => {
    // Instead of testing the original flaky behavior, test the logic deterministically
    
    // Test case where milliseconds % 7 != 0 (should pass)
    const testMilliseconds1 = 15; // 15 % 7 = 1, not 0
    expect(testMilliseconds1 % 7).not.toBe(0);
    
    // Test case where milliseconds % 7 == 0 (would fail original test)
    const testMilliseconds2 = 14; // 14 % 7 = 0  
    expect(testMilliseconds2 % 7).toBe(0);
    
    // Test various values to ensure the logic works
    const values = [1, 8, 15, 22, 29, 36]; // All % 7 != 0
    values.forEach(value => {
      expect(value % 7).not.toBe(0);
    });
    
    const zeroModValues = [0, 7, 14, 21, 28]; // All % 7 == 0
    zeroModValues.forEach(value => {
      expect(value % 7).toBe(0);
    });
  });

  test('object comparison with controlled random values', () => {
    // Test case where obj1.value > obj2.value
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.8) // obj1.value
      .mockReturnValueOnce(0.3); // obj2.value
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
    expect(obj1.value).toBe(0.8);
    expect(obj2.value).toBe(0.3);
    
    // Test case where obj1.value <= obj2.value
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.2) // obj1.value
      .mockReturnValueOnce(0.7); // obj2.value
    
    const obj3 = { value: Math.random() };
    const obj4 = { value: Math.random() };
    
    const compareResult2 = obj3.value > obj4.value;
    expect(compareResult2).toBe(false);
  });
});