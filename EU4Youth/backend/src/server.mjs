import cors from 'cors'
import express from 'express'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  findBySlug,
  nextId,
  publicList,
} from './catalogues.mjs'
import {
  deleteSection,
  flattenPage,
  insertPattern,
  matrixFor,
  navTree,
  publicPatterns,
  reorderSections,
  slugify,
  upsertBlock,
} from './content.mjs'
import { autoFillTranslations, fillCatalogLocales, syncBulk, syncCatalogLocales } from './localeSync.mjs'
import { assertProjectScope, can, requireAbility, requireAnyPerm, requirePerm, scopedByProject } from './permissions.mjs'
import { loadStore, publicUser, resetStore, saveStore } from './store.mjs'
import { translateMany, translateText } from './translate.mjs'
import { hashPassword, loginRateLimited, verifyPassword } from './auth.mjs'
import {
  appendAudit,
  canApproveCatalog,
  catalogCollection,
  countPendingReview,
  ensureAuditLog,
  gateCatalogStatus,
  listAuditLog,
  listPendingReview,
} from './audit.mjs'

const PORT = Number(process.env.PORT || 8040)
const app = express()
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const uploadsDir = join(root, 'uploads')

const CORS_ORIGINS = [
  'http://localhost:3040',
  'http://127.0.0.1:3040',
  'http://localhost:3030',
  'http://127.0.0.1:3030',
]
app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
  }),
)
app.use(express.json({ limit: '12mb' }))

app.get('/api/health', (req, res) => {
  const store = loadStore()
  res.json({
    ok: true,
    service: 'eu4youth-cms',
    authBuild: '2026-09-18-xheader-cookie',
    sawTokenHeader: Boolean(req.headers['x-eu4y-token']),
    port: PORT,
    publicSiteUrl: store.settings?.publicSiteUrl || 'http://localhost:3030',
    catalogs: {
      news: store.news?.length || 0,
      publications: store.publications?.length || 0,
      events: store.events?.length || 0,
      opportunities: store.opportunities?.length || 0,
      stories: store.stories?.length || 0,
      videos: store.videos?.length || 0,
      initiatives: store.initiatives?.length || 0,
      projects: store.projects?.length || 0,
    },
  })
})
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true })
app.use('/api/uploads', express.static(uploadsDir))

function readCookie(req, name) {
  const raw = String(req.headers.cookie || '')
  const parts = raw.split(';')
  for (const part of parts) {
    const idx = part.indexOf('=')
    if (idx < 0) continue
    const key = part.slice(0, idx).trim()
    if (key === name) return decodeURIComponent(part.slice(idx + 1).trim())
  }
  return ''
}

function pruneSessions(store) {
  const now = Date.now()
  store.sessions = (store.sessions || []).filter((item) => item.expiresAt > now)
}

function tokenFor(store, user, ability = 'cms-admin', hours = 8) {
  pruneSessions(store)
  const token = `eu4y.${ability}.${user.id}.${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 8)}`
  store.sessions.push({
    token,
    userId: user.id,
    ability,
    expiresAt: Date.now() + hours * 3600 * 1000,
  })
  saveStore(store)
  return token
}

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : ''
  // Prefer X-EU4Y-Token / cookie so nginx Basic Auth can keep using Authorization.
  const token = String(
    req.headers['x-eu4y-token'] || readCookie(req, 'eu4y_token') || bearer || '',
  ).trim()
  const store = loadStore()
  pruneSessions(store)
  const session = (store.sessions || []).find((item) => item.token === token)
  const user = session ? store.users.find((item) => item.id === session.userId) : null
  if (!user) {
    res.status(401).json({ message: 'Session expiree. Reconnectez-vous.' })
    return
  }
  req.user = user
  req.store = store
  req.ability = session.ability || 'cms-admin'
  req.token = token
  next()
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'administrateur') {
    res.status(403).json({ message: 'Reserve a l administrateur.' })
    return
  }
  next()
}

app.post('/api/auth/login', (req, res) => {
  const ip = req.ip || req.socket?.remoteAddress || 'local'
  if (loginRateLimited(ip)) {
    res.status(429).json({ message: 'Trop de tentatives. Réessayez dans une minute.' })
    return
  }
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  const store = loadStore()
  const user = store.users.find((item) => item.email.toLowerCase() === email)
  if (!user || !verifyPassword(password, user.password)) {
    res.status(401).json({ message: 'Identifiants incorrects.' })
    return
  }
  if (user.password && !String(user.password).startsWith('scrypt$')) {
    user.password = hashPassword(password)
    saveStore(store)
  }
  const token = tokenFor(store, user)
  res.setHeader(
    'Set-Cookie',
    `eu4y_token=${encodeURIComponent(token)}; Path=/eu4youth; HttpOnly; SameSite=Lax; Secure; Max-Age=${8 * 3600}`,
  )
  res.json({
    token,
    user: { ...publicUser(user), permissions: store.rolePermissions?.[user.role] || {} },
  })
})

