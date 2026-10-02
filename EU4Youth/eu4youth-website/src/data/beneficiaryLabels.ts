/** Display labels for project beneficiary filter values (canonical = FR store keys). */
const BEN_EN: Record<string, string> = {
  'Jeunes entrepreneurs': 'Young entrepreneurs',
  'Structures ESS': 'SSE organisations',
  'Acteurs territoriaux': 'Territorial actors',
  'Jeunes et populations vulnérables': 'Young people and vulnerable populations',
  "Chercheurs d'emploi": 'Job seekers',
  Entreprises: 'Companies',
  'Personnes en transition professionnelle': 'People in career transition',
  "Acteurs privés de l'employabilité": 'Private employability actors',
  'Doctorants et post-doctorants': 'PhD and post-doctoral researchers',
  'Jeunes chercheurs': 'Young researchers',
  Associations: 'Associations',
  'Start-ups': 'Start-ups',
  'Acteurs publics': 'Public actors',
  'Institutions de recherche': 'Research institutions',
  'Acteurs socio-économiques': 'Socio-economic actors',
  'Diplômés du supérieur': 'Higher-education graduates',
  'Diplômés de la formation professionnelle': 'Vocational training graduates',
  'Jeunes demandeurs d’emploi': 'Young job seekers',
  "Jeunes demandeurs d'emploi": 'Young job seekers',
  'Porteurs de projets': 'Project holders',
  "Structures d'appui": 'Support structures',
  'Femmes et hommes de moins de 35 ans en situation de vulnérabilité':
    'Women and men under 35 in a situation of vulnerability',
  'Organisations de la société civile et acteurs indépendants':
    'Civil society organisations and independent actors',
  'Structures publiques locales, régionales et déconcentrées':
    'Local, regional and deconcentrated public structures',
  'Ministères et organismes de tutelle': 'Ministries and supervisory bodies',
  'Jeunes tunisien·ne·s âgé·e·s de 18 à 35 ans': 'Young Tunisians aged 18 to 35',
  Communes: 'Municipalities',
}

const BEN_AR: Record<string, string> = {
  'Jeunes entrepreneurs': 'شباب رواد أعمال',
  'Structures ESS': 'هياكل الاقتصاد الاجتماعي والتضامني',
  'Acteurs territoriaux': 'فاعلون ترابيون',
  'Jeunes et populations vulnérables': 'شباب وفئات هشة',
  "Chercheurs d'emploi": 'باحثون عن شغل',
  Entreprises: 'مؤسسات',
  'Personnes en transition professionnelle': 'أشخاص في انتقال مهني',
  "Acteurs privés de l'employabilité": 'فاعلون خواص في القابلية للتشغيل',
  'Doctorants et post-doctorants': 'طلبة دكتوراه وما بعد الدكتوراه',
  'Jeunes chercheurs': 'باحثون شباب',
  Associations: 'جمعيات',
  'Start-ups': 'شركات ناشئة',
  'Acteurs publics': 'فاعلون عموميون',
  'Institutions de recherche': 'مؤسسات بحث',
  'Acteurs socio-économiques': 'فاعلون اجتماعيون واقتصاديون',
  'Diplômés du supérieur': 'خريجو التعليم العالي',
  'Diplômés de la formation professionnelle': 'خريجو التكوين المهني',
  'Jeunes demandeurs d’emploi': 'شباب طالبون للشغل',
  "Jeunes demandeurs d'emploi": 'شباب طالبون للشغل',
  'Porteurs de projets': 'أصحاب مشاريع',
  "Structures d'appui": 'هياكل مساندة',
  'Femmes et hommes de moins de 35 ans en situation de vulnérabilité':
    'نساء ورجال دون 35 سنة في وضعية هشاشة',
  'Organisations de la société civile et acteurs indépendants':
    'منظمات المجتمع المدني وفاعلون مستقلون',
  'Structures publiques locales, régionales et déconcentrées':
    'هياكل عمومية محلية وجهوية ولامركزية',
  'Ministères et organismes de tutelle': 'وزارات وهياكل إشراف',
  'Jeunes tunisien·ne·s âgé·e·s de 18 à 35 ans': 'شباب تونسيون بين 18 و35 سنة',
  Communes: 'بلديات',
}

export function beneficiaryDisplayName(canonical: string, locale: string): string {
  if (locale === 'ar') return BEN_AR[canonical] || canonical
  if (locale === 'en') return BEN_EN[canonical] || canonical
  return canonical
}
