/**
 * GO4Youth: fix swapped acronym/fullName, truncated names, KPI parity FR/EN/AR.
 */
import { loadStore, saveStore } from '../src/store.mjs'

const store = loadStore()
const p = store.projects.find((x) => x.slug === 'go4youth')
if (!p) throw new Error('go4youth missing')

p.acronym = {
  fr: 'GO4Youth',
  en: 'GO4Youth',
  ar: 'GO4Youth',
}

p.fullName = {
  fr: 'Gates for Opportunities for Youth',
  en: 'Gates for Opportunities for Youth',
  ar: 'بوابات الفرص للشباب',
}

p.name = {
  fr: "GO4Youth — Renforcer les services d'emploi pour améliorer l'accès des jeunes à des opportunités professionnelles décentes",
  en: "GO4Youth — Strengthening employment services to improve young people's access to decent employment opportunities",
  ar: 'GO4Youth — تعزيز خدمات التشغيل لتحسين وصول الشباب إلى فرص عمل لائقة',
}

p.kpis = {
  fr: [
    {
      value: '3',
      label: 'nouveaux services créés ou améliorés (sur un objectif de 8)',
    },
    {
      value: '6',
      label: "BETI où les outils d'accompagnement sont testés",
    },
    {
      value: '19',
      label: 'cahiers des charges pour les services numériques développés et en cours de déploiement',
    },
  ],
  en: [
    {
      value: '3',
      label: 'new or improved services created (out of a target of 8)',
    },
    {
      value: '6',
      label: 'BETI offices where support tools are being tested',
    },
    {
      value: '19',
      label: 'technical specifications for digital services developed and under deployment',
    },
  ],
  ar: [
    {
      value: '3',
      label: 'خدمات جديدة أحدثت أو حسّنت (من أصل هدف يبلغ 8 خدمات)',
    },
    {
      value: '6',
      label: 'مكاتب للتشغيل والعمل المستقل (BETI) تُختبر فيها أدوات المرافقة',
    },
    {
      value: '19',
      label: 'كراسات شروط للخدمات الرقمية أُعدت وهي بصدد التنفيذ',
    },
  ],
}

saveStore(store)

console.log('go4youth parity ok')
console.log('acronym', p.acronym)
console.log('fullName', p.fullName)
console.log(
  'kpi counts',
  Object.fromEntries(['fr', 'en', 'ar'].map((loc) => [loc, p.kpis[loc].length])),
)