app.post('/api/auth/logout', auth, (req, res) => {
  req.store.sessions = (req.store.sessions || []).filter((item) => item.token !== req.token)
  saveStore(req.store)
  res.setHeader(
    'Set-Cookie',
    'eu4y_token=; Path=/eu4youth; HttpOnly; SameSite=Lax; Secure; Max-Age=0',
  )
  res.json({ ok: true })
})

app.get('/api/auth/me', auth, (req, res) => {
  const user = publicUser(req.user)
  const permissions = req.store.rolePermissions?.[req.user.role] || {}
  res.json({
    ...user,
    user,
    ability: req.ability,
    full_name: `${req.user.firstName} ${req.user.lastName}`,
    roles:
      req.user.role === 'administrateur' || req.user.role === 'editeur' ? ['admin'] : [req.user.role],
    permissions,
    canLiveEdit: Boolean(permissions.content || req.user.role === 'administrateur'),
  })
})

app.post('/api/admin/edit-session', auth, requireAbility('cms-admin', 'cms-edit'), (req, res) => {
  if (!can(req.user, req.store, 'content')) {
    res.status(403).json({ message: 'Pas de droit d edition du site.' })
    return
  }
  res.json({
    token: tokenFor(req.store, req.user, 'cms-edit', 1),
    website: req.store.settings.publicSiteUrl,
    publicSiteUrl: req.store.settings.publicSiteUrl,
  })
})

app.get('/api/admin/overview', auth, (req, res) => {
  const { store } = req
  res.json({
    pages: store.content.pages.filter((page) => page.slug !== 'global').length,
    published: store.content.pages.filter((page) => page.status === 'published' && page.slug !== 'global').length,
    drafts: store.content.pages.filter((page) => page.status === 'draft').length,
    sections: store.content.sections.length,
    projects: store.projects.length,
    initiatives: store.initiatives.length,
    stories: store.stories.length,
    videos: store.videos.length,
    opportunities: store.opportunities.length,
    news: (store.news || []).length,
    publications: (store.publications || []).length,
    events: (store.events || []).length,
    unread: store.inbox.filter((item) => item.unread && item.status !== 'archived').length,
    pageDrafts: store.content.pages.filter((page) => page.status === 'draft' && page.slug !== 'global').length,
    catalogDrafts:
      (store.news || []).filter((item) => item.status === 'draft').length +
      (store.publications || []).filter((item) => item.status === 'draft').length +
      (store.events || []).filter((item) => item.status === 'draft').length +
      (store.opportunities || []).filter((item) => item.status === 'draft').length +
      (store.stories || []).filter((item) => item.status === 'draft').length,
    pendingReview: countPendingReview(store),
    locales: store.settings.locales,
    publicSiteUrl: store.settings.publicSiteUrl,
    user: publicUser(req.user),
  })
})

app.get('/api/admin/content/matrix', auth, requirePerm('content'), (req, res) => {
  const page = String(req.query.page || 'home')
  res.json(matrixFor(req.store, page))
})

app.get('/api/admin/content/patterns', auth, (_req, res) => {
  res.json(publicPatterns())
})

app.get('/api/admin/content/pages', auth, (req, res) => {
  res.json(req.store.content.pages)
})

app.post('/api/admin/content/pages', auth, (req, res) => {
  const title = String(req.body?.title || '').trim()
  if (!title) {
    res.status(422).json({ message: 'Titre requis.' })
    return
  }
  const slug = slugify(req.body?.slug || title)
  if (req.store.content.pages.some((item) => item.slug === slug)) {
    res.status(409).json({ message: 'Ce permalien existe deja.' })
    return
  }
  const page = {
    slug,
    path: req.body?.path || `/${slug}`,
    title,
    group: req.body?.group || 'Public',
    status: req.body?.status === 'draft' ? 'draft' : 'published',
    template: req.body?.template || 'default',
    is_system: false,
    sort_order: req.store.content.pages.length + 1,
    meta_title: req.body?.meta_title || `${title} | EU4Youth Tunisie`,
    meta_description: req.body?.meta_description || '',
  }
  req.store.content.pages.push(page)
  saveStore(req.store)
  res.status(201).json(page)
})

app.put('/api/admin/content/pages/:slug', auth, (req, res) => {
  const page = req.store.content.pages.find((item) => item.slug === req.params.slug)
  if (!page) {
    res.status(404).json({ message: 'Page introuvable.' })
    return
  }
  Object.assign(page, {
    title: req.body?.title ?? page.title,
    status: req.body?.status ?? page.status,
    template: req.body?.template ?? page.template,
    meta_title: req.body?.meta_title ?? page.meta_title,
    meta_description: req.body?.meta_description ?? page.meta_description,
    path: req.body?.path ?? page.path,
  })
  saveStore(req.store)
  res.json(page)
})

