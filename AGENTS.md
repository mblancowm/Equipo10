## Product Purpose

The team is preparing a training MVP for tracking people who enter hiring processes across hiring waves, including candidates who participated in interviews regardless of whether they came through a referral or another channel. The intended workflow links an existing candidate profile to a role, records progress and outcome for that role, and helps recruiters review prior candidates for future openings. The app is a candidate and hiring-pipeline tracker; it does not replace the source recruiting system.

The current first-slice concept and unresolved scope are recorded in `docs/product/brief.md`, `docs/product/screen-flow.md`, and `docs/requirements-and-plan.md`. The concept prototype is a discussion artifact; its placeholder reuse rules and skill ratings are not approved business logic.

## Repo Map

- `apps/api/`: Bun + Hono API, route handlers, database integration, tests, and Drizzle migrations.
- `apps/web/`: React + Vike web application.
- `packages/contracts/`: shared Zod contracts.
- `docs/product/brief.md`: user, need, current context, constraints, and scope.
- `docs/product/screen-flow.md`: current role-pipeline concept and screen states.
- `docs/requirements-and-plan.md`: objectives, scope, training plan, team coordination, and open decisions.
- `docs/architecture-and-design.md`: components, data flow, contracts, and initial model.
- `docs/architecture/`: space for architecture diagrams and decision records.
- `docs/api/contract.md`: API operations and shared payloads.
- `docs/data/`: initial model and synthetic fixtures.
- `docs/backlog/`: proposed and approved work items.
- `docs/qa/acceptance.md`: acceptance criteria and verification evidence.
- `docs/delivery/`: delivery and release notes.
- `docs/decisions/`: technical decisions.
- `.codex/instructions.md`: pointer to this file.
- `.github/pull_request_template.md`: PR handoff.

## Tech Stack

- Runtime and package manager: Bun workspaces.
- API: Hono on Bun.
- Web: React, strict TypeScript, Vike, and `vike-react`; Vike uses Vite.
- Database access: Drizzle ORM with SQL. SQLite via Bun's built-in `bun:sqlite` driver is the proposed database for the training MVP, pending team review.
- Shared request/response contracts: Zod in `packages/contracts`.
- AI SDK/provider and any product-facing AI capability: not selected or approved. Do not infer automated candidate evaluation, scoring, screening, or recommendations from the prototype discussion.

## Setup Commands

Run from the repository root:

- Install dependencies: `bun install`
- Start API and web: `bun run dev`
- Start API only: `bun run dev:api`
- Start web only: `bun run dev:web`
- Set up SQLite and seed synthetic data: `bun run --filter @equipo10/api db:setup`
- Check TypeScript: `bun run typecheck`

## Backlog Rules

Record proposed and approved work in `docs/backlog/`, and link implementation to its acceptance criteria. Keep dependencies, ownership, and status visible in the project plan. Preserve the distinction between team agreements, prototype suggestions, and unresolved decisions. Do not add product behavior, AI capabilities, or database choices that the team has not approved.

## Security

- Never commit credentials, tokens, populated environment files, candidate resumes, or real candidate data.
- Use synthetic candidate profiles, applications, skills, and outcomes in fixtures and tests.
- Validate API inputs and shared payloads with Zod.
- Candidate status, interview outcomes, skills, and any future-candidate eligibility remain human-recorded and human-reviewed. Do not create automated hiring decisions or infer candidate rankings.
- Review changes to candidate data access, retention, secrets, external integrations, and AI capabilities with a human before merging.

## PR Handoff

Use `.github/pull_request_template.md`. Keep changes within approved scope; align screens, API contracts, shared types, data model, and acceptance criteria. Report commands run and results. Call out schema/migration effects, candidate-data handling, unresolved product decisions, and any required human review.
