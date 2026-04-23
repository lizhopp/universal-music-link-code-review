# Code Defense Cheat Sheet

## Best Opening

If you need a clean opening, lead with the auth vertical slice because it touches the frontend, backend, middleware, database, and security choices in one story.

Use something close to this:

> The strongest completed slice in this project is the auth flow. On the frontend, React Router mounts the app and `App.jsx` holds shared auth state. Register and login submit credentials to the backend, the backend validates the request, hashes or checks the password, creates a JWT, and returns a safe serialized user object. The frontend stores the token, and on refresh it calls `/users/me` to prove the token is still valid and restore the session.

## Fast Request Flow

1. `client/src/main.jsx` wraps the app in `BrowserRouter`.
2. `client/src/App.jsx` holds `authToken` and `authUser` at the top level.
3. `AuthScreen` submits to `POST /users/register` or `POST /users/login`.
4. `server/app.js` applies CORS, JSON parsing, request logging, then token middleware.
5. `server/api/users.js` validates input, normalizes email, checks the database, then creates or verifies credentials.
6. `server/db/queries/users.js` hashes passwords with bcrypt on registration and compares hashes on login.
7. `server/utils/jwt.js` signs a token with a seven-day expiration.
8. The frontend stores the token in `localStorage`.
9. On refresh, `App.jsx` calls `GET /users/me` with `Authorization: Bearer <token>`.
10. `server/middleware/getUserFromToken.js` verifies the token, loads the user, and attaches `req.user`.
11. `GET /users/me` returns a serialized user object if authentication succeeds.

## Commenting Method For Confusing Blocks

When you comment through code tonight, use this structure so your comments help you defend the code instead of just restating syntax:

- `purpose`: what this block is responsible for
- `why here`: why this logic lives in this file or layer
- `input/output`: what comes in and what leaves
- `failure case`: what happens if this goes wrong
- `future improvement`: what you would refine next

Example:

- `purpose`: restore the user session after refresh
- `why here`: `App.jsx` owns shared auth state for multiple routes
- `input/output`: token in state -> fetch `/users/me` -> user object in state
- `failure case`: bad token clears auth state and local storage
- `future improvement`: add an explicit loading state during restore

## Likely Questions

### Why keep `authToken` and `authUser` in `App.jsx` instead of inside the form?

Best answer:
Because both auth pages and future protected pages need shared auth state. Putting it in `App.jsx` makes session restore and logout global instead of tying them to one form component.

Admit cleanly:
Logout is still handled inside `AuthScreen`, so if the app grows, that responsibility should move fully into `App.jsx` or a dedicated auth context.

### What is `useEffect` doing in the auth flow?

Best answer:
It reacts to `authToken` changes. If there is no token, the app clears the user. If there is a token, the app calls `/users/me` to verify the token and rehydrate the session.

Admit cleanly:
There is no explicit loading state during session restore yet, so the UX could be improved.

### Why use `readJsonResponse()`?

Best answer:
It centralizes response parsing and turns backend failures into JavaScript errors that the UI can display. That keeps fetch handlers smaller and avoids repeating the same response boilerplate.

Admit cleanly:
It assumes the backend returns JSON. Some backend paths still return plain text, so the contract is not fully consistent yet.

### Why use `BrowserRouter`?

Best answer:
It enables client-side routing so navigation between auth pages and future app pages can happen without a full page reload. It keeps the SPA flow intact.

Admit cleanly:
The route structure is still early. `/register` and `/login` are real, but `/` is not yet a polished landing-page or redirect decision.

### Why use middleware for auth and request validation?

Best answer:
Middleware keeps shared concerns out of individual route handlers. `requireBody` handles request-shape checks, and `getUserFromToken` handles bearer-token parsing and user hydration before protected routes run.

Admit cleanly:
`requireBody` only checks whether keys exist. It does not do deeper validation like password strength, email format rules, or field-length enforcement.

### How are passwords handled safely?

Best answer:
Passwords are never stored directly. On registration, bcrypt hashes the password before inserting into the database. On login, bcrypt compares the incoming password against the stored hash.

