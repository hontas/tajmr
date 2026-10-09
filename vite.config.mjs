import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const themeColor = '#1f8dd6';

export default defineConfig(({ command, isPreview }) => {
  // `vite preview` serves the production build, so it needs the production base too
  const isBuild = command === 'build' || isPreview;
  const base = isBuild ? '/tajmr/' : '/';
  // Set by the deploy workflow (calendar version, e.g. 2026.10.08 or 2026.10.08.2)
  const release = `${pkg.name}@${process.env.APP_VERSION || 'dev'}`;
  // Only the deploy workflow sets SENTRY_UPLOAD. PR builds run the same production build without it.
  const uploadSourceMaps = command === 'build' && process.env.SENTRY_UPLOAD === 'true';

  if (uploadSourceMaps) {
    // the deploy build has to report to Sentry, so a missing value fails it
    const missing = ['SENTRY_DSN', 'SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'].filter(
      (name) => !process.env[name],
    );
    if (missing.length) {
      throw new Error(`SENTRY_UPLOAD is set but ${missing.join(', ')} is missing`);
    }
  }

  return {
    fmt: {
      singleQuote: true,
      arrowParens: 'always',
      printWidth: 100,
      sortPackageJson: false,
      ignorePatterns: [
        'client/styles/pure-css.min.css',
        'client/styles/normalize.css',
        'dist/',
        'coverage/',
        'package-lock.json',
      ],
    },
    lint: {
      plugins: ['react', 'jsx-a11y', 'import', 'vitest'],
      // correctness, suspicious, pedantic, perf, style, restriction, nursery
      categories: {
        correctness: 'error',
        perf: 'error',
        suspicious: 'error',
      },
      env: { browser: true, node: true, vitest: true },
      // `process.env.X` is replaced at build time (see `define` below)
      globals: { process: 'readonly' },
      ignorePatterns: ['dist/**', 'coverage/**'],
      rules: {
        'no-console': 'error',
        eqeqeq: 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        // side-effect imports (stylesheets, firebase/auth) are normal in a bundled app
        'import/no-unassigned-import': 'off',
      },
      overrides: [
        {
          files: ['cypress/**'],
          env: { mocha: true },
          globals: { cy: 'readonly', Cypress: 'readonly' },
        },
      ],
    },
    base,
    define: {
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      'process.env.RELEASE': JSON.stringify(release),
      'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN || ''),
    },
    css: {
      // the vendored Pure.css 0.6 (2014) carries IE-only hacks (`*zoom`) that the CSS minifier rejects
      lightningcss: { errorRecovery: true },
    },
    test: {
      environment: 'jsdom',
      // describe, test, expect and vi without imports, like Jest
      globals: true,
      setupFiles: ['./test/setup.js'],
      // Swedish time unless TZ is set (`npm run test:timezones` does), so results match on every machine
      env: { TZ: process.env.TZ || 'Europe/Stockholm' },
      coverage: {
        include: ['client/js/**/*.{js,jsx}'],
        // Baseline: ratchet up as coverage improves, never down. Enforced with `--coverage` (CI).
        thresholds: { statements: 75, branches: 60, functions: 70, lines: 75 },
      },
    },
    build: {
      // hidden: emitted for the Sentry upload without being referenced from the bundles. The deploy
      // workflow deletes the .map files afterwards so the original source is not published.
      sourcemap: uploadSourceMaps ? 'hidden' : false,
      rolldownOptions: {
        output: {
          // libraries in their own files (Firebase is the biggest), so a release that only changes
          // app code doesn't make returning users download them again
          codeSplitting: {
            groups: [
              { name: 'firebase', test: /node_modules[\\/](@firebase|firebase)[\\/]/ },
              { name: 'vendor', test: /node_modules/ },
            ],
          },
        },
      },
    },
    plugins: [
      react(),
      VitePWA({
        // a new version waits until the user accepts it (UpdatePrompt, register-sw.js). The worker
        // keeps the name earlier deploys used, so browsers with the old worker pick up this one
        registerType: 'prompt',
        injectRegister: false,
        filename: 'service-worker.js',
        manifestFilename: 'manifest.json',
        // the first install takes control of the open page right away (so it works offline at once);
        // updates still wait for the user, because `skipWaiting` is only called from the prompt
        workbox: { clientsClaim: true },
        // icons and <head> links are generated at build time (see pwa-assets.config.mjs)
        pwaAssets: { config: true },
        manifest: {
          name: pkg.name,
          short_name: pkg.name,
          description: pkg.description,
          orientation: 'any',
          lang: 'sv',
          display: 'standalone',
          start_url: base,
          theme_color: themeColor,
          background_color: themeColor,
        },
      }),
      uploadSourceMaps &&
        sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          telemetry: false,
          // each bundle and its source map get the same debug id, which is how Sentry matches them
          // to events; the maps are deleted after the upload so the original source isn't published
          sourcemaps: { filesToDeleteAfterUpload: ['dist/**/*.map'] },
          // must equal Sentry.init({ release }) in app.jsx, so events are grouped under this release
          release: { name: release },
        }),
    ],
  };
});
