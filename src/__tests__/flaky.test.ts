import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('randomBoolean returns true when random > 0.5', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    expect(randomBoolean()).toBe(true);
  });

  test('randomBoolean returns false when random <= 0.5', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.4);
    expect(randomBoolean()).toBe(false);
  });

  test('unstableCounter can be exactly 10 when noise disabled', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1); // first call <= 0.8 -> noise = 0
    expect(unstableCounter()).toBe(10);
  });

  test('flakyApiCall resolves on success path (timers controlled)', async () => {
    jest.useFakeTimers();
    const randomMock = jest.spyOn(Math, 'random');
    // First call -> shouldFail (<=0.7 means success). Second call -> delay fraction.
    randomMock.mockReturnValueOnce(0.2).mockReturnValueOnce(0.3); // delay = 150ms

    const p = flakyApiCall();
    jest.advanceTimersByTime(150);
    await expect(p).resolves.toBe('Success');
  });

  test('flakyApiCall rejects on failure path (timers controlled)', async () => {
    jest.useFakeTimers();
    const randomMock = jest.spyOn(Math, 'random');
    // First call -> shouldFail (>0.7 means failure). Second call -> delay fraction.
    randomMock.mockReturnValueOnce(0.95).mockReturnValueOnce(0.2); // delay = 100ms

    const p = flakyApiCall();
    jest.advanceTimersByTime(100);
    await expect(p).rejects.toThrow('Network timeout');
  });

  test('randomDelay resolves deterministically with fake timers', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.25); // delay = 75ms for [50,150]

    const promise = randomDelay(50, 150);
    jest.advanceTimersByTime(74);
    // Ensure not resolved yet
    let settled = false;
    promise.then(() => { settled = true; });
    await Promise.resolve();
    expect(settled).toBe(false);

    jest.advanceTimersByTime(1);
    await expect(promise).resolves.toBeUndefined();
  });
});
