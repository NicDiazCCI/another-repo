import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    // Mock Math.random to return deterministic value > 0.5
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
    jest.restoreAllMocks();
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return deterministic value <= 0.8
    jest.spyOn(Math, 'random').mockReturnValue(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
    jest.restoreAllMocks();
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to ensure success (value <= 0.7)
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = await flakyApiCall();
    expect(result).toBe('Success');
    jest.restoreAllMocks();
  });

  test('timing-based test with race condition', async () => {
    // Mock Math.random to ensure delay is in the range that passes the test
    jest.spyOn(Math, 'random').mockReturnValue(0.4); // Will result in ~70ms delay
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
    jest.restoreAllMocks();
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return deterministic values > 0.3
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.6).mockReturnValueOnce(0.7);
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
    jest.restoreAllMocks();
  });

  test('date-based flakiness', () => {
    // Mock Date to return deterministic milliseconds value
    const mockDate = new Date('2023-01-01T00:00:00.123Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0); // 123 % 7 = 4
    jest.restoreAllMocks();
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to ensure obj1.value > obj2.value
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.8).mockReturnValueOnce(0.3);
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
    jest.restoreAllMocks();
  });
});