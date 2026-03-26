# rule-repo

A demonstration repository showcasing CircleCI test execution and flaky test scenarios.

## Overview

This project contains intentionally flaky tests designed to demonstrate test reliability issues and CircleCI's test splitting capabilities. It includes various types of non-deterministic test patterns commonly found in real-world applications.

## Features

- **Flaky Test Scenarios**: Multiple types of non-deterministic tests including:
  - Random boolean assertions
  - Timing-based race conditions
  - Network simulation with random failures
  - Date/time-dependent assertions
  - Probabilistic test conditions

- **CircleCI Integration**:
  - Automated build and test workflows
  - Test splitting and parallelization support
  - JUnit XML test result reporting
  - Build artifact storage

## Prerequisites

- Node.js (v14 or higher)
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

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Build TypeScript

```bash
npm run build
```

### Clean Build Artifacts

```bash
npm run clean
```

## Project Structure

```
.
├── .circleci/          # CircleCI configuration
│   └── config.yml      # Build and test workflows
├── src/
│   ├── utils.ts        # Utility functions with flaky behavior
│   └── __tests__/
│       └── flaky.test.ts  # Intentionally flaky test suite
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── jest.config.js      # Jest test configuration
```

## CircleCI Workflows

This repository includes two workflows:

1. **Build Workflow**: Compiles TypeScript and stores build artifacts
2. **Test Workflow**: Runs the test suite with CircleCI's test splitting for parallelization

## Flaky Test Types

The test suite demonstrates several common flaky test patterns:

- **Random Boolean Tests**: Tests that depend on random values
- **Timing Race Conditions**: Tests sensitive to execution timing
- **Simulated API Failures**: Tests with probabilistic network failures
- **Counter Instability**: Tests with non-deterministic numeric values
- **Date-Based Flakiness**: Tests that depend on current time/date
- **Memory-Based Randomness**: Tests using random object comparisons

## License

ISC