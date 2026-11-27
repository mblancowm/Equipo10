# Application Context

## Purpose

Candidate Pipeline is a training MVP for HR to track role-by-role hiring history and review finalists for future opportunities. The tracked population includes candidates who pass initial screening and reach a final interview, whether they came from referrals or another source.

## Primary user and access

- The intended product persona is HR/recruiting.
- Company SSO is the intended sign-in; it is not implemented in this training build.
- Admin console, hiring-manager access, and manual candidate profile creation/editing are out of scope.
- Candidate profiles remain owned by the upstream recruiting source and are read-only here.

## MVP workflow

1. Find an existing profile.
2. Link it to a role and department as a separate application.
3. Record stage history and outcome for that application.
4. Track everyone who reaches Final interview, whether selected or not. After Screening passed, Final interview, and Not selected, make the application available for explicit HR future-role review.
5. If HR approves future consideration, create a separate application for the new role, including cross-department roles.

## Working stage and outcome values

Stages: Added to role, Initial screening, Screening passed, Interview, Final interview, Decision.

Outcomes: Selected, Not selected, Withdrawn, or null until entered. Stage and outcome are separate.

These values are the current working training-MVP vocabulary. Confirm any production process rules with the HR policy owner.

## Guardrails and exclusions

- Use fabricated data only in repository fixtures and prototypes.
- Skills are descriptive and unscored.
- Human review determines future consideration; the product does not score, rank, match, recommend, or make hiring decisions.
- Exclude SSO implementation, upstream synchronization, production retention/consent, deployment, and backups from this local training increment.
- Do not create, edit, or delete source-owned candidate profiles.

## Open for policy review

Before real profiles are used, an HR policy owner must confirm identity mapping, access, reviewer attribution, retention, consent, and cross-department sharing. The SQLite fixture is not a production policy or permission model.
