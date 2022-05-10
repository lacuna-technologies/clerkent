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
  projects: [`<rootDir>/src`],
  testPathIgnorePatterns: [
    `<rootDir>/node_modules/`,
  ],
  transform: {
    "^.+\\.scss$": `<rootDir>/tests/styleMock.js`,
    "^.+\\.svg$": `<rootDir>/tests/svgTransform.js`,
    "^.+\\.tsx?$": `<rootDir>/node_modules/babel-jest`,
  },
  transformIgnorePatterns: [
    `node_modules/(?!(leven)/)`,
  ],
  verbose: true,
}

export default config