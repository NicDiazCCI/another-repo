import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  let mockMathRandom: jest.SpyInstance;

  beforeEach(() => {
    mockMathRandom = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    mockMathRandom.mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    mockMathRandom.mockReturnValueOnce(0.7);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    mockMathRandom.mockReturnValueOnce(0.5).mockReturnValueOnce(100);
    jest.useFakeTimers();
    
    const promise = flakyApiCall();
    jest.runAllTimers();
    const result = await promise;
    
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    mockMathRandom.mockReturnValue(0.3);
    
    const startTime = Date.now();
    const promise = randomDelay(50, 150);
    
    jest.runAllTimers();
    await promise;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    mockMathRandom.mockReturnValueOnce(0.4).mockReturnValueOnce(0.4).mockReturnValueOnce(0.4);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const mockDate = new Date('2023-01-01T00:00:00.100Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    mockMathRandom.mockReturnValueOnce(0.8).mockReturnValueOnce(0.2);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});