/** Arabic display names for Tunisia’s 24 governorates (canonical Latin keys). */
export const GOV_DISPLAY_AR: Record<string, string> = {
  Tunis: 'تونس',
  Bizerte: 'بنزرت',
  Ariana: 'أريانة',
  'Ben Arous': 'بن عروس',
  Manouba: 'منوبة',
  Nabeul: 'نابل',
  Zaghouan: 'زغوان',
  Béja: 'باجة',
  Jendouba: 'جندوبة',
  'Le Kef': 'الكاف',
  Siliana: 'سليانة',
  Sousse: 'سوسة',
  Monastir: 'المنستير',
  Mahdia: 'المهدية',
  Kairouan: 'القيروان',
  Kasserine: 'القصرين',
  'Sidi Bouzid': 'سيدي بوزيد',
  Sfax: 'صفاقس',
  Gafsa: 'قفصة',
  Tozeur: 'توزر',
  Kébili: 'قبلي',
  Gabès: 'قابس',
  Médenine: 'مدنين',
  Tataouine: 'تطاوين',
  'Grand Tunis': 'تونس الكبرى',
  'Présence nationale': 'حضور وطني',
  Tunisie: 'تونس',
  /* Localités used in news/opportunities filters */
  'Hammam Sousse': 'حمام سوسة',
  Charguia: 'الشرقية',
  Fouchana: 'فوشانة',
}

const GOV_DISPLAY_EN: Record<string, string> = {
  Tunisie: 'Tunisia',
  'Présence nationale': 'National presence',
  'Grand Tunis': 'Greater Tunis',
}

export function govDisplayName(canonical: string, locale: string): string {
  if (locale === 'ar') return GOV_DISPLAY_AR[canonical] || canonical
  if (locale === 'en') return GOV_DISPLAY_EN[canonical] || canonical
  return canonical
}
