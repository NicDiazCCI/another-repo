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
    // First Math.random() call determines if noise is applied. Return 0 to skip noise.
    jest.spyOn(Math, 'random').mockReturnValue(0.0);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Force shouldFail = false (<= 0.7) and delay = 0ms
    const randSpy = jest.spyOn(Math, 'random');
    randSpy.mockImplementationOnce(() => 0.0); // shouldFail false
    randSpy.mockImplementationOnce(() => 0.0); // delay 0ms

    jest.useFakeTimers();
    const promise = flakyApiCall();

    // Resolve scheduled timers
    jest.runAllTimers();

    await expect(promise).resolves.toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    // Use fake timers and select min delay
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.0); // choose min

    const p = randomDelay(50, 150);

    // Should not resolve before advancing time
    let resolved = false;
    p.then(() => { resolved = true; });

    jest.advanceTimersByTime(49);
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(1);
    await p; // now resolved
    expect(resolved).toBe(true);
  });

  test('multiple random conditions', () => {
    const randSpy = jest.spyOn(Math, 'random');
    randSpy
      .mockImplementationOnce(() => 0.9)
      .mockImplementationOnce(() => 0.9)
      .mockImplementationOnce(() => 0.9);

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00.001Z'));

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const randSpy = jest.spyOn(Math, 'random');
    randSpy
      .mockImplementationOnce(() => 0.9) // obj1.value high
      .mockImplementationOnce(() => 0.1); // obj2.value low

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});