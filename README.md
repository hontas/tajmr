tajmr
=====

> Record time sometime [tajmr](https://hontas.github.io/tajmr/)

1. Press play to start recording time.
2. Then pause it.
3. Add a note if you want.
4. Get paid (tajmr won't help with this)

![Tajmr](tajmr.png)

## dev

Use the Node version in `.node-version`.

```shell
npm ci
npm run dev
```

Run `npm run verify` before pushing: it runs what the PR check runs (lint, format check, knip, tests with
coverage, production build). See [AGENTS.md](AGENTS.md) for the conventions and workflow.

### e2e

The Cypress specs in `cypress/e2e` log in with a test account against the **live Firebase project**, so
they are not part of CI or `npm run verify`. With the dev server running (`npm run dev`, port 5173):

```shell
npm ci   # without CYPRESS_INSTALL_BINARY=0, so the Cypress binary is downloaded
npm run e2e
```

## environment

Local development and tests need no environment variables. The deploy build (`SENTRY_UPLOAD=true`) uploads
source maps to Sentry using `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT`, which the deploy workflow
injects at build time (it fails if one is missing, and removes the maps before publishing): `SENTRY_AUTH_TOKEN` is a secret on the `production` environment, `SENTRY_ORG` and
`SENTRY_PROJECT` are repository variables. `.env.example` only documents them. The Firebase web config is committed in
`src/utils/firebaseApi.ts` (public by design).

## deploy

Deployed to GitHub Pages (source: GitHub Actions) by the **Build and Deploy** workflow. It runs on every
merge to `main` that changes app source, dependencies or build config (see the `paths` filter in the
workflow), and can also be run manually from the Actions tab; it only runs on `main`. The `build` job lints, tests and builds (in the
`production` environment, which holds `SENTRY_AUTH_TOKEN`), then the `deploy` job publishes the
artifact to the `github-pages` environment. Each deploy gets a calendar version (`YYYY.MM.DD`, then
`YYYY.MM.DD.2`, ...) that shows in the navbar, is the Sentry release, and is tagged `v<version>` after a
successful deploy.
