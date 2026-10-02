/**
 * Apply full EN/AR translations (same information as FR, not shortened).
 * Run: node tools/patch-full-translations.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const i18nDir = join(root, 'tools', 'full-i18n')

for (const script of [
  'build-narratives.mjs',
  'build-structured-a.mjs',
  'build-structured-b.mjs',
  'build-structured-c.mjs',
  'build-structured-d.mjs',
  'build-structured-e.mjs',
]) {
  const r = spawnSync(process.execPath, [join(i18nDir, script)], { encoding: 'utf8' })
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout)
    process.exit(r.status || 1)
  }
  process.stdout.write(r.stdout)
}

const storePath = join(root, 'data', 'store.json')
const store = JSON.parse(readFileSync(storePath, 'utf8'))
const blocks = store.content.blocks

let nextId = Math.max(0, ...blocks.map((b) => Number(b.id) || 0)) + 1

function ensureBlock(page, section, key, locale, value, frRow) {
  let row = blocks.find(
    (b) => b.page === page && b.section === section && b.key === key && b.locale === locale,
  )
  const serialized = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  if (!row) {
    row = {
      id: nextId++,
      page,
      section,
      key,
      locale,
      type: frRow?.type || 'text',
      value: serialized,
      label: frRow?.label || key,
      sort_order: frRow?.sort_order ?? 0,
    }
    blocks.push(row)
    return 'created'
  }
  row.value = serialized
  return 'updated'
}

const packs = [
  JSON.parse(readFileSync(join(i18nDir, 'narratives.json'), 'utf8')),
  JSON.parse(readFileSync(join(i18nDir, 'structured-a.json'), 'utf8')),
  JSON.parse(readFileSync(join(i18nDir, 'structured-b.json'), 'utf8')),
  JSON.parse(readFileSync(join(i18nDir, 'structured-c.json'), 'utf8')),
  JSON.parse(readFileSync(join(i18nDir, 'structured-d.json'), 'utf8')),
  JSON.parse(readFileSync(join(i18nDir, 'structured-e.json'), 'utf8')),
]

let updated = 0
let created = 0
for (const pack of packs) {
  for (const [id, locales] of Object.entries(pack)) {
    const [page, section, key] = id.split('|')
    const frRow = blocks.find((b) => b.page === page && b.section === section && b.key === key && b.locale === 'fr')
    for (const loc of ['en', 'ar']) {
      if (locales[loc] == null) continue
      const result = ensureBlock(page, section, key, loc, locales[loc], frRow)
      if (result === 'created') created++
      else updated++
    }
  }
}

if (store.content.nextBlockId != null) {
  store.content.nextBlockId = Math.max(store.content.nextBlockId, nextId)
}

writeFileSync(storePath, JSON.stringify(store, null, 2))
console.log(`Patched store: ${updated} updated, ${created} created → ${storePath}`)
