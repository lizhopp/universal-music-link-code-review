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

## Working Agreement

- The user does not want Codex making code changes for them by default.
- Default to guided review, explanation, issue assessment, and block-by-block implementation help unless the user explicitly asks for direct edits.
- Keep `CURRENT_HANDOFF.md` and `CHAT_HISTORY.md` aligned before machine switches.

## Active Focus

- The YouTube matcher fixes are now committed on `main` as `43ef684 Improve YouTube matching heuristics`.
- The next product feature focus is tracking user conversion history.
- Recommended order for the next feature is backend first:
  - `#49` Save conversion to database
  - `#50` Get conversion history endpoint
  - `#51` Delete conversion endpoint
- Frontend history work should follow after the backend routes are real:
  - `#52` Build history page
  - `#53` Display conversion history table
  - `#54` Add delete button for history items

## Current Status

- Git state re-verified on 2026-04-24 after the matcher commit:
  - current branch: `main`
  - latest commit: `43ef684 Improve YouTube matching heuristics`
  - `git status --short --branch` shows `main` is `ahead 1` of `origin/main`
- Git state re-verified on 2026-04-24:
  - `main`, `initial_page_change`, `origin/main`, and `origin/initial_page_change` all point to commit `33bf0bf`
  - commit message: `made conversion accessible by non-users`
  - `git rev-list --left-right --count main...initial_page_change` returned `0 0`
  - `git status --short --branch` showed `## main...origin/main` with no ahead/behind markers
- Conversion matcher checkpoint re-verified on 2026-04-24:
  - `server/utils/youtube.js` now includes:
    - bracketed YouTube-title cleanup
    - `Artist - Song` and `Song - Artist` title parsing heuristic
    - base-title-aware YouTube candidate scoring for cases like `Ghost Town - Live`
  - a 5-case mixed regression batch passed across both directions
- Conversion/history code state re-checked on 2026-04-24:
  - `server/db/schema.sql` already defines the `conversions` table
  - `server/api/convert.js` returns conversion results but does not persist conversion rows yet
  - `server/api/conversions.js` is still placeholder wiring for:
    - `GET /conversions`
    - `DELETE /conversions/:id`
  - `client/src/App.jsx` already has a placeholder `Conversion History` section in the dashboard
- Live issue review re-checked on 2026-04-24:
  - `#49` Save conversion to database is `OPEN` and in `Ready`
  - `#50` Get conversion history endpoint is `OPEN` and in `Ready`
  - `#51` Delete conversion endpoint is `OPEN` and in `Ready`
  - `#52`, `#53`, and `#54` remain the dependent frontend history tickets
- Data caveat found during history-slice review:
  - `server/db/seed.js` currently seeds only:
    - `spotify`
    - `apple-music`
  - it does not currently seed `youtube`
  - that matters if the first pass of `#49` should store `requested_target_platform_id` for YouTube-target conversions

## Next Exact Step

- If this commit should exist on the other machine, push `main` before switching.
- After that, stay in guided mode and start with backend issue `#49`.
- First implementation block should define the minimum `conversions` insert payload:
  - `user_id`: `req.user?.id ?? null`
  - `source_url`: always the submitted URL
  - `requested_target_platform_id`: resolve from the `platforms` table if available
  - `status`: at minimum `success`, `no_match`, `error`, or `unsupported`
  - `source_song_link_id`, `target_song_link_id`, and `confidence_score`: leave nullable in the first pass
- Before writing the insert logic, decide one of these two paths for `requested_target_platform_id`:
  - add a `youtube` platform row first
  - or allow that field to stay `null` for the first persistence pass
- After `#49`, replace the stubbed history routes in `server/api/conversions.js` for `#50` and `#51`.

## Files In Play

- `server/api/convert.js`
- `server/api/conversions.js`
- `server/db/schema.sql`
- `server/db/seed.js`
- `server/db/queries/`
- `client/src/App.jsx`
- `CURRENT_HANDOFF.md`
- `CHAT_HISTORY.md`

## Verified

- latest commit on `main` is `43ef684 Improve YouTube matching heuristics`
- local `main` is ahead of `origin/main` by 1 commit
- `initial_page_change` is already merged into `main`
- `main` is aligned with `origin/main`
- `/convert` currently supports both:
  - `spotify -> youtube`
  - `youtube -> spotify`
- the recent YouTube-matcher fixes pass this mixed regression batch:
  - `4cOdK2wGLETKBW3PvgPWqT -> dQw4w9WgXcQ`
  - `6NCmU0ETuOf1Dq17u4xrNt -> PRAbIP1tN7g`
  - `gGdGFtwCNBE -> 003vvx7Niy0yvhvHt4a68B`
  - `kbB0QrBIs9k -> 5ID6qIRs04r4fMajBDY7uK`
  - `9TqiZA9Az00 -> 5QOeq4uxjxhZWF8BvYI2fo`
- auth/routing work remains in place and is not the current blocker
- `server/.env.example` is updated with the current backend env vars, including `YOUTUBE_API_KEY`

## Open Questions

- For the first history persistence slice, should `requested_target_platform_id` stay `null` until `youtube` is seeded in `platforms`, or should that seed/data step happen first?
- Should the eventual history UI stay inline on the dashboard, or become a separate `/history` route when `#52` begins?

## Handoff Update Rule

Update this file when:
- the active task changes
- the next exact step changes
- a major checkpoint is verified
- a blocker appears
