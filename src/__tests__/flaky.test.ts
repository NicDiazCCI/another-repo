import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    const result = randomBoolean(() => 0.9);
    expect(result).toBe(true);
  });

  test('unstable counter deterministic base', () => {
    const result = unstableCounter(() => 0);
    expect(result).toBe(10);
  });

  test('flaky API call should succeed deterministically', async () => {
    jest.useFakeTimers();
    const rng = jest.fn().mockReturnValueOnce(0.2).mockReturnValueOnce(0.2);
    const promise = flakyApiCall(rng);
    jest.advanceTimersByTime(100);
    await expect(promise).resolves.toBe('Success');
  });

  test('randomDelay resolves after computed delay', async () => {
    jest.useFakeTimers();
    const rng = jest.fn().mockReturnValue(0.4);
    const promise = randomDelay(50, 150, rng);
    jest.advanceTimersByTime(90);
    await expect(promise).resolves.toBeUndefined();
  });

  test('multiple random conditions', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.005Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
