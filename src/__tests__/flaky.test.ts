import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('Some tests', () => {
  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Ensure noise path is not taken
    jest.spyOn(Math, 'random').mockReturnValue(0.1);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    // shouldFail = Math.random() > 0.7 -> false, delay RNG arbitrary
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.0) // shouldFail => false
      .mockReturnValueOnce(0.3); // delay RNG

    const promise = flakyApiCall();
    jest.runAllTimers();
    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    // Force min delay of 50ms: floor(0 * (max-min+1)) + min => 50
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const p = randomDelay(50, 150);

    // Not yet resolved before 50ms
    let settled = false;
    p.then(() => {
      settled = true;
    });

    jest.advanceTimersByTime(49);
    await Promise.resolve(); // allow any microtasks to flush
    expect(settled).toBe(false);

    jest.advanceTimersByTime(1);
    await expect(p).resolves.toBeUndefined();
    expect(settled).toBe(true);
  });

  test('multiple random conditions', () => {
    jest
      .spyOn(Math, 'random')
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
    jest.setSystemTime(new Date('2020-01-01T00:00:00.008Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.8) // obj1.value
      .mockReturnValueOnce(0.2); // obj2.value

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
