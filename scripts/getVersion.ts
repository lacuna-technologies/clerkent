import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync(`package.json`, `utf-8`))

console.log(packageJson.version)
