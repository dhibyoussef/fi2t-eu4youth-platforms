import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  ExternalLink,
  Copy,
  Loader2,
  PenLine,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { api } from '../../api/client'
import { PUBLIC_SITE } from '../../api/editSession'
import { useAuth } from '../../auth/AuthProvider'
import ContextualHelp from '../../components/ContextualHelp'
import { confirmPublish, confirmSubmitReview } from '../../lib/publishConfirm'
import {
  CatalogEditorHeader,
  CatalogEditorLayout,
  LocaleTabs,
} from '../../components/catalog/CatalogEditorShell'
import { localeMissingFlags, renderLocalizedField, renderMetaField } from '../../components/catalog/catalogFields'
import { catalogPublicPreviewUrl, prepareCatalogDraft } from '../../lib/catalogUtils'
import type { Locale } from '../../api/client'

function assetPreview(src: string) {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  return `${PUBLIC_SITE}${src.startsWith('/') ? src : `/${src}`}`
}

type Kind =
  | 'news'
  | 'publications'
  | 'events'
  | 'opportunities'
  | 'stories'
  | 'videos'
  | 'initiatives'

const LIST_FIELDS = ['themes', 'locations', 'audiences'] as const

/** Canonical project labels — match public site + store `projects[].acronym`. */
const PROJECT_OPTIONS = [
  "Jeun'ESS",
  'Fe3il.a',
  "Maghroum'IN",
  'SWAFY',
  'GO4Youth',
  'IRADA4YOUTH',
] as const

const PAGE_SIZE = 50

interface FieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'localized' | 'list' | 'image' | 'boolean' | 'youtube' | 'geo'
  options?: string[]
  wide?: boolean
  hint?: string
  hidden?: boolean
}

