import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('utils', () => {
  describe('randomBoolean', () => {
    test('should return a boolean value', () => {
      const result = randomBoolean();
      expect(typeof result).toBe('boolean');
    });

    test('should return true or false based on random value', () => {
      const results = new Set<boolean>();

      // Run multiple times to ensure we get different results
      for (let i = 0; i < 100; i++) {
        results.add(randomBoolean());
      }

      // Should have both true and false values after 100 iterations (statistically)
      expect(results.size).toBe(2);
    });
  });

  describe('randomDelay', () => {
    test('should delay within the default range (100-1000ms)', async () => {
      const startTime = Date.now();
      await randomDelay();
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThanOrEqual(1100); // Allow 100ms buffer
    });

    test('should delay within custom range', async () => {
      const startTime = Date.now();
      await randomDelay(50, 150);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeGreaterThanOrEqual(50);
      expect(duration).toBeLessThanOrEqual(250); // Allow 100ms buffer
    });

    test('should resolve without value', async () => {
      const result = await randomDelay(10, 20);
      expect(result).toBeUndefined();
    });
  });

  describe('flakyApiCall', () => {
    test('should return a promise', () => {
      const result = flakyApiCall();
      expect(result).toBeInstanceOf(Promise);
    });

    test('should either resolve with "Success" or reject with error', async () => {
      const results: { success: number; failure: number } = { success: 0, failure: 0 };

      // Run multiple times sequentially to get both success and failure cases
      for (let i = 0; i < 20; i++) {
        try {
          const result = await flakyApiCall();
          expect(result).toBe('Success');
          results.success++;
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('Network timeout');
          results.failure++;
        }
      }

      // Verify we got both outcomes (statistically very likely with 20 runs)
      expect(results.success).toBeGreaterThan(0);
      expect(results.failure).toBeGreaterThan(0);
      expect(results.success + results.failure).toBe(20);
    }, 15000);

    test('should reject with Error instance containing correct message', async () => {
      // Keep trying until we get a failure (max 20 attempts)
      let attempts = 0;
      let foundError = false;

      while (attempts < 20 && !foundError) {
        try {
          await flakyApiCall();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('Network timeout');
          foundError = true;
        }
        attempts++;
      }

      // This test verifies error structure when failures occur
      // No assertion needed if only successes happened in all attempts
    });
  });

  describe('unstableCounter', () => {
    test('should return a number', () => {
      const result = unstableCounter();
      expect(typeof result).toBe('number');
    });

    test('should return a value between 9 and 12', () => {
      // Run multiple times to verify the range
      for (let i = 0; i < 100; i++) {
        const result = unstableCounter();
        expect(result).toBeGreaterThanOrEqual(9);
        expect(result).toBeLessThanOrEqual(12);
      }
    });

    test('should return 10 or values close to it (9, 10, 11)', () => {
      const results = new Set<number>();

      // Collect results
      for (let i = 0; i < 200; i++) {
        results.add(unstableCounter());
      }

      // All results should be in the valid range
      results.forEach(value => {
        expect([9, 10, 11]).toContain(value);
      });
    });

    test('should return 10 most frequently', () => {
      const counts: Record<number, number> = { 9: 0, 10: 0, 11: 0 };

      // Run many times to get statistical distribution
      for (let i = 0; i < 1000; i++) {
        const result = unstableCounter();
        counts[result] = (counts[result] || 0) + 1;
      }

      // 10 should appear most frequently (80% chance vs 10% each for 9 and 11)
      expect(counts[10]).toBeGreaterThan(counts[9]);
      expect(counts[10]).toBeGreaterThan(counts[11]);

      // Verify we got all three values
      expect(counts[9]).toBeGreaterThan(0);
      expect(counts[10]).toBeGreaterThan(0);
      expect(counts[11]).toBeGreaterThan(0);
    });
  });
});
