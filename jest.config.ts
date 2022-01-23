import { defaults } from 'jest-config'

const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, `ts`, `tsx`],
  projects: [`<rootDir>/src`],
  testPathIgnorePatterns: [
    `<rootDir>/node_modules/`,
  ],
  transform: {
    "^.+\\.scss$": `jest-scss-transform`,
    "^.+\\.svg$": `<rootDir>/tests/svgTransform.js`,
    "^.+\\.tsx?$": `<rootDir>/node_modules/babel-jest`,
  },
  verbose: true,
}

export default config