app.delete('/api/admin/content/pages/:slug', auth, (req, res) => {
  const page = req.store.content.pages.find((item) => item.slug === req.params.slug)
  if (!page) {
    res.status(404).json({ message: 'Page introuvable.' })
    return
  }
  if (page.is_system) {
    res.status(422).json({ message: 'Page systeme, suppression impossible.' })
    return
  }
  req.store.content.pages = req.store.content.pages.filter((item) => item.slug !== page.slug)
  req.store.content.sections = req.store.content.sections.filter((item) => item.page !== page.slug)
  req.store.content.blocks = req.store.content.blocks.filter((item) => item.page !== page.slug)
  saveStore(req.store)
  res.status(204).end()
})

app.post('/api/admin/content/bulk', auth, requirePerm('content'), async (req, res) => {
  const list = Array.isArray(req.body?.blocks) ? req.body.blocks : []
  await syncBulk(req.store, list, {
    source: req.body?.source_locale || 'fr',
    translate: Boolean(req.body?.translate),
  })
  const page = list[0]?.page || 'home'
  appendAudit(req.store, req.user, {
    action: 'content.save',
    target: `page:${page}`,
    targetId: page,
    label: `Contenu · ${list.length} modification${list.length > 1 ? 's' : ''}`,
    meta: { count: list.length },
  })
  saveStore(req.store)
  res.json({ message: 'Enregistre', count: list.length })
})

app.post('/api/admin/content/sync-locales', auth, requirePerm('content'), async (req, res) => {
  const page = String(req.body?.page || 'home')
  const source = req.body?.source_locale || 'fr'
  const blocks = req.store.content.blocks
    .filter((item) => item.page === page && item.locale === source)
    .map((item) => ({
      page: item.page,
      section: item.section,
      key: item.key,
      locale: item.locale,
      type: item.type,
      value: item.value,
      label: item.label,
      sort_order: item.sort_order,
    }))
  await syncBulk(req.store, blocks, { source, translate: Boolean(req.body?.translate) })
  saveStore(req.store)
  res.json(matrixFor(req.store, page))
})

app.post('/api/admin/translate', auth, requireAnyPerm('translations', 'content', 'catalogues'), async (req, res) => {
  const from = req.body?.from || 'fr'
  const to = req.body?.to || 'en'
  if (Array.isArray(req.body?.texts)) {
    const values = {}
    req.body.texts.forEach((text, index) => {
      values[index] = text
    })
    const translated = await translateMany(values, from, to)
    res.json({ texts: Object.values(translated) })
    return
  }
  res.json({ text: await translateText(String(req.body?.text || ''), from, to) })
})

app.post('/api/admin/translations/auto-fill', auth, requirePerm('translations'), async (req, res) => {
  const filled = await autoFillTranslations(req.store, req.body?.source || 'fr', {
    overwrite: Boolean(req.body?.overwrite),
  })
  saveStore(req.store)
  res.json({ filled, translations: req.store.translations })
})

app.post('/api/admin/catalog/sync-locales', auth, requirePerm('catalogues'), async (req, res) => {
  const count = await syncCatalogLocales(req.store, {
    source: req.body?.source || 'fr',
    translate: Boolean(req.body?.translate),
    collections: Array.isArray(req.body?.collections) ? req.body.collections : undefined,
  })
  saveStore(req.store)
  res.json({ count })
})

app.post('/api/admin/content/insert-pattern', auth, (req, res) => {
  const slug = insertPattern(req.store, req.body || {})
  if (!slug) {
    res.status(422).json({ message: 'Composant inconnu.' })
    return
  }
  saveStore(req.store)
  res.json({ section: slug, ...matrixFor(req.store, req.body.page) })
})

app.delete('/api/admin/content/sections', auth, (req, res) => {
  deleteSection(req.store, req.body?.page, req.body?.section)
  saveStore(req.store)
  res.json({ ok: true })
})

app.post('/api/admin/content/reorder-sections', auth, (req, res) => {
  reorderSections(req.store, req.body?.page, req.body?.order || [])
  saveStore(req.store)
  res.json(matrixFor(req.store, req.body.page))
})

app.post('/api/admin/content/upload-image', auth, (req, res) => {
  const dataUrl = String(req.body?.dataUrl || '')
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  if (!match) {
    res.status(422).json({ message: 'Image invalide.' })
    return
  }
  const ext = match[1].split('/')[1].replace('jpeg', 'jpg')
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  writeFileSync(join(uploadsDir, name), Buffer.from(match[2], 'base64'))
  res.json({ url: `/api/uploads/${name}`, path: name })
})

