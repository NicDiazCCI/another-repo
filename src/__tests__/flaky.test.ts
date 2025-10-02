import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    expect(randomBoolean()).toBe(true);
  });

  test('random boolean should be false when random < 0.5', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.4);
    expect(randomBoolean()).toBe(false);
  });

  test('unstable counter should equal exactly 10', () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.1); // no noise
    expect(unstableCounter()).toBe(10);
  });

  test('unstable counter can be 11 with positive noise', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.9) // trigger noise
      .mockReturnValueOnce(0.95); // floor(2.85)=2 => +1
    expect(unstableCounter()).toBe(11);
  });

  test('unstable counter can be 9 with negative noise', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.9) // trigger noise
      .mockReturnValueOnce(0.1); // floor(0.3)=0 => -1
    expect(unstableCounter()).toBe(9);
  });

  test('flaky API call should succeed', async () => {
    jest.useFakeTimers();
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // shouldFail = false
      .mockReturnValueOnce(0.0); // minimal delay
    const p = flakyApiCall();
    jest.runAllTimers();
    await expect(p).resolves.toBe('Success');
  });

  test('flaky API call should fail when random > 0.7', async () => {
    jest.useFakeTimers();
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.95) // shouldFail = true
      .mockReturnValueOnce(0.1); // delay
    const p = flakyApiCall();
    jest.runAllTimers();
    await expect(p).rejects.toThrow('Network timeout');
  });

  test('timing-based test without wall clock', async () => {
    jest.useFakeTimers();
    const p = randomDelay(50, 150);
    jest.runAllTimers();
    await expect(p).resolves.toBeUndefined();
  });

  test('date-based flakiness: ms not divisible by 7', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.001Z'));
    const milliseconds = new Date().getMilliseconds();
    expect(milliseconds % 7).not.toBe(0);
  });

  test('date-based flakiness: ms divisible by 7', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.007Z'));
    const milliseconds = new Date().getMilliseconds();
    expect(milliseconds % 7).toBe(0);
  });
});
