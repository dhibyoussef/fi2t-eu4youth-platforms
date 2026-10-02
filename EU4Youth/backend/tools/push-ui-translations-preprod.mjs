/**
 * Push complete UI TRANSLATIONS to preprod via /admin/translations/bulk
 */
import { TRANSLATIONS } from '../src/uiTranslations.mjs'

// Credentials come from the environment — never hardcode them.
const BASE = process.env.EU4Y_API_BASE || 'http://localhost:8040/api'
const BASIC_AUTH = process.env.EU4Y_BASIC_AUTH || '' // "user:password" for an nginx Basic Auth gate (optional)
const BASIC = BASIC_AUTH ? 'Basic ' + Buffer.from(BASIC_AUTH).toString('base64') : undefined
const ADMIN_EMAIL = process.env.EU4Y_ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.EU4Y_ADMIN_PASSWORD || ''
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set EU4Y_ADMIN_EMAIL and EU4Y_ADMIN_PASSWORD')
  process.exit(1)
}

async function main() {
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: {
      ...(BASIC ? { Authorization: BASIC } : {}),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const login = await loginRes.json()
  if (!login.token) {
    console.error('login failed', login)
    process.exit(1)
  }

  const bulkRes = await fetch(`${BASE}/admin/translations/bulk`, {
    method: 'POST',
    headers: {
      Authorization: BASIC,
      'Content-Type': 'application/json',
      'X-EU4Y-Token': login.token,
    },
    body: JSON.stringify({ changes: TRANSLATIONS }),
  })
  const rows = await bulkRes.json()
  if (!Array.isArray(rows)) {
    console.error('bulk failed', rows)
    process.exit(1)
  }
  console.log(JSON.stringify({ status: bulkRes.status, total: rows.length, keys: rows.map((r) => r.key).sort() }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
