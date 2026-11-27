# Team 10 · Candidate Pipeline

Candidate Pipeline is a training MVP concept for HR to track role-specific hiring history and review finalists for future opportunities. The same person can have separate applications across departments. Profiles remain read-only references to the upstream source.

## Current implementation status

- The repository includes a local SQLite database, Drizzle schema, versioned migrations, and a deterministic synthetic fixture.
- Migration 0002 adds application department and stage history, and creates future-role review records.
- The API currently implements only the health check. Candidate operations and frontend/database connection remain to be built.
- SQLite is for local training data; SSO and production access/retention policy are not implemented.

## Quick start

Install Bun and run from the repository root:

    bun install
    bun run dev

Run one workspace:

    bun run dev:api
    bun run dev:web

Create or update the local SQLite database and seed synthetic data:

    bun run --filter @equipo10/api db:setup

The database defaults to data/equipo10.sqlite and is ignored by Git. Set DATABASE_PATH to use another location. The seed upserts fixture records; it does not delete records removed from a later fixture revision.

Check TypeScript:

    bun run typecheck

## MVP data rules

Working stages: Added to role, Initial screening, Screening passed, Interview, Final interview, Decision.

Working outcomes: Selected, Not selected, Withdrawn, or null until entered.

Only a human HR review may approve future consideration after Final interview and Not selected. A new role creates a separate application. The training sample is fabricated and unscored. See docs/data/model.md and docs/qa/acceptance.md.
