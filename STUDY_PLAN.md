# Study Plan

This study plan compiles the topics we have covered in the repo docs and logged session history, then organizes them into a practical progression from core CS foundations through full-stack architecture and system design.

Source material used:
- `CHAT_HISTORY.md`
- `CURRENT_HANDOFF.md`
- `README.md`
- `ERD.md`
- `AGENTS.md`
- `example-codex.md`

Note:
- I can only use chat history that was actually logged into the repo docs. I do not have hidden cross-session memory outside those files.
- This file is intended to stay live and should be updated as new concepts are taught in future sessions.

## How To Use This Plan

- Study in order.
- Do not move on just because code exists; move on when you can explain the idea and verify the behavior.
- For each topic, aim to do three things:
  - explain it in plain language
  - implement a small version of it
  - test or verify it manually

## Update Rule

- When a new concept, pattern, or architectural idea is taught in a meaningful way, add it to this file.
- Prefer updating the most relevant existing phase instead of creating duplicate sections.
- If a topic becomes important enough to deserve focused practice, add it to `Near-Term Focus For This Repo`.
- Keep additions concise and practical.
- Treat `CHAT_HISTORY.md` as the source log and this file as the cleaned-up study roadmap.

## Phase 1: Programming And Problem-Solving Foundations

- Variables, conditionals, loops, functions
- Arrays, objects, strings, sets, maps
- Time and space complexity
- Big-O tradeoffs in real code
- Recursion basics
- Sorting and searching
- Two pointers
- Sliding window
- Hash map patterns
- Stack and queue basics
- Tree and graph fundamentals
- Basic dynamic programming pattern recognition

Why this matters here:
- Your app already depends on parsing, matching, branching logic, and choosing efficient internal representations.

## Phase 2: JavaScript And Node Fundamentals

- Scope, closures, and lexical environment
- `async` / `await`
- Promises and error propagation
- Module systems
- Input validation
- Defensive coding
- Environment variables and config loading
- Debugging with logs and isolated test runs

Repo tie-ins:
- backend route handlers
- env setup
- request validation
- service-client helpers

## Phase 3: HTTP, APIs, And Backend Contracts

- HTTP methods
- Status codes
- Request and response shapes
- Difference between request headers and request bodies
- Header-name case insensitivity in HTTP
- RESTful route design
- Route-level responsibility
- Middleware responsibility
- Validation before business logic
- Error handling strategy
- API contracts and client expectations

Repo tie-ins:
- `POST /users/register`
- `POST /users/login`
- `GET /users/me`
- bearer token handling
- `req.get("authorization")` works without capitalization because HTTP header names are case-insensitive

## Phase 4: Authentication And Authorization

- Password hashing with bcrypt
- JWT basics
- What a bearer token is
- Difference between authentication and authorization
- Reading auth headers safely
- Attaching user context to the request
- Protected route flow
- Session restore on the client
- Token persistence tradeoffs
- Logout behavior and auth state clearing

Repo tie-ins:
- `server/middleware/getUserFromToken.js`
- frontend token storage
- `GET /users/me` as auth proof

## Phase 5: React And Frontend Architecture

- Component state
- Controlled forms
- Conditional rendering
- Side effects with `useEffect`
- Form submission flow
- Loading, success, and error state
- Lifting state up
- Route-based UI organization
- 404 fallback routes
- Protected frontend routes and redirects

Repo tie-ins:
- register flow
- login flow
- `BrowserRouter`
- route definitions in `client/src/App.jsx`

## Phase 6: Databases And Data Modeling

- Relational database basics
- Tables, rows, primary keys, foreign keys
- One-to-one and one-to-many relationships
- Unique constraints
- Join thinking
- Schema design from product requirements
- Normalization
- Querying for user-centric features
- Designing for saved history and preferences

Repo tie-ins:
- `USERS`
- `PREFERENCES`
- `SONGS`
- `SONG_LINKS`
- `CONVERSIONS`
- `USER_SAVED_LINKS`

## Phase 7: Music-Link Conversion Domain Logic

- URL parsing
- Source-service detection
- Track ID extraction
- Metadata normalization
- Canonical song modeling
- Cross-platform link matching
- Confidence scoring
- Internal normalized shapes vs provider-specific payloads
- Conversion history recording

Why this matters:
- This is the domain-specific algorithmic layer of the project.

## Phase 8: Integrations And External APIs

- Reading external API docs carefully
- Auth differences between providers
- Building thin API clients
- Isolating provider-specific logic
- Rate limits
- Retry and failure handling
- Mapping third-party responses into internal models
- Feature flags or fallback behavior when integrations are blocked

Repo tie-ins:
- Spotify client work
- planned Apple Music client work
- env/config requirements for provider credentials

## Phase 9: Testing, Verification, And Debugging

- Manual endpoint testing
- Verifying acceptance criteria instead of assuming completion
- Reproducing bugs with the smallest slice possible
- Comparing docs, code, and actual behavior
- Debugging local services
- Reading stack traces and server errors
- Regression checking after changes

Repo tie-ins:
- verifying auth with authenticated and unauthenticated `/users/me`
- checking frontend register/login behavior end to end
- fixing local Postgres/service issues

## Phase 10: Engineering Workflow And Delivery

- Breaking work into vertical slices
- Dependency-aware task ordering
- Using issue definitions as implementation contracts
- Distinguishing partial vs complete work
- Keeping docs aligned with code
- Writing handoffs for future sessions
- Tracking decisions in project history
- Reviewing code against “definition of done”

