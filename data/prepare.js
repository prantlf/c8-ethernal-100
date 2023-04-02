const { mkdir, readFile, writeFile } = require('fs/promises')
const { join } = require('path')

;(async () => {
  console.log('Reading data/out.json')
  const template = await readFile(join(__dirname, 'out.json'), 'utf8')
  const output = template.replaceAll('$$$CWD$$$', process.cwd())
  const targetDir = join(__dirname, '../coverage/tmp')
  console.log('Writing coverage/tmp/out.json')
  await mkdir(targetDir, { recursive: true })
  await writeFile(join(targetDir, 'out.json'), output)
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
