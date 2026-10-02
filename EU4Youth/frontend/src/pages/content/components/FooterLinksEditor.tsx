import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { PUBLIC_SITE } from '../../../api/editSession'
import PageUrlPicker from '../../../components/PageUrlPicker'

type FooterLink = { label: string; to: string }

type MergedRow = { to: string; fr: string; en: string; ar: string }

function parseLinks(raw: string): FooterLink[] {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((row) => ({
      label: String(row?.label ?? '').trim(),
      to: String(row?.to ?? '').trim(),
    }))
  } catch {
    return []
  }
}

function mergeLinks(frRaw: string, enRaw: string, arRaw: string): MergedRow[] {
  const fr = parseLinks(frRaw)
  const en = parseLinks(enRaw)
  const ar = parseLinks(arRaw)
  const max = Math.max(fr.length, en.length, ar.length, 0)
  return Array.from({ length: max }, (_, index) => ({
    to: fr[index]?.to || en[index]?.to || ar[index]?.to || '',
    fr: fr[index]?.label || '',
    en: en[index]?.label || '',
    ar: ar[index]?.label || '',
  }))
}

function serialize(rows: MergedRow[]): { fr: string; en: string; ar: string } {
  const pack = (locale: 'fr' | 'en' | 'ar') =>
    JSON.stringify(
      rows
        .filter((row) => row.to.trim() || row[locale].trim())
        .map((row) => ({ label: row[locale].trim() || row.fr.trim() || row.to, to: row.to.trim() })),
      null,
      2,
    )
  return { fr: pack('fr'), en: pack('en'), ar: pack('ar') }
}

function previewHref(path: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${PUBLIC_SITE}${path.startsWith('/') ? path : `/${path}`}`
}

export default function FooterLinksEditor({
  values,
  onChange,
}: {
  values: { fr: string; en: string; ar: string }
  onChange: (next: { fr: string; en: string; ar: string }) => void
}) {
  const rows = useMemo(
    () => mergeLinks(values.fr, values.en, values.ar),
    [values.fr, values.en, values.ar],
  )

  const write = (next: MergedRow[]) => onChange(serialize(next))

  const patch = (index: number, patchRow: Partial<MergedRow>) =>
    write(rows.map((row, i) => (i === index ? { ...row, ...patchRow } : row)))

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= rows.length) return
    const next = [...rows]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    write(next)
  }

  return (
    <div className="footer-links-editor">
      {rows.length === 0 ? (
        <div className="footer-links-editor__empty-state">
          <p>Aucun lien dans cette colonne.</p>
          <button
            type="button"
            className="footer-links-editor__add footer-links-editor__add--center"
            onClick={() => write([{ to: '', fr: '', en: '', ar: '' }])}
          >
            <Plus size={14} /> Ajouter le premier lien
          </button>
        </div>
      ) : (
        <ul className="footer-links-editor__list">
          {rows.map((row, index) => (
            <li key={index} className="footer-links-editor__item">
              <div className="footer-links-editor__index">{index + 1}</div>
              <div className="footer-links-editor__main">
                <div className="footer-links-editor__labels">
                  <label className="footer-links-editor__field">
                    <span className="footer-links-editor__tag">FR</span>
                    <input
                      value={row.fr}
                      onChange={(event) => patch(index, { fr: event.target.value })}
                      placeholder="Libellé français"
                    />
                  </label>
                  <label className="footer-links-editor__field">
                    <span className="footer-links-editor__tag">EN</span>
                    <input
                      value={row.en}
                      onChange={(event) => patch(index, { en: event.target.value })}
                      placeholder="English label"
                    />
                  </label>
                  <label className="footer-links-editor__field footer-links-editor__field--ar">
                    <span className="footer-links-editor__tag">AR</span>
                    <input
                      dir="rtl"
                      value={row.ar}
                      onChange={(event) => patch(index, { ar: event.target.value })}
                      placeholder="التسمية"
                    />
                  </label>
                </div>
                <PageUrlPicker
                  label="Page du site"
                  value={row.to}
                  onChange={(to) => patch(index, { to })}
                />
              </div>
              <div className="footer-links-editor__actions">
                {row.to ? (
                  <a
                    href={previewHref(row.to)}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-links-editor__action"
                    title="Ouvrir sur le site"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : null}
                <button type="button" className="footer-links-editor__action" title="Monter" onClick={() => move(index, -1)}>
                  <ArrowUp size={14} />
                </button>
                <button type="button" className="footer-links-editor__action" title="Descendre" onClick={() => move(index, 1)}>
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  className="footer-links-editor__action footer-links-editor__action--danger"
                  title="Supprimer"
                  onClick={() => write(rows.filter((_, i) => i !== index))}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {rows.length > 0 ? (
        <button
          type="button"
          className="footer-links-editor__add"
          onClick={() => write([...rows, { to: '', fr: '', en: '', ar: '' }])}
        >
          <Plus size={14} /> Ajouter un lien
        </button>
      ) : null}
    </div>
  )
}
