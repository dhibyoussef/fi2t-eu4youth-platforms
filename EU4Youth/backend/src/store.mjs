import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStore } from './seed.mjs'
import { ensureContent } from './contentSeed.mjs'
import { ensureCatalogues } from './catalogues.mjs'
import { ensureUsers } from './auth.mjs'
import { ensureAuditLog } from './audit.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'data')
const storePath = join(dataDir, 'store.json')

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function freshStore() {
  return ensureUsers(ensureCatalogues(ensureContent(createStore())))
}

function readStoreFile() {
  if (!existsSync(storePath)) return null
  const raw = readFileSync(storePath, 'utf8').trim()
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function loadStore() {
  const store = readStoreFile()
  if (!store) {
    const fresh = freshStore()
    saveStore(fresh)
    return clone(fresh)
  }
  const snapshot = (data) =>
    JSON.stringify({
      pages: data.content?.pages?.length || 0,
      sections: data.content?.sections?.length || 0,
      blocks: data.content?.blocks?.length || 0,
      seedRev: data.content?.seedRev || 0,
      translations: data.translations?.length || 0,
      roles: Boolean(data.rolePermissions),
      news: data.news?.length || 0,
      initiatives: data.initiatives?.length || 0,
      stories: data.stories?.length || 0,
      publishedStories: (data.stories || []).filter((item) => item.status === 'published').length,
      videos: data.videos?.length || 0,
      users: data.users?.length || 0,
      hashed: (data.users || []).filter((item) => String(item.password || '').startsWith('scrypt$')).length,
    })
  const before = snapshot(store)
  ensureContent(store)
  ensureCatalogues(store)
  ensureUsers(store)
  ensureAuditLog(store)
  const after = snapshot(store)
  if (before !== after) saveStore(store)
  return store
}

export function saveStore(store) {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
  const tmp = `${storePath}.tmp`
  writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8')
  try {
    renameSync(tmp, storePath)
  } catch {
    writeFileSync(storePath, readFileSync(tmp))
    unlinkSync(tmp)
  }
}

export function resetStore() {
  const fresh = freshStore()
  saveStore(fresh)
  return clone(fresh)
}

export function publicUser(user) {
  if (!user) return null
  const { password: _password, ...safe } = user
  return safe
}
