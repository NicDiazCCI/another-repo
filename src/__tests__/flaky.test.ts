import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

class TestSeededRandom {
  private seed: number;

  constructor(seed: number = 54321) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

describe('Some tests', () => {
  test('random boolean should be true', () => {
    const result = randomBoolean(true);
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    const result = unstableCounter(true);
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    const result = await flakyApiCall(true);
    expect(result).toBe('Success');
  });

  test('timing-based test with race condition', async () => {
    const startTime = Date.now();
    await randomDelay(50, 150, true);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeGreaterThanOrEqual(50);
  });

  test('multiple random conditions', () => {
    const rng = new TestSeededRandom(1111);
    const condition1 = rng.next() > 0.3;
    const condition2 = rng.next() > 0.3;
    const condition3 = rng.next() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    const testDate = new Date('2023-01-01T12:00:00.123Z');
    const milliseconds = testDate.getMilliseconds();
    
    expect(milliseconds % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    const rng = new TestSeededRandom(3);
    const obj1 = { value: rng.next() };
    const obj2 = { value: rng.next() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});