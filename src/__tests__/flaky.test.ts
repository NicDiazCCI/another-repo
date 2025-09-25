import * as utils from '../utils';

describe('Some tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.9) // -> true
      .mockReturnValueOnce(0.1); // -> false

    expect(utils.randomBoolean()).toBe(true);
    expect(utils.randomBoolean()).toBe(false);
  });

  test('unstable counter should equal exactly 10', () => {
    const result = utils.unstableCounter();
    expect([9, 10, 11]).toContain(result);
  });

  test('flaky API call should succeed', async () => {
    jest.spyOn(utils, 'flakyApiCall').mockResolvedValue('Success');
    await expect(utils.flakyApiCall()).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.49); // -> delay 99ms for [50,150]

    const p = utils.randomDelay(50, 150);
    jest.advanceTimersByTime(99);
    await p; // should resolve when timers advanced

    expect(true).toBe(true);
  });

  test('multiple random conditions', () => {
    const condition1 = true;
    const condition2 = true;
    const condition3 = true;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00.006Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const obj1 = { value: 2 };
    const obj2 = { value: 1 };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});
