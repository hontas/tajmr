# AGENTS.md

Guidance for coding agents (Claude Code, Cursor, Codex, ...) and contributors. This file is the single
source of truth; `CLAUDE.md` only imports it. Don't duplicate it elsewhere.

## What this is

**tajmr**: a small time-recording PWA ("press play, press pause, add a note"). React + Redux +
Firebase (Auth + Realtime Database), built with Vite, tested with Vitest (via Vite+) + React Testing Library,
deployed to GitHub Pages. UI text is Swedish. The default branch is `main`.

## Commands

Use the Node version in `.nvmrc`, then `npm ci` for a clean install that matches `package-lock.json` exactly
(what CI does). Use `npm install <package>` only to add or change a dependency, and commit the lockfile.

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server with hot reload |
| `npm run verify` | **everything the PR check runs**: lint, format check, knip, tests with coverage (also in other timezones), production build. Run before pushing |
| `npm test` | Vitest, one run (`npm run tdd` to watch); `npm run test:timezones` reruns it in other timezones |
| `npm run lint` / `npm run format` | ESLint (airbnb) / Oxfmt via `vp fmt` (writes) |
| `npm run knip` | unused files, exports and dependencies |
| `npm run build` | production build; the Sentry source map upload only runs when `SENTRY_UPLOAD=true` (deploy workflow, see below) |

`npm run e2e` (Cypress) logs in with a hard-coded test account against the **live Firebase project**. Do
not run it unless asked.

## Layout

```
client/js/
  app.jsx           bootstrap: Sentry, store, Firebase auth listener
  components/<x>/   one folder per feature: <x>.jsx, <x>.module.css, <x>.test.jsx
  redux/            one module per slice (actions + reducer + thunks): intervals, user, userSettings, app
  utils/
    firebaseApi.js  ALL Firebase access (auth, reads, writes, realtime listeners); mock this in tests
    time.js         ALL date/time logic; components never do date maths themselves
    interValidator.js  validation of intervals before they are written / after they are read
```

Data (Firebase Realtime Database): `userIntervals/{uid}/{id}` (a user's intervals) and `users/{uid}`
(settings); the rules in `database.rules.json` let a user touch only their own paths. The old flat
`intervals/{id}` node is denied by the rules (nothing else is readable) and is deleted at the end of #14.

## Conventions

- Match the surrounding code. Oxfmt (Prettier style, options in `vite.config.mjs`) + airbnb ESLint are enforced; `no-console` is an error.
- Never log interval data (notes, times) or any user data. Report errors to Sentry, ids only.
- Tests live next to the code (`*.test.js[x]`). Mock `utils/firebaseApi`; never hit real Firebase in tests.
- Tests run in `Europe/Stockholm` by default (`test/setupTimezone.js`); code must not depend on the
  timezone, so `npm run test:timezones` (part of `verify`) reruns them in UTC, New York and Kolkata. Build
  dates with the local constructor (`new Date(y, m, d)`), never `'2018-03-14'` (parsed as UTC).
- Tests named `BUG: ...` pin known wrong behaviour on purpose; the fixing PR flips them.
- Coverage has a global threshold in `vite.config.mjs`. Raise it when coverage improves, never lower it.
- `data-testid` attributes are used by the Cypress specs; don't rename them casually.
- Browser support: the latest 2 versions of major browsers, including iOS Safari (the app is installed
  as a PWA on iPhone). No polyfills. The build uses Vite's default target (Chrome 111, Safari 16.4 and
  up), which covers that with room to spare.
- Keep it simple: no new dependency, abstraction or config without a concrete need.

## Workflow

1. Work is tracked as GitHub issues; **one issue = one PR**, branched from `main`, linked with `Closes #n`.
2. Tests first for bug fixes (see the `BUG:` tests). Add or update tests with every behaviour change.
3. Run `npm run verify` before pushing. CI (`lint-and-test`) must be green; PRs are merged by the owner.
4. Don't skip, disable or loosen tests, lint rules or the coverage threshold to get green.
5. Never commit secrets or `.env`. Don't force-push to branches you didn't create.

## Environment and deploy

- Local dev, tests and `npm run verify` need no environment variables. The deploy workflow sets
  `SENTRY_UPLOAD=true` plus `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT` for the build, which
  then emits hidden source maps and uploads them to Sentry. The first step of the deploy job checks that all
  four are set and fails at once if not (the build checks them too).
  The workflow deletes the `.map` files before publishing, so the original source is never served.
  `.env.example` only documents the variables (`.env` is gitignored).
- The Firebase web config is committed in `utils/firebaseApi.js` (public by design; it is not a secret).
- Database security rules live in `database.rules.json` (+ `firebase.json`). They are **not** deployed by the
  workflow: the owner deploys them with `firebase deploy --only database --project <id>` or pastes them in
  the console. The rules are the access control; never rely on client-side filtering.
- **Build and Deploy** (runs on pushes to `main` that touch app source, dependencies or build config, and
  manually via `workflow_dispatch`; `main` only): such a merged PR goes live, so hold the merge of anything
  that needs a manual step first (e.g. a data migration). The file list is the `paths` filter in the
  workflow; add new build-affecting files there. The `build` job runs in the `production`
  environment (holds the `SENTRY_AUTH_TOKEN` secret), uploads the site as a Pages artifact; the `deploy`
  job publishes it via `actions/deploy-pages`. In GitHub: `SENTRY_AUTH_TOKEN` = environment secret on
  `production`; `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_DSN` = repository variables (the DSN is public; it ships in the
  bundle, and without it Sentry stays off, which is the case in dev and in tests).
- **Versions** are calendar versions computed by the deploy workflow: `YYYY.MM.DD` (UTC), plus `.N` from the
  second deploy of the same day. They show in the navbar, are the Sentry release (`tajmr@<version>`) and
  are tagged `v<version>` on the deployed commit after a successful deploy. `package.json`'s `version` is
  not used; local builds report `dev`.
