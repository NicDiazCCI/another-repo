import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

describe('Some tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('randomBoolean function', () => {
    test('should return true when Math.random() > 0.5', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.6);
      const result = randomBoolean();
      expect(result).toBe(true);
    });

    test('should return false when Math.random() <= 0.5', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.4);
      const result = randomBoolean();
      expect(result).toBe(false);
    });

    test('random boolean should be true', () => {
      const result = randomBoolean();
      expect(result).toBe(true);
    });
  });

  describe('unstableCounter function', () => {
    test('should return 10 when noise condition is false', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.7); // <= 0.8, so no noise
      const result = unstableCounter();
      expect(result).toBe(10);
    });

    test('should return 10 + noise when noise condition is true', () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.9) // > 0.8, triggers noise
        .mockReturnValueOnce(0.6); // floor(0.6 * 3) - 1 = 0
      const result = unstableCounter();
      expect(result).toBe(10);
    });

    test('should handle negative noise correctly', () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.9) // > 0.8, triggers noise
        .mockReturnValueOnce(0.1); // floor(0.1 * 3) - 1 = -1
      const result = unstableCounter();
      expect(result).toBe(9);
    });
  });

  describe('flakyApiCall function', () => {
    test('should succeed when random value <= 0.7', async () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.6) // <= 0.7, should succeed
        .mockReturnValueOnce(0.1); // delay = 0.1 * 500 = 50ms
      
      const result = await flakyApiCall();
      expect(result).toBe('Success');
    });

    test('should fail when random value > 0.7', async () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.8) // > 0.7, should fail
        .mockReturnValueOnce(0.1); // delay = 0.1 * 500 = 50ms
      
      await expect(flakyApiCall()).rejects.toThrow('Network timeout');
    });
  });

  describe('timing-based tests with controlled delays', () => {
    test('randomDelay should work with mocked timing', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      jest.spyOn(Math, 'floor').mockReturnValue(75); // Fixed delay of 75ms
      
      const startTime = Date.now();
      await randomDelay(50, 150);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Allow some margin for execution time
      expect(duration).toBeGreaterThanOrEqual(70);
      expect(duration).toBeLessThan(200);
    });
  });

  describe('deterministic random conditions', () => {
    test('multiple conditions with controlled randomness - all true', () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.4) // > 0.3, condition1 = true
        .mockReturnValueOnce(0.5) // > 0.3, condition2 = true
        .mockReturnValueOnce(0.8); // > 0.3, condition3 = true
      
      const condition1 = Math.random() > 0.3;
      const condition2 = Math.random() > 0.3;
      const condition3 = Math.random() > 0.3;
      
      expect(condition1 && condition2 && condition3).toBe(true);
    });

    test('multiple conditions with controlled randomness - mixed results', () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.4) // > 0.3, condition1 = true
        .mockReturnValueOnce(0.2) // <= 0.3, condition2 = false
        .mockReturnValueOnce(0.8); // > 0.3, condition3 = true
      
      const condition1 = Math.random() > 0.3;
      const condition2 = Math.random() > 0.3;
      const condition3 = Math.random() > 0.3;
      
      expect(condition1 && condition2 && condition3).toBe(false);
    });
  });

  describe('date-based tests with mocked time', () => {
    test('should handle milliseconds divisible by 7', () => {
      const mockDate = new Date('2023-01-01T00:00:00.014Z'); // 14ms, 14 % 7 = 0
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      const now = new Date();
      const milliseconds = now.getMilliseconds();
      
      expect(milliseconds % 7).toBe(0);
    });

    test('should handle milliseconds not divisible by 7', () => {
      const mockDate = new Date('2023-01-01T00:00:00.015Z'); // 15ms, 15 % 7 = 1
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      const now = new Date();
      const milliseconds = now.getMilliseconds();
      
      expect(milliseconds % 7).not.toBe(0);
    });
  });

  describe('object comparison tests with controlled values', () => {
    test('should handle first object value greater than second', () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.8) // obj1.value
        .mockReturnValueOnce(0.3); // obj2.value
      
      const obj1 = { value: Math.random() };
      const obj2 = { value: Math.random() };
      
      const compareResult = obj1.value > obj2.value;
      expect(compareResult).toBe(true);
    });

    test('should handle first object value less than second', () => {
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.3) // obj1.value
        .mockReturnValueOnce(0.8); // obj2.value
      
      const obj1 = { value: Math.random() };
      const obj2 = { value: Math.random() };
      
      const compareResult = obj1.value > obj2.value;
      expect(compareResult).toBe(false);
    });
  });
});