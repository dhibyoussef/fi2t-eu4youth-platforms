import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const extractDir = join(process.cwd(), 'tools', '_trilingual_extract')
const outDir = extractDir

function write(name, data) {
  writeFileSync(join(outDir, name), JSON.stringify(data, null, 2), 'utf8')
  console.log('wrote', name)
}

// --- Glossaire HTML ---
const html = readFileSync(join(extractDir, 'glossaire_eu4youth_trilingue.html'), 'utf8')
const dataMatch = html.match(/const\s+DATA\s*=\s*(\[[\s\S]*?\]);/)
if (!dataMatch) {
  // try window.DATA or var DATA
  const m2 = html.match(/DATA\s*=\s*(\[[\s\S]*?\]);\s*\n/)
  if (!m2) {
    console.log('No DATA array found; sniffing...')
    console.log(html.slice(0, 800))
    process.exit(1)
  }
}
const raw = (dataMatch || html.match(/DATA\s*=\s*(\[[\s\S]*?\]);/))[1]
let DATA
try {
  DATA = Function(`"use strict"; return (${raw})`)()
} catch (e) {
  console.error('parse DATA failed', e.message)
  process.exit(1)
}

console.log('glossary categories', DATA.length)
let entries = 0
for (const cat of DATA) entries += (cat.entries || cat.items || []).length
console.log('glossary entries', entries)
write('glossary-parsed.json', DATA)

// --- Remarques ---
const remFile = readdirSync(extractDir).find((n) => n.startsWith('remarques'))
if (remFile) {
  const rem = readFileSync(join(extractDir, remFile), 'utf8')
  write('remarques.json', { text: rem, bullets: rem.split(/\n+/).map((s) => s.trim()).filter(Boolean) })
}

console.log('done')
