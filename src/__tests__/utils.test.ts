import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('utils', () => {
  describe('randomBoolean', () => {
    test('should return a boolean', () => {
      const result = randomBoolean();
      expect(typeof result).toBe('boolean');
    });

    test('should return true or false', () => {
      const result = randomBoolean();
      expect([true, false]).toContain(result);
    });

    test('should produce both true and false over multiple calls', () => {
      const results = new Set<boolean>();
      for (let i = 0; i < 100; i++) {
        results.add(randomBoolean());
      }
      expect(results.size).toBe(2);
    });
  });

  describe('randomDelay', () => {
    test('should return a Promise', () => {
      const result = randomDelay();
      expect(result).toBeInstanceOf(Promise);
    });

    test('should resolve after default min delay (100ms)', async () => {
      const startTime = Date.now();
      await randomDelay();
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(100);
    });

    test('should resolve within default max delay (1000ms)', async () => {
      const startTime = Date.now();
      await randomDelay();
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeLessThanOrEqual(1100);
    }, 2000);

    test('should accept custom min and max delays', async () => {
      const startTime = Date.now();
      await randomDelay(50, 100);
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(50);
      expect(duration).toBeLessThanOrEqual(150);
    });

    test('should resolve with undefined', async () => {
      const result = await randomDelay(10, 20);
      expect(result).toBeUndefined();
    });
  });

  describe('flakyApiCall', () => {
    test('should return a Promise', () => {
      const result = flakyApiCall();
      expect(result).toBeInstanceOf(Promise);
    });

    test('should resolve with "Success" or reject with error', async () => {
      const promises = Array.from({ length: 50 }, () => flakyApiCall());
      const results = await Promise.allSettled(promises);

      const fulfilled = results.filter(r => r.status === 'fulfilled');
      const rejected = results.filter(r => r.status === 'rejected');

      fulfilled.forEach(r => {
        if (r.status === 'fulfilled') {
          expect(r.value).toBe('Success');
        }
      });

      rejected.forEach(r => {
        if (r.status === 'rejected') {
          expect(r.reason).toBeInstanceOf(Error);
          expect(r.reason.message).toBe('Network timeout');
        }
      });

      expect(results.length).toBe(50);
    }, 10000);

    test('should produce both success and failure outcomes', async () => {
      const promises = Array.from({ length: 100 }, () => flakyApiCall());
      const results = await Promise.allSettled(promises);

      const hasSuccess = results.some(r => r.status === 'fulfilled');
      const hasFailure = results.some(r => r.status === 'rejected');

      expect(hasSuccess).toBe(true);
      expect(hasFailure).toBe(true);
    }, 15000);
  });

  describe('unstableCounter', () => {
    test('should return a number', () => {
      const result = unstableCounter();
      expect(typeof result).toBe('number');
    });

    test('should return a value near 10', () => {
      const result = unstableCounter();
      expect(result).toBeGreaterThanOrEqual(9);
      expect(result).toBeLessThanOrEqual(11);
    });

    test('should return possible values: 9, 10, or 11', () => {
      const results = new Set<number>();
      for (let i = 0; i < 200; i++) {
        results.add(unstableCounter());
      }
      results.forEach(value => {
        expect([9, 10, 11]).toContain(value);
      });
    });

    test('should produce varying results over multiple calls', () => {
      const results = Array.from({ length: 100 }, () => unstableCounter());
      const uniqueValues = new Set(results);
      expect(uniqueValues.size).toBeGreaterThan(1);
    });
  });
});
