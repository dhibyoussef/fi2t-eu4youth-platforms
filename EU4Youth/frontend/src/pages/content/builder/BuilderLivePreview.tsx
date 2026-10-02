import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, Globe, Maximize2, Minimize2, Monitor, RefreshCw, Smartphone, Tablet } from 'lucide-react'
import toast from 'react-hot-toast'
import { createEditSessionToken, pagePublicPath, websiteOrigin } from '../../../api/editSession'
import { buildPreviewOverrides } from './buildPreviewOverrides'
import type { BuilderSection } from './PageBuilder'

const WEBSITE_ORIGIN = websiteOrigin()
const PREVIEW_MSG = 'gc-builder-preview'
const PREVIEW_READY = 'gc-builder-preview-ready'
const PREVIEW_EDIT = 'gc-builder-preview-edit'
const PREVIEW_SAVED = 'gc-builder-preview-saved'

type Device = 'desktop' | 'tablet' | 'mobile'
type PreviewLocale = 'fr' | 'en' | 'ar'

const DEVICE_WIDTH: Record<Device, number> = { desktop: 1440, tablet: 768, mobile: 390 }
const DEVICE_HEIGHT: Record<Device, number> = { desktop: 900, tablet: 820, mobile: 720 }

interface PendingChange {
  section: string
  key: string
  locale: string
  value: string
}

export interface EmbedEditPayload {
  page: string
  section: string
  key: string
  locale: string
  type: 'text' | 'image' | 'json'
  value: string
  label?: string
}

interface Props {
  pageSlug: string
  pagePath?: string
  sections: BuilderSection[]
  changes: Record<string, PendingChange>
  selectedSection: string | null
  expanded?: boolean
  onToggleExpand?: () => void
  showToolbar?: boolean
  onLocaleChange?: (locale: PreviewLocale) => void
  onEmbedEdit?: (edit: EmbedEditPayload) => void
  onEmbedSaved?: (page: string) => void
  chromeHint?: boolean
}

const LOCALES: { code: PreviewLocale; flag: string; label: string }[] = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ar', flag: '🇹🇳', label: 'AR' },
]