app.delete('/api/admin/content/block', auth, (req, res) => {
  const { page, section, key, locale } = req.body || {}
  req.store.content.blocks = req.store.content.blocks.filter((item) => {
    if (item.page !== page || item.section !== section || item.key !== key) return true
    if (locale && item.locale !== locale) return true
    return false
  })
  saveStore(req.store)
  res.json({ ok: true })
})

app.get('/api/content/:page', (req, res) => {
  const store = loadStore()
  const locale = String(req.query.locale || 'fr')
  const page = store.content.pages.find((item) => item.slug === req.params.page)
  if (!page) {
    res.status(404).json({ message: 'Page introuvable.' })
    return
  }
  res.json({
    page: page.slug,
    locale,
    path: page.path,
    meta: page,
    blocks: flattenPage(store, page.slug, locale),
  })
})

app.get('/api/pages/:slug', (req, res) => {
  const store = loadStore()
  const locale = String(req.query.locale || 'fr')
  const page = store.content.pages.find((item) => item.slug === req.params.slug)
  if (!page) {
    res.status(404).json({ message: 'Page introuvable.' })
    return
  }
  const matrix = matrixFor(store, page.slug)
  res.json({
    page,
    sections: matrix.sections.map((section) => ({
      slug: section.name,
      title: section.title,
      pattern: section.pattern,
      blocks: Object.fromEntries(
        section.blocks.map((block) => [
          block.key,
          flattenPage(store, page.slug, locale)[`${section.name}.${block.key}`] || '',
        ]),
      ),
    })),
  })
})

app.get('/api/translations/all', (_req, res) => {
  const store = loadStore()
  const all = { fr: {}, en: {}, ar: {} }
  for (const row of store.translations) {
    all.fr[row.key] = row.fr
    all.en[row.key] = row.en
    all.ar[row.key] = row.ar
  }
  res.json(all)
})

app.post('/api/admin/translations/bulk', auth, (req, res) => {
  const changes = Array.isArray(req.body?.changes) ? req.body.changes : []
  for (const change of changes) {
    let row = req.store.translations.find((item) => item.key === change.key)
    if (!row) {
      row = { key: change.key, fr: '', en: '', ar: '' }
      req.store.translations.push(row)
    }
    if (change.locale && change.value != null) row[change.locale] = change.value
    if (change.fr != null) row.fr = change.fr
    if (change.en != null) row.en = change.en
    if (change.ar != null) row.ar = change.ar
  }
  saveStore(req.store)
  res.json(req.store.translations)
})

app.get('/api/site-nav', (req, res) => {
  const store = loadStore()
  res.json(navTree(store.siteNav || [], String(req.query.locale || 'fr')))
})

app.get('/api/admin/site-nav', auth, (req, res) => {
  res.json(req.store.siteNav || [])
})

app.post('/api/admin/site-nav', auth, (req, res) => {
  req.store.nextNavId = (req.store.nextNavId || 20) + 1
  const item = {
    id: req.store.nextNavId,
    parent_id: req.body?.parent_id ?? null,
    label_fr: req.body?.label_fr || 'Nouveau lien',
    label_en: req.body?.label_en || 'New link',
    label_ar: req.body?.label_ar || 'رابط جديد',
    url: req.body?.url || '/',
    sort_order: req.body?.sort_order ?? (req.store.siteNav?.length || 0) + 1,
    is_active: req.body?.is_active !== false,
    open_in_new_tab: Boolean(req.body?.open_in_new_tab),
  }
  req.store.siteNav = req.store.siteNav || []
  req.store.siteNav.push(item)
  appendAudit(req.store, req.user, {
    action: 'nav.create',
    target: 'site-nav',
    targetId: item.id,
    label: item.label_fr,
  })
  saveStore(req.store)
  res.status(201).json(item)
})

app.put('/api/admin/site-nav/:id', auth, (req, res) => {
  const item = (req.store.siteNav || []).find((row) => String(row.id) === req.params.id)
  if (!item) {
    res.status(404).json({ message: 'Lien introuvable.' })
    return
  }
  Object.assign(item, req.body || {})
  appendAudit(req.store, req.user, {
    action: 'nav.update',
    target: 'site-nav',
    targetId: item.id,
    label: item.label_fr,
  })
  saveStore(req.store)
  res.json(item)
})

app.delete('/api/admin/site-nav/:id', auth, (req, res) => {
  const id = Number(req.params.id)
  const removed = (req.store.siteNav || []).find((item) => item.id === id)
  req.store.siteNav = (req.store.siteNav || []).filter((item) => item.id !== id && item.parent_id !== id)
  if (removed) {
    appendAudit(req.store, req.user, {
      action: 'nav.delete',
      target: 'site-nav',
      targetId: removed.id,
      label: removed.label_fr,
    })
  }
  saveStore(req.store)
  res.status(204).end()
})

