import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const KEYLEN = 64
const LOGIN_WINDOW_MS = 60_000
const LOGIN_MAX = 8
const attempts = new Map()

export const BOOTSTRAP_EMAIL = (process.env.EU4Y_ADMIN_EMAIL || 'admin@eu4youth.org').trim().toLowerCase()
// No hardcoded default: if EU4Y_ADMIN_PASSWORD is unset, a random one is generated
// and printed once at bootstrap (only used when the store has no admin yet).
export const BOOTSTRAP_PASSWORD = process.env.EU4Y_ADMIN_PASSWORD || (() => {
  const generated = randomBytes(12).toString('base64url')
  console.warn(`[eu4youth-cms] EU4Y_ADMIN_PASSWORD not set — bootstrap admin password: ${generated}`)
  return generated
})()

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(String(plain), salt, KEYLEN).toString('hex')
  return `scrypt$${salt}$${hash}`
}

export function verifyPassword(plain, stored) {
  if (!plain || !stored) return false
  if (String(stored).startsWith('scrypt$')) {
    const [, salt, hash] = String(stored).split('$')
    if (!salt || !hash) return false
    const next = scryptSync(String(plain), salt, KEYLEN)
    const prev = Buffer.from(hash, 'hex')
    if (next.length !== prev.length) return false
    return timingSafeEqual(next, prev)
  }
  const a = Buffer.from(String(plain))
  const b = Buffer.from(String(stored))
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function loginRateLimited(ip) {
  const key = ip || 'local'
  const now = Date.now()
  const row = attempts.get(key) || { count: 0, start: now }
  if (now - row.start > LOGIN_WINDOW_MS) {
    attempts.set(key, { count: 1, start: now })
    return false
  }
  row.count += 1
  attempts.set(key, row)
  return row.count > LOGIN_MAX
}

export function superAdminUser() {
  return {
    id: 1,
    email: BOOTSTRAP_EMAIL,
    password: hashPassword(BOOTSTRAP_PASSWORD),
    firstName: 'Super',
    lastName: 'Admin',
    role: 'administrateur',
    projectSlug: null,
  }
}

const DEMO_EMAILS = new Set([
  'editeur@eu4youth.org',
  'jeuness@eu4youth.org',
  'com@eu4youth.org',
])

export function ensureUsers(store) {
  if (!Array.isArray(store.users)) store.users = []
  store.users = store.users.filter((user) => !DEMO_EMAILS.has(String(user.email || '').toLowerCase()))
  store.users = store.users.map((user) => {
    if (user.firstName === 'Amira' && user.lastName === 'Ben Youssef') {
      return { ...user, firstName: 'Super', lastName: 'Admin' }
    }
    return user
  })
  let admin = store.users.find((user) => user.role === 'administrateur')
  if (!admin) {
    admin = superAdminUser()
    store.users.unshift(admin)
  }
  if (admin.password && !String(admin.password).startsWith('scrypt$')) {
    admin.password = hashPassword(admin.password)
  }
  for (const user of store.users) {
    if (user.password && !String(user.password).startsWith('scrypt$')) {
      user.password = hashPassword(user.password)
    }
  }
  return store
}
