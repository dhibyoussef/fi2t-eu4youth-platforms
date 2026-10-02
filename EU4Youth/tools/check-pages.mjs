/**
 * Quick API check for every CMS page data source.
 * Run: node tools/check-pages.mjs
 */
const BASE = 'http://localhost:8040'
const login = await fetch(`${BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: process.env.EU4Y_ADMIN_EMAIL, password: process.env.EU4Y_ADMIN_PASSWORD }),
}).then((r) => r.json())
const H = { Authorization: `Bearer ${login.token}` }

const checks = [
  ['overview', '/api/admin/overview'],
  ['pages', '/api/admin/content/pages'],
  ['projects', '/api/admin/projects'],
  ['news', '/api/admin/news'],
  ['publications', '/api/admin/publications'],
  ['events', '/api/admin/events'],
  ['initiatives', '/api/admin/initiatives'],
  ['stories', '/api/admin/stories'],
  ['videos', '/api/admin/videos'],
  ['opportunities', '/api/admin/opportunities'],
  ['glossary', '/api/admin/glossary'],
  ['inbox', '/api/admin/inbox'],
  ['translations', '/api/admin/translations'],
  ['users', '/api/admin/users'],
  ['roles', '/api/admin/roles'],
  ['activity', '/api/admin/activity'],
  ['validation', '/api/admin/validation-queue'],
  ['site-nav', '/api/admin/site-nav'],
  ['settings', '/api/admin/settings'],
]

for (const [name, path] of checks) {
  try {
    const r = await fetch(`${BASE}${path}`, { headers: H })
    const data = await r.json()
    const count = Array.isArray(data) ? data.length : data?.items?.length ?? data?.pages ?? (data?.ok !== undefined ? 'ok' : Object.keys(data).length)
    console.log(`✅ ${name.padEnd(14)} ${r.status} → ${count}`)
  } catch (e) {
    console.log(`❌ ${name.padEnd(14)} ${e.message}`)
  }
}