app.post('/api/admin/site-nav/reorder', auth, (req, res) => {
  for (const row of req.body?.items || []) {
    const item = (req.store.siteNav || []).find((nav) => nav.id === row.id)
    if (item) {
      item.sort_order = row.sort_order
      if (row.parent_id !== undefined) item.parent_id = row.parent_id
    }
  }
  appendAudit(req.store, req.user, {
    action: 'nav.reorder',
    target: 'site-nav',
    targetId: '',
    label: `${(req.body?.items || []).length} lien(s) réorganisé(s)`,
  })
  saveStore(req.store)
  res.json(req.store.siteNav)
})

app.get('/api/admin/activity', auth, requireAnyPerm('content', 'catalogues'), (req, res) => {
  res.json(
    listAuditLog(req.store, {
      limit: Math.min(Number(req.query.limit) || 80, 200),
      offset: Number(req.query.offset) || 0,
      action: String(req.query.action || ''),
    }),
  )
})

app.get('/api/admin/validation-queue', auth, requireAnyPerm('catalogues'), (req, res) => {
  const items = listPendingReview(req.store, req.user)
  res.json({ total: items.length, items })
})

function receiveInbox(kind, body) {
  if (body?.website) return { ok: true, trapped: true }
  const store = loadStore()
  if (!Array.isArray(store.inbox)) store.inbox = []
  const id = Math.max(0, ...store.inbox.map((item) => Number(item.id) || 0)) + 1
  store.inbox.unshift({
    id,
    kind,
    from: body?.email || '',
    profile: body?.profile || body?.name || (kind === 'newsletter' ? 'Newsletter' : ''),
    project: body?.project || 'Programme EU4Youth',
    subject: body?.subject || body?.requestType || (kind === 'newsletter' ? 'Inscription newsletter' : 'Contact'),
    unread: true,
    receivedAt: new Date().toISOString(),
    payload: body || {},
  })
  saveStore(store)
  return { ok: true }
}

app.post('/api/forms/contact', (req, res) => {
  res.json(receiveInbox('contact', req.body || {}))
})

app.post('/api/forms/newsletter', (req, res) => {
  res.json(receiveInbox('newsletter', req.body || {}))
})

app.post('/api/contact', (req, res) => {
  res.json(receiveInbox('contact', req.body || {}))
})

app.post('/api/newsletter', (req, res) => {
  res.json(receiveInbox('newsletter', req.body || {}))
})

const PUBLIC_CATALOGS = ['news', 'publications', 'events', 'opportunities', 'stories', 'videos', 'initiatives', 'projects', 'glossary']

for (const kind of PUBLIC_CATALOGS) {
  app.get(`/api/catalog/${kind}`, (req, res) => {
    const store = loadStore()
    res.json(publicList(store, kind, { locale: req.query.locale, project: req.query.project }))
  })
  app.get(`/api/catalog/${kind}/:slug`, (req, res) => {
    const store = loadStore()
    const item = findBySlug(store, kind, req.params.slug, req.query.locale || 'fr')
    if (!item || (item.status && item.status !== 'published')) {
      res.status(404).json({ message: 'Introuvable.' })
      return
    }
    res.json(item)
  })
}

app.put('/api/admin/glossary', auth, requirePerm('catalogues'), (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(422).json({ message: 'Tableau de categories requis.' })
    return
  }
  req.store.glossary = req.body
  saveStore(req.store)
  res.json(req.store.glossary)
})

app.patch('/api/admin/settings', auth, requirePerm('settings'), (req, res) => {
  req.store.settings = { ...req.store.settings, ...req.body }
  saveStore(req.store)
  res.json(req.store.settings)
})

app.get('/api/admin/form-submissions/unread', auth, requirePerm('inbox'), (req, res) => {
  const unread = req.store.inbox.filter((item) => item.unread)
  res.json({ count: unread.length, latest: unread.slice(0, 8) })
})

app.post('/api/admin/form-submissions/mark-all-read', auth, requirePerm('inbox'), (req, res) => {
  for (const item of req.store.inbox) item.unread = false
  saveStore(req.store)
  res.json({ ok: true })
})

app.get('/api/admin/inbox/:id', auth, requirePerm('inbox'), (req, res) => {
  const item = req.store.inbox.find((row) => String(row.id) === req.params.id)
  if (!item) {
    res.status(404).json({ message: 'Message introuvable.' })
    return
  }
  item.unread = false
  saveStore(req.store)
  res.json(item)
})

