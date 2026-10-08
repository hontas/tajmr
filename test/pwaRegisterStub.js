// stands in for the `virtual:pwa-register` module that vite-plugin-pwa provides at build time
module.exports = { registerSW: () => () => Promise.resolve() };
