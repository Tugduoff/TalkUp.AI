# Setup Node.js with Cache for npm Dependencies

This custom GitHub Action sets up Node.js (v23.x) and caches or installs npm dependencies. It supports both npm workspaces (root directory) and subdirectory-based projects. Designed to optimize workflows by reducing dependency installation time through caching.

## Features

- **Node.js Setup**: Installs Node.js version `23.x` using the [actions/setup-node](https://github.com/actions/setup-node) action.
- **Dependency Caching**: Caches the `node_modules` directory and npm cache for faster builds using the [actions/cache](https://github.com/actions/cache) action.
- **Workspace Support**: Works with npm workspaces when no working directory is specified.
- **Dependency Installation**: Installs dependencies using `npm ci` in the specified directory.

## Inputs

| Name                | Description                                                                | Required | Default    |
| ------------------- | -------------------------------------------------------------------------- | -------- | ---------- |
| `working-directory` | The directory containing the `package.json` file (optional for workspace). | `false`  | `.` (root) |

## Usage

### For npm workspace (root directory)
```yaml
steps:
  - name: Setup Node.js and Install Dependencies
    uses: ./.github/actions/setup-node-with-cache
```

### For subdirectory project
```yaml
steps:
  - name: Setup Node.js and Install Dependencies
    uses: ./.github/actions/setup-node-with-cache
    with:
      working-directory: ./web
```
