# API Contract

## Status

The API currently implements only GET /api/health. Candidate operations below are proposed. Shared Zod schemas in packages/contracts define the working stage, outcome, application, stage-history, and review fields used by the synthetic seed.

## Working payloads

CandidateProfile has candidateId, sourceChannel, and optional unscored skills.

RoleApplication has applicationId, candidateId, role, department, stage, stageHistory, outcome, and updatedAt. Each stageHistory event contains a valid stage and reachedAt timestamp. Outcomes are Selected, Not selected, Withdrawn, or null.

FutureRoleReview has reviewId, candidateId, triggeringApplicationId, status, reviewerId, and reviewedAt. Pending requires a null reviewer and timestamp. Approved and Not approved require both.

## Proposed operations

- GET /api/candidate-profiles/{candidateId}: return an existing source profile read-only.
- GET /api/role-applications?role=&department=&stage=&outcome=: list applications with optional exact-match filters and linked read-only profile.
- POST /api/role-applications: accept candidateId, role, and department; create a separate application at Added to role with a first stage-history event and null outcome.
- PATCH /api/role-applications/{applicationId}: accept a stage, an outcome, or both. A stage change appends an event; an outcome change remains separate.
- POST /api/candidate-profiles/{candidateId}/reuse-reviews: accept triggeringApplicationId and create a Pending review only if that application's history includes Screening passed and Final interview and its outcome is Not selected.
- PATCH /api/reuse-reviews/{reviewId}: accept Approved or Not approved. In a real authenticated service, reviewerId comes from the HR SSO identity and is not accepted from the client.

After an Approved review, HR may create a new role application in the same or another department. The prior application and review remain unchanged.

## Validation and errors

- Validate requests and responses against packages/contracts.
- Return 400 VALIDATION_ERROR for invalid data, 404 NOT_FOUND for missing records, and 500 INTERNAL_ERROR for unexpected failures.
- The database seed additionally checks that every fixture review refers to a same-candidate application that passed screening, reached Final interview, and ended Not selected.

## Not implemented

No candidate CRUD, role CRUD, authentication, SSO mapping, API database routes, source-system integration, or production access controls are implemented. The SQLite migration/seed is local training infrastructure only. Do not use real candidate data.
