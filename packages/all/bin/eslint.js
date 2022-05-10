import { exec } from 'child_process'
const argv = process.argv.slice(2)
exec(`eslint $(git diff --name-only HEAD) ${argv.join(' ')}`)
