# rule-repo

A TypeScript repository demonstrating flaky test patterns and CircleCI testing workflows.

## Overview

This project contains utility functions that exhibit non-deterministic behavior and a test suite designed to demonstrate flaky test scenarios. It's configured with CircleCI for continuous integration and automated testing.

## Features

- **Utility Functions**: Random behavior generators including:
  - `randomBoolean()`: Returns a random boolean value
  - `randomDelay()`: Creates a promise with random delay timing
  - `flakyApiCall()`: Simulates an API call that randomly fails
  - `unstableCounter()`: Returns a number with occasional noise

- **Test Suite**: Comprehensive test cases demonstrating various flaky test patterns:
  - Random boolean assertions
  - Timing-based race conditions
  - Non-deterministic API call testing
  - Memory-based reference comparisons

## Project Structure

```
rule-repo/
├── src/
│   ├── utils.ts              # Utility functions with random behavior
│   └── __tests__/
│       └── flaky.test.ts     # Test suite with flaky test patterns
├── .circleci/
│   └── config.yml            # CircleCI pipeline configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── jest.config.js            # Jest testing configuration
```

## Prerequisites

- Node.js (v22 or higher recommended)
- npm or yarn

## Installation

```bash
npm install
```

## Usage

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Testing

Run tests once:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Clean

Remove build artifacts:

```bash
npm clean
```

## CircleCI Integration

This project uses CircleCI for continuous integration with two main workflows:

1. **Build Workflow**: Compiles the TypeScript project and stores build artifacts
2. **Test Workflow**: Runs the test suite with test splitting and parallel execution

The pipeline configuration includes:
- Automated dependency installation
- Test result collection with JUnit reporting
- Build artifact storage
- Test file distribution for parallel execution

## Development

The project uses:
- **TypeScript 5.9+** for type-safe JavaScript
- **Jest 30** for testing framework
- **ts-jest** for TypeScript Jest integration
- **CircleCI Node Orb 7** for CI/CD

## License

ISC
