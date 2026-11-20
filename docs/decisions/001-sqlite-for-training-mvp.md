# Decision 001: SQLite for the training MVP

- Status: Proposed for team review
- Date: 2026-11-20

## Context

The first persisted workflow contains candidate profiles and role applications. The repository API runs on Bun, already includes Drizzle ORM, and currently has no database driver or deployed multi-instance requirement.

## Decision

Use SQLite through Bun's built-in `bun:sqlite` driver and Drizzle's Bun SQLite adapter for the first training MVP. Keep the database file local and untracked. Create its schema through versioned SQL migrations, and seed it from `docs/data/fixtures/template.synthetic.json`.

Persist only `CandidateProfile` and `RoleApplication` in this slice. Store the optional skills summary as JSON text; it remains descriptive, with no ratings or history. Keep stage and outcome as nullable/free-form strings according to the current model.

## Consequences

- Teammates can create the same local database with the migration and seed commands without sharing a binary database file.
- SQLite supports the current small prototype without a separate database service.
- This does not add API CRUD routes, authentication, SSO mappings, or role-based authorization.
- User and authorization records remain a discussion fixture until the team agrees on identity mapping and permissions.
- Revisit the database choice before a hosted multi-instance deployment or if write concurrency and operational needs outgrow a local SQLite file. PostgreSQL would be the likely next option.

## Review

This choice and the persistence scope require team review before merge.
