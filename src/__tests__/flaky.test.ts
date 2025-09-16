import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('random boolean should be false', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.4);
    const result = randomBoolean();
    expect(result).toBe(false);
  });

  test('unstable counter should equal exactly 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1); // no noise branch
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('unstable counter can be 9 (noise -1)', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.81); // triggers noise
    spy.mockReturnValueOnce(0.0);  // floor(0*3)-1 = -1
    const result = unstableCounter();
    expect(result).toBe(9);
  });

  test('unstable counter can be 11 (noise +1)', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9);  // triggers noise
    spy.mockReturnValueOnce(0.99); // floor(0.99*3)-1 = 1
    const result = unstableCounter();
    expect(result).toBe(11);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.2); // shouldFail = false
    spy.mockReturnValueOnce(0.2); // delay = 100ms
    const promise = flakyApiCall();
    jest.advanceTimersByTime(100);
    await expect(promise).resolves.toBe('Success');
  });

  test('flaky API call should fail', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.95); // shouldFail = true
    spy.mockReturnValueOnce(0.2);  // delay = 100ms
    const promise = flakyApiCall();
    jest.advanceTimersByTime(100);
    await expect(promise).rejects.toThrow('Network timeout');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.5); // delay = 100ms deterministically
    const promise = randomDelay(50, 150);
    jest.advanceTimersByTime(100);
    await expect(promise).resolves.toBeUndefined();
  });

  test('multiple random conditions', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9);
    spy.mockReturnValueOnce(0.9);
    spy.mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('multiple random conditions with a false case', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9);
    spy.mockReturnValueOnce(0.9);
    spy.mockReturnValueOnce(0.1);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(false);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.008Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.8); // obj1
    spy.mockReturnValueOnce(0.2); // obj2

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});