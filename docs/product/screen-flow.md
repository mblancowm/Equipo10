# Screen Flow

This is the working training-MVP flow. The repository's React demo and local HTML prototype are not yet connected to the API or SQLite.

## HR journey

| Screen | HR action | Data shown or changed | Boundary |
|---|---|---|---|
| Role pipeline | Search/filter by role, department, stage, or outcome | One row per RoleApplication, including current stage and outcome | Profile remains source-owned |
| Source profiles | Find a profile and link it to a role | Source channel, descriptive skills, new application | No manual profile creation or editing |
| Application history | Record stage and outcome | Stage history and outcome for that role only | Other applications remain unchanged |
| Future-role review | Review a finalist whose outcome is Not selected | Qualifying application history and review status | Human HR decision only |
| Future role | For an approved review, select a role in the same or another department | New role application, starting at Added to role | Keep prior applications and review |

## Working process values

Stages: Added to role, Initial screening, Screening passed, Interview, Final interview, Decision.

Outcomes: Selected, Not selected, Withdrawn, or empty until recorded. Stage and outcome are separate fields.

Track every application with a Final interview event. Reuse review requires Screening passed and Final interview in the history and outcome Not selected. Pending, Approved, and Not approved decisions are separate from application outcomes.

## Access and prototype limits

The intended user is HR/recruiting with company SSO. SSO, API routes, database-backed UI, and production retention/access policy are not implemented. Admin and hiring-manager screens are out of scope. The current browser prototype uses synthetic in-memory data only.
