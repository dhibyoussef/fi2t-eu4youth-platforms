/** Display labels for Carte nature/sector filter values (canonical = FR store keys). */

const NATURE_EN: Record<string, string> = {
  Association: 'Association',
  Club: 'Club',
  Institution: 'Institution',
  Startup: 'Startup',
}

const NATURE_AR: Record<string, string> = {
  Association: 'جمعية',
  Club: 'نادي',
  Institution: 'مؤسسة',
  Startup: 'شركة ناشئة',
}

const SECTOR_EN: Record<string, string> = {
  Agriculture: 'Agriculture',
  Artisanat: 'Crafts',
  Culture: 'Culture',
  Éducation: 'Education',
  Education: 'Education',
  Entrepreneuriat: 'Entrepreneurship',
  Environnement: 'Environment',
  ESS: 'SSE',
  Média: 'Media',
  Media: 'Media',
}

const SECTOR_AR: Record<string, string> = {
  Agriculture: 'الفلاحة',
  Artisanat: 'الحرف',
  Culture: 'الثقافة',
  Éducation: 'التربية',
  Education: 'التربية',
  Entrepreneuriat: 'ريادة الأعمال',
  Environnement: 'البيئة',
  ESS: 'الاقتصاد الاجتماعي والتضامني',
  Média: 'الإعلام',
  Media: 'الإعلام',
}

export function natureDisplayName(canonical: string, locale: string): string {
  if (locale === 'ar') return NATURE_AR[canonical] || canonical
  if (locale === 'en') return NATURE_EN[canonical] || canonical
  return canonical
}

export function sectorDisplayName(canonical: string, locale: string): string {
  if (locale === 'ar') return SECTOR_AR[canonical] || canonical
  if (locale === 'en') return SECTOR_EN[canonical] || canonical
  return canonical
}