Repo tie-ins:
- issue-driven workflow
- handoff updates
- board reconciliation
- acceptance-criteria-based reviews

## Phase 11: System Design Foundations

- Client-server architecture
- Separation of concerns
- Request flow across frontend, backend, database, and third-party APIs
- Stateless API design
- Caching opportunities
- Data consistency vs performance
- Service boundaries
- Failure points and graceful degradation
- Observability basics
- Security boundaries
- Scalability tradeoffs

Use this project to practice answers like:
- How does a request move through the system?
- Where should auth live?
- What should be cached?
- What happens when a provider API is down?
- How would you scale conversion requests?

## Recommended Study Order

1. Programming and problem-solving foundations
2. JavaScript and Node fundamentals
3. HTTP, APIs, and backend contracts
4. Authentication and authorization
5. React and frontend architecture
6. Databases and data modeling
7. Music-link conversion domain logic
8. Integrations and external APIs
9. Testing, verification, and debugging
10. Engineering workflow and delivery
11. System design foundations

## Near-Term Focus For This Repo

- Protected frontend routes
- Auth-state flow from login to session restore to logout
- Route organization beyond auth pages
- Auth documentation cleanup
- Database reasoning from the ERD
- Conversion-pipeline thinking: detect, extract, fetch, normalize, match, return

## Done Standard For Each Topic

- You can explain the topic without reading code.
- You can point to where it exists in this repo.
- You can build a small version yourself.
- You can verify the behavior with a test, request, or manual walkthrough.

## Working Glossary

### API Contract

Definition:
- The agreed request and response shape between a client and a server.

Example:
- `POST /users/login` expects `email` and `password`, then returns a `token`, `user`, and `message`.

### Authenticated Request

Definition:
- A request that includes proof of identity, usually with a bearer token.

Example:
- `GET /users/me` with `Authorization: Bearer <token>`.

### Authorization Header

Definition:
- The HTTP header commonly used to send credentials such as bearer tokens.

Example:
- `Authorization: Bearer abc123`

### Bearer Token

Definition:
- A token that grants access to protected resources if the server accepts it as valid.

Example:
- After login, the frontend stores the JWT and sends it in the `Authorization` header.

### Client

Definition:
- The part of the app that sends requests to a server.

Example:
- The React app in `client/` is the client for this project.

### Control Flow

Definition:
- The order in which code runs and decisions are made.

Example:
- In auth middleware:
  missing header -> continue
  malformed header -> `401`
  valid token -> attach `req.user`

### Endpoint

Definition:
- A specific route and method that the backend exposes.

Example:
- `POST /users/register`

### Error Handling

Definition:
- The logic that decides what happens when something goes wrong.

Example:
- Returning `401` when a token is invalid instead of crashing the request.

### Fallback Route

Definition:
- The route used when no other route matches.

Example:
- `path="*"` rendering a 404 page in React Router.

### Header

Definition:
- Metadata attached to an HTTP request or response, separate from the body.

Example:
- `Authorization` and `Content-Type` are headers.

### Hydrate / Hydration In Request Context

Definition:
- To load data and attach it to something that downstream code can use.

Example:
- Auth middleware verifies the token, loads the user, and hydrates `req.user`.

### JSON Response Shape

Definition:
- The structure of the JSON object returned by the server.

Example:
- `{ "message": "Invalid token." }`

### JWT

Definition:
- JSON Web Token, a signed token often used to represent logged-in identity.

Example:
- After login, the backend creates a JWT containing the user id.

### Malformed

Definition:
- Present, but not in the expected format.

Example:
- `Authorization: Token abc123` is malformed for a bearer-token flow.

### Middleware

Definition:
- A function that runs during the request cycle before the final route handler finishes the response.

Example:
- `getUserFromToken` checks the auth header before protected routes use `req.user`.

### Normalized Data

Definition:
- Data reshaped into one consistent internal format.

Example:
- Spotify track data gets normalized before matching logic uses it.

### Protected Route

Definition:
- A route that should only be accessible to authenticated users.

Example:
- `GET /users/me` is protected because it requires a valid user context.

### Provider

Definition:
- An external service your app integrates with.

Example:
- Spotify and Apple Music are providers in this project.

### Request Body

Definition:
- The main payload sent with a request, usually JSON in this app.

Example:
- Login sends:
  `{ "email": "test@example.com", "password": "secret123" }`

### Response Contract

Definition:
- The promised structure of what an endpoint returns.

Example:
- If an endpoint fails, the frontend expects a JSON object with a `message`.

### Route Guard

Definition:
- Logic that allows or blocks access to a route based on a condition.

Example:
- Redirecting a user to `/login` if they try to open a protected page without a token.

### Serialize

Definition:
- To shape data into a safe, intentional format before returning it.

Example:
- `serializedUser(user)` returns `id`, `email`, and `created_at` instead of the full DB row.

### Source Of Truth

Definition:
- The place you trust most when deciding what is actually correct.

Example:
- The code is often the source of truth for current behavior when docs are stale.

### Stub

Definition:
- A temporary implementation that stands in for unfinished real logic.

Example:
- Returning placeholder conversion data while Apple Music integration is blocked.

### Vertical Slice

Definition:
- A small end-to-end feature that works across all necessary layers.

Example:
- Register form -> backend register route -> token response -> frontend stores token.

### Verification

Definition:
- Checking the actual behavior of code instead of assuming it works because it compiles.

Example:
- Testing `GET /users/me` with no token, bad token, and valid token.
