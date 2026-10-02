interface BlockRow {
  key: string
  type: 'text' | 'image' | 'json'
  locales: Record<string, { value: string | null }>
}

interface Section {
  name: string
  blocks: BlockRow[]
}

interface PendingChange {
  section: string
  key: string
  locale: string
  value: string
}

export function buildPreviewOverrides(
  _pageSlug: string,
  sections: Section[],
  changes: Record<string, PendingChange>,
  locale: string,
): Record<string, string> {
  const overrides: Record<string, string> = {}
  for (const sec of sections) {
    for (const block of sec.blocks) {
      const candidates =
        block.type === 'image' ? ['_all'] : block.type === 'json' ? [locale, 'fr', '_all'] : [locale, 'fr']
      let value = ''
      for (const loc of candidates) {
        value = changes[`${sec.name}.${block.key}.${loc}`]?.value ?? block.locales[loc]?.value ?? ''
        if (value) break
      }
      if (value) overrides[`${sec.name}.${block.key}`] = value
    }
  }
  return overrides
}
