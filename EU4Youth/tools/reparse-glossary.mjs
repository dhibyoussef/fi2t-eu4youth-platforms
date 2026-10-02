import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '_trilingual_extract')
const html = readFileSync(join(dir, 'glossaire_eu4youth_trilingue.html'), 'utf8')
const m = html.match(/const DATA = (\[[\s\S]*?\]);\s*\n/)
if (!m) throw new Error('DATA not found')
const DATA = Function(`return (${m[1]})`)()
writeFileSync(join(dir, 'glossary-parsed.json'), JSON.stringify(DATA, null, 2))
console.log(DATA.length, 'cats', DATA.reduce((a, c) => a + (c.terms || []).length, 0), 'terms')
console.log(DATA[0].terms[0].term_ar)
