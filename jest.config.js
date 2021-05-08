const {defaults} = require(`jest-config`)

const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, `ts`, `tsx`],
  projects: [`<rootDir>/src`],
  verbose: true,
}

module.exports = config