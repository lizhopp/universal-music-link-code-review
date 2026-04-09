# 2026-04-08 Partial Issue Audit And Todo

## Purpose

This note captures the open issues that appear to be:
- already complete in the codebase but still open on GitHub
- partially done and worth turning into a focused short-term todo list

This audit is based on:
- current open issue bodies from GitHub
- the local codebase state on `2026-04-08`

## Open Issues That Look Already Complete

These should be good candidates for board cleanup or a quick verification pass before closing:

- `#6` Initialize React app
  - Evidence:
    - Vite/React client exists in `client/package.json`
    - app entry exists in `client/src/main.jsx`
    - visible shell exists in `client/src/App.jsx`
    - API base URL strategy exists in `client/src/App.jsx`

- `#10` Write initial README and project description
  - Evidence:
    - repo-level `README.md` exists and already documents project purpose, schema, endpoints, setup, and future work

- `#11` Create `/convert` endpoint (initial stub)
  - Evidence:
    - `server/api/convert.js` exposes `POST /`
    - `server/app.js` mounts `/convert`
    - route was previously runtime-tested successfully

- `#28` Create users table
  - Evidence:
    - `users` table exists in `server/db/schema.sql`
    - register/login code already uses `email` + `password_hash` shape through `server/api/users.js` and `server/db/queries/users.js`

- `#40` Create login endpoint
  - Evidence:
    - login route exists in `server/api/users.js`
    - password verification exists in `server/db/queries/users.js`
    - JWT response exists in `server/api/users.js`
  - Note:
    - issue text still says `/auth/login`, but the repo has standardized on `/users/login`

- `#41` Hash passwords with bcrypt
  - Evidence:
    - `bcrypt.hash(...)` in `server/db/queries/users.js`
    - `bcrypt.compare(...)` in `server/db/queries/users.js`

- `#42` Generate JWT tokens
  - Evidence:
    - JWT utility exists in `server/utils/jwt.js`
    - register/login routes call `createToken(...)`

## Partially Done Issues

These are the issues that have meaningful code or docs already in place, but still have clear remaining work.

## Priority Order

If the goal is to be defense-ready soon, a good order is:

1. `#9`
2. `#39`
3. `#43`
4. `#55` and `#56`
5. `#49`, `#50`, and `#51`
6. `#32`
7. `#86`
8. `#87`
9. `#89`

That order favors:
- safer local setup
- cleaner auth behavior
- one usable preferences slice
- one usable history slice
- schema/doc cleanup after behavior exists

## Todo List

### `#9` Configure environment variables (.env)

Current evidence:
- `server/.env` exists
- runtime scripts load env files with `--env-file=.env` in `server/package.json`
- backend code reads env vars like `CORS_ORIGIN` and `JWT_SECRET`

What is still missing:
- [ ] add `server/.env.example` with placeholders and variable names
- [ ] document all required env vars in one place
- [ ] add fail-fast startup validation for critical env vars
- [ ] make setup docs match the real env requirements

Helpful files:
- `server/package.json`
- `server/app.js`
- `server/utils/jwt.js`
- `server/db/client.js`

### `#39` Create register endpoint

Current evidence:
- `POST /users/register` exists in `server/api/users.js`
- password hashing already happens through `createUser(...)`
- register returns a token instead of exposing the password hash

What is still missing:
- [ ] handle duplicate email more intentionally than the current generic DB-error path
- [ ] return a clearer register success/error contract
- [ ] manually verify successful registration with a real request
- [ ] decide whether to keep returning a raw token string or move to JSON response shape

Helpful files:
- `server/api/users.js`
- `server/db/queries/users.js`
- `server/app.js`

### `#43` Implement auth middleware

Current evidence:
- `getUserFromToken` exists in `server/middleware/getUserFromToken.js`
- it reads `Authorization: Bearer ...`
- it verifies the token and loads the user
- it is mounted in `server/app.js`

What is still missing:
- [ ] use auth middleware on an actually protected route flow
- [ ] decide whether `req.user` should contain the full DB row or a safer subset
- [ ] document expected auth-header behavior for future endpoints
- [ ] verify valid-token and invalid-token behavior against a protected endpoint

