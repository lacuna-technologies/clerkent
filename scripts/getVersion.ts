import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync(`package.json`).toString())

console.log(packageJson.version)