Admit cleanly:
The current flow does not enforce password complexity rules yet.

### Why serialize the user before returning it?

Best answer:
It makes the API response intentional and safe. The frontend only gets fields it needs, and sensitive fields like `password_hash` stay out of the response.

Admit cleanly:
If the response contract changes later, that serializer must stay aligned with frontend expectations.

### Why use JWTs here?

Best answer:
JWTs make the auth flow straightforward for a React frontend and an Express API. The server can verify the token on each request without storing a server-side session table for this slice.

Admit cleanly:
Storing the token in `localStorage` is convenient, but it is less secure than an `httpOnly` cookie approach in a more hardened production build.

### Why call `/users/me` instead of just trusting the token in local storage?

Best answer:
A token existing in the browser does not prove it is valid. `/users/me` makes the backend verify the token and return the current safe user object, so the client restores state from server truth instead of assumption.

Admit cleanly:
This is still manual session restoration. A fuller version could add refresh-token strategy or better loading UX.

### What is actually implemented in `server/api/convert.js`?

Best answer:
That route is an orchestration slice. It validates the body, detects the source service, supports Spotify URLs, extracts the track ID, fetches Spotify track data, normalizes the track shape, and returns the normalized result.

Admit cleanly:
It is not a full cross-platform conversion engine yet. It does not persist conversions, match multiple providers, or return a completed destination link.

### What is placeholder or scaffolded right now?

Best answer:
`server/api/preferences.js` and parts of `server/api/conversions.js` are route stubs. They prove routing shape and intended API surface, but they do not contain finished business logic yet.

Admit cleanly:
I would not present those as completed features. I would present them as planned surfaces with routing in place.

### Why keep `.env.example`?

Best answer:
It documents required configuration without committing secrets. That makes setup reproducible for another developer or evaluator while keeping the actual `.env` private.

Admit cleanly:
The server does not yet fail fast with centralized env validation, so missing config could still be discovered later than ideal.

### How would you explain `server/app.js` quickly?

Best answer:
It is the backend request pipeline. It configures cross-origin access, parses request bodies, logs requests, exposes a health route, attaches authenticated users from bearer tokens, mounts API routers, then handles known database errors, `404`s, and generic `500`s.

Admit cleanly:
There are some cleanup opportunities like tightening response consistency and removing small leftovers such as unused imports.

## Weak Spots To Admit Before They Catch You

- The backend response contract is inconsistent in a few places. Some errors return plain text while the frontend helper expects JSON.
- There is no real automated test suite configured on the backend yet, so current verification is mostly manual.
- The frontend routing structure is functional but still transitional. `/register` and `/login` exist, but `/` is not yet a final experience.
- Token persistence uses `localStorage`, which is simple for the demo but not the strongest production security posture.
- `preferences` and parts of `conversions` are placeholders, not completed features.
- The conversion flow is Spotify-only right now and stops at normalized metadata rather than full destination-platform resolution.
- The env setup is documented in `server/.env.example`, but the app does not yet have centralized startup validation for required variables.

## Demo Order For Tomorrow

1. Start with the auth slice, not the unfinished routes.
2. Show `client/src/main.jsx` and `client/src/App.jsx` for shared auth state and routing.
3. Show `server/app.js` for request flow and middleware order.
4. Show `server/api/users.js`, `server/middleware/getUserFromToken.js`, and `server/db/queries/users.js` for the login/register/session pipeline.
5. Mention `server/utils/jwt.js` and `server/.env.example` when you explain configuration and security.
6. Only then show `server/api/convert.js` as an example of domain logic that is started but not fully complete.
7. Call `preferences` and conversion-history routes what they are: stubs or early slices.

## If You Blank During The Defense

Use this recovery pattern:

1. State the goal of the code.
2. State the input.
3. State the decision or transformation.
4. State the output.
5. State one limitation or next improvement.

That structure sounds honest and technical even when you are nervous.

## Final Reminder

Do not try to sound like everything is finished. Sound like you understand what is complete, what is partial, why you chose the current slice, and what you would improve next.
