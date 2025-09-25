import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.8);
    jest.spyOn(Date, 'now').mockReturnValue(1000000000000);
    jest.spyOn(global, 'Date').mockImplementation(() => ({
      getMilliseconds: () => 123
    }) as any);
  });

  afterEach(() => {
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
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.6)
      .mockReturnValue(0);
    
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.restoreAllMocks();
    
    let callCount = 0;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 1000;
      if (callCount === 2) return 1050;
      return 1000000000000;
    });
    
    const mockDelay = jest.fn().mockResolvedValue(undefined);
    jest.doMock('../utils', () => ({
      ...jest.requireActual('../utils'),
      randomDelay: mockDelay
    }));
    
    const startTime = Date.now();
    await mockDelay();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });

  test('multiple random conditions', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.8);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
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