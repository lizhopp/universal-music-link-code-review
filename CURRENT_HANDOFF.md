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

- Finish the frontend auth vertical slice in `client/src/App.jsx`

## Current Status

- Backend auth contract is in place and manually tested:
  - `POST /users/register`
  - `POST /users/login`
- Protected auth proof is in place and manually tested:
  - `GET /users/me`
- Frontend auth state has been introduced in `client/src/App.jsx`
- Work is still in the frontend teaching/build phase; JSX form rendering and request wiring are not finished yet

## Next Exact Step

- In `client/src/App.jsx`, render the auth form UI using the state that has already been added:
  - register/login mode toggle
  - controlled email input
  - controlled password input
- While doing that, explain:
  - what `value` does
  - what `onChange` does
  - how controlled inputs map typed text into React state

## After That

- Add `readJsonResponse`
- Add `handleSubmit` for both `/users/register` and `/users/login`
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
- `GET /users/me` works with auth middleware

## Open Questions

- none currently

## Handoff Update Rule

Update this file when:
- the active task changes
- the next exact step changes
- a major checkpoint is verified
- a blocker appears
