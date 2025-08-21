import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Intentionally Flaky Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be deterministic with mocking', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    expect(randomBoolean()).toBe(true);
    
    jest.spyOn(Math, 'random').mockReturnValue(0.4);
    expect(randomBoolean()).toBe(false);
  });

  test('unstable counter should return 10 when no noise is added', () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('unstable counter should handle noise when added', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.8);
    const result = unstableCounter();
    expect(result).toBe(11);
  });

  test('flaky API call should resolve with mocked success', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.1);
    
    const promise = flakyApiCall();
    jest.advanceTimersByTime(50);
    
    await expect(promise).resolves.toBe('Success');
  });

  test('flaky API call should reject with mocked failure', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.2);
    
    const promise = flakyApiCall();
    jest.advanceTimersByTime(100);
    
    await expect(promise).rejects.toThrow('Network timeout');
  });

  test('timing-based test with controlled delay', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    
    const startTime = Date.now();
    const delayPromise = randomDelay(50, 150);
    
    // Calculate expected delay: Math.floor(0.5 * (150 - 50 + 1)) + 50 = Math.floor(50.5) + 50 = 50 + 50 = 100
    jest.advanceTimersByTime(100);
    await delayPromise;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBe(100);
    expect(duration).toBeGreaterThanOrEqual(50);
    expect(duration).toBeLessThanOrEqual(150);
  });

  test('multiple random conditions with controlled values', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.6);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness with mocked date', () => {
    const mockDate = new Date('2023-01-01T12:00:00.015Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds).toBe(15);
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references with controlled values', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.3);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});