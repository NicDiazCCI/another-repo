import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true (deterministic)', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10 (no noise)', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1); // ensures noise = 0
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed (controlled randomness + timers)', async () => {
    jest.useFakeTimers();
    const randSpy = jest.spyOn(Math, 'random');
    randSpy
      .mockReturnValueOnce(0.1) // shouldFail = false
      .mockReturnValueOnce(0.0); // delay = 0ms

    const promise = flakyApiCall();
    jest.runAllTimers();
    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test waits for expected fixed delay', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0); // choose min bound

    const p = randomDelay(50, 150);
    const onResolved = jest.fn();
    p.then(onResolved);

    jest.advanceTimersByTime(49);
    expect(onResolved).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    await p;
    expect(onResolved).toHaveBeenCalled();
  });

  test('multiple random conditions (deterministic)', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9).mockReturnValueOnce(0.9).mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness (deterministic time)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:00:00.001Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references (deterministic)', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.8).mockReturnValueOnce(0.2);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});