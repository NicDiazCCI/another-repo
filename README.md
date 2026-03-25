# rule-repo

A TypeScript project demonstrating flaky test patterns and behaviors for testing and educational purposes.

## Overview

This repository contains utility functions that exhibit non-deterministic behavior and a test suite that demonstrates various types of flaky tests commonly encountered in software development.

## Features

- **Random utilities**: Functions that generate random booleans, delays, and counters
- **Flaky API simulation**: Mock API call that randomly fails to simulate network issues
- **Comprehensive test suite**: Examples of different types of flaky tests including:
  - Random boolean assertions
  - Unstable counter values
  - Network timeout simulations
  - Timing-based race conditions
  - Date-based flakiness
  - Memory-based non-deterministic behavior

## Installation

```bash
npm install
```

## Usage

### Building the project

```bash
npm run build
```

### Running tests

```bash
npm test
```

### Running tests in watch mode

```bash
npm run test:watch
```

### Cleaning build artifacts

```bash
npm run clean
```

## Project Structure

```
.
├── src/
│   ├── utils.ts              # Utility functions with non-deterministic behavior
│   └── __tests__/
│       └── flaky.test.ts     # Test suite demonstrating flaky test patterns
├── .circleci/
│   └── config.yml            # CircleCI pipeline configuration
├── jest.config.js            # Jest testing configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## CI/CD

This project uses CircleCI for continuous integration with two main workflows:

- **build**: Compiles the TypeScript project
- **test**: Runs the test suite with JUnit reporting

## License

ISC
