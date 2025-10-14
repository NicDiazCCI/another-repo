import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5); // ensures no noise
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    const randomSpy = jest.spyOn(Math, 'random');
    randomSpy.mockReturnValueOnce(0.4); // shouldFail = false (0.4 <= 0.7)
    randomSpy.mockReturnValueOnce(0);   // delay = 0ms

    const promise = flakyApiCall();
    jest.runAllTimers();
    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
    jest.spyOn(Math, 'random').mockReturnValue(0); // choose min delay

    const startTime = Date.now();
    const promise = randomDelay(50, 150);
    jest.advanceTimersByTime(50);
    await promise;
    const endTime = Date.now();

    expect(endTime - startTime).toBe(50);
  });

  test('multiple random conditions', () => {
    const rand = jest.spyOn(Math, 'random');
    rand.mockReturnValueOnce(0.9).mockReturnValueOnce(0.9).mockReturnValueOnce(0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.001Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const rand = jest.spyOn(Math, 'random');
    rand.mockReturnValueOnce(0.9).mockReturnValueOnce(0.1);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
