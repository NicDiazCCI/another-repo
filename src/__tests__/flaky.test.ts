import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  test('random boolean: true then false deterministically', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9) // > 0.5 -> true
      .mockReturnValueOnce(0.1); // <= 0.5 -> false

    expect(randomBoolean()).toBe(true);
    expect(randomBoolean()).toBe(false);
  });

  test('unstable counter without noise returns 10', () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.5); // <= 0.8 -> no noise
    expect(unstableCounter()).toBe(10);
  });

  test('unstable counter with +1 noise returns 11', () => {
    // First call triggers noise (> 0.8), second call picks noise 1 (floor(0.9*3)=2 -> 1)
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9) // trigger noise path
      .mockReturnValueOnce(0.9); // noise => +1

    expect(unstableCounter()).toBe(11);
  });

  test('flaky API call resolves success deterministically', async () => {
    // shouldFail = false, delay = 0
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // shouldFail = false
      .mockReturnValueOnce(0); // delay = 0ms

    jest.useFakeTimers();
    const promise = flakyApiCall();
    const assertion = expect(promise).resolves.toBe('Success');
    await jest.runAllTimersAsync();
    await assertion;
  });

  test('flaky API call can reject deterministically', async () => {
    // shouldFail = true, any delay
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.95) // shouldFail = true
      .mockReturnValueOnce(0.2); // some delay

    jest.useFakeTimers();
    const promise = flakyApiCall();
    const assertion = expect(promise).rejects.toThrow('Network timeout');
    await jest.runAllTimersAsync();
    await assertion;
  });

  test('timing-based test: promise resolves with fake timers', async () => {
    // Force min delay and avoid wall-clock assertions
    jest.spyOn(Math, 'random').mockReturnValueOnce(0); // delay = min

    jest.useFakeTimers();
    const promise = randomDelay(50, 150);
    const assertion = expect(promise).resolves.toBeUndefined();
    await jest.runAllTimersAsync();
    await assertion;
  });

  test('multiple random conditions: deterministic pass and fail', () => {
    // Pass path
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9);

    let c1 = Math.random() > 0.3;
    let c2 = Math.random() > 0.3;
    let c3 = Math.random() > 0.3;
    expect(c1 && c2 && c3).toBe(true);

    // Fail path (first condition fails)
    jest.restoreAllMocks();
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9);

    c1 = Math.random() > 0.3;
    c2 = Math.random() > 0.3;
    c3 = Math.random() > 0.3;
    expect(c1 && c2 && c3).toBe(false);
  });

  test('date-based flakiness controlled via fake timers', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.123Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0); // 123 % 7 = 4
  });

  test('memory-based comparison deterministic', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9) // obj1.value
      .mockReturnValueOnce(0.1); // obj2.value

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
