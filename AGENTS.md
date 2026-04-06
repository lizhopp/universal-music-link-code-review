# AGENTS.md

## Purpose
- This file standardizes how Codex should work in this repository across different machines and sessions.
- Follow these instructions before relying on assumptions from prior chat context.

## Repo Root
- The git repository root is `universal-music-link/`.
- Run git commands from this directory unless there is a specific reason not to.

## Project Structure
- Frontend app: `client/`
- Backend app: `server/`
- Shared project docs live at repo root.
- Conversation log: `CHAT_HISTORY.md`
- ERD files: `ERD.md` and `ERD.erd`

## Known Repo Quirk
- There appears to be duplicate or leftover scaffold content under `client/universal-music-link/`.
- Treat `client/` as the primary frontend unless the user explicitly says otherwise.
- Be careful not to edit the duplicate frontend tree by accident.

## Chat History Standard
- Keep `CHAT_HISTORY.md` updated after meaningful requests, decisions, or completed work.
- Use transcript-style entries instead of one-line summaries.
- Format entries as:

  ```md
  ### YYYY-MM-DD HH:MM:SS TZ
  - User:
    <user request>
  - Codex:
    <what was checked, decided, changed, and why>
  ```

- If exact timestamps are unavailable for older content, use a backfilled note such as:
  - `### Earlier in session (chronological, timestamps not captured)`
- Include concrete commands, findings, files, issue numbers, and outcomes when they matter.
- Do not dump every tiny intermediate step; keep entries concise but reconstructable.

## Communication
- Details are important. User is beginner/intermediate. Reasoning behind logic and instructions help build mental mold. 

## Working Style
- The user learns best by doing the implementation themselves.
- Inspect the relevant files before making edits.
- Prefer updating existing files over creating duplicate implementations.
- Do not delete, edit or overwrite user work unless the user explicitly asks for that.
- Do not create, update, or delete code without the user's explicit consent.
- If a user request could reasonably be interpreted as asking Codex to write code, pause and ask for confirmation before making any file changes.
- Default to review, explanation, debugging guidance, issue assessment, and step-by-step implementation help unless the user clearly authorizes direct edits.
- If there is a risky git action, explain the impact clearly.
- When the user asks about whether something is current, verify with git instead of assuming.

## Git Workflow Guidance
- This project may be used across multiple computers.
- Prefer safe git guidance first:
  - `git status`
  - `git fetch origin`
  - `git pull origin main`
- Before destructive sync steps like `git reset --hard` or `git clean -fd`, call out that they can discard local work.
- The main tracked branch is usually `main` unless the repo state shows otherwise.

## Documentation Expectations
- Keep `README.md` aligned with the actual repo state and near-term plan.
- Keep schema and ERD docs aligned with the current database design work.
- When updating issue-related work, mention relevant issue numbers in `CHAT_HISTORY.md`.

## Project Board Workflow
- The user wants Codex to actively use the GitHub project board and issues as part of normal project guidance.
- When asked about progress, next steps, completion status, or what to work on next:
  - inspect the relevant local code first
  - review the relevant GitHub issues/project board state if access is available
  - compare implementation status against the issue description/checklist
- If an issue is clearly misclassified on the board, Codex should recommend moving it and may move it when the user has already established that board maintenance is part of the task.
- Codex should help keep issue status aligned with reality, including:
  - identifying completed issues
  - identifying partial issues
  - identifying blocked issues
  - suggesting which issue is the next most feasible based on dependencies and current codebase state
- “Next feasible issue” should mean the next task the user can realistically complete with the fewest blockers, not just the next numeric issue.
- When suggesting next work, prefer dependency-aware sequencing and explain why that issue is the best next step.
- When helpful, provide a short checklist of what remains for the chosen issue.
- If board access is unavailable, say so clearly and fall back to a codebase-only assessment.

## Issue Review Standard
- For issue reviews, default to checking:
  - whether the code exists
  - whether it matches the issue requirements
  - whether supporting docs/config/schema are aligned
  - whether the live or test behavior was verified if practical
- Do not mark an issue complete just because partial code exists.
- Call out the exact missing pieces that prevent completion.
- When an issue appears complete in code but not on the board, mention that mismatch explicitly.

## Frontend/Backend Notes
- Frontend is Vite + React under `client/`.
- Backend is Node + Express + PostgreSQL under `server/`.
- Favor changes that preserve the current project structure instead of introducing new parallel app scaffolds.

## If Uncertain
- Prefer local inspection over assumptions.
- If two similar paths exist, verify the intended one before editing.
- If the user asks for standardization, favor stable repo files like this one over chat-only memory.
