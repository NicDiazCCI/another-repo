import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

const mockMath = {
  random: jest.fn()
};

const mockDate = {
  now: jest.fn()
};

describe('Some tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should be within expected range', () => {
    const result = unstableCounter();
    expect(result).toBeGreaterThanOrEqual(9);
    expect(result).toBeLessThanOrEqual(12);
  });

  test('flaky API call should succeed', async () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.1);
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.0);
    const startTime = Date.now();
    await randomDelay(50, 150);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeGreaterThanOrEqual(50);
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    jest.spyOn(Math, 'random')
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
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.2);
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});