export default function BuilderLivePreview({
  pageSlug,
  pagePath,
  sections,
  changes,
  selectedSection,
  expanded = false,
  onToggleExpand,
  showToolbar = true,
  onLocaleChange,
  onEmbedEdit,
  onEmbedSaved,
  chromeHint = false,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const liveRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [device, setDevice] = useState<Device>('desktop')
  const [locale, setLocale] = useState<PreviewLocale>('fr')
  const [zoom, setZoom] = useState(100)
  const [wrapWidth, setWrapWidth] = useState(0)
  const [wrapHeight, setWrapHeight] = useState(0)
  const [iframeReady, setIframeReady] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [editToken, setEditToken] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    createEditSessionToken()
      .then((token) => {
        if (!cancelled) setEditToken(token)
      })
      .catch(() => {
        if (!cancelled) setEditToken(null)
      })
    return () => {
      cancelled = true
    }
  }, [iframeKey, pageSlug])

  const previewUrl = useMemo(() => {
    if (!editToken) return null
    const path = pagePublicPath(pageSlug, pagePath)
    const params = new URLSearchParams({ builder_preview: '1', edit_token: editToken, locale })
    return `${WEBSITE_ORIGIN}${path}?${params}`
  }, [pageSlug, pagePath, editToken, locale])

  const setPreviewLocale = (next: PreviewLocale) => {
    setLocale(next)
    onLocaleChange?.(next)
  }

  const overrides = useMemo(
    () => buildPreviewOverrides(pageSlug, sections, changes, locale),
    [pageSlug, sections, changes, locale],
  )

  const pushPreview = useCallback(
    (scrollTo = false) => {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      win.postMessage(
        {
          type: PREVIEW_MSG,
          page: pageSlug,
          locale,
          overrides,
          highlightSection: selectedSection,
          scrollToSection: scrollTo ? selectedSection : null,
          device,
        },
        WEBSITE_ORIGIN,
      )
    },
    [pageSlug, locale, overrides, selectedSection, device],
  )

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== WEBSITE_ORIGIN) return
      if (event.data?.type === PREVIEW_READY) setIframeReady(true)
      if (event.data?.type === PREVIEW_EDIT && event.data.page === pageSlug) {
        onEmbedEdit?.({
          page: event.data.page,
          section: event.data.section,
          key: event.data.key,
          locale: event.data.locale,
          type: event.data.blockType ?? 'text',
          value: event.data.value ?? '',
          label: event.data.label,
        })
      }
      if (event.data?.type === PREVIEW_SAVED && event.data.cleared && event.data.page === pageSlug) {
        onEmbedSaved?.(event.data.page)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [pageSlug, onEmbedEdit, onEmbedSaved])

  useEffect(() => {
    if (!iframeReady) return
    const timer = setTimeout(() => pushPreview(false), 120)
    return () => clearTimeout(timer)
  }, [iframeReady, overrides, locale, selectedSection, device, pushPreview])

  useEffect(() => {
    if (!iframeReady || !selectedSection) return
    const timer = setTimeout(() => pushPreview(true), 200)
    return () => clearTimeout(timer)
  }, [selectedSection, iframeReady, pushPreview])

  /* Measure the outer preview shell, not the scroll container — otherwise
     scrollbar appearance shrinks clientWidth and retriggers fit scale (26↔28% flicker). */
  useLayoutEffect(() => {
    const live = liveRef.current
    if (!live) return
    const measure = () => {
      const rect = live.getBoundingClientRect()
      const toolbar = live.querySelector<HTMLElement>('.pb-live__toolbar')
      const toolbarH = toolbar?.offsetHeight ?? 0
      const framePad = 20
      setWrapWidth(Math.max(280, Math.floor(rect.width) - framePad))
      setWrapHeight(Math.max(200, Math.floor(rect.height - toolbarH) - framePad))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(live)
    return () => observer.disconnect()
  }, [expanded, device, showToolbar])

  const artboardW = DEVICE_WIDTH[device]
  const available = Math.max(280, wrapWidth - 24)
  const fitScale = wrapWidth > 0 ? Math.min(1, available / artboardW) : 1
  const scale = Math.round(fitScale * (zoom / 100) * 1000) / 1000
  const paneH = wrapHeight > 40 ? wrapHeight - 8 : DEVICE_HEIGHT[device]
  const artboardH = Math.max(560, Math.ceil(paneH / Math.max(scale, 0.05)))
  const shellW = Math.min(Math.round(artboardW * scale), Math.max(1, wrapWidth - 2))
  const shellH = Math.min(Math.round(artboardH * scale), Math.max(1, wrapHeight - 2))
  const effectivePct = Math.round(scale * 100)

  const openInTab = async () => {
    try {
      const token = await createEditSessionToken()
      const path = pagePublicPath(pageSlug, pagePath)
      const url = new URL(`${WEBSITE_ORIGIN}${path}`)
      url.searchParams.set('edit_token', token)
      window.open(url.toString(), '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Session d’édition indisponible — reconnectez-vous')
    }
  }

  return (
    <div ref={liveRef} className={`pb-live${expanded ? ' pb-live--expanded' : ''}`}>
      {showToolbar && (
        <div className="pb-live__toolbar">
          <div className="pb-live__toolbar-group">
            <span className="pb-live__label">Aperçu live</span>
            <div className="pb-live__devices">
              {(
                [
                  ['desktop', Monitor, 'Bureau 1440px'],
                  ['tablet', Tablet, 'Tablette 768px'],
                  ['mobile', Smartphone, 'Mobile 390px'],
                ] as const
              ).map(([d, Icon, title]) => (
                <button key={d} type="button" title={title} className={device === d ? 'active' : ''} onClick={() => setDevice(d)}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
            <span className="pb-live__device-size">{artboardW}px</span>
          </div>
          <div className="pb-live__toolbar-group">
            <Globe size={13} />
            <div className="pb-live__locales">
              {LOCALES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={locale === item.code ? 'active' : ''}
                  onClick={() => setPreviewLocale(item.code)}
                >
                  {item.flag} {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pb-live__toolbar-group pb-live__zoom">
            <input
              type="range"
              min={50}
              max={160}
              step={5}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              title={`Zoom ${zoom}%`}
            />
            <span>{effectivePct}%</span>
          </div>
          <div className="pb-live__toolbar-actions">
            <button
              type="button"
              title="Actualiser"
              onClick={() => {
                setIframeReady(false)
                setIframeKey((k) => k + 1)
              }}
            >
              <RefreshCw size={14} />
            </button>
            {onToggleExpand && (
              <button type="button" title={expanded ? 'Réduire' : 'Plein écran'} onClick={onToggleExpand}>
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}
            <button type="button" title="Ouvrir dans un nouvel onglet" onClick={() => void openInTab()}>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}
      {chromeHint && (
        <p className="pb-live__chrome-hint">
          Aperçu sur l&apos;accueil — seuls l&apos;en-tête, le pied de page et le bandeau cookies sont modifiables ici.
        </p>
      )}
      <div className="pb-live__frame-wrap" ref={wrapRef}>
        {!previewUrl ? (
          <p className="pb-live__loading">Préparation de la session sécurisée…</p>
        ) : (
          <div className={`pb-live__frame${device !== 'desktop' ? ' pb-live__frame--device' : ''}`} style={{ width: shellW, height: shellH }}>
            <iframe
              ref={iframeRef}
              key={`${iframeKey}-${pageSlug}-${editToken?.slice(-12) ?? 'x'}`}
              src={previewUrl}
              title="Aperçu du site"
              className="pb-live__iframe"
              width={artboardW}
              height={artboardH}
              style={{
                width: artboardW,
                height: artboardH,
                maxWidth: 'none',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
              onLoad={() => {
                setIframeReady(true)
                setTimeout(() => pushPreview(false), 300)
              }}
            />
          </div>
        )}
      </div>
      {Object.keys(changes).length > 0 && (
        <p className="pb-live__draft-hint">Modifications non enregistrées visibles dans l’aperçu</p>
      )}
    </div>
  )
}
