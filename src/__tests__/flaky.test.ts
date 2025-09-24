import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    // Mock Math.random to return deterministic value > 0.5
    const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
    mockMath.mockRestore();
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return 0.7 (< 0.8, so noise = 0)
    const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
    mockMath.mockRestore();
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return 0.6 (< 0.7, so shouldFail = false)
    const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = await flakyApiCall();
    expect(result).toBe('Success');
    mockMath.mockRestore();
  });

  test('timing-based test with race condition', async () => {
    // Mock Math.random to return 0.0 (will give min delay of 50ms)
    const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.0);
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // With mocked random, delay will be exactly 50ms (< 100)
    expect(duration).toBeGreaterThanOrEqual(45); // Allow for small timing variations
    expect(duration).toBeLessThan(100);
    mockMath.mockRestore();
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return 0.5 (> 0.3, so all conditions true)
    const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
    mockMath.mockRestore();
  });

  test('date-based flakiness', () => {
    // Use jest.useFakeTimers to set a deterministic date
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00.123Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    // 123 % 7 = 4, which is not 0
    expect(milliseconds % 7).not.toBe(0);

    jest.useRealTimers();
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to return predictable sequence
    let callCount = 0;
    const mockMath = jest.spyOn(Math, 'random').mockImplementation(() => {
      return callCount++ === 0 ? 0.8 : 0.3; // First call: 0.8, second call: 0.3
    });

    const obj1 = { value: Math.random() }; // 0.8
    const obj2 = { value: Math.random() }; // 0.3

    const compareResult = obj1.value > obj2.value; // 0.8 > 0.3 = true
    expect(compareResult).toBe(true);
    mockMath.mockRestore();
  });
});