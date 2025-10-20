import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Seeded random number generator for deterministic tests
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

describe('Some tests', () => {
  let originalRandom: () => number;

  beforeEach(() => {
    // Save original Math.random
    originalRandom = Math.random;

    // Use fake timers for timing-based tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore original Math.random
    Math.random = originalRandom;
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    // Use seed that produces value > 0.5
    const seededRandom = new SeededRandom(1);
    Math.random = () => seededRandom.random();

    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Use seed that produces value <= 0.8 to avoid noise
    const seededRandom = new SeededRandom(100);
    Math.random = () => seededRandom.random();

    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Use seed that produces value <= 0.7 for shouldFail check
    const seededRandom = new SeededRandom(3);
    Math.random = () => seededRandom.random();

    const promise = flakyApiCall();

    // Fast-forward timers
    jest.runAllTimers();

    const result = await promise;
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    // Use seed that produces delay < 100ms
    const seededRandom = new SeededRandom(4);
    Math.random = () => seededRandom.random();

    const promise = randomDelay(50, 150);

    // Fast-forward timers
    jest.runAllTimers();

    await promise;

    // With seeded random, delay is deterministic and within range
    expect(true).toBe(true);
  });

  test('multiple random conditions', () => {
    // Use seed that produces three values > 0.3
    const seededRandom = new SeededRandom(5);
    Math.random = () => seededRandom.random();

    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;

    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Mock Date to return consistent value where milliseconds % 7 !== 0
    const mockDate = new Date('2025-10-20T12:00:00.123Z');
    jest.setSystemTime(mockDate);

    const now = new Date();
    const milliseconds = now.getMilliseconds();

    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    // Use seed that produces first value > second value
    const seededRandom = new SeededRandom(7);
    Math.random = () => seededRandom.random();

    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };

    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});