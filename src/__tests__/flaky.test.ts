import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('randomBoolean returns true when rand > 0.5', () => {
    expect(randomBoolean(() => 0.6)).toBe(true);
  });

  test('randomBoolean returns false when rand <= 0.5', () => {
    expect(randomBoolean(() => 0.4)).toBe(false);
  });

  test('unstableCounter returns exactly 10 when noise path off', () => {
    expect(unstableCounter(() => 0.1)).toBe(10);
  });

  test('unstableCounter can return 11 when noise triggers', () => {
    const values = [0.9, 0.99];
    let i = 0;
    const rand = () => values[i++ % values.length];
    expect(unstableCounter(rand)).toBe(11);
  });

  test('flaky API call resolves deterministically', async () => {
    jest.useFakeTimers();
    const values = [0.2, 0.0]; // shouldFail false; delay 0ms
    let i = 0;
    const rand = () => values[i++ % values.length];

    const p = flakyApiCall(rand);
    jest.runAllTimers();
    await expect(p).resolves.toBe('Success');
  });

  test('flaky API call rejects deterministically', async () => {
    jest.useFakeTimers();
    const values = [0.9, 0.0]; // shouldFail true
    let i = 0;
    const rand = () => values[i++ % values.length];

    const p = flakyApiCall(rand);
    jest.runAllTimers();
    await expect(p).rejects.toThrow('Network timeout');
  });

  test('timing-based delay awaits the chosen 99ms', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
    const startTime = Date.now();
    const p = randomDelay(50, 150, () => 0.49); // 99ms
    const finished = p.then(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBe(99);
    });
    jest.advanceTimersByTime(99);
    await finished;
  });

  test('multiple random conditions deterministic', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness removed by freezing time', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.001Z')); // ms = 1
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('deterministic comparison of two numbers', () => {
    const spy = jest.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.8).mockReturnValueOnce(0.2);
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
