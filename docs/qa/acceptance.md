# Acceptance Criteria

These criteria define the working training-MVP flow. Fixtures and tests must use fabricated data only.

## Link an existing source profile

- Given a profile supplied by the source
- When an HR user links it to a role and department
- Then the application starts at Added to role with an initial history event and null outcome.
- The source profile is unchanged.

## Record stage and outcome separately

- Given a role application
- When HR updates its stage
- Then the current stage changes and a timestamped event is appended to that application's history.
- When HR records an outcome, the outcome changes without changing stage.
- Valid stages are Added to role, Initial screening, Screening passed, Interview, Final interview, and Decision.
- Valid outcomes are Selected, Not selected, Withdrawn, and null until entered.

## Preserve applications across roles

- Given a profile with an existing application
- When HR creates an application for another role, including a role in another department
- Then the new application has its own stage, history, and outcome, and the prior applications remain unchanged.

## Create a human reuse review

- Given an application with Screening passed and Final interview in stage history and outcome Not selected
- When HR requests a future-role review
- Then a Pending review references the same candidate and qualifying application.
- Given a Not selected application without both Screening passed and Final interview in its history
- When the profile is evaluated for the review queue
- Then no reuse review is created.
- A Pending review has no reviewer or review timestamp.

## Record HR's review decision

- Given a Pending reuse review
- When HR records Approved or Not approved
- Then the review stores the authenticated reviewer and review time.
- If Approved, HR may create a separate application for a future role; if Not approved, that review cannot create one.
- The review does not score, rank, match, or make a hiring decision.

## Data integrity

- Every role application references an existing profile.
- Every reuse review references the same candidate as its triggering application.
- An application can have no more than one reuse-review record.
- Invalid enum values and invalid reviewer/status combinations are rejected by shared validation or database constraints.

## Deferred integration verification

- Add operation tests for migration/seed, validation, eligibility, and review updates with the first API implementation.
- Add a QA test plan mapping these criteria to commands and manual procedures.
- Record actual commands and results in the implementing PR. No API CRUD operations are implemented yet.
- Do not use real candidate data until the HR policy owner approves SSO, retention, consent, and cross-department sharing.
