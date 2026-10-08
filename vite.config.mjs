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
      // hidden: emitted for the Sentry upload without being referenced from the bundles. The deploy
      // workflow deletes the .map files afterwards so the original source is not published.
      sourcemap: uploadSourceMaps ? 'hidden' : false,
      rolldownOptions: {
        output: {
          // big, rarely changing libraries get their own files, so a release that only changes app
          // code doesn't make returning users download them again
          codeSplitting: {
            groups: [
              { name: 'firebase', test: /node_modules[\\/](@firebase|firebase)[\\/]/ },
              { name: 'sentry', test: /node_modules[\\/]@sentry[\\/]/ },
              {
                name: 'react',
                test: /node_modules[\\/](react|react-dom|scheduler|react-redux|redux|redux-thunk)[\\/]/,
              },
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
