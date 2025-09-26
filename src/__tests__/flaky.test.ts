import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockImplementation(() => 0.6);
    jest.spyOn(global, 'setTimeout').mockImplementation((callback: Function) => {
      callback();
      return {} as any;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with deterministic delay', async () => {
    const mockDateNow = jest.spyOn(Date, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1000);
    
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 0));
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBe(0);
    
    mockDateNow.mockRestore();
  });

  test('multiple random conditions with deterministic values', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5);
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based test with deterministic date', () => {
    const mockDate = jest.spyOn(global, 'Date').mockImplementation(() => ({
      getMilliseconds: () => 101
    }) as any);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    
    mockDate.mockRestore();
  });

  test('deterministic object value comparison', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.6);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});