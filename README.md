# rule-repo

A demonstration repository for testing flaky test detection and handling in CircleCI pipelines.

## Overview

This project contains intentionally flaky tests to demonstrate common test instability patterns and how they can be detected using CircleCI's test splitting and rerun features.

## Project Structure

```
.
├── src/
│   ├── utils.ts              # Utility functions with non-deterministic behavior
│   └── __tests__/
│       └── flaky.test.ts     # Test suite with intentionally flaky tests
├── .circleci/
│   └── config.yml            # CircleCI pipeline configuration
├── package.json              # Project dependencies and scripts
└── jest.config.js            # Jest testing configuration
```

## Flaky Test Patterns

This repository demonstrates several common flaky test patterns:

1. **Random Boolean Assertion** - Tests that depend on random values
2. **Unstable Counter** - Non-deterministic numeric values with noise
3. **Flaky API Calls** - Simulated network calls with random failures
4. **Timing-Based Tests** - Race conditions and time-dependent assertions
5. **Multiple Random Conditions** - Combined probability failures
6. **Date-Based Flakiness** - Tests dependent on current time
7. **Memory-Based Flakiness** - Object reference comparisons with random values

## Setup

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn

### Installation

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

### Build Project

```bash
npm run build
```

### Clean Build Artifacts

```bash
npm run clean
```

## CircleCI Integration

The project includes a CircleCI configuration that:

- Runs build and test jobs in separate workflows
- Uses test splitting for parallel execution
- Stores test results in JUnit format
- Captures build artifacts

## Purpose

This repository serves as a reference for:

- Understanding common flaky test patterns
- Testing CI/CD pipeline resilience
- Demonstrating test result reporting
- Experimenting with test rerun strategies

## License

ISC