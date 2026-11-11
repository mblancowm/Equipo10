# Data Model

## Status and scope

This is the conceptual model for the first recruiter workflow: find a candidate profile, link it to a role, and record that role application's current stage and outcome. It is a review draft, not a database schema, API contract, or approved set of enums.

The fixture is the source for this first model and contains synthetic profiles only. An external candidate repository and its identifiers are outside this change.

## CandidateProfile

One synthetic candidate profile. A profile may exist before any role application is created.

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `candidateId` | string | Yes | Stable synthetic identifier for the profile. |
| `sourceChannel` | string | Yes | How the candidate entered the hiring process. `Referral` and `Other` are illustrative values, not a final enum. |
| `skills` | string array | No | Optional, unscored summary of synthetic skills. It is not assessment evidence or a reuse decision. |

## RoleApplication

One candidate's process for one role. Stage and outcome belong here, not on the shared candidate profile.

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `applicationId` | string | Yes | Stable identifier for this role-specific process. |
| `candidateId` | string | Yes | Reference to exactly one `CandidateProfile.candidateId`. |
| `role` | string | Yes | Role label for this process. A separate role catalog is not part of this model. |
| `stage` | string | Yes | Current stage for this application. Task-sheet labels such as `Added to role`, `Screening`, `Interview`, and `Decision` are examples only. |
| `outcome` | string or null | Yes | Current outcome, or `null` until one is recorded. `Selected` and `Not selected` are illustrative values only. |
| `updatedAt` | ISO 8601 UTC timestamp | Yes | When this application record was last updated. |

## Relationships and rules

- One profile may have zero or many role applications; each application references one existing profile.
- Profile identity, source channel, and optional skills summary are shared across applications. Stage and outcome are specific to one application.
- `candidateId` and `applicationId` values are unique within their respective collections.
- No unique constraint is proposed for `candidateId` plus `role`; separate applications can represent different hiring processes for the same role.
- Stage and outcome values remain descriptive strings in this fixture. It does not define a complete lifecycle, allowed transitions, or validation enums.

## Synthetic fixture

Keep `docs/data/fixtures/template.synthetic.json` small, deterministic, and entirely synthetic. It covers referral and other channels, multiple applications for one profile, selected and not-selected outcomes, and a profile with no applications. No real names, contact details, resumes, or interview notes belong in the fixture.

The sample skills are descriptive labels only. Do not attach ratings, dates, assessment authors, or reuse eligibility to them.

## Deferred decisions

- External profile identifiers, source adapters, and synchronization.
- A role catalog.
- Skill evidence history, assessment aggregation, and reusable-candidate criteria.
- Approved stage/outcome values and transition rules.
- SQL driver, persistence schema, and migrations.
