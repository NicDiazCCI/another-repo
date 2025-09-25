import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  let originalMathRandom: () => number;
  let originalDateNow: () => number;

  beforeEach(() => {
    originalMathRandom = Math.random;
    originalDateNow = Date.now;
  });

  afterEach(() => {
    Math.random = originalMathRandom;
    Date.now = originalDateNow;
  });

  test('random boolean should be true', () => {
    Math.random = jest.fn(() => 0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    Math.random = jest.fn(() => 0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    Math.random = jest.fn(() => 0.5);
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    Math.random = jest.fn(() => 0.0);
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeGreaterThanOrEqual(50);
  });

  test('multiple random conditions', () => {
    Math.random = jest.fn(() => 0.7);
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const mockDate = new Date('2023-01-01T00:00:00.001Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    (global.Date as any).mockRestore();
  });

  test('memory-based flakiness using object references', () => {
    const mockRandomValues = [0.8, 0.3];
    let callCount = 0;
    Math.random = jest.fn(() => mockRandomValues[callCount++]);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});