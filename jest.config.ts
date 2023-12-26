import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
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
  testEnvironment: `jsdom`,
  testPathIgnorePatterns: [
    `<rootDir>/node_modules/`,
  ],
  transform: {
    "^.+\\.(tsx|jsx|js|ts|mjs)?$": `<rootDir>/node_modules/babel-jest`,
    "^.+\\.svg$": `<rootDir>/tests/svgTransform.js`,
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/.pnpm/(?!(leven|@testing-library\\+preact|preact)@)`,
  ],
}

export default config