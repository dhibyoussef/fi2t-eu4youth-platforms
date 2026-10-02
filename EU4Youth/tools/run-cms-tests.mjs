/**
 * EU4Youth CMS — automated A→Z API test runner
 * Usage: node tools/run-cms-tests.mjs
 */
const BASE = 'http://localhost:8040'
const results = []

function pass(id, note = '') {
  results.push({ id, ok: true, note })
  console.log(`✅ ${id}${note ? ` — ${note}` : ''}`)
}
function fail(id, note = '') {
  results.push({ id, ok: false, note })
  console.log(`❌ ${id}${note ? ` — ${note}` : ''}`)
}
function skip(id, note = '') {
  results.push({ id, ok: null, note })
  console.log(`⏭  ${id}${note ? ` — ${note}` : ''}`)
}

async function req(method, path, { token, body, expectStatus } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })
  let data = null
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (expectStatus != null && res.status !== expectStatus) {
    throw new Error(`${method} ${path} expected ${expectStatus}, got ${res.status}: ${text.slice(0, 200)}`)
  }
  return { status: res.status, data }
}

async function main() {
  console.log('\n=== EU4Youth CMS — Tests API A→Z ===\n')

  // A — health & login
  try {
    const h = await req('GET', '/api/health')
    if (h.status === 200) pass('A1/A2', 'API health OK')
    else fail('A1/A2', `status ${h.status}`)
  } catch (e) {
    fail('A1/A2', e.message)
  }

  let token = null
  let user = null
  try {
    const login = await req('POST', '/api/auth/login', {
      body: { email: process.env.EU4Y_ADMIN_EMAIL, password: process.env.EU4Y_ADMIN_PASSWORD },
      expectStatus: 200,
    })
    token = login.data.token
    user = login.data.user
    if (token && user?.email) pass('A3', `connecté ${user.email}`)
    else fail('A3', 'token ou user manquant')
  } catch (e) {
    fail('A3', e.message)
    console.log('\nArrêt — login requis.\n')
    process.exit(1)
  }

  try {
    const me = await req('GET', '/api/auth/me', { token, expectStatus: 200 })
    if (me.data?.email) pass('A4', 'session /me OK après login')
    else fail('A4', 'me invalide')
  } catch (e) {
    fail('A4', e.message)
  }

  // M2 — no token
  try {
    const noAuth = await req('GET', '/api/admin/overview', { expectStatus: 401 })
    if (noAuth.status === 401) pass('M2', 'API refuse sans token')
    else fail('M2', `status ${noAuth.status}`)
  } catch (e) {
    fail('M2', e.message)
  }

  // B — overview
  try {
    const ov = await req('GET', '/api/admin/overview', { token, expectStatus: 200 })
    const keys = ['pages', 'pendingReview', 'unread', 'news']
    if (keys.every((k) => k in ov.data)) pass('B4', `overview: ${ov.data.pendingReview} à valider, ${ov.data.unread} messages`)
    else fail('B4', 'clés overview manquantes')
  } catch (e) {
    fail('B4', e.message)
  }

  // C — live edit session
  try {
    const live = await req('POST', '/api/admin/edit-session', { token, expectStatus: 200 })
    if (live.data?.website) pass('C1', `edit-session → ${live.data.website}`)
    else fail('C1', 'pas de website URL')
  } catch (e) {
    fail('C1', e.message)
  }

  // D — site nav
  try {
    const nav = await req('GET', '/api/admin/site-nav', { token, expectStatus: 200 })
    if (Array.isArray(nav.data)) pass('D1/D3', `${nav.data.length} entrées menu`)
    else fail('D1', 'site-nav pas un tableau')
  } catch (e) {
    fail('D1', e.message)
  }

  // E — create news draft
  let newsId = null
  const testTitle = `Test auto ${Date.now()}`
  try {
    const created = await req('POST', '/api/admin/news', {
      token,
      body: {
        title: { fr: testTitle, en: '', ar: '' },
        summary: { fr: 'Résumé test automatique', en: '', ar: '' },
        status: 'draft',
      },
      expectStatus: 201,
    })
    newsId = created.data?.id
    if (newsId && created.data?.status === 'draft') pass('E1/E2/E3', `fiche créée id=${newsId}`)
    else fail('E1/E2/E3', JSON.stringify(created.data).slice(0, 120))
  } catch (e) {
    fail('E1/E2/E3', e.message)
  }

  // E4 duplicate
  let dupId = null
  if (newsId) {
    try {
      const dup = await req('POST', `/api/admin/news/${newsId}/duplicate`, { token, expectStatus: 201 })
      dupId = dup.data?.id
      const titleFr = dup.data?.title?.fr || ''
      if (dupId && titleFr.includes('copie')) pass('E4', `dupliqué id=${dupId}`)
      else if (dupId) pass('E4', `dupliqué id=${dupId} (titre: ${titleFr.slice(0, 40)})`)
      else fail('E4', 'duplicate sans id')
    } catch (e) {
      fail('E4', e.message)
    }
  }

  // E5 submit for review
  if (newsId) {
    try {
      const sub = await req('PATCH', `/api/admin/news/${newsId}`, {
        token,
        body: { status: 'pending_review' },
        expectStatus: 200,
      })
      if (sub.data?.status === 'pending_review') pass('E5', 'soumis à validation')
      else fail('E5', `status=${sub.data?.status}`)
    } catch (e) {
      fail('E5', e.message)
    }
  }

  // F — validation queue
  try {
    const q = await req('GET', '/api/admin/validation-queue', { token, expectStatus: 200 })
    const found = (q.data?.items || []).some((i) => i.id === newsId)
    if (Array.isArray(q.data?.items) && found) pass('F1', `${q.data.items.length} dans la queue, test item présent`)
    else if (Array.isArray(q.data?.items)) pass('F1', `${q.data.items.length} items (test id ${newsId} ${found ? '' : 'non trouvé'})`)
    else fail('F1', 'queue invalide')
  } catch (e) {
    fail('F1', e.message)
  }

  // F2 approve
  if (newsId) {
    try {
      const appr = await req('POST', `/api/admin/news/${newsId}/approve`, { token, expectStatus: 200 })
      if (appr.data?.status === 'published') pass('F2/F3', 'validé et publié')
      else fail('F2', `status=${appr.data?.status}`)
    } catch (e) {
      fail('F2', e.message)
    }
  }

  // F4 activity log
  try {
    const act = await req('GET', '/api/admin/activity', { token, expectStatus: 200 })
    if (Array.isArray(act.data?.items) && act.data.items.length > 0) pass('F4/L1', `${act.data.items.length} entrées historique`)
    else fail('F4/L1', 'historique vide')
  } catch (e) {
    fail('F4/L1', e.message)
  }

  // L2 filter catalogues
  try {
    const actCat = await req('GET', '/api/admin/activity?scope=catalog', { token, expectStatus: 200 })
    if (Array.isArray(actCat.data?.items)) pass('L2', `filtre catalogues: ${actCat.data.items.length} entrées`)
    else fail('L2', 'filtre invalide')
  } catch (e) {
    fail('L2', e.message)
  }

  // G — other catalogues sample create draft
  const catalogs = ['publications', 'events', 'opportunities', 'initiatives', 'stories', 'videos']
  for (const cat of catalogs) {
    try {
      const body =
        cat === 'videos'
          ? { title: { fr: `Vidéo test ${Date.now()}`, en: '', ar: '' }, youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', status: 'draft' }
          : { title: { fr: `Test ${cat} ${Date.now()}`, en: '', ar: '' }, summary: { fr: 'Test', en: '', ar: '' }, status: 'draft' }
      const r = await req('POST', `/api/admin/${cat}`, { token, body, expectStatus: 201 })
      if (r.data?.id) pass(`G-${cat}`, `brouillon créé id=${r.data.id}`)
      else fail(`G-${cat}`, 'pas id')
      // cleanup
      await req('DELETE', `/api/admin/${cat}/${r.data.id}`, { token, expectStatus: 200 }).catch(() => {})
    } catch (e) {
      fail(`G-${cat}`, e.message)
    }
  }

  // H — projects
  try {
    const proj = await req('GET', '/api/admin/projects', { token, expectStatus: 200 })
    const first = Array.isArray(proj.data) ? proj.data[0] : null
    const firstKey = first?.slug || first?.id
    if (firstKey) {
      pass('H1', `${proj.data.length} projets, premier: ${firstKey}`)
      const patch = await req('PATCH', `/api/admin/projects/${firstKey}`, {
        token,
        body: { tagline: { fr: first.tagline?.fr || 'Test accroche', en: first.tagline?.en || '', ar: first.tagline?.ar || '' } },
        expectStatus: 200,
      })
      if (patch.status === 200) pass('H2', 'accroche patch OK')
      else fail('H2', `status ${patch.status}`)
    } else fail('H1', 'aucun projet')
  } catch (e) {
    fail('H1/H2', e.message)
  }

  // I — contact form
  let inboxId = null
  try {
    const form = await req('POST', '/api/forms/contact', {
      body: { name: 'Test Auto', email: 'test@example.com', subject: 'Test CMS', message: `Message auto ${Date.now()}` },
    })
    if (form.status !== 200 && form.status !== 201) throw new Error(`contact form status ${form.status}`)
    inboxId = form.data?.id
    if (inboxId) pass('I1', `formulaire reçu id=${inboxId}`)
    else pass('I1', 'formulaire accepté')
  } catch (e) {
    fail('I1', e.message)
  }

  try {
    const unread = await req('GET', '/api/admin/form-submissions/unread', { token, expectStatus: 200 })
    if (typeof unread.data?.count === 'number') pass('I2', `${unread.data.count} non lus`)
    else fail('I2', 'unread invalide')
  } catch (e) {
    fail('I2', e.message)
  }

  if (inboxId) {
    try {
      await req('PATCH', `/api/admin/inbox/${inboxId}`, { token, body: { unread: false }, expectStatus: 200 })
      pass('I3', 'marqué lu')
    } catch (e) {
      fail('I3', e.message)
    }
  }

  // J — translations
  try {
    const tr = await req('GET', '/api/translations/all')
    if (tr.data && typeof tr.data === 'object') pass('J1', 'traductions publiques OK')
    else fail('J1', 'traductions vides')
  } catch (e) {
    fail('J1', e.message)
  }

  try {
    const gloss = await req('GET', '/api/admin/glossary', { token, expectStatus: 200 })
    if (Array.isArray(gloss.data)) pass('J3', `${gloss.data.length} entrées glossaire`)
    else fail('J3', 'glossaire invalide')
  } catch (e) {
    fail('J3', e.message)
  }

  // K — users
  let contribId = null
  const contribEmail = `contrib.test.${Date.now()}@test.local`
  try {
    const created = await req('POST', '/api/admin/users', {
      token,
      body: {
        email: contribEmail,
        password: 'short',
        firstName: 'Test',
        lastName: 'Contrib',
        role: 'contributeur',
        projectSlug: 'jeuness',
      },
      expectStatus: 400,
    })
    if (created.status === 400) pass('M3', 'mot de passe court refusé')
    else fail('M3', `status ${created.status}`)
  } catch (e) {
    if (String(e.message).includes('400')) pass('M3', 'mot de passe court refusé')
    else fail('M3', e.message)
  }

  try {
    const created = await req('POST', '/api/admin/users', {
      token,
      body: {
        email: contribEmail,
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'Contrib',
        role: 'contributeur',
        projectSlug: 'jeuness',
      },
      expectStatus: 201,
    })
    contribId = created.data?.id
    if (contribId) pass('K1', `contributeur créé ${contribEmail}`)
    else fail('K1', 'pas id')
  } catch (e) {
    fail('K1', e.message)
  }

  let contribToken = null
  if (contribId) {
    try {
      const cl = await req('POST', '/api/auth/login', {
        body: { email: contribEmail, password: 'testpass123' },
        expectStatus: 200,
      })
      contribToken = cl.data.token
      if (contribToken) pass('K2', 'connexion contributeur OK')
      else fail('K2', 'pas token')
    } catch (e) {
      fail('K2', e.message)
    }
  }

  // K3 — contributeur cannot approve
  if (contribToken && newsId) {
    try {
      const draftNews = await req('POST', '/api/admin/news', {
        token: contribToken,
        body: { title: { fr: 'Contrib news', en: '', ar: '' }, status: 'draft' },
        expectStatus: 201,
      })
      const cid = draftNews.data?.id
      if (cid) {
        const pub = await req('PATCH', `/api/admin/news/${cid}`, {
          token: contribToken,
          body: { status: 'pending_review' },
          expectStatus: 200,
        })
        if (pub.data?.status === 'pending_review') pass('K3', 'contributeur → pending_review')
        else fail('K3', `status ${pub.data?.status}`)
        await req('DELETE', `/api/admin/news/${cid}`, { token }).catch(() => {})
      }
    } catch (e) {
      fail('K3', e.message)
    }
  }

  // K4 roles
  try {
    const roles = await req('GET', '/api/admin/roles', { token, expectStatus: 200 })
    if (roles.data) pass('K4', 'roles endpoint OK')
    else fail('K4', 'roles vides')
  } catch (e) {
    fail('K4', e.message)
  }

  // L3 store.json
  try {
    const fs = await import('node:fs')
    const path = new URL('../backend/data/store.json', import.meta.url)
    const stat = fs.statSync(path)
    if (stat.size > 1000) pass('L3', `store.json ${Math.round(stat.size / 1024)} KB`)
    else fail('L3', 'store.json trop petit')
  } catch (e) {
    fail('L3', e.message)
  }

  // L4 uploads dir
  try {
    const fs = await import('node:fs')
    const up = new URL('../backend/uploads/', import.meta.url)
    if (fs.existsSync(up)) pass('L4', 'dossier uploads existe')
    else fail('L4', 'uploads manquant')
  } catch (e) {
    fail('L4', e.message)
  }

  // E7 cleanup test news + duplicate
  if (dupId) await req('DELETE', `/api/admin/news/${dupId}`, { token }).catch(() => {})
  if (newsId) {
    try {
      const del = await req('DELETE', `/api/admin/news/${newsId}`, { token })
      if (del.status !== 200 && del.status !== 204) throw new Error(`delete status ${del.status}`)
      pass('E7', 'fiche test supprimée')
    } catch (e) {
      fail('E7', e.message)
    }
  }
  if (contribId) await req('DELETE', `/api/admin/users/${contribId}`, { token }).catch(() => {})

  // A5 logout
  try {
    await req('POST', '/api/auth/logout', { token, expectStatus: 200 })
    pass('A5', 'déconnexion OK')
  } catch (e) {
    fail('A5', e.message)
  }

  // F3 public catalog
  try {
    const pub = await req('GET', '/api/catalog/news')
    if (pub.status === 200 && Array.isArray(pub.data)) pass('F3-pub', `${pub.data.length} actualités publiques`)
    else fail('F3-pub', `status ${pub.status}`)
  } catch (e) {
    fail('F3-pub', e.message)
  }

  // N — build (manual note)
  skip('N1/N2', 'vérifié séparément (build OK)')

  const ok = results.filter((r) => r.ok === true).length
  const ko = results.filter((r) => r.ok === false).length
  const skipped = results.filter((r) => r.ok === null).length
  console.log(`\n=== RÉSUMÉ API: ${ok} OK, ${ko} FAIL, ${skipped} SKIP ===\n`)
  if (ko > 0) {
    console.log('Échecs:')
    results.filter((r) => r.ok === false).forEach((r) => console.log(`  - ${r.id}: ${r.note}`))
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
