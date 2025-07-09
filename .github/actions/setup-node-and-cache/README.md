# Setup Node.js and Cache Dependencies

This composite action sets up Node.js and caches dependencies for both the `web` and `server` directories.

## Inputs

- `node-version` (required): The version of Node.js to set up.

## Usage

```yaml
steps:
  - name: Setup Node.js and Cache Dependencies
    uses: ./.github/actions/setup-node-and-cache
    with:
      node-version: '23.x'
```