const collections = [
  'pages',
  'projects',
  'initiatives',
  'stories',
  'videos',
  'opportunities',
  'news',
  'publications',
  'events',
  'glossary',
  'inbox',
  'translations',
]

for (const name of collections) {
  app.get(`/api/admin/${name}`, auth, (req, res) => {
    const perm = name === 'inbox' ? 'inbox' : name === 'translations' ? 'translations' : name === 'pages' ? 'content' : 'catalogues'
    if (!can(req.user, req.store, perm)) {
      res.status(403).json({ message: 'Acces refuse pour ce role.' })
      return
    }
    const list = req.store[name] || []
    res.json(name === 'inbox' || name === 'translations' || name === 'pages' || name === 'glossary' ? list : scopedByProject(list, req.user))
  })
}

app.get('/api/admin/users', auth, requirePerm('users'), (req, res) => {
  res.json(req.store.users.map(publicUser))
})

app.post('/api/admin/users', auth, requireAdmin, (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const firstName = String(req.body?.firstName || '').trim()
  const lastName = String(req.body?.lastName || '').trim()
  const role = String(req.body?.role || 'contributeur')
  const allowed = ['administrateur', 'editeur', 'contributeur', 'communication']
  if (!email || !firstName || !lastName) {
    res.status(400).json({ message: 'Nom, prenom et e-mail sont requis.' })
    return
  }
  if (!allowed.includes(role)) {
    res.status(400).json({ message: 'Role inconnu.' })
    return
  }
  if (req.store.users.some((item) => item.email.toLowerCase() === email)) {
    res.status(409).json({ message: 'Cet e-mail existe deja.' })
    return
  }
  const password = String(req.body?.password || '')
  if (password.length < 8) {
    res.status(400).json({ message: 'Mot de passe : 8 caractères minimum.' })
    return
  }
  const id = Math.max(0, ...req.store.users.map((item) => Number(item.id) || 0)) + 1
  const user = {
    id,
    email,
    password: hashPassword(password),
    firstName,
    lastName,
    role,
    projectSlug: role === 'contributeur' ? req.body?.projectSlug || 'jeuness' : null,
  }
  req.store.users.push(user)
  appendAudit(req.store, req.user, {
    action: 'user.create',
    target: 'users',
    targetId: user.id,
    label: user.email,
  })
  saveStore(req.store)
  res.status(201).json(publicUser(user))
})

app.delete('/api/admin/users/:id', auth, requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  const target = req.store.users.find((item) => item.id === id)
  if (!target) {
    res.status(404).json({ message: 'Utilisateur introuvable.' })
    return
  }
  if (target.id === req.user.id) {
    res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte.' })
    return
  }
  const admins = req.store.users.filter((item) => item.role === 'administrateur')
  if (target.role === 'administrateur' && admins.length <= 1) {
    res.status(400).json({ message: 'Il faut au moins un administrateur.' })
    return
  }
  req.store.users = req.store.users.filter((item) => item.id !== id)
  saveStore(req.store)
  res.status(204).end()
})

app.get('/api/admin/roles', auth, requirePerm('roles'), (req, res) => {
  res.json(req.store.rolePermissions)
})

app.patch('/api/admin/roles', auth, requireAdmin, (req, res) => {
  const next = req.body || {}
  for (const role of Object.keys(req.store.rolePermissions || {})) {
    if (next[role] && typeof next[role] === 'object') {
      req.store.rolePermissions[role] = { ...req.store.rolePermissions[role], ...next[role] }
    }
  }
  if (req.store.rolePermissions?.administrateur) {
    req.store.rolePermissions.administrateur.users = true
    req.store.rolePermissions.administrateur.roles = true
  }
  saveStore(req.store)
  res.json(req.store.rolePermissions)
})

app.get('/api/admin/settings', auth, (req, res) => {
  res.json(req.store.settings)
})

app.get('/api/admin/live', auth, (req, res) => {
  res.json(req.store.live)
})

app.patch('/api/admin/live', auth, (req, res) => {
  const next = { ...req.store, live: deepMerge(req.store.live, req.body || {}) }
  saveStore(next)
  res.json(next.live)
})

app.get('/api/public/live', (req, res) => {
  const store = loadStore()
  const locale = String(req.query.locale || 'fr')
  res.json({
    live: store.live,
    projects: store.projects,
    settings: store.settings,
    blocks: flattenPage(store, 'home', locale),
  })
})

