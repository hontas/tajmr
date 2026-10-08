import { readFileSync } from 'node:fs';
import browserslist from 'browserslist';
import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const themeColor = '#1f8dd6';

// Vite ignores `browserslist` in package.json, so turn it into build targets (the lowest version
// of each browser, e.g. ['chrome153', 'ios26.6', 'safari26.6'])
const targetNames = { chrome: 'chrome', safari: 'safari', ios_saf: 'ios' };
const lowestVersions = {};
browserslist().forEach((entry) => {
  const [browser, version] = entry.split(' ');
  const name = targetNames[browser];
  if (name && !(parseFloat(version) >= parseFloat(lowestVersions[name]))) {
    lowestVersions[name] = version;
  }
});
const buildTarget = Object.entries(lowestVersions).map(([name, version]) => `${name}${version}`);

export default defineConfig(({ command, isPreview }) => {
  // `vite preview` serves the production build, so it needs the production base too
  const isBuild = command === 'build' || isPreview;
  const base = isBuild ? '/tajmr/' : '/';
  // Set by the deploy workflow (calendar version, e.g. 2026.10.08 or 2026.10.08.2)
  const release = `${pkg.name}@${process.env.APP_VERSION || 'dev'}`;
  // Only the deploy workflow sets SENTRY_UPLOAD. PR builds run the same production build without it.
  const uploadSourceMaps = command === 'build' && process.env.SENTRY_UPLOAD === 'true';

  if (uploadSourceMaps) {
    const missing = ['SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'].filter(
      (name) => !process.env[name]
    );
    if (missing.length) {
      throw new Error(`SENTRY_UPLOAD is set but ${missing.join(', ')} is missing`);
    }
  }

  return {
    root: 'client',
    base,
    define: {
      // an instant (ISO string); the app formats it in the viewer's timezone, not the build machine's
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      'process.env.RELEASE': JSON.stringify(release),
    },
    css: {
      // pure-css.min.css still carries IE-only hacks (`*zoom`), which the CSS minifier rejects
      lightningcss: { errorRecovery: true },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      target: buildTarget,
      // hidden: emitted for the Sentry upload without being referenced from the bundles. The deploy
      // workflow deletes the .map files afterwards so the original source is not published.
      sourcemap: uploadSourceMaps ? 'hidden' : false,
    },
    plugins: [
      react(),
      VitePWA({
        // the app registers the worker itself (register-sw.js), under the name earlier deploys used,
        // so browsers with the old worker installed pick up this one
        injectRegister: false,
        filename: 'service-worker.js',
        manifestFilename: 'manifest.json',
        workbox: { clientsClaim: true, skipWaiting: true },
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
          // the 6.x SDK can't use debug ids, so match uploads to events by release and url
          sourcemaps: { disable: true },
          release: {
            // must equal Sentry.init({ release }) in app.jsx, or Sentry can't match events to uploads
            name: release,
            inject: false,
            // the site is served from a sub path, so artifact urls must include it
            uploadLegacySourcemaps: { paths: ['dist'], urlPrefix: `~${base}` },
          },
        }),
    ],
  };
});
