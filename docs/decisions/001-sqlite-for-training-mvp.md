# Decision 001: SQLite for the Training MVP

- Status: Working choice; confirm with the team
- Date: 2026-11-20

## Context

The training MVP needs a reproducible local store for source-profile references, role applications, stage history, and explicit HR reuse reviews. The API runs on Bun, and Drizzle is already in the workspace. The training repository uses synthetic data only.

## Decision

Use SQLite through Bun's built-in bun:sqlite driver and Drizzle for the local training database. Keep the database file untracked. Version schema changes as SQL migrations and seed from docs/data/fixtures/template.synthetic.json.

The current schema contains CandidateProfile references, RoleApplications, and FutureRoleReviews. Skills remain descriptive JSON text. Application stages, stage history, and outcomes belong to each role process.

## Consequences

- Teammates can create a local database and load fabricated data without sharing a binary database file.
- A future-role review requires prior Screening passed and Final interview stages and a Not selected outcome; the seed validates this relationship.
- The migration adds department and stage history while preserving existing rows, and creates a review table tied to the triggering application.
- API CRUD, authentication, SSO identity mapping, and authorization are not implemented.
- This choice does not determine production hosting, backup/recovery, retention, consent, or access policy.

## Revisit when

The project moves to hosted multi-instance use or when concurrency and operational needs exceed a local training database.
