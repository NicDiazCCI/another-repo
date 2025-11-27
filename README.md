# rule-repo

A TypeScript project demonstrating flaky test patterns and testing utilities.

## Overview

This project contains utility functions that exhibit non-deterministic behavior and a test suite that demonstrates various types of flaky tests commonly encountered in software development.

## Installation

```bash
npm install
```

## Scripts

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run build` - Compile TypeScript to JavaScript
- `npm run clean` - Remove build artifacts

## Project Structure

```
src/
├── utils.ts           # Utility functions with non-deterministic behavior
└── __tests__/
    └── flaky.test.ts  # Test suite demonstrating various flaky test patterns
```

## Utility Functions

- `randomBoolean()` - Returns a random boolean value
- `randomDelay(min, max)` - Returns a promise that resolves after a random delay
- `flakyApiCall()` - Simulates an API call that randomly fails
- `unstableCounter()` - Returns a counter value with random noise

## Technologies

- TypeScript 5.9.2
- Jest 30.0.5
- Node.js

## License

ISC
