import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('Some tests', () => {
  test('random boolean can be true (deterministic)', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter within expected range', () => {
    const result = unstableCounter();
    expect([9, 10, 11]).toContain(result);
  });

  test('flaky API call should succeed (deterministic)', async () => {
    jest.useFakeTimers();
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.2);

    const promise = flakyApiCall();
    await jest.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test, deterministic with fake timers', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const startTime = Date.now();
    const p = randomDelay(50, 150);
    await jest.advanceTimersByTimeAsync(50);
    await p;
    const endTime = Date.now();

    const duration = endTime - startTime;
    expect(duration).toBe(50);
  });

  test('multiple random conditions (deterministic)', () => {
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

  test('date-based flakiness (deterministic)', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.005Z'));
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references (deterministic)', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.2);

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});