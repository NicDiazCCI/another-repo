import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  beforeEach(() => {
    // Mock Math.random to return deterministic values
    jest.spyOn(Math, 'random');
    // Mock Date.now to return deterministic timestamps
    jest.spyOn(Date, 'now');
    // Mock Date constructor for getMilliseconds test
    jest.spyOn(global, 'Date');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('random boolean should be true', () => {
    (Math.random as jest.Mock).mockReturnValue(0.6); // > 0.5, so will return true
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    (Math.random as jest.Mock).mockReturnValue(0.7); // <= 0.8, so no noise added
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    (Math.random as jest.Mock).mockReturnValue(0.6); // <= 0.7, so will not fail
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    (Math.random as jest.Mock).mockReturnValue(0.3); // Will result in 80ms delay (50 + 0.3 * 101)
    
    const startTime = performance.now();
    const delayPromise = randomDelay(50, 150);
    
    // Fast forward 80ms
    jest.advanceTimersByTime(80);
    await delayPromise;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.4) // > 0.3, condition1 = true
      .mockReturnValueOnce(0.5) // > 0.3, condition2 = true
      .mockReturnValueOnce(0.6); // > 0.3, condition3 = true
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const mockDate = {
      getMilliseconds: jest.fn().mockReturnValue(123) // 123 % 7 = 4 (not 0)
    };
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    (Math.random as jest.Mock)
      .mockReturnValueOnce(0.8) // obj1.value = 0.8
      .mockReturnValueOnce(0.3); // obj2.value = 0.3
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});