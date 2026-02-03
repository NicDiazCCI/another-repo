# rule-repo

A TypeScript test repository demonstrating flaky test patterns and CircleCI integration.

## Overview

This project contains intentionally flaky tests designed to illustrate common test reliability issues in CI/CD environments. It serves as a testing ground for understanding and resolving non-deterministic test behavior.

## Features

- **Utility Functions**: Various utility functions that exhibit non-deterministic behavior
  - `randomBoolean()`: Returns a random boolean value
  - `randomDelay()`: Creates a random delay between specified min/max values
  - `flakyApiCall()`: Simulates an API call that randomly fails
  - `unstableCounter()`: Returns a value that occasionally deviates from expected output

- **Flaky Test Suite**: Comprehensive test cases demonstrating different types of flakiness:
  - Random boolean assertions
  - Unstable counter values
  - Network timeout simulations
  - Timing-based race conditions
  - Multiple random conditions
  - Date-based flakiness
  - Memory/reference-based flakiness

## Installation

```bash
npm install
```

## Scripts

- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run build` - Compile TypeScript to JavaScript
- `npm run clean` - Remove build artifacts

## CI/CD

This project uses CircleCI for continuous integration with two workflows:

- **Build Workflow**: Compiles the TypeScript project and stores artifacts
- **Test Workflow**: Runs the test suite with parallel test execution and JUnit reporting

## Project Structure

```
.
├── src/
│   ├── __tests__/
│   │   └── flaky.test.ts    # Flaky test cases
│   └── utils.ts              # Utility functions
├── .circleci/
│   └── config.yml            # CircleCI configuration
├── jest.config.js            # Jest configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Jest** - Testing framework
- **CircleCI** - Continuous integration platform
- **Node.js** - Runtime environment

## License

ISC
