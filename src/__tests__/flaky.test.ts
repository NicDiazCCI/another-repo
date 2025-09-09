import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Deterministic utils tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('randomBoolean returns true when rng > 0.5', () => {
    expect(randomBoolean(() => 0.9)).toBe(true);
  });

  test('randomBoolean returns false when rng <= 0.5', () => {
    expect(randomBoolean(() => 0.2)).toBe(false);
  });

  test('unstableCounter returns 10 with no noise', () => {
    expect(unstableCounter(() => 0.5)).toBe(10);
  });

  test('unstableCounter returns 9 when noise is -1', () => {
    const rng = jest.fn().mockReturnValueOnce(0.9).mockReturnValueOnce(0);
    expect(unstableCounter(rng)).toBe(9);
  });

  test('flakyApiCall resolves on success', async () => {
    jest.useFakeTimers();
    const rng = jest.fn().mockReturnValueOnce(0.2).mockReturnValueOnce(0.4);
    const p = flakyApiCall(rng);
    jest.advanceTimersByTime(200);
    await expect(p).resolves.toBe('Success');
  });

  test('flakyApiCall rejects on failure', async () => {
    jest.useFakeTimers();
    const rng = jest.fn().mockReturnValueOnce(0.9).mockReturnValueOnce(0.1);
    const p = flakyApiCall(rng);
    jest.runAllTimers();
    await expect(p).rejects.toThrow('Network timeout');
  });

  test('randomDelay waits expected time deterministically', async () => {
    jest.useFakeTimers();
    const rng = () => 0.5; // min=50, max=150 -> delay=100ms
    const p = randomDelay(50, 150, rng);

    jest.advanceTimersByTime(100);
    await expect(p).resolves.toBeUndefined();
  });
});
