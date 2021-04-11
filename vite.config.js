import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { generateSW } from 'rollup-plugin-workbox';
import copy from 'rollup-plugin-copy';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    RELEASE: JSON.stringify(`${pkg.name}@${pkg.version}`),
    BUILD_TIME: JSON.stringify(
      new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date()
      )
    ),
  },
  plugins: [
    reactRefresh(),
    generateSW({
      globDirectory: 'dist',
      swDest: path.join('dist', 'service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
    }),
    copy({
      targets: [
        {
          src: ['client/assets/icons/icon_512x512.png', 'client/assets/icons/icon_192x192.png'],
          dest: 'dist/assets',
        },
      ],
      verbose: true,
      hook: 'writeBundle',
      copyOnce: true,
    }),
  ],
});
