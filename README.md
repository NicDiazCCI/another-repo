# Rule-Repo

A demonstration project showcasing flaky tests and CircleCI test splitting functionality. This repository contains intentionally unreliable tests designed to illustrate common patterns of test flakiness in real-world applications.

## Overview

This TypeScript project demonstrates various types of flaky tests, including:
- Random boolean assertions
- Timing-based race conditions
- Probabilistic API call failures
- Date/time-dependent assertions
- Memory-based non-deterministic behavior

## Project Structure

```
rule-repo/
├── src/
│   ├── utils.ts              # Utility functions with non-deterministic behavior
│   └── __tests__/
│       └── flaky.test.ts     # Collection of intentionally flaky tests
├── .circleci/
│   └── config.yml            # CircleCI pipeline configuration with test splitting
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── jest.config.js            # Jest test configuration
```

## Prerequisites

- Node.js (v22 or higher recommended)
- npm or yarn

## Installation

```bash
npm install
```

or

```bash
yarn install
```

## Usage

### Build

Compile TypeScript files to JavaScript:

```bash
npm run build
```

### Run Tests

Execute all tests:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

Run tests (alternative command):

```bash
npm run test:run
```

### Clean Build Artifacts

Remove compiled files:

```bash
npm run clean
```

## CircleCI Integration

This project includes a CircleCI configuration (`.circleci/config.yml`) that demonstrates:

- **Build Job**: Compiles TypeScript and stores build artifacts
- **Test Job**: Runs tests with CircleCI test splitting for parallel execution
- Test results are stored in JUnit XML format for CircleCI insights

### Workflows

- **build**: Runs the build-node job
- **test**: Runs the test-node job with test splitting enabled

## Understanding the Flaky Tests

The test suite in `src/__tests__/flaky.test.ts` contains seven different types of flaky tests:

1. **Random Boolean Test**: Expects random value to always be true (50% pass rate)
2. **Unstable Counter Test**: Expects counter with random noise to equal exact value
3. **Flaky API Call Test**: Expects API call with 30% failure rate to always succeed
4. **Timing-Based Test**: Expects random delay to always be under threshold (race condition)
5. **Multiple Random Conditions**: Expects three independent random conditions to all be true
6. **Date-Based Flakiness**: Depends on current milliseconds value
7. **Memory-Based Flakiness**: Compares two random values with non-deterministic outcome

These tests are intentionally unreliable to demonstrate patterns that should be avoided in production test suites.

## Technologies

- **TypeScript**: Static typing for JavaScript
- **Jest**: Testing framework
- **CircleCI**: Continuous integration and test splitting
- **Node.js**: JavaScript runtime

## License

ISC

## Contributing

This is a demonstration project for understanding flaky tests and CircleCI test execution patterns.
