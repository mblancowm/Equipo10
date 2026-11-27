# Architecture and Design

## Current state

The repository has a Bun workspace, Hono health-check API, React/Vike frontend, shared Zod contracts, and local SQLite persistence through Drizzle. This proposed change adds application department/history, explicit future-role reviews, and a richer synthetic fixture. Candidate API routes and frontend/database integration are not implemented.

## Components

- Web: React + Vike; current demo remains local state and has not been aligned with the selected HR workflow.
- API: Bun + Hono; currently exposes the health check only.
- Contracts: shared Zod schemas for profiles, applications, stage history, and future-role reviews.
- Data: Drizzle over Bun SQLite for the local training MVP. Migration 0001 creates profiles/applications; 0002 adds application department/history and the future-role review table.
- Source system: owns candidate profiles; connection and synchronization are not implemented.

## Data flow

The planned flow is Web → API → SQLite. A profile is a read-only source reference. Each role application contains its own department, stage history, and outcome. A future-role review references the same candidate and a qualifying prior application.

A review is eligible only when the prior application passed screening, reached Final interview, and has outcome Not selected. HR's explicit Approved decision enables consideration for a future role; it is not an automated ranking or selection. A future role is a new application.

## Access and security

The intended persona is HR/recruiting with company SSO, which is not implemented. There is no admin console or manager access in the working MVP. The fixture's reviewer ID is synthetic. Do not store real candidate data before policy approval.

## Technical boundary

SQLite is for a local training database. Production hosting, backup/recovery, SSO, retention, consent, and department-sharing controls are not covered by these migrations.

## Next implementation step

Add and test one API operation over this schema, then connect one frontend flow. Keep the contract, model, acceptance criteria, migration, and fixture aligned.
