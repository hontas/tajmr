import { defineConfig } from '@vite-pwa/assets-generator/config';

// Icons and the matching <head> links are generated at build time from this one image
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    // the source image is opaque and square, so no padding and no maskable variant
    transparent: { sizes: [192, 512], favicons: [[48, 'favicon.ico']] },
    maskable: { sizes: [] },
    apple: { sizes: [180], padding: 0 },
  },
  images: ['public/icon.png'],
});
