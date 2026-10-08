module.exports = {
  globalSetup: '<rootDir>/test/setupTimezone.js',
  moduleNameMapper: {
    '^.+\\.(css|styl)$': '<rootDir>/client/styles/CSSStub.js',
    '^virtual:pwa-register$': '<rootDir>/test/pwaRegisterStub.js',
  },
  setupFilesAfterEnv: [],
  collectCoverageFrom: ['client/js/**/*.{js,jsx}', '!client/js/**/*.test.{js,jsx}'],
  // Baseline: ratchet up as coverage improves, never down. Enforced with `--coverage` (CI).
  coverageThreshold: {
    global: { statements: 75, branches: 60, functions: 70, lines: 75 },
  },
};
