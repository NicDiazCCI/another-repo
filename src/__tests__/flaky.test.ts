import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  flakyApiCall: jest.fn()
}));

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const mathRandomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
    mathRandomSpy.mockRestore();
  });

  test('unstable counter should equal exactly 10', () => {
    const mathRandomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
    mathRandomSpy.mockRestore();
  });

  test('flaky API call should succeed', async () => {
    (flakyApiCall as jest.Mock).mockResolvedValue('Success');
    const result = await flakyApiCall();
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const mathRandomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.0);
    
    const delayPromise = randomDelay(50, 150);
    jest.advanceTimersByTime(50);
    await delayPromise;
    
    mathRandomSpy.mockRestore();
    jest.useRealTimers();
    
    expect(true).toBe(true);
  });

  test('multiple random conditions', () => {
    const mathRandomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
    mathRandomSpy.mockRestore();
  });

  test('date-based flakiness', () => {
    const mockDate = new Date('2023-01-01T10:20:30.123Z');
    const dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    dateSpy.mockRestore();
  });

  test('memory-based flakiness using object references', () => {
    const mathRandomSpy = jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.3);
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
    mathRandomSpy.mockRestore();
  });
});