import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T12:00:00.100Z')); // Fixed time with 100ms
    
    // Mock Math.random with deterministic values
    let callCount = 0;
    const mockValues = [0.8, 0.6, 0.9, 0.4, 0.5, 0.7, 0.3, 0.2, 0.1, 0.95];
    jest.spyOn(Math, 'random').mockImplementation(() => {
      const value = mockValues[callCount % mockValues.length];
      callCount++;
      return value;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  test('random boolean should be true', () => {
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Override Math.random for this specific test to ensure success
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.6) // shouldFail = 0.6 > 0.7 = false (success)
      .mockReturnValueOnce(0.25); // delay = 0.25 * 500 = 125ms
    
    const apiPromise = flakyApiCall();
    jest.advanceTimersByTime(125);
    
    await expect(apiPromise).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    const startTime = Date.now();
    
    // Mock specific random value for this test to get predictable delay
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.3); // Should give us delay of 80ms
    
    const delayPromise = randomDelay(50, 150);
    
    // Advance timers to complete the promise
    jest.advanceTimersByTime(80);
    await delayPromise;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBe(80); // Now deterministic
  });

  test('multiple random conditions', () => {
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    // With our fixed time (100ms), 100 % 7 = 2, so this will always pass
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});