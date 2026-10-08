# AGENTS.md

Guidance for coding agents (Claude Code, Cursor, Codex, ...) and contributors. This file is the single
source of truth; `CLAUDE.md` only imports it. Don't duplicate it elsewhere.

## What this is

**tajmr**: a small time-recording PWA ("press play, press pause, add a note"). React 17 + Redux +
Firebase (Auth + Realtime Database), built with webpack, tested with Jest + React Testing Library,
deployed to GitHub Pages. UI text is Swedish. The default branch is `main`.

## Commands

Use the Node version in `.nvmrc`, then `npm ci` (never `npm install` unless changing dependencies).

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server with hot reload |
| `npm run verify` | **everything the PR check runs**: lint, format check, knip, tests with coverage. Run before pushing |
| `npm test` | Jest (add `-- --watch` or use `npm run tdd`) |
| `npm run lint` / `npm run format` | ESLint (airbnb) / Prettier (writes) |
| `npm run knip` | unused files, exports and dependencies |
| `npm run build` | production build (normally run by CI; the Sentry env vars are injected there, see below) |

`npm run e2e` (Cypress) logs in with a hard-coded test account against the **live Firebase project**. Do
not run it unless asked.

## Layout

```
client/js/
  app.js            bootstrap: Sentry, store, Firebase auth listener
  components/<x>/   one folder per feature: <x>.jsx, <x>.module.css, <x>.test.jsx
  redux/            one module per slice (actions + reducer + thunks): intervals, user, userSettings, app
  utils/
    firebaseApi.js  ALL Firebase access (auth, reads, writes, realtime listeners); mock this in tests
    time.js         ALL date/time logic; components never do date maths themselves
    interValidator.js  validation of intervals before they are written / after they are read
```

Data (Firebase Realtime Database): `intervals/{id}` (flat, each with a `user` field) and
`users/{uid}` (settings). The client filters intervals by user; this is being replaced by per-user paths
and security rules (#14), so don't build on the flat model.

## Conventions

- Match the surrounding code. Prettier + airbnb ESLint are enforced; `no-console` is an error.
- Never log interval data (notes, times) or any user data. Report errors to Sentry, ids only.
- Tests live next to the code (`*.test.js[x]`). Mock `utils/firebaseApi`; never hit real Firebase in tests.
- Tests run in `Europe/Stockholm` (`test/setupTimezone.js`): duration formatting currently assumes
  Swedish time (known bug, #24). Don't remove the pin without fixing that.
- Tests named `BUG: ...` pin known wrong behaviour on purpose; the fixing PR flips them.
- Coverage has a global threshold in `jest.config.js`. Raise it when coverage improves, never lower it.
- `data-testid` attributes are used by the Cypress specs; don't rename them casually.
- Browser support: the latest 2 versions of major browsers, including iOS Safari (the app is installed
  as a PWA on iPhone). No polyfills.
- Keep it simple: no new dependency, abstraction or config without a concrete need.

## Workflow

1. Work is tracked as GitHub issues; **one issue = one PR**, branched from `main`, linked with `Closes #n`.
2. Tests first for bug fixes (see the `BUG:` tests). Add or update tests with every behaviour change.
3. Run `npm run verify` before pushing. CI (`lint-and-test`) must be green; PRs are merged by the owner.
4. Don't skip, disable or loosen tests, lint rules or the coverage threshold to get green.
5. Never commit secrets or `.env`. Don't force-push to branches you didn't create.

## Environment and deploy

- Local dev, tests and `npm run verify` need no environment variables. `SENTRY_AUTH_TOKEN`,
  `SENTRY_ORG` and `SENTRY_PROJECT` are injected at build time by the deploy workflow for the source map
  upload; `.env.example` only documents them (`.env` is gitignored).
- The Firebase web config is committed in `utils/firebaseApi.js` (public by design; it is not a secret).
- **Build and Deploy** (`workflow_dispatch`, `main` only): the `build` job runs in the `production`
  environment (holds the `SENTRY_AUTH_TOKEN` secret), uploads the site as a Pages artifact; the `deploy`
  job publishes it via `actions/deploy-pages`. In GitHub: `SENTRY_AUTH_TOKEN` = environment secret on
  `production`; `SENTRY_ORG` / `SENTRY_PROJECT` = repository variables.
