import { defaults } from 'jest-config'

const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, `ts`, `tsx`],
  projects: [`<rootDir>/src`],
  verbose: true,
}

export default config