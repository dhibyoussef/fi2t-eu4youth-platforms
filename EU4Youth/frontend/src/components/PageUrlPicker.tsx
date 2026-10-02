import { useQuery } from '@tanstack/react-query'
import { Link2 } from 'lucide-react'
import { api } from '../api/client'
import { pageDisplayTitle, type CmsPage } from '../pages/content/components/PageSidebar'

type Props = {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

export default function PageUrlPicker({ value, onChange, label = 'Page du site', placeholder = 'Choisir une page…' }: Props) {
  const { data: pages = [] } = useQuery<CmsPage[]>({
    queryKey: ['cms-page-urls'],
    queryFn: () =>
      api.get('/admin/content/matrix', { params: { page: 'home' } }).then((res) => {
        const list: CmsPage[] = res.data.pages ?? []
        return list.filter((page) => page.template !== 'global' && page.slug !== 'global')
      }),
    staleTime: 60_000,
  })

  const options = pages
    .map((page) => ({
      path: page.path || (page.slug === 'home' ? '/' : `/${page.slug}`),
      label: pageDisplayTitle(page),
      group: page.group || 'Pages',
    }))
    .sort((a, b) => a.group.localeCompare(b.group, 'fr') || a.label.localeCompare(b.label, 'fr'))

  const groups = options.reduce<Record<string, typeof options>>((acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = []
    acc[opt.group].push(opt)
    return acc
  }, {})

  return (
    <label className="field field--catalog page-url-picker">
      <span>
        <Link2 size={12} aria-hidden="true" /> {label}
      </span>
      <div className="page-url-picker__row">
        <select
          value={options.some((o) => o.path === value) ? value : ''}
          onChange={(event) => {
            if (event.target.value) onChange(event.target.value)
          }}
        >
          <option value="">{placeholder}</option>
          {Object.entries(groups).map(([group, items]) => (
            <optgroup key={group} label={group}>
              {items.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label} ({item.path})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/programme/a-propos ou https://…"
          aria-label={`${label} — saisie manuelle`}
        />
      </div>
    </label>
  )
}