app.patch('/api/admin/:collection/:id', auth, async (req, res) => {
  const collection = req.params.collection
  if (!['initiatives', 'stories', 'videos', 'opportunities', 'inbox', 'projects', 'pages', 'users', 'translations', 'news', 'publications', 'events', 'glossary'].includes(collection)) {
    res.status(404).json({ message: 'Collection inconnue.' })
    return
  }
  const perm = collection === 'users' ? 'users' : collection === 'inbox' ? 'inbox' : collection === 'translations' ? 'translations' : collection === 'pages' ? 'content' : 'catalogues'
  if (!can(req.user, req.store, perm)) {
    res.status(403).json({ message: 'Acces refuse pour ce role.' })
    return
  }
  if (!assertProjectScope(req.user, req.body, res)) return
  const key =
    collection === 'projects' || collection === 'pages'
      ? 'slug'
      : collection === 'translations'
        ? 'key'
        : 'id'
  const list = req.store[collection]
  const index = list.findIndex(
    (item) =>
      String(item[key]) === String(req.params.id) ||
      String(item.id) === String(req.params.id) ||
      String(item.slug || '') === String(req.params.id) ||
      String(item.key || '') === String(req.params.id),
  )
  if (index < 0) {
    res.status(404).json({ message: 'Element introuvable.' })
    return
  }
  if (req.user.role === 'contributeur' && list[index].projectSlug && list[index].projectSlug !== req.user.projectSlug) {
    res.status(403).json({ message: 'Contributeur: uniquement votre projet.' })
    return
  }
  const translateFlag = Boolean(req.body?.translate)
  const { translate: _dropTranslate, ...body } = req.body || {}
  const updated = { ...list[index], ...body }
  if (collection === 'users') {
    const password = req.body?.password
    const { password: _drop, ...safeBody } = req.body || {}
    Object.assign(list[index], safeBody)
    if (password) {
      if (String(password).length < 8) {
        res.status(400).json({ message: 'Mot de passe : 8 caractères minimum.' })
        return
      }
      list[index].password = hashPassword(password)
    }
  } else {
    if (catalogCollection(collection)) {
      updated.status = gateCatalogStatus(req.user, updated.status ?? list[index].status)
    }
    if (['news', 'publications', 'events', 'opportunities', 'stories', 'videos', 'projects', 'glossary', 'initiatives'].includes(collection)) {
      await fillCatalogLocales(updated, 'fr', { translate: translateFlag })
    }
    list[index] = updated
  }
  if (collection === 'pages') {
    const cms = req.store.content.pages.find((item) => item.slug === list[index].slug)
    if (cms) Object.assign(cms, { status: list[index].status, title: list[index].title, path: list[index].path })
    appendAudit(req.store, req.user, {
      action: 'page.update',
      target: 'pages',
      targetId: list[index].slug,
      label: String(list[index].title?.fr || list[index].slug),
    })
  } else if (collection === 'users') {
    appendAudit(req.store, req.user, {
      action: 'user.update',
      target: 'users',
      targetId: list[index].id,
      label: list[index].email,
    })
  } else if (catalogCollection(collection)) {
    appendAudit(req.store, req.user, {
      action: 'catalog.update',
      target: collection,
      targetId: list[index].id ?? list[index].slug,
      label: String(list[index].title?.fr || list[index].name || list[index].slug || collection),
      meta: { status: list[index].status },
    })
  }
  saveStore(req.store)
  res.json(collection === 'users' ? publicUser(list[index]) : list[index])
})

app.post('/api/admin/:collection/:id/approve', auth, async (req, res) => {
  const collection = req.params.collection
  if (!catalogCollection(collection)) {
    res.status(404).json({ message: 'Collection inconnue.' })
    return
  }
  if (!can(req.user, req.store, 'catalogues')) {
    res.status(403).json({ message: 'Acces refuse pour ce role.' })
    return
  }
  if (!canApproveCatalog(req.user)) {
    res.status(403).json({ message: 'Validation réservée aux éditeurs.' })
    return
  }
  const list = req.store[collection]
  const index = list.findIndex(
    (item) =>
      String(item.id) === String(req.params.id) ||
      String(item.slug || '') === String(req.params.id),
  )
  if (index < 0) {
    res.status(404).json({ message: 'Element introuvable.' })
    return
  }
  if (req.user.role === 'contributeur' && list[index].projectSlug && list[index].projectSlug !== req.user.projectSlug) {
    res.status(403).json({ message: 'Contributeur: uniquement votre projet.' })
    return
  }
  list[index].status = 'published'
  appendAudit(req.store, req.user, {
    action: 'catalog.approve',
    target: collection,
    targetId: list[index].id ?? list[index].slug,
    label: String(list[index].title?.fr || list[index].name || list[index].slug || collection),
  })
  saveStore(req.store)
  res.json(list[index])
})

