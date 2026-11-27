# Data Model

## Status and boundary

This is the working training-MVP data model for review with the team. Use fabricated records only. Candidate profiles are references to source-owned records; this application tracks role-specific process data and HR future-role reviews. It does not replace the recruiting source.

## CandidateProfile

| Field | Type | Required | Meaning |
|---|---|---:|---|
| candidateId | string | Yes | Stable identifier from the synthetic/source profile |
| sourceChannel | string | Yes | Referral or another source channel |
| skills | string array | No | Descriptive, unscored skills |

The training model excludes names, contact details, resumes, and interview notes. Production profile fields require an access and retention review.

## RoleApplication

One person's process for one role and department. Keep every application separate, including future roles after an HR approval.

| Field | Type | Required | Meaning |
|---|---|---:|---|
| applicationId | string | Yes | Stable identifier for the role process |
| candidateId | string | Yes | Reference to an existing CandidateProfile |
| role | string | Yes | Role title; there is no role catalog in this model |
| department | string | Yes | Department for this role |
| stage | enum | Yes | Current stage for this application |
| stageHistory | array of stage/reachedAt | Yes | Records each stage reached, including Final interview |
| outcome | enum or null | Yes | Selected, Not selected, Withdrawn, or null until recorded |
| updatedAt | ISO 8601 UTC timestamp | Yes | Last application update |

Working stages: Added to role, Initial screening, Screening passed, Interview, Final interview, Decision.

Working outcomes: Selected, Not selected, Withdrawn. Stage and outcome are separate. A stage update appends a history event; an outcome update does not change stage.

## FutureRoleReview

An explicit human HR review associated with the application that qualifies the profile for future consideration.

| Field | Type | Required | Meaning |
|---|---|---:|---|
| reviewId | string | Yes | Stable review identifier |
| candidateId | string | Yes | Profile being considered |
| triggeringApplicationId | string | Yes | Prior application that reached Final interview and ended Not selected |
| status | enum | Yes | Pending, Approved, or Not approved |
| reviewerId | string or null | Yes | Authenticated HR identity after a decision; synthetic placeholder in the fixture |
| reviewedAt | timestamp or null | Yes | Time of the human decision |

Create a Pending review only when the triggering application has Screening passed and Final interview stage-history events and outcome Not selected. Pending reviews have no reviewer or review timestamp. Approved and Not approved reviews require both. This review permits or declines future consideration; it is not a hiring decision or candidate recommendation.

The shared contract checks that the current stage matches the last history event and that history timestamps are chronological. The schema enforces that the triggering application belongs to the same candidate. The seed validates review eligibility. API authorization and reviewer attribution depend on SSO and are not implemented yet.

## Relationships and safeguards

- One profile can have zero or many role applications.
- One profile can have multiple applications across departments.
- Each reuse-review record references one candidate and one of that candidate's applications; an application can trigger at most one review record.
- A new role creates a new application and never overwrites the source profile or prior applications.
- Skills remain optional descriptive strings; do not add scores, ranking, model-generated suitability, or automated matching.
- Production retention, consent, access controls, and cross-department sharing require HR policy approval.

## Synthetic fixture

The deterministic fixture contains 15 fabricated profiles, 16 applications, and four future-role reviews. It includes:

- A non-selected candidate who did not reach Final interview and has no review.
- Pending, Approved, and Not approved reviews for candidates who did reach Final interview and were Not selected.
- An approved candidate with a separate new application in another department.
- A Final interview in progress with no outcome, a Withdrawn outcome, multiple applications for one profile, and a profile with no application.

## SQLite representation

Migration 0001 creates candidate_profiles and role_applications. Migration 0002 adds department and serialized stage history and creates future_role_reviews. The seed serializes skills and stage history as JSON text. SQLite is the current working training-MVP choice; production hosting remains undecided.
