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

- Implement `#61` protected routes on the frontend using lifted auth state in `client/src/App.jsx`

## Current Status

- Backend auth contract is in place and re-verified:
  - `POST /users/register`
  - `POST /users/login`
- Protected auth proof is in place and re-verified:
  - unauthenticated `GET /users/me` returns `401` with `{"message":"Authentication required."}`
  - authenticated `GET /users/me` returns the serialized user object
- Frontend auth work in `client/src/App.jsx` has been manually verified end-to-end:
  - register flow works
  - login flow works
  - success/error feedback renders
  - token persists to `localStorage`
  - session restores through `GET /users/me`
  - logout clears session state and survives refresh
- Frontend routing has already been added locally:
  - `react-router-dom` is installed in `client/package.json`
  - `BrowserRouter` wraps the app in `client/src/main.jsx`
  - `client/src/App.jsx` defines `/register`, `/login`, and `*` fallback routes
- Auth state ownership has started moving to the route level in `client/src/App.jsx`:
  - `authToken` now lives in `App`
  - `authUser` now lives in `App`
  - session restore via `GET /users/me` now runs in `App`
  - `AuthScreen` now receives shared auth state/setters as props
- Live issue review on 2026-04-21 found:
  - `#7` Setup React Router is still `OPEN`
  - `#43` Implement auth middleware is still `OPEN`
  - `#45` Build register page is still `OPEN`
  - `#46` Build login page is still `OPEN`
  - `#61` Implement protected routes is still `OPEN`
- Auth middleware cleanup for `#43` was reviewed and tightened:
  - comments were clarified around headers vs request body
  - bearer-token/header reasoning was added to `STUDY_PLAN.md`
  - middleware behavior is now treated as complete enough to move on
- Live project-column status could not be re-checked from this machine because `gh` is missing the `read:project` scope

## Next Exact Step

- Continue the first protected-route slice in `client/src/App.jsx`:
  - add `Navigate` import
  - create one small protected page component
  - create a `ProtectedRoute` guard component
  - move logout ownership into `App`
  - mount one protected route such as `/dashboard`

## After That

- verify:
  - logged-out access to the protected route redirects to `/login`
  - logged-in access renders the protected page
  - refresh on the protected route restores the session correctly
- decide whether to redirect authenticated users away from `/login` and `/register`
- decide whether to close `#45`, `#46`, and `#43`
- Either close `#7` if the issue scope is intentionally narrow, or keep it open for the remaining non-auth pages called out in the issue body

## Files In Play

- `client/src/App.jsx`
- `client/src/main.jsx`
- `server/api/users.js`
- `server/middleware/getUserFromToken.js`
- `STUDY_PLAN.md`
- `README.md`
- `CURRENT_HANDOFF.md`
- `CHAT_HISTORY.md`

## Verified

- `POST /users/register` works
- duplicate email handling works
- `POST /users/login` works
- invalid credential path works
- `GET /users/me` returns `401` correctly when no token is sent
- `GET /users/me` returns the serialized user object when a valid bearer token is sent
- frontend register form submits successfully
- frontend login form submits successfully
- auth success/error messages render in the UI
- auth token persists in `localStorage`
- session restore works after refresh
- logout clears auth state and persisted token
- direct routes exist for `/register` and `/login`
- unknown frontend routes fall back to the local 404 page
- auth token and auth user state are now owned by `App`
- session restore effect now runs from `App`
- `AuthScreen` consumes shared auth state via props

## Open Questions

- Should `#7` be considered complete now that router wiring, auth routes, and a 404 route exist, or does the issue still require additional non-auth pages?
- Should `/` remain a temporary auth entry route, or eventually become a true landing page?
- Should authenticated users be redirected away from `/login` and `/register` once the protected route exists?
- If project-board columns need to be updated from this machine, `gh auth refresh -s read:project` is still required

## Handoff Update Rule

Update this file when:
- the active task changes
- the next exact step changes
- a major checkpoint is verified
- a blocker appears
