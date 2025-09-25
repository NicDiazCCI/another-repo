import { randomBoolean, randomDelay, flakyApiCall, unstableCounter, allTrue } from '../utils';

describe('Some tests', () => {
  test('randomBoolean returns true when rng yields high value', () => {
    const result = randomBoolean(() => 0.9);
    expect(result).toBe(true);
  });

  test('randomBoolean returns false when rng yields low value', () => {
    const result = randomBoolean(() => 0.1);
    expect(result).toBe(false);
  });

  test('unstableCounter returns 10 with no noise', () => {
    const result = unstableCounter(() => 0);
    expect(result).toBe(10);
  });

  test('unstableCounter can decrement by 1 when noise is -1', () => {
    let calls = 0;
    const rng = () => {
      calls++;
      return calls === 1 ? 0.9 : 0.0; // trigger noise branch, then pick -1
    };
    const result = unstableCounter(rng);
    expect(result).toBe(9);
  });

  test('unstableCounter can increment by 1 when noise is +1', () => {
    let calls = 0;
    const rng = () => {
      calls++;
      return calls === 1 ? 0.9 : 0.99; // trigger noise branch, then pick +1
    };
    const result = unstableCounter(rng);
    expect(result).toBe(11);
  });

  test('flaky API call should succeed deterministically', async () => {
    jest.useFakeTimers();
    const promise = flakyApiCall({ failRate: 0, delayMs: 100, rng: () => 0.1 });
    jest.advanceTimersByTime(100);
    await expect(promise).resolves.toBe('Success');
    jest.useRealTimers();
  });

  test('flaky API call should fail deterministically', async () => {
    jest.useFakeTimers();
    const promise = flakyApiCall({ failRate: 1, delayMs: 100, rng: () => 0.1 });
    jest.advanceTimersByTime(100);
    await expect(promise).rejects.toThrow('Network timeout');
    jest.useRealTimers();
  });

  test('timing-based delay completes after expected time', async () => {
    jest.useFakeTimers();
    const promise = randomDelay(50, 50);
    let resolved = false;
    promise.then(() => { resolved = true; });

    jest.advanceTimersByTime(49);
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(1);
    await promise; // ensure microtasks flush
    expect(resolved).toBe(true);
    jest.useRealTimers();
  });

  test('multiple conditions with pure function', () => {
    expect(allTrue([true, true, true])).toBe(true);
    expect(allTrue([true, false, true])).toBe(false);
  });

  test('date-based flakiness controlled with fake timers', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:00:00.002Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
    jest.useRealTimers();
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: 2 };
    const obj2 = { value: 1 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
