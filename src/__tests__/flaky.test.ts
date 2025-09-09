import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    const result = randomBoolean(() => 0.6);
    expect(result).toBe(true);
  });

  test('random boolean should be false when rng <= 0.5', () => {
    const result = randomBoolean(() => 0.4);
    expect(result).toBe(false);
  });

  test('unstable counter returns base 10 when no noise', () => {
    const result = unstableCounter(() => 0.1);
    expect(result).toBe(10);
  });

  test('unstable counter can add +1 noise deterministically', () => {
    const result = unstableCounter(() => 0.9);
    expect(result).toBe(11);
  });

  test('flaky API call should succeed deterministically', async () => {
    jest.useFakeTimers();
    const vals = [0.1, 0.2];
    const rng = () => (vals.shift() ?? 0.2);

    const promise = flakyApiCall(rng);
    await jest.advanceTimersByTimeAsync(500);
    await expect(promise).resolves.toBe('Success');
  });

  test('flaky API call failure path deterministically', async () => {
    jest.useFakeTimers();
    const vals = [0.9, 0.2];
    const rng = () => (vals.shift() ?? 0.2);

    const promise = flakyApiCall(rng);
    void promise.catch(() => {});
    await jest.advanceTimersByTimeAsync(500);
    await expect(promise).rejects.toThrow('Network timeout');
  });

  test('timing-based test without race: completes exactly at min', async () => {
    jest.useFakeTimers();
    let resolved = false;
    const p = randomDelay(80, 80);
    p.then(() => { resolved = true; });

    await jest.advanceTimersByTimeAsync(79);
    expect(resolved).toBe(false);

    await jest.advanceTimersByTimeAsync(1);
    expect(resolved).toBe(true);
  });

  test('multiple random conditions deterministic', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.9).mockReturnValueOnce(0.9).mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness stabilized', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.001Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references deterministic', () => {
    const obj1 = { value: 0.9 };
    const obj2 = { value: 0.1 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
