const path = require('path')
const fs = require('fs')

async function run() {
  const dir = __dirname
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.js'))
  let passed = 0, failed = 0
  for (const f of files) {
    process.stdout.write(`Running ${f}... `)
    try {
      await require(path.join(dir, f))()
      console.log('OK')
      passed++
    } catch (e) {
      console.log('FAIL')
      console.error(e)
      failed++
    }
  }
  console.log(`\nTests finished: ${passed} passed, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

run().catch(err => { console.error(err); process.exit(1) })
