import { defaults } from 'jest-config'

const config = {
  moduleDirectories: [
    `node_modules`,
    `src`,
  ],
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    `ts`,
    `tsx`,
  ],
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  moduleNameMapper: {
    "^react$": `preact/compat`,
    "^react-dom/test-utils$": `preact/test-utils`,
    "^react-dom$": `preact/compat`,
    "^react/jsx-runtime$": `preact/jsx-runtime`,
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
  projects: [`<rootDir>/src`],
  testEnvironment: `jsdom`,
  testPathIgnorePatterns: [
    `<rootDir>/node_modules/`,
  ],
  transform: {
    "^.+\\.(tsx|jsx|js|ts|mjs)?$": `<rootDir>/node_modules/babel-jest`,
    "^.+\\.scss$": `<rootDir>/tests/styleMock.js`,
    "^.+\\.svg$": `<rootDir>/tests/svgTransform.js`,
  },
  transformIgnorePatterns: [
    `node_modules/(?!(leven|@testing-library/preact|preact)/)`,
  ],
  verbose: true,
}

export default config