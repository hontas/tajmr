import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite-plus';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { VitePWA } from 'vite-plugin-pwa';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const themeColor = '#1f8dd6';

export default defineConfig(({ command, isPreview }) => {
  // `vite preview` serves the production build
  const isBuild = command === 'build' || isPreview;
  const base = isBuild ? '/tajmr/' : '/';
  const release = `${pkg.name}@${process.env.APP_VERSION || 'dev'}`;
  const uploadSourceMaps = command === 'build' && process.env.SENTRY_UPLOAD === 'true';

  if (uploadSourceMaps) {
    const missing = ['SENTRY_DSN', 'SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'].filter(
      (name) => !process.env[name],
    );
    if (missing.length) {
      throw new Error(`SENTRY_UPLOAD is set but ${missing.join(', ')} is missing`);
    }
  }

  return {
    staged: {
      '*.{js,jsx,mjs,css,md}': 'vp check --fix',
    },
    fmt: {
      singleQuote: true,
      arrowParens: 'always',
      printWidth: 100,
      sortPackageJson: false,
      ignorePatterns: ['dist/', 'coverage/', 'package-lock.json'],
    },
    lint: {
      plugins: ['react', 'jsx-a11y', 'import', 'vitest'],
      categories: {
        correctness: 'error',
        perf: 'error',
        suspicious: 'error',
      },
      env: { browser: true, node: true, vitest: true },
      // replaced at build time (see `define`)
      globals: { process: 'readonly' },
      ignorePatterns: ['dist/**', 'coverage/**'],
      rules: {
        'no-console': 'error',
        eqeqeq: 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        // firebase/auth and firebase/database register themselves on import
        'import/no-unassigned-import': ['error', { allow: ['firebase/*'] }],
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
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test/setup.js'],
      // Swedish time unless TZ is set (`npm run test:timezones` does), so results match on every machine
      env: { TZ: process.env.TZ || 'Europe/Stockholm' },
      coverage: {
        include: ['src/**/*.{js,jsx}'],
        thresholds: { statements: 75, branches: 60, functions: 70, lines: 75 },
      },
    },
    build: {
      // hidden: not referenced from the bundles, only uploaded to Sentry
      sourcemap: uploadSourceMaps ? 'hidden' : false,
      rolldownOptions: {
        output: {
          // a release that only changes app code doesn't re-download the libraries
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
      babel({ presets: [reactCompilerPreset()] }),
      VitePWA({
        // a new version waits until the user accepts it (UpdatePrompt); keep the file name so
        // browsers with the old worker pick up the new one
        registerType: 'prompt',
        injectRegister: false,
        filename: 'service-worker.js',
        manifestFilename: 'manifest.json',
        // the first install takes control at once; updates wait for the prompt
        workbox: { clientsClaim: true },
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
          // the original source is never served
          sourcemaps: { filesToDeleteAfterUpload: ['dist/**/*.map'] },
          // must equal Sentry.init({ release }) in app.jsx
          release: { name: release },
        }),
    ],
  };
});
