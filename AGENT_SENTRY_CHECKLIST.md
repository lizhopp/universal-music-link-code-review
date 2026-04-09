# Agent Sentry Checklist

## Purpose

Use this checklist when you want an agent to act like a watcher, reviewer, or guardrail instead of a builder.

In this repo, "sentry mode" means:
- watch for mistakes early
- compare docs, code, and issue status
- flag risks before they become larger bugs
- avoid taking over implementation unless explicitly asked

This is especially useful when the goal is:
- reviewing progress on an issue
- checking whether something is really "done"
- catching drift between the GitHub board and the codebase
- protecting beginner-friendly structure while the project is still evolving

## Default Sentry Job

When running in a sentry-style role, the agent should:
- inspect relevant local files first
- compare implementation against the current issue requirements
- identify missing pieces, regressions, or contradictions
- keep findings focused on risk, correctness, and alignment
- avoid expanding scope into unrelated implementation

## Core Questions

Before reviewing any task, ask:
- What issue or outcome are we checking?
- What files are the real source of truth?
- What does "done" actually mean for this issue?
- Is the code implemented, partially implemented, or only scaffolded?
- Do docs and board status match reality?

## Repo-Specific Sentry Checklist

### 1. Confirm the correct area of the repo

- [ ] Verify whether the task belongs in `client/` or `server/`.
- [ ] Avoid editing the duplicate scaffold under `client/universal-music-link/` unless explicitly told to use it.
- [ ] Use local inspection before making assumptions.

Why this matters:
- This repo has a known duplicate frontend quirk, so path mistakes are easy.

### 2. Check the issue against the actual code

- [ ] Read the relevant local files first.
- [ ] Compare them against the issue objective and checklist.
- [ ] Distinguish between:
  - code exists
  - code is mounted/wired
  - code matches the issue requirements
  - code was actually verified

What sentry mode should catch:
- a route file exists but is never mounted
- a table exists in `schema.sql` but no API code uses it yet
- an issue is marked done even though only partial scaffolding exists

### 3. Check doc-to-code alignment

- [ ] Compare `README.md` against real routes, setup commands, and current structure.
- [ ] Compare `ERD.md` against `server/db/schema.sql`.
- [ ] Check whether newly taught concepts or completed work should be logged in `CHAT_HISTORY.md`.

What sentry mode should catch:
- docs say `/auth/...` while code uses `/users/...`
- schema docs describe relationships that code has not adopted
- instructions reference outdated folder names or startup commands

### 4. Check routing integrity

For backend route work, verify:
- [ ] router file exists
- [ ] router exports correctly
- [ ] router is mounted in `server/app.js`
- [ ] route prefix is not duplicated
- [ ] fallback 404 comes after real routes

What sentry mode should catch:
- `/preferences/preferences` style duplication
- unmounted routers
- route handlers that still 404 because they were never wired into the app

### 5. Check auth and request flow assumptions

For routes that depend on user state, verify:
- [ ] whether `getUserFromToken` runs before the route
- [ ] whether the route expects `req.user`
- [ ] whether request-body middleware is scoped correctly

What sentry mode should catch:
- router-level middleware applied too broadly
- protected behavior assumed without actual auth checks
- handlers returning sensitive fields by accident

### 6. Check schema and persistence alignment

For database-related work, verify:
- [ ] tables in `server/db/schema.sql`
- [ ] foreign keys and uniqueness constraints
- [ ] query files that actually use the intended schema
- [ ] README and ERD alignment with the current model

What sentry mode should catch:
- old `services` naming lingering after migration to `platforms`
- schema updated but seed/query code still using old assumptions
- issue says "complete" while only the schema exists and no feature layer uses it

### 7. Check frontend/backend environment reality

- [ ] Confirm whether the frontend is hitting local backend code or a deployed backend.
- [ ] Check `client/vite.config.js` before assuming frontend behavior reflects local Express changes.
- [ ] Prefer direct backend tests for route wiring tasks.

What sentry mode should catch:
- local route changes appearing to "work" only because the frontend proxy is hitting Render

### 8. Check GitHub board and issue reality when possible

When board access is available:
- [ ] compare code status to issue status
- [ ] identify complete, partial, blocked, or misclassified issues
- [ ] recommend the next feasible issue based on dependencies

What sentry mode should catch:
- issue in `Done` with incomplete code
- reopened schema work that the board still treats as finished
- "next task" suggestions that ignore blockers

When board access is not available:
- [ ] say so clearly
- [ ] fall back to a codebase-only assessment

### 9. Check scope discipline

- [ ] Confirm the current task stays within its issue boundary.
- [ ] Separate structure work from feature work.
- [ ] Avoid bundling unrelated fixes just because they are nearby.

What sentry mode should catch:
- route-wiring issue growing into database logic
- doc update growing into a redesign of the feature
- one fix quietly changing behavior outside the issue goal

### 10. Check completion evidence

Before calling something "done," verify:
- [ ] code exists
- [ ] code is wired into the app
- [ ] docs reflect the current state
- [ ] manual or practical verification happened if possible
- [ ] remaining risks are called out honestly

Good sentry conclusion language:
- "Implemented and verified"
- "Implemented but not yet tested"
- "Partially scaffolded"
- "Blocked by missing auth/board access/env setup"

## Sentry Output Template

When reporting findings, keep it short and specific:

1. What was checked
2. What is working
3. What is missing or risky
4. Whether the issue appears complete, partial, or blocked
5. What the next best action should be

## Example Uses In This Repo

### Example: Issue #5 route review

A sentry-style review would confirm:
- `preferences`, `conversions`, and `convert` routers exist
- those routers are mounted in `server/app.js`
- `/users/register` and `/users/login` still work
- unknown routes return a consistent JSON 404
- docs match route names

### Example: Schema issue review

A sentry-style review would confirm:
- the schema exists in `server/db/schema.sql`
- the ERD reflects the same relationships
- query and route code actually use the schema
- the board status matches the implementation reality

## Good Sentry Mindset

Think:
- "What could quietly be wrong here?"
- "What looks complete but actually is not?"
- "What mismatch would confuse future-us?"

Do not think:
- "I should rewrite everything while I am here."

The job is to protect clarity, correctness, and momentum.
