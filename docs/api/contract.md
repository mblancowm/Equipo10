# API Contract

## Status

This is a **draft for Frontend, Backend/API, Data, and QA review**. It describes the first proposed recruiter flow using the conceptual model and synthetic fixture. It does not approve authentication, persistence, production access, or final stage and outcome values.

The profile and application fields align with [`docs/data/model.md`](../data/model.md). All examples use synthetic identifiers and data.

## Implemented: Health Check

- **Method and path:** `GET /api/health`
- **Request:** no body.
- **Success:** `200`, `{ "status": "ok" }`.
- **Implementation:** `apps/api/src/routes/health.ts`.

## Proposed Operations

### Read a candidate profile

`GET /api/candidate-profiles/{candidateId}`

Returns the existing profile without changing it. The current model supports lookup by `candidateId`; it has no approved name, email, or free-text search fields.

**Success — `200`**

```json
{
  "data": {
    "candidateId": "candidate-sample-001",
    "sourceChannel": "Referral",
    "skills": ["SQL", "Reporting"]
  }
}
```

**Not found — `404`**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Candidate profile not found"
  }
}
```

### List role applications for the pipeline

`GET /api/role-applications?role={role}&stage={stage}`

Both query parameters are optional exact-match filters. With no filters, the response contains all applications. Each row includes its read-only candidate profile so the pipeline can display the linked profile, role, stage, and outcome together.

**Success — `200`**

```json
{
  "data": [
    {
      "applicationId": "application-sample-001",
      "candidateId": "candidate-sample-001",
      "role": "Data Analyst",
      "stage": "Interview",
      "outcome": null,
      "updatedAt": "2026-01-15T10:00:00Z",
      "candidateProfile": {
        "candidateId": "candidate-sample-001",
        "sourceChannel": "Referral",
        "skills": ["SQL", "Reporting"]
      }
    }
  ]
}
```

The draft omits pagination because the fixture is small. Agree on pagination and ordering before using this operation with a larger data set.

### Create a role application

`POST /api/role-applications`

Creates an application for an existing profile. The profile remains unchanged. The request supplies the initial `stage` because the model requires one and no default stage has been agreed. The draft has the API assign `applicationId` and `updatedAt`, and initialize `outcome` to `null`.

**Request**

```json
{
  "candidateId": "candidate-sample-002",
  "role": "Data Engineer",
  "stage": "Screening"
}
```

**Success — `201`**

```json
{
  "data": {
    "applicationId": "application-sample-004",
    "candidateId": "candidate-sample-002",
    "role": "Data Engineer",
    "stage": "Screening",
    "outcome": null,
    "updatedAt": "2026-01-18T12:00:00Z"
  }
}
```

**Invalid request — `400`**

```json
{
  "candidateId": "candidate-sample-002",
  "role": "Data Engineer",
  "stage": ""
}
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "issues": [
      { "path": ["stage"], "message": "Must be a non-empty string" }
    ]
  }
}
```

For this example, the request contains an empty `stage`. Clients should branch on the error `code` and issue `path`; the message is for display.

**Candidate profile not found — `404`** uses the `NOT_FOUND` error shape above.

### Update a role application's stage or outcome

`PATCH /api/role-applications/{applicationId}`

Updates only the specified application. At least one of `stage` or `outcome` is required. `outcome: null` clears a previously recorded outcome. The API updates `updatedAt`.

**Request**

```json
{
  "stage": "Decision",
  "outcome": "Selected"
}
```

**Success — `200`** returns `{ "data": <updated role application> }` using the application shape shown above.

**Invalid request — `400`** uses the `VALIDATION_ERROR` shape above. **Application not found — `404`** uses the `NOT_FOUND` shape.

## Shared Validation and Types

`packages/contracts/src/index.ts` is the source of shared Zod schemas and inferred TypeScript types for these payloads.

- Required descriptive strings must be non-empty.
- `skills` is optional; when present, it is an array of descriptive strings without ratings.
- `stage`, `outcome`, `role`, and `sourceChannel` remain strings. Example values are not enums, transition rules, or eligibility criteria.
- `updatedAt` is an ISO 8601 UTC timestamp.
- API errors use `{ "error": { "code", "message", "issues?" } }`. Validation issues include a field path and message.
- A missing candidate or application returns `404`; invalid request data returns `400`.
- An unexpected server failure returns `500` with code `INTERNAL_ERROR`.

## Decisions for Review

1. Confirm these routes, methods, response envelopes, and status codes with Frontend, Data, and QA.
2. Confirm that the API generates application IDs and update timestamps.
3. Define authentication, authorization, and which profile fields each user may read. This draft does not imply unauthenticated access.
4. Decide whether candidate lookup needs search fields beyond the synthetic `candidateId`.
5. Agree on stage and outcome vocabularies and any transition rules before enforcing them.
6. Choose persistence and the SQL driver separately before implementing database connections or migrations.

Candidate reuse, ranking, automated evaluation, external recruiting-system integration, and real candidate data are outside this contract draft.
