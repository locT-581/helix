# Helix Changesets

Welcome to the Helix changesets directory!

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs for the Helix monorepo.

## How to use

When you make a change that requires a version bump:

```bash
pnpm changeset
```

Follow the prompts to:

1. Select which packages have changed
2. Choose the version bump type (major, minor, patch)
3. Write a summary of the changes

Then commit the generated changeset file along with your changes.
