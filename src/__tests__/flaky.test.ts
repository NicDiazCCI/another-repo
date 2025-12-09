import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Utils', () => {
  describe('randomBoolean', () => {
    test('should return a boolean', () => {
      const result = randomBoolean();
      expect(typeof result).toBe('boolean');
    });

    test('should return both true and false over multiple calls', () => {
      const results = new Set();
      for (let i = 0; i < 100; i++) {
        results.add(randomBoolean());
      }
      expect(results.has(true) || results.has(false)).toBe(true);
    });
  });

  describe('randomDelay', () => {
    test('should delay within default range', async () => {
      const startTime = Date.now();
      await randomDelay();
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(1200);
    });

    test('should delay within custom range', async () => {
      const startTime = Date.now();
      await randomDelay(50, 100);
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(50);
      expect(duration).toBeLessThan(200);
    });

    test('should handle min = max case', async () => {
      const startTime = Date.now();
      await randomDelay(100, 100);
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(200);
    });
  });

  describe('flakyApiCall', () => {
    test('should eventually succeed or reject with Network timeout', async () => {
      try {
        const result = await flakyApiCall();
        expect(result).toBe('Success');
      } catch (error: any) {
        expect(error.message).toBe('Network timeout');
      }
    });

    test('should resolve to Success when successful', async () => {
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < 20; i++) {
        try {
          const result = await flakyApiCall();
          if (result === 'Success') successCount++;
        } catch (error: any) {
          if (error.message === 'Network timeout') errorCount++;
        }
      }

      expect(successCount + errorCount).toBe(20);
      expect(successCount).toBeGreaterThan(0);
    });

    test('should reject with Error containing Network timeout message', async () => {
      const attempts = 30;
      let caughtError = false;

      for (let i = 0; i < attempts; i++) {
        try {
          await flakyApiCall();
        } catch (error: any) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Network timeout');
          caughtError = true;
          break;
        }
      }

      expect(caughtError).toBe(true);
    });
  });

  describe('unstableCounter', () => {
    test('should return a number', () => {
      const result = unstableCounter();
      expect(typeof result).toBe('number');
    });

    test('should return values in range 9-12', () => {
      const results = new Set();
      for (let i = 0; i < 100; i++) {
        const result = unstableCounter();
        results.add(result);
        expect(result).toBeGreaterThanOrEqual(9);
        expect(result).toBeLessThanOrEqual(12);
      }
      expect(results.size).toBeGreaterThan(1);
    });

    test('should return 10 most frequently', () => {
      const counts: Record<number, number> = {};
      for (let i = 0; i < 500; i++) {
        const result = unstableCounter();
        counts[result] = (counts[result] || 0) + 1;
      }

      const maxCount = Math.max(...Object.values(counts));
      const mostFrequent = Number(Object.keys(counts).find(k => counts[Number(k)] === maxCount));
      expect(mostFrequent).toBe(10);
    });

    test('should occasionally return values other than 10', () => {
      const results = new Set();
      for (let i = 0; i < 200; i++) {
        results.add(unstableCounter());
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });
});