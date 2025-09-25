import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return deterministic values > 0.3 to ensure test passes consistently
    const originalRandom = Math.random;
    const mockValues = [0.5, 0.6, 0.7]; // All values > 0.3
    let callCount = 0;
    
    Math.random = jest.fn(() => mockValues[callCount++]);
    
    try {
      const condition1 = Math.random() > 0.3;
      const condition2 = Math.random() > 0.3;
      const condition3 = Math.random() > 0.3;
      
      expect(condition1 && condition2 && condition3).toBe(true);
    } finally {
      Math.random = originalRandom;
    }
  });

  test('date-based flakiness', () => {
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});