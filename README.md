# rule-repo

A TypeScript project demonstrating flaky test patterns and utilities for testing non-deterministic behavior.

## Overview

This repository contains utility functions that exhibit intentionally flaky behavior, along with test cases that demonstrate common patterns of test instability. It's designed for educational purposes to help identify and understand flaky tests.

## Features

- **Random boolean generation**: Produces non-deterministic true/false values
- **Random delays**: Asynchronous delays with variable timing
- **Flaky API calls**: Simulated network calls with random failures
- **Unstable counters**: Functions that return slightly variable results

## Installation

```bash
npm install
```

## Usage

```typescript
import { randomBoolean, flakyApiCall, unstableCounter, randomDelay } from './src/utils';

// Generate random boolean
const result = randomBoolean();

// Simulate flaky API call
const data = await flakyApiCall();

// Get unstable counter value
const count = unstableCounter();

// Add random delay
await randomDelay(100, 1000);
```

## Scripts

- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run build` - Compile TypeScript to JavaScript
- `npm run clean` - Remove compiled output

## Project Structure

```
.
├── src/
│   ├── utils.ts              # Utility functions with flaky behavior
│   └── __tests__/
│       └── flaky.test.ts     # Test suite demonstrating flaky patterns
├── jest.config.js            # Jest configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## Testing

The test suite includes examples of common flaky test anti-patterns:

- Random boolean assertions
- Timing-based race conditions
- Non-deterministic API calls
- Multiple random conditions
- Date/time-based flakiness
- Memory-based non-determinism

Run the tests to observe flaky behavior:

```bash
npm test
```

## Development

This project uses:
- **TypeScript** for type-safe code
- **Jest** for testing framework
- **ts-jest** for TypeScript support in Jest

## License

ISC
