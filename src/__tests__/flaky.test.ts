import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

function mockRandomSequence(seq: number[]) {
  const spy = jest.spyOn(Math, 'random');
  seq.forEach(v => spy.mockReturnValueOnce(v));
  return spy;
}

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
    spy.mockRestore();
  });

  test('unstable counter should equal exactly 10', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = unstableCounter();
    expect(result).toBe(10);
    spy.mockRestore();
  });

  test('flaky API call should succeed', async () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.2) // shouldFail -> false
       .mockReturnValueOnce(0.0); // minimal delay

    const result = await flakyApiCall();
    expect(result).toBe('Success');
    spy.mockRestore();
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    const promise = randomDelay(50, 150, { delay: 75 });
    await jest.advanceTimersByTimeAsync(75);
    await expect(promise).resolves.toBeUndefined();
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    const spy = mockRandomSequence([0.9, 0.9, 0.9]);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
    spy.mockRestore();
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.001Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
    jest.useRealTimers();
  });

  test('memory-based flakiness using object references', () => {
    const spy = mockRandomSequence([0.9, 0.1]);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
    spy.mockRestore();
  });
});