const KINDS: Record<Kind, { title: string; hint: string; fields: FieldDef[]; create: Record<string, unknown> }> = {
  news: {
    title: 'Actualités',
    hint: 'Fiches publiées sur /actualites. Modifiez titre, résumé et contenu en FR / EN / AR.',
    fields: [
      { key: 'title', label: 'Titre', type: 'localized' },
      { key: 'slug', label: 'Slug URL', type: 'text', hidden: true },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          'Communiqué',
          'Vie du programme',
          'Résultat / succès de terrain',
          'Événement',
          'Partenariat',
          'Article',
          'Reportage',
          'Interview',
        ],
      },
      { key: 'summary', label: 'Résumé', type: 'localized', wide: true },
      { key: 'body', label: 'Contenu complet', type: 'localized', wide: true },
      { key: 'publishedAt', label: 'Date de publication', type: 'date' },
      { key: 'dateLabel', label: 'Libellé date', type: 'text' },
      { key: 'project', label: 'Projet', type: 'select', options: [...PROJECT_OPTIONS] },
      { key: 'projectSlug', label: 'Slug projet', type: 'text', hidden: true },
      { key: 'themes', label: 'Thématiques', type: 'list', hint: 'Séparées par des virgules' },
      { key: 'locations', label: 'Localisations', type: 'list', hint: 'Séparées par des virgules' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published'] },
    ],
    create: {
      slug: '', title: { fr: 'Nouvelle actualité', en: '', ar: '' }, type: 'Communiqué', summary: { fr: '', en: '', ar: '' }, body: { fr: '', en: '', ar: '' },
      publishedAt: new Date().toISOString().slice(0, 10), dateLabel: '', project: "Jeun'ESS", projectSlug: 'jeuness',
      themes: [], locations: [], image: '/img/photo-entretien.webp', status: 'draft',
    },
  },
  publications: {
    title: 'Publications',
    hint: 'Rapports, newsletters et outils. Le lien href pointe vers /docs/.',
    fields: [
      { key: 'title', label: 'Titre', type: 'localized' },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          'Rapport',
          'Newsletter',
          'Appel à propositions',
          'Capitalisation',
          'Guide',
          'Outil',
          'Synthèse',
          'Étude',
          'Module de formation',
        ],
      },
      { key: 'summary', label: 'Résumé', type: 'localized', wide: true },
      { key: 'project', label: 'Projet', type: 'select', options: [...PROJECT_OPTIONS] },
      { key: 'projectSlug', label: 'Slug projet', type: 'text', hidden: true },
      { key: 'publishedAt', label: 'Date de publication', type: 'date' },
      { key: 'dateLabel', label: 'Libellé date', type: 'text' },
      { key: 'year', label: 'Année', type: 'number' },
      { key: 'themes', label: 'Thématiques', type: 'list', hint: 'Séparées par des virgules' },
      { key: 'href', label: 'Lien PDF/document', type: 'text' },
      { key: 'fileSize', label: 'Taille fichier', type: 'text', hint: 'ex. 2,4 Mo' },
      { key: 'cover', label: 'Couverture', type: 'image' },
      { key: 'language', label: 'Langue du document', type: 'select', options: ['Français', 'English', 'العربية', 'Bilingue'] },
      { key: 'format', label: 'Format', type: 'select', options: ['PDF', 'Web', 'Vidéo'] },
      { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published'] },
    ],
    create: {
      id: '', title: { fr: 'Nouvelle publication', en: '', ar: '' }, type: 'Rapport', summary: { fr: '', en: '', ar: '' },
      project: "Jeun'ESS", projectSlug: 'jeuness', publishedAt: new Date().toISOString().slice(0, 10),
      dateLabel: '', year: new Date().getFullYear(),
      themes: [], href: '', fileSize: '', cover: '', language: 'Français', format: 'PDF', status: 'draft',
    },
  },
  events: {
    title: 'Agenda',
    hint: 'Événements datés visibles sur /agenda. Titre et résumé trilingues.',
    fields: [
      { key: 'title', label: 'Titre', type: 'localized' },
      { key: 'summary', label: 'Résumé', type: 'localized', wide: true },
      { key: 'startsAt', label: 'Date de début', type: 'date' },
      { key: 'endsAt', label: 'Date de fin', type: 'date' },
      { key: 'dateLabel', label: 'Libellé date', type: 'text' },
      { key: 'project', label: 'Projet', type: 'select', options: [...PROJECT_OPTIONS] },
      { key: 'projectSlug', label: 'Slug projet', type: 'text', hidden: true },
      { key: 'location', label: 'Lieu', type: 'text' },
      {
        key: 'format',
        label: 'Format',
        type: 'select',
        options: [
          'Atelier',
          'Formation',
          'Comité de pilotage',
          'Cérémonie',
          "Journée d'information",
          'Rencontre',
          'Conférence',
          'Webinaire',
          'Forum',
          'Salon',
        ],
      },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published'] },
    ],
    create: {
      id: '', title: { fr: 'Nouvel événement', en: '', ar: '' }, summary: { fr: '', en: '', ar: '' },
      startsAt: new Date().toISOString().slice(0, 10), endsAt: '', dateLabel: '',
      project: "Jeun'ESS", projectSlug: 'jeuness', location: 'Tunis', format: 'Atelier',
      image: '/img/photo-entretien.webp', source: 'CMS', status: 'draft',
    },
  },
  opportunities: {
    title: 'Opportunités',
    hint: 'Appels, formations, bourses. Titre, résumé et thématiques trilingues.',
    fields: [
      { key: 'title', label: 'Titre', type: 'localized' },
      { key: 'slug', label: 'Slug URL', type: 'text', hidden: true },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          'Appel à projets',
          'Appel à candidatures',
          'Formation',
          'Bourse',
          'Stage / emploi',
          'Volontariat',
          'Concours',
        ],
      },
      { key: 'summary', label: 'Résumé', type: 'localized', wide: true },
      { key: 'body', label: 'Contenu complet', type: 'localized', wide: true },
      { key: 'opensAt', label: 'Date ouverture', type: 'date' },
      { key: 'deadline', label: 'Date limite', type: 'date' },
      { key: 'deadlineLabel', label: 'Libellé deadline', type: 'text' },
      { key: 'locations', label: 'Localisations', type: 'list', hint: 'Séparées par des virgules' },
      { key: 'locationLabel', label: 'Libellé lieu', type: 'text' },
      { key: 'project', label: 'Projet', type: 'select', options: [...PROJECT_OPTIONS] },
      { key: 'projectSlug', label: 'Slug projet', type: 'text', hidden: true },
      { key: 'themes', label: 'Thématiques', type: 'list', hint: 'Séparées par des virgules' },
      { key: 'audiences', label: 'Publics cibles', type: 'list', hint: 'Séparées par des virgules' },
      { key: 'contactEmail', label: 'Email de contact', type: 'text' },
      { key: 'applyHref', label: 'Lien candidature / dossier', type: 'text' },
      { key: 'applyLabel', label: 'Libellé bouton candidature', type: 'text' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published'] },
    ],
    create: {
      slug: '', title: { fr: 'Nouvelle opportunité', en: '', ar: '' }, type: 'Appel à projets', summary: { fr: '', en: '', ar: '' }, body: { fr: '', en: '', ar: '' },
      opensAt: new Date().toISOString().slice(0, 10), deadline: '', deadlineLabel: '',
      locations: ['Nationale'], locationLabel: 'Nationale', project: "Jeun'ESS", projectSlug: 'jeuness',
      themes: [], audiences: [], contactEmail: '', applyHref: '', applyLabel: 'Candidater',
      image: '/img/photo-entretien.webp', status: 'draft',
    },
  },
  stories: {
    title: 'Youth Stories',
    hint: 'Portraits de jeunes. Consentement obligatoire avant publication.',
    fields: [
      { key: 'firstName', label: 'Prénom', type: 'text' },
      { key: 'city', label: 'Ville', type: 'text' },
      { key: 'format', label: 'Format', type: 'select', options: ['Portrait', 'Témoignage', 'Interview', 'Reportage'] },
      { key: 'project', label: 'Projet', type: 'select', options: [...PROJECT_OPTIONS] },
      { key: 'projectSlug', label: 'Slug projet', type: 'text', hidden: true },
      { key: 'quote', label: 'Citation', type: 'localized', wide: true },
      { key: 'body', label: 'Contenu', type: 'localized', wide: true },
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'consent', label: 'Consentement', type: 'boolean' },
      { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published'] },
    ],
    create: {
      firstName: '', city: 'Tunis', format: 'Portrait', project: "Jeun'ESS", projectSlug: 'jeuness',
      quote: { fr: '', en: '', ar: '' }, body: { fr: '', en: '', ar: '' },
      image: '', consent: false, status: 'draft',
    },
  },
  videos: {
    title: 'Vidéothèque YouTube',
    hint: 'Collez le lien YouTube complet — aperçu automatique.',
    fields: [
      { key: 'title', label: 'Titre', type: 'localized' },
      { key: 'youtubeId', label: 'Lien ou ID YouTube', type: 'youtube' },
      { key: 'project', label: 'Projet', type: 'select', options: [...PROJECT_OPTIONS] },
      { key: 'projectSlug', label: 'Slug projet', type: 'text', hidden: true },
      { key: 'theme', label: 'Thème', type: 'select', options: ['Général', 'Entrepreneuriat', 'Employabilité', 'Engagement civique', 'Égalité des genres'] },
      { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published'] },
    ],
    create: {
      youtubeId: '', project: "Jeun'ESS", projectSlug: 'jeuness', theme: 'Général',
      title: { fr: '', en: '', ar: '' }, status: 'draft',
    },
  },
  initiatives: {
    title: 'Initiatives / carte',
    hint: 'Fiches territoire pour la carte interactive. Gouvernorat obligatoire.',
    fields: [
      { key: 'name', label: 'Nom', type: 'text' },
      { key: 'governorate', label: 'Gouvernorat', type: 'select', options: [
        'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
        'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia',
        'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine',
        'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
      ] },
      { key: 'locality', label: 'Localité', type: 'text' },
      { key: 'project', label: 'Projet', type: 'select', options: [...PROJECT_OPTIONS] },
      { key: 'projectSlug', label: 'Slug projet', type: 'text', hidden: true },
      { key: 'sector', label: 'Secteur', type: 'text' },
      { key: 'nature', label: 'Nature', type: 'text' },
      { key: 'geo', label: 'Position sur la carte', type: 'geo' },
      { key: 'lat', label: 'Latitude', type: 'number', hidden: true },
      { key: 'lng', label: 'Longitude', type: 'number', hidden: true },
      { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published'] },
    ],
    create: {
      name: '', governorate: 'Tunis', locality: '', project: "Jeun'ESS", projectSlug: 'jeuness',
      sector: '', nature: '', lat: 36.8, lng: 10.18, status: 'draft',
    },
  },
}

function displayValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') {
    const rec = value as Record<string, unknown>
    return String(rec.fr || rec.en || rec.ar || JSON.stringify(value))
  }
  return String(value)
}

