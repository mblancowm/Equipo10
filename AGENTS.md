# Project Guidance

## Product scope

Candidate Pipeline is a local training MVP for HR to track role-by-role hiring history and review finalists for future opportunities. Candidate profiles are read-only source references. A future role always receives a separate application.

The working stages are Added to role, Initial screening, Screening passed, Interview, Final interview, and Decision. Outcomes are Selected, Not selected, Withdrawn, or null. A future-role review requires a prior Final interview and Not selected outcome, followed by an explicit human HR decision.

## Technology and data

- Bun workspaces; Hono API; React/Vike frontend; shared Zod contracts.
- Drizzle with SQLite is the current working choice for the local training database.
- Use only fabricated candidate records in fixtures, seeds, and screenshots.
- Candidate skills are descriptive and unscored.
- Do not add AI scoring, ranking, matching, recommendations, or automated hiring decisions.
- Do not create or edit upstream candidate profiles.

## Security and policy

The intended user is HR/recruiting with company SSO, which is not implemented. Do not use real candidate data until an HR policy owner confirms identity mapping, access, retention, consent, and cross-department sharing. Do not infer these decisions from synthetic fixtures.

## Change workflow

- Link implementation to docs/qa/acceptance.md and a backlog item.
- Keep the model, shared Zod contracts, migration, seed, and UI aligned.
- Record actual commands and results in the PR. Do not claim checks that were not run.
- Review data handling, migration effects, and unresolved policy questions before merge.
- Never commit credentials, populated environment files, real candidate data, resumes, or secrets.
