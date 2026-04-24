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

- After completing `#61`, the next recommended frontend slice is `#57` Build settings page

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
- repeated refreshes exposed one remaining auth-restore bug:
  - `GET /users/me` previously returned `304 Not Modified` until `cache: "no-store"` was added
  - after that cache fix, spam-refreshing reproduced token loss until restore logic was hardened further
  - `AbortController` + `signal` are now wired into the restore fetch
  - aborted/interrupted refresh requests are now ignored instead of being treated like invalid auth
  - only explicit `401` handling clears the saved token
- Frontend routing has already been added locally:
  - `react-router-dom` is installed in `client/package.json`
  - `BrowserRouter` wraps the app in `client/src/main.jsx`
  - `client/src/App.jsx` defines `/register`, `/login`, `/dashboard`, and `*` fallback routes
- Auth state ownership has started moving to the route level in `client/src/App.jsx`:
  - `authToken` now lives in `App`
  - `authUser` now lives in `App`
  - session restore via `GET /users/me` now runs in `App`
  - `AuthScreen` now receives shared auth state/setters as props
  - `handleLogout` now lives in `App`
- First protected-route slice is now functionally in place locally:
  - `Navigate` is imported in `client/src/App.jsx`
  - `ProtectedRoute` exists
  - `DashboardPage` exists
  - `/dashboard` is mounted behind `ProtectedRoute`
  - the earlier blank-screen crash was caused by referencing `DashboardPage` before defining it
  - authenticated users are redirected away from `/register` and `/login`
- Live issue and board review on 2026-04-22 found:
  - `#7` Setup React Router is `READY` on the project board
  - `#43` Implement auth middleware is `DONE` on the project board
  - `#45` Build register page is `CLOSED` and `DONE`
  - `#46` Build login page is `CLOSED` and `DONE`
  - `#61` Implement protected routes is `CLOSED` and `DONE`
  - `#52` Build history page is `OPEN` and `READY`
  - `#57` Build settings page is `OPEN` and `READY`
  - `#60` Add navigation bar is `OPEN` and `READY`
- Auth middleware cleanup for `#43` was reviewed and tightened:
  - comments were clarified around headers vs request body
  - bearer-token/header reasoning was added to `STUDY_PLAN.md`
  - middleware behavior is now treated as complete enough to move on
- Live project access is working again from this machine:
  - `gh project field-list 1 --owner @me`
  - `gh project item-list 1 --owner @me --limit 200`

## Next Exact Step

- Start `#57` Build settings page as the next dependency-safe slice:
  - reuse the existing protected-route pattern
  - create a small protected settings page component and route
  - keep this ticket page-shell only
  - leave the dropdown/backend wiring to follow-up issues `#58` and `#59`

## After That

- verify:
  - `/` redirects where expected
  - logged-out access to the protected route redirects to `/login`
  - logged-in access renders the protected page
  - refresh on the protected route restores the session correctly
- repeated refreshes do not remove a valid token because of a cached `304` response
- repeated refreshes do not remove a valid token because of aborted/canceled in-flight restore requests
- decide whether to do `#60` Add navigation bar immediately after `#57`, or wait until there are more protected pages to navigate between
- decide whether `#7` should stay open for the remaining non-auth pages called out in the issue body

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
- direct route exists for `/dashboard`
- unknown frontend routes fall back to the local 404 page
- auth token and auth user state are now owned by `App`
- session restore effect now runs from `App`
- `AuthScreen` consumes shared auth state via props
- `ProtectedRoute` exists in `client/src/App.jsx`
- `DashboardPage` exists in `client/src/App.jsx`
- the blank-screen crash was resolved by defining `DashboardPage`
- current auth restore logic still over-clears the token when `/users/me` returns cached `304 Not Modified`
- current restore flow is hardened with `cache: "no-store"` and abort handling
- authenticated users are redirected away from `/register` and `/login`
- the unused `authToken` prop has been removed from the `AuthScreen` route elements
- `#61` has been verified locally and is now aligned live as closed/done

## Open Questions

- Should `#7` be considered complete now that router wiring, auth routes, and a 404 route exist, or does the issue still require additional non-auth pages?
- Should `/` stay a redirect-only route for now, or eventually become a true landing page?
- Should `#62` remain treated as done once logout ownership finishes moving into `App` for the protected-route refactor?
- Should cache prevention live only in the frontend fetch for now, or also be added to the backend `/users/me` response headers as hardening?
- Should the restore effect use `AbortController`, an `isActive` flag, or both for the safest request-cancel handling?
- Should `#60` be done after `#57`, or after both settings and history pages exist?

## Handoff Update Rule

Update this file when:
- the active task changes
- the next exact step changes
- a major checkpoint is verified
- a blocker appears
