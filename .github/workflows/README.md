# CI/CD Workflows

This repository uses GitHub Actions with parallel workflows for optimal performance and better failure isolation.

## Workflow Triggers

All workflows are triggered on:

- **Push Events**: When code is pushed to the `main` branch
- **Pull Requests**: When a pull request is opened or updated

## Workflows

### 1. Code Quality (`code-quality.yml`)

Runs code quality checks in parallel:

- **ESLint**: Linting rules enforcement
- **Prettier**: Code formatting verification
- **TypeScript**: Type checking for the web folder

### 2. Unit Tests (`unit-tests.yml`)

Executes unit testing pipeline:

- **Vitest**: Unit test execution
- **Coverage**: Code coverage reporting with 80% threshold

### 3. E2E Tests (`e2e-tests.yml`)

Runs end-to-end tests using **Playwright Docker image**:

- **Container**: `mcr.microsoft.com/playwright:v1.53.2-jammy`
- **Benefits**: No browser installation, faster execution, consistent environment
- **Browsers**: Chromium, Firefox, WebKit
- **Artifacts**: Test reports uploaded on failure

### 4. Mirror Push (`mirror-push.yml`)

Syncs repository to mirror after **all workflows succeed**:
- **Trigger**: `workflow_run` event when all 3 workflows complete successfully
- **Condition**: Only pushes to mirror on main branch
- **Target**: Epitech mirror repository

## Custom Actions

### 1. `setup-node-with-cache`

This custom action is defined in `.github/actions/setup-node-with-cache/action.yml`. It performs the following tasks:

- Sets up Node.js version `23.x` using the [actions/setup-node](https://github.com/actions/setup-node) action.
- Caches `node_modules` for faster dependency installation using the [actions/cache](https://github.com/actions/cache) action.
- Installs dependencies using `npm ci` in the specified `working-directory`.

#### Inputs:

- `working-directory`: The subdirectory containing the `package.json` and `node_modules`.

### 2. `run-quality-check`

This custom action is defined in `.github/actions/run-quality-check/action.yml`. It performs the following tasks:

- Runs ESLint to check for linting issues.
- Runs Prettier to check for formatting issues.
- Runs TypeScript (`tsc`) to ensure type safety in the `web` folder.

### 3. `run-coverage-check`

This custom action is defined in `.github/actions/run-coverage-check/action.yml`. It performs the following tasks:
- Runs unit tests and generates a code coverage report.

### 4. `run-e2e-tests`

This custom action is defined in `.github/actions/run-e2e-tests/action.yml`. It performs the following tasks:
- Runs end-to-end tests to validate the application's functionality.
