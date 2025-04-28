# Full CI Workflow

This workflow is designed to ensure code quality and maintain consistency across the project by running automated checks on every push or pull request to the `main` branch.

## Workflow Triggers

The workflow is triggered in the following scenarios:
- **Push Events**: Whenever code is pushed to the `main` branch.
- **Pull Requests**: Whenever a pull request is opened or updated.

## Jobs

### 1. Code Quality Job

This job runs on an `ubuntu-latest` runner and performs the following steps:

#### Steps:
1. **Checkout Code**:
   - Uses the [actions/checkout](https://github.com/actions/checkout) action to clone the repository into the runner.

2. **Set Up Node.js and Cache Dependencies**:
   - Uses the custom `setup-node-with-cache` action to:
     - Set up Node.js version `23.x`.
     - Cache and install dependencies for the `web` and `server` subprojects:
       - `web`: Installs dependencies in the `web/` directory.
       - `server`: Installs dependencies in the `server/` directory.

3. **Run Code Quality Checks**:
   - Executes the custom `run-quality-check` action to perform the following checks:
     - **Linting**: Ensures code adheres to the project's linting rules.
     - **Prettier Formatting**: Verifies that the code is properly formatted.
     - **TypeScript Checks**: Runs TypeScript type-checking to catch type errors in the `web` folder.

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
