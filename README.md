# Team 10 · Candidate Pipeline

An application for tracking candidates who have participated in interviews, whether referred or sourced through another channel, across roles and hiring waves. Recruiters can link an existing profile to a role and record the stage and outcome of that role-specific application. Integration with the existing recruiting source is not part of the current setup.

## Quick start

Install Bun, then run these commands from the repository root:

```sh
bun install
bun run dev
```

The API and web development servers start together. To run one workspace:

```sh
bun run dev:api
bun run dev:web
```

Create or update the local SQLite database and load the deterministic synthetic fixture:

```sh
bun run --filter @equipo10/api db:setup
```

The database defaults to `data/equipo10.sqlite` and is ignored by Git. Set `DATABASE_PATH` to use another location. To reapply only unapplied schema changes or rerun the fixture seed separately:

```sh
bun run --filter @equipo10/api db:migrate
bun run --filter @equipo10/api db:seed
```

Check TypeScript:

```sh
bun run typecheck
```

## Workspaces

- `apps/api`: Bun + Hono API; Drizzle ORM with Bun's built-in SQLite driver.
- `apps/web`: React + Vike (`vike-react`).
- `packages/contracts`: shared Zod schemas and types.

All candidate records in this repository must be synthetic. Candidate reuse rules, skill interpretation, hiring-manager access, and source-system integration remain open. See [AGENTS.md](AGENTS.md), the [product brief](docs/product/brief.md), the [screen flow](docs/product/screen-flow.md), and the [project plan](docs/requirements-and-plan.md).
