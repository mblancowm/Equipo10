# Requirements and Plan

## Objective

Deliver a local training MVP for HR to track hiring progress per role and record explicit human review for finalists who may be considered for future roles.

## Working MVP scope

1. Read existing source-owned candidate profiles.
2. Link a profile to a role and department as a new role application.
3. Record current stage, timestamped stage history, and outcome per application.
4. Track everyone who reaches Final interview. Make a future-role review available only after Screening passed, Final interview, and Not selected.
5. Record HR's Pending, Approved, or Not approved review with reviewer and time.
6. For an Approved review, create a separate application for a future role, including one in another department.

The working stages are Added to role, Initial screening, Screening passed, Interview, Final interview, and Decision. Outcomes are Selected, Not selected, Withdrawn, or null. Skills are optional and unscored.

## Boundaries

- HR/recruiting is the intended persona; SSO is not implemented.
- No admin console, hiring-manager access, or manual profile creation/editing.
- Do not synchronize with the upstream system or use real candidate data in this training increment.
- Do not score, rank, match, recommend, or automate candidate selection.
- Production retention, consent, access controls, cross-department sharing, and deployment remain open for HR policy review.

## Current technical point

The current main branch contains SQLite and Drizzle persistence for synthetic candidate profiles and applications. This proposed change adds department, stage history, and FutureRoleReview records in a follow-up migration and seed. Candidate API operations and the database-connected UI are still not implemented.

## Next implementation sequence

1. Review the data migration, model, contracts, and updated fixture together.
2. Add operation tests for schema setup, seed eligibility, and review integrity with the first API implementation.
3. Implement one API operation and link it to acceptance criteria.
4. Connect one frontend flow, using a clearly labeled fixture only if the API is not ready.
5. Record commands/results in reviewed PRs; keep integration work small and ready for the next milestone.
