# Contributing

This document outlines the guidelines and workflows we follow to ensure a clear and effective development process.

## Development Strategy

We use **Trunk-Based Development** with Git and GitHub. All development work is done in short-lived branches created from the main branch (`main`).

📌 **Do not work on a branch after it has been merged and deleted.**

## Branching

### Naming Convention

Branch names should follow the format:

```
<trello-id>-<nature>-<description>
```

- `trello-id` (optional): ID of the corresponding Trello ticket (e.g. `abc123de`)
- `nature`: Type of work (e.g. `feature`, `bugfix`, `refactor`, `chore`)
- `description`: Brief purpose of the branch, in kebab-case

**Examples:**

- `ID-9-feature-passport-auth`
- `bugfix-security-breach-header`

**Constraints:**

- Use **kebab-case**
- Keep names under 80 characters
- Ideally match the Trello ticket title

### Creating a Branch

```bash
git checkout main
git pull origin main
git checkout -b ID-XX-feature-description
```

## Commit Messages

We follow the Conventional Commits spec with a few additions:

### Format

```
<type>(<optional-scope>): <description>
```

#### Types

- `feat`: New feature
- `anomaly`: Unexpected behavior that doesn’t break the app
- `bug`: Issue that breaks the app
- `refactor`: Code improvements without behavior changes
- `build`: Changes to build system/configuration
- `tests`: Adding or fixing tests
- `docs`: Documentation updates
- `chore`: Other changes not fitting above
- `ci`: Continuous integration changes

#### Guidelines

- Use **present** tense, imperative form (e.g., "add", not "added")
- Do not capitalize the first letter
- Do not end with a period
- Keep under 80 characters

#### Examples

- `feat(auth): add passport authentication`
- `fix(profile): correct display of user's full name`
- `refactor(database): improve user query performance`
- `docs: clarify installation instructions`

## Pull Requests (PRs)

### Creating a PR

1. Push commits on a new branch from main.
2. Open a PR using the following title format:

```
[trello-id] short description
```

- `trello-id`: optional ID of the corresponding Trello ticket (ex: `abc123de`)
- `short description`: related to the Trello ticket, no capitalization or period, present tense

💡 PRs must be reviewed by at least 1 reviewer before being squashed and merged. GitHub Copilot suggestions are also welcome.

### Merging

When merging a PR, use **squash and merge**.

The final commit message should follow this format:

```
[trello-id] short description (#pr-id)
```

Example:

```
[ID] add passport js auth (#5)
```

## Kanban workflow

We use a Kanban board to manage tasks. The main columns:

1. **Backlog**: initial ideas and tasks
2. **To Do**: tasks planned for the day
3. **In Process**: actively being worked on
4. **Review**: waiting for external validation
5. **Test**: reviewed tasks waiting to be validated in the test environment
6. **Done**: completed tasks

### Tickets

Each ticket should include:

- A short description
- Any relevant subtasks or information
- Appropriate labels:
  - build
  - feature
  - anomaly
  - bug
  - architecture
  - refactor
  - tests

📌 Assign yourself when taking a ticket.

## Releases

### Versioning

We follow Semantic Versioning:

```
MAJOR.MINOR.PATCH release-name
```

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes and minor changes

### Creating a release

1. Create a branch from the oldest commit before the latest release on main.

2. Cherry-pick the relevant commits one by one.
   - Exclude broken/incomplete features.
   - Ensures clean, safe releases.
