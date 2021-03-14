import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { generateSW } from 'rollup-plugin-workbox';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    PKG_VERSION: JSON.stringify(pkg.version),
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
  ],
});
