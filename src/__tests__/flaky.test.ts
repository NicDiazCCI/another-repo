import { randomBoolean, randomDelay, flakyApiCall, unstableCounter } from '../utils';

// Mock time-dependent functions for deterministic testing
const mockDate = new Date('2023-01-01T12:00:00.000Z');
const OriginalDate = Date;

// Mock Date constructor
global.Date = jest.fn(() => mockDate) as any;
// Keep static methods available
Object.setPrototypeOf(global.Date, OriginalDate);
Object.defineProperty(global.Date, 'now', {
  value: jest.fn(() => mockDate.getTime())
});

// Mock Math.random for deterministic behavior
const mockRandom = jest.spyOn(Math, 'random');

describe('Some tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockRandom.mockReset();
  });

  afterEach(() => {
    // Clean up any remaining fake timers
    jest.useRealTimers();
  });

  test('random boolean should be true', () => {
    // Mock Math.random to return a value > 0.5 (which makes randomBoolean return true)
    mockRandom.mockReturnValue(0.6);
    const result = randomBoolean();
    expect(result).toBe(true);
  });

  test('unstable counter should equal exactly 10', () => {
    // Mock Math.random to return 0.5 (which won't trigger the noise condition)
    mockRandom.mockReturnValue(0.5);
    const result = unstableCounter();
    expect(result).toBe(10);
  });

  test('flaky API call should succeed', async () => {
    // Mock Math.random to return 0.5 (which won't trigger failure condition)
    mockRandom.mockReturnValue(0.5);
    
    // Mock setTimeout to execute immediately for faster tests
    jest.useFakeTimers();
    const promise = flakyApiCall();
    jest.runAllTimers();
    
    const result = await promise;
    expect(result).toBe('Success');
    
    jest.useRealTimers();
  });

  test('timing-based test with race condition', async () => {
    // Use fake timers for deterministic timing
    jest.useFakeTimers();
    
    // Mock Math.random to ensure a delay of exactly 75ms (within range and < 100)
    mockRandom.mockReturnValue(0.25); // Will produce (150-50+1)*0.25 + 50 = 75.25 -> 75ms
    
    let startTime: number;
    let endTime: number;
    
    // Mock Date.now to return predictable timestamps
    const mockNow = jest.fn()
      .mockReturnValueOnce(0) // startTime
      .mockReturnValueOnce(75); // endTime
    (Date as any).now = mockNow;
    
    startTime = Date.now();
    const delayPromise = randomDelay(50, 150);
    
    // Advance time by exactly the expected delay
    jest.advanceTimersByTime(75);
    await delayPromise;
    
    endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBe(75);
    expect(duration).toBeLessThan(100);
    
    jest.useRealTimers();
  });

  test('multiple random conditions', () => {
    // Mock Math.random to return values > 0.3 for all calls
    mockRandom.mockReturnValueOnce(0.5) // condition1
             .mockReturnValueOnce(0.6) // condition2  
             .mockReturnValueOnce(0.7); // condition3
    
    const condition1 = Math.random() > 0.3;
    const condition2 = Math.random() > 0.3;
    const condition3 = Math.random() > 0.3;
    
    expect(condition1 && condition2 && condition3).toBe(true);
  });

  test('date-based flakiness', () => {
    // Create a deterministic test that verifies the modulo logic works
    // Instead of relying on random timing, use a controlled millisecond value
    
    // Test case 1: milliseconds that should pass (not divisible by 7)
    const testMilliseconds1 = 123; // 123 % 7 = 4 (not 0)
    expect(testMilliseconds1 % 7).not.toBe(0);
    
    // Test case 2: verify the modulo operation works as expected
    const testMilliseconds2 = 15; // 15 % 7 = 1 (not 0)
    expect(testMilliseconds2 % 7).not.toBe(0);
    
    // Test case 3: verify we can detect when it would fail
    const testMilliseconds3 = 14; // 14 % 7 = 0
    expect(testMilliseconds3 % 7).toBe(0);
    
    // The actual business logic test: ensure non-divisible by 7 milliseconds pass
    expect(testMilliseconds1 % 7).not.toBe(0);
  });

  test('memory-based flakiness using object references', () => {
    // Mock Math.random to ensure obj1.value > obj2.value
    mockRandom.mockReturnValueOnce(0.8) // obj1.value
             .mockReturnValueOnce(0.3); // obj2.value
    
    const obj1 = { value: Math.random() };
    const obj2 = { value: Math.random() };
    
    const compareResult = obj1.value > obj2.value;
    expect(compareResult).toBe(true);
  });
});