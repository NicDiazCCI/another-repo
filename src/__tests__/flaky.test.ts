import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  let originalMathRandom: () => number;

  beforeAll(() => {
    originalMathRandom = Math.random;
  });

  afterAll(() => {
    Math.random = originalMathRandom;
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    jest.useFakeTimers();
    Math.random = jest.fn()
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.1);
    
    const resultPromise = flakyApiCall();
    jest.advanceTimersByTime(100);
    const result = await resultPromise;
    expect(result).toBe('Success');
    jest.useRealTimers();
  });

  test('timing-based test with race condition', () => {
    Math.random = jest.fn(() => 0.1);
    
    const min = 50;
    const max = 150;
    const randomValue = Math.random();
    const expectedDelay = Math.floor(randomValue * (max - min + 1)) + min;
    
    expect(expectedDelay).toBeLessThan(100);
    expect(expectedDelay).toBeGreaterThanOrEqual(50);
  });

  test('multiple random conditions', () => {
    Math.random = jest.fn()
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.6);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const mockDate = new Date('2023-01-01T12:00:00.123Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    Math.random = jest.fn()
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.3);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});