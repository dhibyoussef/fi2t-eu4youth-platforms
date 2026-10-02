/**
 * Irada4Youth: same KPI set in FR/EN/AR; flatten feed titles (no forced line breaks).
 */
import { loadStore, saveStore } from '../src/store.mjs'

const store = loadStore()
const p = store.projects.find((x) => x.slug === 'irada4youth')
if (!p) throw new Error('irada4youth missing')

p.kpis = {
  fr: [
    { value: '6', label: 'gouvernorats prioritaires' },
    { value: '≥ 200', label: 'projets sélectionnés et subventionnés (cible)' },
    { value: '≥ 1 000', label: 'jeunes sensibilisés (cible)' },
    { value: '600', label: 'dossiers de notes conceptuelles accompagnés (cible)' },
    { value: '300', label: 'dossiers complets accompagnés (cible)' },
    {
      value: '15 %',
      label: 'réduction des demandes d’emploi non satisfaites 20–40 ans (cible)',
    },
  ],
  en: [
    { value: '6', label: 'priority governorates' },
    { value: '≥ 200', label: 'projects selected and funded (target)' },
    { value: '≥ 1,000', label: 'young people reached (target)' },
    { value: '600', label: 'concept-note dossiers supported (target)' },
    { value: '300', label: 'full dossiers supported (target)' },
    {
      value: '15%',
      label: 'reduction in unmet job demand ages 20–40 (target)',
    },
  ],
  ar: [
    { value: '6', label: 'ولايات ذات أولوية' },
    { value: '≥ 200', label: 'مشاريع مختارة ومموَّلة (هدف)' },
    { value: '≥ 1 000', label: 'شباب تم تحسيسهم (هدف)' },
    { value: '600', label: 'ملفات مذكرات مفاهيمية مرافَقة (هدف)' },
    { value: '300', label: 'ملفات كاملة مرافَقة (هدف)' },
    {
      value: '15 %',
      label: 'خفض الطلبات غير الملباة على الشغل للفئة 20–40 سنة (هدف)',
    },
  ],
}

const feedTitleKeys = new Set(['oppsTitle', 'newsTitle', 'eventsTitle'])
const feedTitleFlat = {
  fr: {
    oppsTitle: 'OPPORTUNITÉS EN COURS',
    newsTitle: 'DERNIÈRES ACTUALITÉS',
    eventsTitle: 'PROCHAINS ÉVÉNEMENTS',
  },
  en: {
    oppsTitle: 'OPEN OPPORTUNITIES',
    newsTitle: 'LATEST NEWS',
    eventsTitle: 'UPCOMING EVENTS',
  },
  ar: {
    oppsTitle: 'فرص جارية',
    newsTitle: 'آخر الأخبار',
    eventsTitle: 'الفعاليات القادمة',
  },
}

for (const b of store.content.blocks || []) {
  if (b.page !== 'projet' || b.section !== 'feeds') continue
  if (!feedTitleKeys.has(b.key)) continue
  const next = feedTitleFlat[b.locale]?.[b.key]
  if (next && b.value !== next) {
    console.log('feed', b.locale, b.key, JSON.stringify(b.value), '->', JSON.stringify(next))
    b.value = next
  }
}

for (const b of store.content.blocks || []) {
  if (b.page !== 'projet' || b.section !== 'impact' || b.key !== 'title') continue
  const next =
    b.locale === 'fr'
      ? 'CHIFFRES CLÉS DU PROJET'
      : b.locale === 'en'
        ? 'PROJECT KEY FIGURES'
        : 'أرقام المشروع الرئيسية'
  if (b.value !== next) {
    console.log('impact title', b.locale, JSON.stringify(b.value), '->', JSON.stringify(next))
    b.value = next
  }
}

saveStore(store)
console.log(
  'kpi counts',
  Object.fromEntries(['fr', 'en', 'ar'].map((loc) => [loc, p.kpis[loc].length])),
)
