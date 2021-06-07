import { defaults } from 'jest-config'

const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, `ts`, `tsx`],
  projects: [`<rootDir>/src`],
  transform: {
    "^.+\\.scss$": `jest-scss-transform`,
    "^.+\\.tsx?$": `<rootDir>/node_modules/babel-jest`,
  },
  verbose: true,
}

export default config