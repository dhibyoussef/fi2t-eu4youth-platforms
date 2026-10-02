const FIELD_TITLES: Record<string, string> = {
  lastName: 'Nom',
  firstName: 'Prénom',
  organisation: 'Organisation / Structure',
  role: 'Fonction',
  email: 'Adresse e-mail',
  phone: 'Téléphone',
  profile: 'Vous êtes…',
  project: 'Projet concerné',
  location: 'Zone géographique',
  requestType: 'Objet de la demande',
  subject: 'Objet',
  message: 'Message',
  subjectHint: 'Mention sous l’objet',
  messageHint: 'Mention sous le message',
}

type Row = Record<string, string>

function parseRows(raw: string): Row[] {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => {
      if (typeof item === 'string') return { label: item }
      return Object.fromEntries(
        Object.entries(item || {}).map(([key, value]) => [key, value == null ? '' : String(value)]),
      )
    })
  } catch {
    return []
  }
}

function kindOf(rows: Row[]) {
  if (!rows.length) return 'options' as const
  if (rows.some((row) => 'image' in row && 'label' in row)) return 'slides' as const
  if (rows.some((row) => 'title' in row && 'body' in row)) return 'cards' as const
  if (rows.some((row) => 'text' in row && 'key' in row)) return 'labels' as const
  return 'options' as const
}

export function FriendlyJsonRows({
  value,
  onChange,
  onUploadImage,
}: {
  value: string
  onChange: (next: string) => void
  onUploadImage?: (file: File) => Promise<string>
}) {
  const rows = parseRows(value)
  const kind = kindOf(rows)
  const write = (next: Row[]) => onChange(JSON.stringify(next, null, 2))

  if (kind === 'slides') {
    return (
      <div className="wc-json-rows">
        {rows.map((row, index) => (
          <article key={index} className="wc-json-row wc-json-row--slide">
            <div className="wc-json-row__head">
              <strong>Photo {index + 1}</strong>
              <button type="button" className="wc-json-row__remove" onClick={() => write(rows.filter((_, i) => i !== index))}>
                Supprimer
              </button>
            </div>
            <label className="wc-json-row">
              <span>Libellé</span>
              <input
                value={row.label ?? ''}
                onChange={(event) =>
                  write(rows.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)))
                }
              />
            </label>
            <label className="wc-json-row">
              <span>Image</span>
              {row.image ? <img src={row.image} alt="" className="wc-image-thumb" /> : null}
              <input
                value={row.image ?? ''}
                onChange={(event) =>
                  write(rows.map((item, i) => (i === index ? { ...item, image: event.target.value } : item)))
                }
              />
              {onUploadImage ? (
                <label className="wc-json-row__upload">
                  Téléverser
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      void onUploadImage(file).then((url) =>
                        write(rows.map((item, i) => (i === index ? { ...item, image: url } : item))),
                      )
                      event.target.value = ''
                    }}
                  />
                </label>
              ) : null}
            </label>
          </article>
        ))}
        <button
          type="button"
          className="wc-json-row__add"
          onClick={() => write([...rows, { label: `Photo ${rows.length + 1}`, image: '' }])}
        >
          + Ajouter une photo
        </button>
      </div>
    )
  }

  if (kind === 'cards') {
    return (
      <div className="wc-json-rows">
        {rows.map((row, index) => (
          <article key={index} className="wc-json-row wc-json-row--card">
            <div className="wc-json-row__head">
              <strong>Élément {index + 1}</strong>
              <button type="button" className="wc-json-row__remove" onClick={() => write(rows.filter((_, i) => i !== index))}>
                Supprimer
              </button>
            </div>
            <label className="wc-json-row">
              <span>Titre</span>
              <input
                value={row.title ?? ''}
                onChange={(event) =>
                  write(rows.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)))
                }
              />
            </label>
            <label className="wc-json-row">
              <span>Texte</span>
              <textarea
                rows={3}
                value={row.body ?? ''}
                onChange={(event) =>
                  write(rows.map((item, i) => (i === index ? { ...item, body: event.target.value } : item)))
                }
              />
            </label>
          </article>
        ))}
        <button type="button" className="wc-json-row__add" onClick={() => write([...rows, { title: '', body: '' }])}>
          + Ajouter
        </button>
      </div>
    )
  }

  if (kind === 'labels') {
    return (
      <div className="wc-json-rows">
        {rows.map((row, index) => (
          <label key={`${row.key}-${index}`} className="wc-json-row">
            <span>{FIELD_TITLES[row.key] || row.text || `Ligne ${index + 1}`}</span>
            <input
              value={row.text ?? ''}
              onChange={(event) =>
                write(rows.map((item, i) => (i === index ? { ...item, text: event.target.value } : item)))
              }
            />
          </label>
        ))}
      </div>
    )
  }

  return (
    <div className="wc-json-rows">
      {rows.map((row, index) => (
        <div key={index} className="wc-json-row wc-json-row--option">
          <span>Option {index + 1}</span>
          <input
            value={row.label ?? row.text ?? ''}
            onChange={(event) =>
              write(rows.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)))
            }
          />
          <button
            type="button"
            className="wc-json-row__remove"
            onClick={() => write(rows.filter((_, i) => i !== index))}
          >
            Retirer
          </button>
        </div>
      ))}
      <button type="button" className="wc-json-row__add" onClick={() => write([...rows, { label: '' }])}>
        + Ajouter une option
      </button>
    </div>
  )
}
