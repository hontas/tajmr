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
    publicDir: 'public',
    define: {
      'process.env.NODE_ENV': JSON.stringify(isBuild ? 'production' : 'development'),
      // an instant (ISO string); the app formats it in the viewer's timezone, not the build machine's
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      'process.env.RELEASE': JSON.stringify(release),
    },
    css: {
      // pure-css.min.css still carries IE-only hacks (`*zoom`), which the CSS minifier rejects
      lightningcss: { errorRecovery: true },
    },
    build: {
      outDir: '../public',
      emptyOutDir: true,
      // hidden: emitted for the Sentry upload without being referenced from the bundles. The deploy
      // workflow deletes the .map files afterwards so the original source is not published.
      sourcemap: uploadSourceMaps ? 'hidden' : false,
    },
    plugins: [
      react({ include: /\.(js|jsx)$/ }),
      VitePWA({
        // the app registers the worker itself (register-sw.js), under the name earlier deploys used,
        // so browsers with the old worker installed pick up this one
        injectRegister: false,
        filename: 'service-worker.js',
        manifestFilename: 'manifest.json',
        workbox: { clientsClaim: true, skipWaiting: true },
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
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
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
            uploadLegacySourcemaps: { paths: ['public'], urlPrefix: `~${base}` },
          },
        }),
    ],
  };
});
