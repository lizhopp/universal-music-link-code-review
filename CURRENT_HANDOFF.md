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

- Deadline pivot: Apple developer-account approval is still blocked, so the MVP is moving from Spotify -> Apple Music to Spotify -> YouTube.
- Settings/history/preferences are no longer the next safest slice for the deadline. The next work should be the smallest conversion demo path.

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
- Pivot review on 2026-04-24 found:
  - current code has Spotify URL detection, Spotify track-ID extraction, Spotify metadata fetch, and Spotify normalization in `server/utils/spotify.js`
  - `server/utils/youtube.js` now supports both:
    - YouTube target search from normalized Spotify metadata
    - YouTube source normalization for reverse `YouTube -> Spotify` conversion
  - `/convert` now accepts `sourceUrl` and `targetService`, branches by source platform, and returns both `sourceTrack` and `targetTrack`
  - there is no Apple API client implemented yet, so the pivot does not require removing completed Apple code
  - `server/db/seed.js` still seeds Spotify and Apple Music only
  - README still describes Spotify + Apple Music as MVP
  - board issue `#21` Setup Apple Music API client is `In Progress`
  - board issue `#22` Search Apple Music for track is `Ready`
  - board issue `#67` Test valid Spotify -> Apple conversion is `Ready`
  - board issue `#80` Add YouTube Music support is `Ready`, but should become core MVP work for the pivot
  - live Render backend health check is passing at `https://universal-music-link.onrender.com/health`
  - live frontend bundle at `https://universal-music-link-frontend.onrender.com` is built against the backend origin `https://universal-music-link.onrender.com`
  - live frontend bundle is using the current convert request shape `{ sourceUrl, targetService }`
  - production CORS currently allows `https://universal-music-link-frontend.onrender.com`
  - live production `POST /convert` now passes direct endpoint tests in both directions:
    - `spotify -> youtube`
    - `youtube -> spotify`

## Next Exact Step

- The current local conversion demo path is now verified in both directions:
  - Spotify track URL input -> YouTube match
  - YouTube video URL input -> Spotify match
  - dashboard selector + result rendering work against the local backend contract
- Next safest move for the deadline demo:
  - freeze the matcher logic unless a new real failing track appears
  - update README and any issue/board wording that still describes Apple Music as the active MVP target
  - keep README deferred until the finish line, but continue keeping operational deploy docs aligned

## After That

- Defer until after the conversion demo is working:
  - `#52`-`#54` history UI
  - `#55`-`#59` preferences/settings
  - `#81` browser extension
  - `#82` copy-to-clipboard
  - `#83` rate limiting
  - `#84` recommendations/social feed
  - `#85` collaborative playlist/live-update idea
- Keep deployment work near the end, not after every small feature:
  - `#72` prepare production env vars
  - `#74` deploy backend
  - `#75` deploy frontend
  - `#76` connect frontend to deployed backend
  - `#77` test live deployment
  - `#78` write deployment steps

## Files In Play

- `client/src/App.jsx`
- `client/src/main.jsx`
- `server/api/convert.js`
- `server/api/users.js`
- `server/middleware/getUserFromToken.js`
- `server/utils/spotify.js`
- `server/utils/youtube.js`
- `server/db/seed.js`
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
- `#16` through `#20` are `Done` on the project board
- `#12`, `#13`, `#14`, `#15`, `#23`, `#24`, `#25`, `#26`, `#27`, and `#34` are still `Ready` and become part of the stripped conversion-demo path
- YouTube Data API docs confirm public-data reads can use an API key, while `search.list` costs 100 quota units and `videos.list` costs 1 quota unit
- `POST /convert` now works locally for the one-way Spotify -> YouTube slice and returns `{ sourceService, targetService, sourceTrack, targetTrack }`
- the dashboard conversion form works locally against the local backend after setting `client/.env.local` to `VITE_API_URL=http://localhost:3000`
- the improved YouTube scorer fixed at least one previously bad mismatch case when retesting the same Spotify track
- broader local retesting now checks out for the current one-way Spotify -> YouTube matcher
- `/convert` now supports both `spotify -> youtube` and `youtube -> spotify` locally through the dashboard
- reverse normalization fixes now cover at least these edge cases:
  - camel-cased VEVO channel names
  - Unicode title separators (`-`, `–`, `—`)
  - trailing `Official` channel branding
- recent manual edge-case testing for `YouTube -> Spotify` now checks out locally
- live Render backend health endpoint returns `200`
- live production frontend is wired to the backend origin `https://universal-music-link.onrender.com`
- live production `/convert` route accepts the new request contract and now returns successful conversion payloads in both directions
- `server/.env.example` now includes the current backend env set, including `YOUTUBE_API_KEY`

## Open Questions

- Should issue `#80` be rewritten/moved from Stretch Goal to Core Conversion for the new MVP?
- Should Apple issues `#21`, `#22`, and `#67` be moved to blocked/post-MVP instead of staying in active work?
- Should the seed data keep Apple Music as inactive/post-MVP, or replace Apple with YouTube for the deadline build?
- Should `/` become the conversion landing page immediately, replacing the current redirect-only route?
- Should the target link be a standard YouTube URL or a `music.youtube.com/watch?v=...` URL for the demo?

## Handoff Update Rule

Update this file when:
- the active task changes
- the next exact step changes
- a major checkpoint is verified
- a blocker appears
