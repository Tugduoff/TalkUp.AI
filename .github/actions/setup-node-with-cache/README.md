# Setup Node.js with Cache for npm Dependencies

This custom GitHub Action sets up Node.js (v23.x) and caches or installs npm dependencies in a specified subdirectory. It is designed to optimize workflows by reducing dependency installation time through caching.

## Features

- **Node.js Setup**: Installs Node.js version `23.x` using the [actions/setup-node](https://github.com/actions/setup-node) action.
- **Dependency Caching**: Caches the `node_modules` directory for faster builds using the [actions/cache](https://github.com/actions/cache) action.
- **Dependency Installation**: Installs dependencies using `npm ci` in the specified subdirectory.

## Inputs

| Name                | Description                                           | Required | Default |
|---------------------|-------------------------------------------------------|----------|---------|
| `working-directory` | The subdirectory containing the `package.json` file.  | `true`   | None    |
