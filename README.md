# rule-repo

A TypeScript testing repository demonstrating flaky test patterns and utilities.

## Overview

This project contains utilities and test cases that demonstrate various types of flaky tests, including random behaviors, timing-based conditions, and unstable states. It's configured with Jest for testing and TypeScript for type safety.

## Installation

```bash
npm install
```

## Usage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test:run
```

### Build

```bash
# Compile TypeScript to JavaScript
npm run build

# Clean build artifacts
npm run clean
```

## Project Structure

- `src/utils.ts` - Utility functions that exhibit flaky behavior
- `src/__tests__/` - Test suite with various flaky test patterns

## Utilities

The project includes several utilities for demonstrating test flakiness:

- `randomBoolean()` - Returns a random boolean value
- `randomDelay(min, max)` - Creates a random delay promise
- `flakyApiCall()` - Simulates an API call that randomly fails
- `unstableCounter()` - Returns a value with random noise

## License

ISC
