# AGENTS.md

Guidance for coding agents (Claude Code, Cursor, Codex, ...) and contributors. This file is the single
source of truth; `CLAUDE.md` only imports it. Keep it lean: a line belongs here only if it prevents a
mistake that the code, the config or the tools wouldn't. Delete a line when a tool starts enforcing it.

**tajmr** is a small time-recording PWA (React, Firebase Auth + Realtime Database, Vite+). The UI
text is Swedish. The default branch is `main`.

## Before you push

Run `npm run verify`: it is everything the PR check runs (lint, format, knip, tests with coverage, tests in
other timezones, production build). Use the Node version in `.node-version` and `npm ci`; use `npm install` only
to add or change a dependency, and commit the lockfile.

Do not run `npm run e2e` (Cypress) unless asked: it logs in with a hard-coded test account against the
**live Firebase project**.

## Code rules

- Never log interval data (notes, times) or any user data. Report errors to Sentry, ids only.
- All Firebase access goes through `utils/firebaseApi.ts`, all date maths through `utils/time.ts`
  (components never do date maths), validation of intervals through `utils/interValidator.ts`.
- Tests: mock `utils/firebaseApi`, never hit real Firebase. Tests run in `Europe/Stockholm`, but code must
  not depend on the timezone (`verify` reruns them in UTC, New York and Kolkata): build dates with
  `new Date(y, m, d)`, never `'2018-03-14'` (parsed as UTC).
- Tests named `BUG: ...` pin known wrong behaviour on purpose; the PR that fixes it flips them.
- `data-testid` attributes are used by the Cypress specs; don't rename them casually.
- Coverage thresholds are in `vite.config.mjs`. Raise them when coverage improves, never lower them.
- Browser support: the latest 2 versions of major browsers, including iOS Safari (the app is installed as
  a PWA on iPhone). No polyfills. Vite's default build target covers this.
- **Web APIs first.** Before writing a custom implementation or adding a package, check whether the
  platform already does it (`fetch`, `IntersectionObserver`, `Intl`, `URL`, IndexedDB, Web Locks,
  `structuredClone`, `<dialog>`, CSS features, ...) in the browsers above (MDN / caniuse). Only reach for a
  package or custom code when the Web API can't do the job, and say why in the PR.
- The code is TypeScript (strict), checked by `vp lint`: no `any`, no `@ts-ignore`, no casts that hide a problem. Data from Firebase is validated by the valibot schemas in `utils/interValidator.ts`; the `Interval` and settings types come from them.
- Keep it simple: no new dependency, abstraction or config without a concrete need.
- Import across folders from the `src` root with `#/` (`#/utils/time.ts`, `#/components/button/button.tsx`, with the real file extension; `package.json` `imports`). Relative imports only into the same folder or below (`./x.ts`, `./sub/x.ts`); the linter rejects `../`.
- The React Compiler memoizes at build time: don't write `useMemo`, `useCallback` or `memo`. Keep components pure (no `Date.now()` or ref reads while rendering; use `useNow`), which the lint rules check.
- **No comments by default.** Rename the function or variable instead. Add a comment only when a name
  can't explain code that would otherwise look wrong or make no sense, and then make it as short and
  direct as possible.
- **Docs describe the current state only**: no history, no "used to" or "removed in", here and in
  comments, unless the user asks for it. The history is in git and the issues.

## Workflow

1. Work is tracked as GitHub issues; **one issue = one PR**, branched from `main`, linked with `Closes #n`.
   PRs are merged by the owner, and CI (`lint-and-test`) must be green. Fill in the PR template
   (`.github/pull_request_template.md`) and keep the description short and in plain words.
2. Tests first for bug fixes. Add or update tests with every behaviour change.
3. Don't skip, disable or loosen tests, lint rules or the coverage threshold to get green. Fix the places
   instead of turning a rule off.
4. **Any UI change includes at least one screenshot in the PR description**: mobile width (about 390×844,
   the app is used on an iPhone), plus a desktop one when the layout differs there. Show the changed
   state, not just the page; one per state the change touches (dark/light, ...). Keep the image files out
   of the repo (use a temp folder and delete it afterwards).
5. Never commit secrets or `.env`. Don't force-push to branches you didn't create.

## Deploy and data

- **A merged PR goes live**: _Build and Deploy_ runs on pushes to `main` that touch app source,
  dependencies or build config (the `paths` filter in the workflow; add new build-affecting files there).
  Hold the merge of anything that needs a manual step first, such as a data migration.
- Database security rules (`database.rules.json`) are **not** deployed by the workflow: the owner deploys
  them (`firebase deploy --only database --project <id>`) or pastes them in the console. The rules are the
  access control; never rely on client-side filtering. Data lives under `userIntervals/{uid}/{id}` and
  `users/{uid}`.
- Sentry: the deploy build needs `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` (repository variables) and
  `SENTRY_AUTH_TOKEN` (secret on the `production` environment), and fails at once if one is missing.
  Without the DSN Sentry stays off, as in dev and tests. Source maps are uploaded and deleted before
  publishing, so the source is never served. `.env.example` documents the variables.
- The Firebase web config in `utils/firebaseApi.ts` is public by design; it is not a secret.
- Versions are calendar versions (`YYYY.MM.DD`, plus `.N` from the second deploy of a day) computed by the
  deploy workflow; they are the Sentry release and the `v<version>` tag. `package.json`'s `version` is not
  used.
