# Current Handoff

## Purpose

This file is the short operational handoff for the next session or machine.

Use this file for:
- current focus
- exact next step
- verified behavior
- files in play
- blockers or open questions

Do not use this file as a transcript. Historical conversation details belong in `CHAT_HISTORY.md`.

## Active Focus

- Continue the frontend auth submit/feedback slice in `client/src/App.jsx`

## Current Status

- Backend auth contract is in place and re-verified:
  - `POST /users/register`
  - `POST /users/login`
- Protected auth proof is in place and re-verified:
  - unauthenticated `GET /users/me` returns `401` with `{"message":"Authentication required."}`
  - authenticated `GET /users/me` returns the serialized user object
- Frontend auth work in `client/src/App.jsx` has progressed to:
  - auth-related state
  - register/login mode toggle
  - controlled email input
  - controlled password input
  - `readJsonResponse`
  - a partially wired `handleSubmit`
- Work is paused in the frontend teaching/build phase at the feedback-rendering step

## Next Exact Step

- In `client/src/App.jsx`, add the feedback lines directly above the `<form>`:
  - `{authMessage ? <p>{authMessage}</p> : null}`
  - `{authError ? <p style={{ color: "crimson" }}>{authError}</p> : null}`
- Immediately after that, sanity-check the current submit wiring:
  - `handleSubmit` should be `async`
  - `setSubmitting(true)` should run at the start of submission
  - the current `fetch` + `readJsonResponse` flow should then be manually tested in the browser

## After That

- Save token to `localStorage`
- Add session restore via `GET /users/me`
- Add logout behavior
- Manually verify browser flow:
  - register
  - login
  - refresh persistence
  - logout
  - failed login

## Files In Play

- `client/src/App.jsx`
- `server/api/users.js`
- `server/db/queries/users.js`
- `CHAT_HISTORY.md`

## Verified

- `POST /users/register` works
- duplicate email handling works
- `POST /users/login` works
- invalid credential path works
- `GET /users/me` returns `401` correctly when no token is sent
- `GET /users/me` returns the serialized user object when a valid bearer token is sent

## Open Questions

- none currently

## Handoff Update Rule

Update this file when:
- the active task changes
- the next exact step changes
- a major checkpoint is verified
- a blocker appears