Helpful files:
- `server/middleware/getUserFromToken.js`
- `server/app.js`

### `#29`, `#55`, and `#56` Preferences Slice

Current evidence:
- `preferences` table exists in `server/db/schema.sql`
- `GET /preferences` and `PUT /preferences` stubs exist in `server/api/preferences.js`
- routes are mounted in `server/app.js`

What is still missing:
- [ ] create query helpers for reading/updating preferences
- [ ] make `GET /preferences` return the authenticated user's preference
- [ ] join platform metadata from `platforms`
- [ ] handle "no preference row yet" cleanly
- [ ] make `PUT /preferences` validate that `default_platform_id` exists
- [ ] use upsert behavior for first-time and repeat updates
- [ ] return real JSON data instead of stub messages

Helpful files:
- `server/api/preferences.js`
- `server/db/schema.sql`
- `server/db/queries/platforms.js`

### `#30`, `#49`, `#50`, and `#51` Conversion History Slice

Current evidence:
- `conversions` table exists in `server/db/schema.sql`
- `GET /conversions` and `DELETE /conversions/:id` stubs exist in `server/api/conversions.js`
- routes are mounted in `server/app.js`

What is still missing:
- [ ] add query helpers for inserting, reading, and deleting conversions
- [ ] make `POST /convert` save conversion attempts when appropriate
- [ ] make `GET /conversions` return newest-first history for the authenticated user
- [ ] make `DELETE /conversions/:id` only delete that user's own history rows
- [ ] handle nullable source/target link references without crashing
- [ ] return real structured conversion-history data for the frontend

Helpful files:
- `server/api/conversions.js`
- `server/api/convert.js`
- `server/db/schema.sql`

### `#32` Create platforms table and seed supported platforms

Current evidence:
- `platforms` table exists in `server/db/schema.sql`
- schema FKs point to `platforms(id)`
- seed script adds Spotify and Apple Music

What is still missing:
- [ ] add YouTube Music seed data if this issue is meant to match the current acceptance checklist exactly
- [ ] confirm whether YouTube Music is truly needed before the defense, since the README frames extra platforms as future work

Helpful files:
- `server/db/schema.sql`
- `server/db/seed.js`
- `README.md`

### `#86` Create song_links table (platform-specific links per song)

Current evidence:
- `song_links` table exists in `server/db/schema.sql`
- uniqueness and FK constraints are present

What is still missing:
- [ ] add query/service logic that actually uses `song_links`
- [ ] connect future conversion flow so source/target link resolution goes through this table
- [ ] prove the feature layer understands canonical song -> many platform links

Helpful files:
- `server/db/schema.sql`
- `server/api/convert.js`

### `#87` Create user_saved_links join table

Current evidence:
- `user_saved_links` exists in `server/db/schema.sql`
- constraints and cascades are present

What is still missing:
- [ ] create saved-links queries
- [ ] build any endpoint or feature that actually uses `user_saved_links`
- [ ] avoid creating denormalized saved-link data elsewhere

Helpful files:
- `server/db/schema.sql`

### `#89` Update ERD/docs for revised schema relationships

Current evidence:
- `ERD.md` includes `platforms`, `songs`, `song_links`, `user_saved_links`, `preferences`, and `conversions`
- `README.md` documents the revised schema and relationship map

What is still missing:
- [ ] confirm README text fully matches the latest implementation decisions
- [ ] post the documentation evidence back to issue `#31` as requested by the parent tracker

Helpful files:
- `ERD.md`
- `README.md`

## Notes On Excluded Issues

- `#31` is a parent tracker, so it is not listed as a normal partial implementation issue here.
- `#88` was not included in the partial list because the schema constraints exist, but the actual validation evidence/check artifacts are not clearly present yet.
- Frontend settings/history pages and conversion-history UI issues were not marked partial here because the current client still only exposes the small API-status shell.

## Suggested Next Work Session

If the goal is fast progress with the least context-switching:

- [ ] finish `#9`
- [ ] finish `#39`
- [ ] finish `#43`
- [ ] then complete the preferences slice (`#55` and `#56`)

That sequence gives you:
- cleaner local startup
- stronger auth foundations
- one real authenticated feature you can demo