app.post('/api/admin/:collection/:id/duplicate', auth, async (req, res) => {
  const collection = req.params.collection
  if (!catalogCollection(collection)) {
    res.status(404).json({ message: 'Collection inconnue.' })
    return
  }
  if (!can(req.user, req.store, 'catalogues')) {
    res.status(403).json({ message: 'Acces refuse pour ce role.' })
    return
  }
  const list = req.store[collection]
  const index = list.findIndex(
    (item) =>
      String(item.id) === String(req.params.id) ||
      String(item.slug || '') === String(req.params.id),
  )
  if (index < 0) {
    res.status(404).json({ message: 'Element introuvable.' })
    return
  }
  if (req.user.role === 'contributeur' && list[index].projectSlug && list[index].projectSlug !== req.user.projectSlug) {
    res.status(403).json({ message: 'Contributeur: uniquement votre projet.' })
    return
  }
  const stamp = Date.now().toString(36)
  const copy = JSON.parse(JSON.stringify(list[index]))
  copy.status = 'draft'
  if (copy.id != null) copy.id = nextId(list)
  if (copy.slug) {
    const base = String(copy.slug).replace(/-copie-[a-z0-9]+$/i, '')
    copy.slug = `${base}-copie-${stamp}`
  }
  if (copy.title && typeof copy.title === 'object') {
    copy.title = { ...copy.title, fr: `${String(copy.title.fr || '').trim() || 'Copie'} (copie)` }
  }
  if (copy.name) copy.name = `${String(copy.name).trim() || 'Copie'} (copie)`
  if (copy.firstName) copy.firstName = `${String(copy.firstName).trim() || 'Copie'} (copie)`
  list.unshift(copy)
  appendAudit(req.store, req.user, {
    action: 'catalog.duplicate',
    target: collection,
    targetId: copy.id ?? copy.slug,
    label: String(copy.title?.fr || copy.name || copy.firstName || copy.slug || collection),
  })
  saveStore(req.store)
  res.status(201).json(copy)
})

app.post('/api/admin/:collection', auth, async (req, res) => {
  const collection = req.params.collection
  if (!['initiatives', 'stories', 'videos', 'opportunities', 'news', 'publications', 'events'].includes(collection)) {
    res.status(404).json({ message: 'Collection non creable ici.' })
    return
  }
  if (!can(req.user, req.store, 'catalogues')) {
    res.status(403).json({ message: 'Acces refuse pour ce role.' })
    return
  }
  if (!assertProjectScope(req.user, req.body, res)) return
  const translateFlag = Boolean(req.body?.translate)
  const { translate: _dropTranslate, ...body } = req.body || {}
  const list = req.store[collection]
  const id = nextId(list)
  const item = { id, status: gateCatalogStatus(req.user, body.status || 'draft'), ...body }
  if (['news', 'publications', 'events', 'opportunities', 'stories', 'videos'].includes(collection)) {
    await fillCatalogLocales(item, 'fr', { translate: translateFlag })
  }
  list.unshift(item)
  appendAudit(req.store, req.user, {
    action: 'catalog.create',
    target: collection,
    targetId: item.id ?? item.slug,
    label: String(item.title?.fr || item.name || item.slug || collection),
    meta: { status: item.status },
  })
  saveStore(req.store)
  res.status(201).json(item)
})

app.delete('/api/admin/:collection/:id', auth, (req, res) => {
  const collection = req.params.collection
  if (!['initiatives', 'stories', 'videos', 'opportunities', 'news', 'publications', 'events', 'inbox'].includes(collection)) {
    res.status(404).json({ message: 'Collection non supprimable ici.' })
    return
  }
  const perm = collection === 'inbox' ? 'inbox' : 'catalogues'
  if (!can(req.user, req.store, perm)) {
    res.status(403).json({ message: 'Acces refuse pour ce role.' })
    return
  }
  const id = req.params.id
  const removed = req.store[collection].find(
    (item) => String(item.id) === String(id) || String(item.slug || '') === String(id),
  )
  req.store[collection] = req.store[collection].filter(
    (item) => String(item.id) !== String(id) && String(item.slug || '') !== String(id),
  )
  if (removed && catalogCollection(collection)) {
    appendAudit(req.store, req.user, {
      action: 'catalog.delete',
      target: collection,
      targetId: removed.id ?? removed.slug,
      label: String(removed.title?.fr || removed.name || removed.slug || collection),
    })
  }
  saveStore(req.store)
  res.status(204).end()
})

app.post('/api/admin/reset-demo', auth, (req, res) => {
  if (req.user.role !== 'administrateur') {
    res.status(403).json({ message: 'Reserve a l administrateur.' })
    return
  }
  res.json(resetStore())
})

function deepMerge(base, patch) {
  if (patch == null || typeof patch !== 'object' || Array.isArray(patch)) return patch
  const next = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    next[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? deepMerge(base?.[key] ?? {}, value)
        : value
  }
  return next
}

app.listen(PORT, () => {
  loadStore()
  saveStore(loadStore())
  console.log(`EU4Youth CMS API http://localhost:${PORT}`)
})
