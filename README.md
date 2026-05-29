# rule-repo

A TypeScript sandbox repository used to exercise CI workflows, scheduled tasks, and flaky-test behavior.

## Requirements

- Node.js (see `package.json` engines / dev dependencies)
- npm or yarn

## Install

```bash
npm install
```

## Scripts

- `npm test` — run the Jest test suite
- `npm run test:watch` — run Jest in watch mode
- `npm run build` — compile TypeScript to `dist/`
- `npm run clean` — remove the `dist/` directory
- `npm run task:custom` — run the scheduled custom task (`scripts/custom-task.js`)
- `npm run task:custom:validate` — run the custom task and validate its JSON output
- `npm run task:custom:validate:fake` — validate with a fixed `FAKE_NOW` timestamp

## Project layout

- `src/` — TypeScript source (utilities under `src/utils.ts`)
- `src/__tests__/` — Jest test files
- `scripts/` — standalone Node scripts (custom scheduled task)
- `.circleci/` — CircleCI pipeline configuration
- `jest.config.js`, `tsconfig.json` — tool configuration
