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

2. **Set Up Node.js**:
   - Uses the [actions/setup-node](https://github.com/actions/setup-node) action to set up Node.js version `23.x` for the workflow.

3. **Install Dependencies**:
   - Installs dependencies for the `web` and `server` subprojects using `npm ci`:
     - `web`: Installs dependencies in the `web/` directory.
     - `server`: Installs dependencies in the `server/` directory.

4. **Run Code Quality Checks**:
   - Executes the custom `run-quality-check` action to perform the following checks:
     - **Linting**: Ensures code adheres to the project's linting rules.
     - **Prettier Formatting**: Verifies that the code is properly formatted.
     - **TypeScript Checks**: Runs TypeScript type-checking to catch type errors.

        *For more info, see the linked README file in the run-quality-check folder*
