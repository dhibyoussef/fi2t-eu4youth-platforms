import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

for (const f of readdirSync('src/pages').filter((x) => x.endsWith('.css'))) {
  const path = `src/pages/${f}`
  let t = readFileSync(path, 'utf8')
  const before = t
  t = t.replace(/\n(border-inline-start(?:-width|-color|-style)?:)/g, '\n  $1')
  t = t.replace(/\n(padding-inline-(?:start|end):)/g, '\n  $1')
  if (t !== before) {
    writeFileSync(path, t)
    console.log('indented', f)
  }
}