function coerce(draft: Record<string, unknown>) {
  const next = { ...draft }
  for (const key of LIST_FIELDS) {
    if (typeof next[key] === 'string') {
      next[key] = String(next[key]).split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  if (next.lat != null) next.lat = Number(next.lat)
  if (next.lng != null) next.lng = Number(next.lng)
  if (next.year != null) next.year = Number(next.year)
  return next
}

function StatusPill({ status }: { status: string }) {
  if (status === 'published') {
    return <span className="pill pill--on">Publié</span>
  }
  if (status === 'pending_review') {
    return <span className="pill pill--pending">En validation</span>
  }
  return <span className="pill pill--off">Brouillon</span>
}

function canApproveCatalog(role?: string) {
  return role === 'administrateur' || role === 'editeur'
}

export default function CollectionStudio({ kind }: { kind: Kind }) {
  const qc = useQueryClient()
  const { user } = useAuth()
  const canApprove = canApproveCatalog(user?.role)
  const meta = KINDS[kind]
  const { data: rows = [], isLoading } = useQuery<Record<string, unknown>[]>({
    queryKey: ['catalog', kind],
    queryFn: () => api.get(`/admin/${kind}`).then((res) => res.data),
  })
  const [editing, setEditing] = useState<string | number | null>(null)
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [translateOnSave, setTranslateOnSave] = useState(true)
  const [editLocale, setEditLocale] = useState<Locale>('fr')

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr')
    if (!needle) return rows
    return rows.filter((row) => JSON.stringify(row).toLocaleLowerCase('fr').includes(needle))
  }, [query, rows])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const listColumns = useMemo(() => {
    const cols: FieldDef[] = []
    const title = meta.fields.find((f) => f.key === 'title' || f.key === 'name')
    if (title) cols.push(title)
    for (const key of ['type', 'publishedAt', 'startsAt', 'project', 'format', 'governorate', 'location']) {
      const field = meta.fields.find((f) => f.key === key && f.type !== 'localized')
      if (field && !cols.some((col) => col.key === field.key)) cols.push(field)
    }
    return cols.slice(0, 4)
  }, [meta.fields])

  const save = useMutation({
    mutationFn: (row: Record<string, unknown>) =>
      api.patch(`/admin/${kind}/${row.id ?? row.slug ?? row.key}`, {
        ...prepareCatalogDraft(coerce(row)),
        translate: translateOnSave,
      }),
    onSuccess: (_data, row) => {
      qc.invalidateQueries({ queryKey: ['catalog', kind] })
      qc.invalidateQueries({ queryKey: ['activity'] })
      qc.invalidateQueries({ queryKey: ['validation-queue'] })
      const status = String(row.status ?? '')
      if (status === 'pending_review') toast.success('Fiche soumise à validation')
      else if (status === 'published') toast.success(translateOnSave ? 'Fiche publiée — EN / AR synchronisés' : 'Fiche publiée')
      else toast.success(translateOnSave ? 'Fiche enregistrée — EN / AR synchronisés' : 'Fiche enregistrée')
      setEditing(null)
      setDraft(null)
    },
    onError: () => toast.error('Erreur d\'enregistrement'),
  })

  const create = useMutation({
    mutationFn: () => {
      const stamp = Date.now().toString(36)
      const payload = prepareCatalogDraft(coerce({ ...meta.create }))
      if ('slug' in payload) payload.slug = `${kind}-${stamp}`
      if ('id' in payload && !payload.id) payload.id = `${kind}-${stamp}`
      return api.post(`/admin/${kind}`, { ...payload, translate: translateOnSave })
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['catalog', kind] })
      toast.success('Fiche créée en brouillon')
      const item = res.data
      if (item) {
        const id = item.id ?? item.slug ?? item.key
        if (id) {
          setEditing(id)
          setDraft({ ...meta.create, ...item })
        }
      }
    },
  })

  const remove = useMutation({
    mutationFn: (id: string | number) => api.delete(`/admin/${kind}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalog', kind] })
      toast.success('Fiche supprimée')
      if (editing) { setEditing(null); setDraft(null) }
    },
  })

  const approve = useMutation({
    mutationFn: (id: string | number) => api.post(`/admin/${kind}/${id}/approve`),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['catalog', kind] })
      qc.invalidateQueries({ queryKey: ['activity'] })
      qc.invalidateQueries({ queryKey: ['validation-queue'] })
      toast.success('Fiche publiée')
      if (res.data) setDraft({ ...res.data })
    },
    onError: () => toast.error('Validation impossible'),
  })

  const duplicate = useMutation({
    mutationFn: (id: string | number) => api.post(`/admin/${kind}/${id}/duplicate`),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['catalog', kind] })
      qc.invalidateQueries({ queryKey: ['activity'] })
      toast.success('Fiche dupliquée en brouillon')
      const item = res.data
      if (item) {
        const id = item.id ?? item.slug ?? item.key
        if (id) {
          setEditing(id)
          setDraft({ ...item })
        }
      }
    },
    onError: () => toast.error('Duplication impossible'),
  })

  const saveWithStatus = (status: string) => {
    if (!draft) return
    const title = displayValue(draft.title ?? draft.name ?? draft.firstName).slice(0, 80) || 'Sans titre'
    const missing = localeMissingFlags(draft, meta.fields)
    if (status === 'published') {
      if (!confirmPublish(title, missing)) return
    }
    if (status === 'pending_review') {
      if (!confirmSubmitReview(title)) return
    }
    save.mutate({ ...coerce(draft), status })
  }

  const handleApprove = () => {
    if (!draft) return
    const title = displayValue(draft.title ?? draft.name ?? draft.firstName).slice(0, 80) || 'Sans titre'
    const missing = localeMissingFlags(draft, meta.fields)
    if (!confirmPublish(title, missing)) return
    approve.mutate(editing!)
  }

  const openEditor = (row: Record<string, unknown>) => {
    const id = (row.id ?? row.slug ?? row.key) as string | number
    setEditing(id)
    setDraft({ ...row })
    setEditLocale('fr')
  }

  if (editing && draft) {
    const contentFields = meta.fields.filter((field) => field.type === 'localized')
    const metaFields = meta.fields.filter((field) => field.type !== 'localized' && field.key !== 'status')
    const missingLocales = localeMissingFlags(draft, meta.fields)
    const previewUrl = catalogPublicPreviewUrl(kind, draft, PUBLIC_SITE)
    const status = String(draft.status ?? 'draft')
    const workflowActions = (
      <>
        <StatusPill status={status} />
        {canApprove && status === 'pending_review' ? (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={approve.isPending}
            onClick={() => handleApprove()}
          >
            Valider et publier
          </button>
        ) : null}
        {!canApprove && status !== 'pending_review' ? (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={save.isPending}
            onClick={() => saveWithStatus('pending_review')}
          >
            Soumettre à validation
          </button>
        ) : null}
        {canApprove && status !== 'published' ? (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={save.isPending}
            onClick={() => saveWithStatus('published')}
          >
            Publier directement
          </button>
        ) : null}
      </>
    )

    return (
      <div className="catalog-studio catalog-studio--editing">
        <CatalogEditorHeader
          backLabel="Retour à la liste"
          onBack={() => {
            setEditing(null)
            setDraft(null)
          }}
          translateOnSave={translateOnSave}
          onTranslateOnSave={setTranslateOnSave}
          saving={save.isPending}
          onSave={() => save.mutate(coerce(draft))}
          previewUrl={previewUrl}
          extraActions={workflowActions}
          onDelete={() => {
            if (confirm('Supprimer cette fiche ?')) remove.mutate(editing)
          }}
        />

        {contentFields.length > 0 ? (
          <CatalogEditorLayout
            localeTabs={
              <>
                <LocaleTabs locale={editLocale} onLocale={setEditLocale} missing={missingLocales} />
                {editLocale !== 'fr' && translateOnSave ? (
                  <p className="catalog-editor__hint">
                    Rédigez d&apos;abord en <strong>français</strong> — EN / AR se complètent à l&apos;enregistrement.
                  </p>
                ) : null}
              </>
            }
            main={contentFields.map((field) => renderLocalizedField(field, draft, setDraft, editLocale))}
            side={metaFields.map((field) => renderMetaField(field, draft, setDraft))}
          />
        ) : (
          <div className="catalog-editor catalog-editor--single">
            <div className="catalog-editor__main">
              <h3 className="catalog-editor__section">Fiche</h3>
              <div className="catalog-editor__fields">
                {metaFields.map((field) => renderMetaField(field, draft, setDraft))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="catalog-studio">
      <div className="catalog-list__hero">
        <div>
          <h2 className="catalog-list__title">{meta.title}</h2>
          <p className="catalog-list__desc">{meta.hint}</p>
          {user?.role === 'contributeur' ? (
            <p className="catalog-list__scope">
              Vous voyez uniquement les fiches de votre projet ({user.projectSlug || 'assigné par l’administrateur'}).
              Soumettez à validation — un éditeur publiera sur le site.
            </p>
          ) : null}
        </div>
        <div className="catalog-list__hero-actions">
          <ContextualHelp screen="catalog" />
          <p className="catalog-list__count">{filtered.length} fiche{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="catalog-list__toolbar">
        <div className="search-field">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher une fiche…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
          {query ? (
            <button type="button" className="search-field__clear" onClick={() => setQuery('')} aria-label="Effacer">
              <X size={14} />
            </button>
          ) : null}
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => create.mutate()} disabled={create.isPending}>
          {create.isPending ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
          Nouvelle fiche
        </button>
      </div>

      <div className="table-wrap catalog-list__table">
        <table>
          <thead>
            <tr>
              {listColumns.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th>Statut</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={listColumns.length + 2} className="table-empty">
                  <Loader2 size={18} className="spin" /> Chargement…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={listColumns.length + 2} className="table-empty">
                  Aucune fiche{query ? ' pour cette recherche' : ''}.
                  {!query ? (
                    <button type="button" className="btn btn--ghost btn--sm" style={{ marginLeft: 8 }} onClick={() => create.mutate()}>
                      <Plus size={14} /> Créer la première
                    </button>
                  ) : null}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = (row.id ?? row.slug ?? row.key) as string | number
                const titleText = displayValue(row.title ?? row.name).slice(0, 80)
                return (
                  <tr key={String(id)} className="table-row--click" onClick={() => openEditor(row)}>
                    {listColumns.map((f, index) => (
                      <td key={f.key} className={index === 0 ? 'cell-title' : undefined}>
                        {f.type === 'image' && row[f.key] ? (
                          <img className="cell-thumb" src={assetPreview(String(row[f.key]))} alt="" />
                        ) : index === 0 ? (
                          <strong>{titleText || 'Sans titre'}</strong>
                        ) : f.key.includes('At') || f.key === 'publishedAt' || f.key === 'startsAt' ? (
                          String(row[f.key] ?? '').slice(0, 10)
                        ) : (
                          displayValue(row[f.key]).slice(0, 48)
                        )}
                      </td>
                    ))}
                    <td><StatusPill status={String(row.status ?? 'draft')} /></td>
                    <td className="col-actions">
                      <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                        {catalogPublicPreviewUrl(kind, row, PUBLIC_SITE) ? (
                          <a
                            className="icon-action"
                            href={catalogPublicPreviewUrl(kind, row, PUBLIC_SITE)!}
                            target="_blank"
                            rel="noreferrer"
                            title="Aperçu sur le site"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={18} />
                          </a>
                        ) : null}
                        <button type="button" className="icon-action" onClick={() => openEditor(row)} title="Modifier">
                          <PenLine size={18} />
                        </button>
                        <button
                          type="button"
                          className="icon-action"
                          title="Dupliquer"
                          onClick={() => duplicate.mutate(id)}
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          type="button"
                          className="icon-action icon-action--danger"
                          onClick={() => { if (confirm('Supprimer cette fiche ?')) remove.mutate(id) }}
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 ? (
        <div className="catalog-list__pager">
          <button type="button" className="btn btn--ghost btn--sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Précédent
          </button>
          <span className="muted">Page {page} / {totalPages}</span>
          <button type="button" className="btn btn--ghost btn--sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Suivant
          </button>
        </div>
      ) : null}
    </div>
  )
}
