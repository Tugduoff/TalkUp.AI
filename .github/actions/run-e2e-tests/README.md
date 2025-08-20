# Playwright E2E Tests Action

This custom GitHub Action is designed to run end-to-end (e2e) tests using Playwright. It ensures that the application's functionality is thoroughly tested across supported browsers.

## Features

This action performs the following steps:

- **Cache Playwright Browsers**: Caches the Playwright browser binaries to speed up subsequent runs.
- **Install System Dependencies**: Installs the required system dependencies for Playwright.
- **Install Playwright Browsers**: Installs the necessary Playwright browser binaries if not already cached.
- **Run E2E Tests**: Executes the Playwright end-to-end tests for the `web` application.
- **Upload Test Reports**: Uploads the Playwright test report as an artifact for later review.
