/**
 * Merge complete UI TRANSLATIONS into local store.json and print a bulk payload
 * for the preprod API.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TRANSLATIONS } from '../src/uiTranslations.mjs'

const root = dirname(fileURLToPath(import.meta.url))
const storePath = join(root, '..', 'data', 'store.json')
const store = JSON.parse(readFileSync(storePath, 'utf8'))

if (!Array.isArray(store.translations)) store.translations = []

const byKey = new Map(store.translations.map((row) => [row.key, row]))
let added = 0
let updated = 0

for (const row of TRANSLATIONS) {
  const existing = byKey.get(row.key)
  if (!existing) {
    store.translations.push({ ...row })
    byKey.set(row.key, row)
    added++
  } else {
    // Fill empty locales from seed; keep editor overrides when already set
    let touched = false
    for (const loc of ['fr', 'en', 'ar']) {
      if (!String(existing[loc] || '').trim() && row[loc]) {
        existing[loc] = row[loc]
        touched = true
      }
    }
    if (touched) updated++
  }
}

writeFileSync(storePath, JSON.stringify(store, null, 2))
console.log(
  JSON.stringify(
    {
      total: store.translations.length,
      added,
      updated,
      keys: store.translations.map((r) => r.key).sort(),
    },
    null,
    2,
  ),
)

// Write bulk payload for remote sync
writeFileSync(
  join(root, '_translations-bulk.json'),
  JSON.stringify({ changes: TRANSLATIONS }, null, 2),
)
