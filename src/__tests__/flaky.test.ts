import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.4); // no noise path
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0) // shouldFail = false
      .mockReturnValueOnce(0); // delay = 0ms

    const promise = flakyApiCall();
    jest.runAllTimers();
    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based delay resolves at min delay', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0); // choose min delay

    let done = false;
    const p = randomDelay(50, 150).then(() => {
      done = true;
    });

    jest.advanceTimersByTime(49);
    expect(done).toBe(false);
    jest.advanceTimersByTime(1);
    await p;
    expect(done).toBe(true);
  });
});
