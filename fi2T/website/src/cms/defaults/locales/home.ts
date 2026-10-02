/** EN / AR overlays for home page (text + JSON). Images stay in FR base defaults. */

export const HOME_EN: Record<string, string> = {
  'hero.title': 'The future of Tunisian tourism is built here!',
  'hero.subtitle': 'Unite, innovate and promote Tunisian tourism',
  'hero.cta_primary': 'Discover the Federation',
  'hero.cta_secondary': 'Join now',

  'about.title': 'Who we are',
  'about.body':
    'The Interprofessional Federation of Tunisian Tourism is an independent employers’ professional union founded in March 2016 by operators from different tourism activities: travel agencies, alternative accommodation, leisure, entertainment, sports, transport…',
  'about.cta': 'See more',
  'about.badge': "10+\nYEARS OF COMMITMENT",

  'objectifs.title': 'Our Objectives',
  'objectifs.intro':
    'Fi2T aims to bring together different tourism operators within a single employers’ professional union, in order to:',
  'objectifs.items': JSON.stringify([
    {
      title: 'Strategic vision',
      desc: 'Contribute strategic and practical vision for the diversification and innovation of Tunisian tourism.',
    },
    {
      title: 'Members’ interests',
      desc: 'Safeguard the economic and social interests of its members',
    },
    {
      title: 'Synergy',
      desc: 'Create synergy between the different operators of Tunisian tourism',
    },
    {
      title: 'Development',
      desc: 'Contribute to the development and growth of Tunisian tourism',
    },
    {
      title: 'Diversification',
      desc: 'Support the diversification of Tunisian tourism',
    },
    {
      title: 'Commercialisation',
      desc: 'Promote and support the marketing of Tunisian tourism products’ diversity',
    },
  ]),

  'groupements.title': 'Professional Groups',
  'groupements.intro': '',
  'groupements.items': JSON.stringify([
    { label: 'Travel agencies', slug: 'agences-de-voyages', icon: '/images/icon1.png?v=5' },
    { label: 'Alternative accommodation', slug: 'hebergements-alternatifs', icon: '/images/icon2.png?v=5' },
    { label: 'Cultural tourism', slug: 'tourisme-culturel', icon: '/images/icon3.png?v=5' },
    { label: 'Health tourism', slug: 'tourisme-de-sante', icon: '/images/icon4.png?v=5' },
    { label: 'Adventure tourism', slug: 'tourisme-aventure', icon: '/images/icon5.png?v=5' },
    { label: 'Business tourism', slug: 'tourisme-affaire', icon: '/images/icon6.png?v=5' },
    { label: 'Ecological tourism', slug: 'tourisme-ecologique', icon: '/images/icon7.png?v=5' },
    { label: 'Aeronautical tourism', slug: 'tourisme-aeronautique', icon: '/images/icon8.png?v=5' },
    { label: 'Automotive tourism', slug: 'tourisme-automobile', icon: '/images/icon9.png?v=5' },
    { label: 'Golf tourism', slug: 'tourisme-sportif', icon: '/images/icon10.png?v=5' },
    { label: 'Nautical tourism', slug: 'tourisme-nautique', icon: '/images/icon11.png?v=5' },
    { label: 'Underwater tourism', slug: 'tourisme-subaquatique', icon: '/images/icon12.png?v=5' },
  ]),

  'adherer.title': 'Why join Fi2T?',
  'adherer.badge': "50+\nACTIVE MEMBERS",
  'adherer.cta': 'Join now',
  'adherer.reasons': JSON.stringify([
    { title: 'Institutional representation', desc: 'Be represented before governments and institutions' },
    { title: 'Strategic networking', desc: 'Join a structured professional network' },
    { title: 'Greater visibility', desc: 'Improve your visibility and commercial opportunities' },
    { title: 'Quality label', desc: 'Benefit from a quality and compliance label' },
    {
      title: 'Resources & expertise',
      desc: 'Access professional resources and training, strengthening competitiveness on the Tunisian and international market',
    },
  ]),

  'actualites.title': 'Latest News',
  'actualites.cta': 'See more',
  'actualites.facebook_note':
    'All our news since Fi2T was founded is on our official Facebook page.',
  'actualites.facebook_cta': 'View on Facebook',
  'actualites.facebook_url': 'https://www.facebook.com/F.i.T.Tunisie/',
  'actualites.items': JSON.stringify([
    {
      slug: 'walid-tritar-president-fi2t',
      title: 'Tourism: Walid Tritar, new President of Fi2T',
      desc: 'Walid Tritar has been elected new President of Fi2T (Interprofessional Federation of Tunisian Tourism) for 2026–2029....',
      date: '11 May 2026',
      img: '/images/act1.jpg',
    },
    {
      slug: 'secteur-sous-pression',
      title: 'Tourism sector: under pressure, but resilient...',
      desc: 'The global tourism sector is going through a challenging phase, with more demanding markets and later booking decisions....',
      date: '22 May 2026',
      img: '/images/act2.jpg',
    },
    {
      slug: 'houssem-azouz-centre-ouest',
      title: 'Houssem Azouz (President of the Interprofessional Federation...',
      desc: 'Houssem Azouz — the Centre-West of the country, marked by the scale of its heritage and its colours...',
      date: '7 April 2026',
      img: '/images/act3.jpg',
    },
  ]),

  'partners.title': 'Partners',
  'partners.items': JSON.stringify([
    { name: 'Ministry of Tourism', logo: '/images/partners/ministere-tourisme.png?v=3', url: 'https://www.tourisme.gov.tn/' },
    { name: 'ONTT', logo: '/images/partners/ontt.png?v=3', url: 'https://www.discovertunisia.com/' },
    { name: 'GIZ', logo: '/images/partners/giz.svg?v=3', url: 'https://www.giz.de/' },
    { name: 'Swiss Contact', logo: '/images/partners/swisscontact.svg?v=3', url: 'https://www.swisscontact.org/' },
    { name: 'USAID', logo: '/images/partners/usaid.svg?v=3', url: 'https://www.usaid.gov/' },
    { name: 'European Union', logo: '/images/partners/ue.svg?v=3', url: 'https://european-union.europa.eu/' },
    { name: 'BIOTED', logo: '/images/partners/bioted.png?v=6', url: 'https://www.eco-conseil.be/le-projet-bioted/' },
    { name: 'Leaders International', logo: '/images/partners/leaders-international.png?v=6', url: 'https://leadersinternational.org/' },
  ]),

  'cta.title': 'Join our vision for the future',
  'cta.body':
    'Become a member of the Federation and take an active part in building\noutstanding Tunisian tourism.',
  'cta.primary': 'Join the federation',
  'cta.secondary': 'Contact the board',
}

export const HOME_AR: Record<string, string> = {
  'hero.title': 'مستقبل السياحة التونسية يُبنى هنا!',
  'hero.subtitle': 'توحيد وابتكار وتعزيز السياحة التونسية',
  'hero.cta_primary': 'اكتشف الفيدرالية',
  'hero.cta_secondary': 'انضم الآن',

  'about.title': 'من نحن؟',
  'about.body':
    'الاتحاد المهني المشترك للسياحة التونسية هو نقابة مهنية لأرباب العمل مستقلة تأسست في مارس 2016 من قبل فاعلين من أنشطة سياحية مختلفة: وكالات أسفار، إقامة بديلة، ترفيه، تنشيط، رياضة، نقل…',
  'about.cta': 'المزيد',
  'about.badge': "10+\nسنوات من الالتزام",

  'objectifs.title': 'أهدافنا',
  'objectifs.intro':
    'تهدف Fi2T إلى جمع مختلف الفاعلين السياحيين ضمن نقابة مهنية واحدة لأرباب العمل، وذلك من أجل:',
  'objectifs.items': JSON.stringify([
    { title: 'رؤية استراتيجية', desc: 'المساهمة برؤية استراتيجية وعملية لتنويع وابتكار السياحة التونسية.' },
    { title: 'مصالح الأعضاء', desc: 'حماية المصالح الاقتصادية والاجتماعية لأعضائها' },
    { title: 'التآزر', desc: 'خلق تآزر بين مختلف الفاعلين في السياحة التونسية' },
    { title: 'التطوير', desc: 'المساهمة في تطوير وازدهار السياحة التونسية' },
    { title: 'التنويع', desc: 'دعم تنويع السياحة التونسية' },
    { title: 'التسويق', desc: 'تعزيز ودعم تسويق تنوع المنتجات السياحية التونسية' },
  ]),

  'groupements.title': 'التجمعات المهنية',
  'groupements.intro': '',
  'groupements.items': JSON.stringify([
    { label: 'وكالات الأسفار', slug: 'agences-de-voyages', icon: '/images/icon1.png?v=5' },
    { label: 'الإقامة البديلة', slug: 'hebergements-alternatifs', icon: '/images/icon2.png?v=5' },
    { label: 'السياحة الثقافية', slug: 'tourisme-culturel', icon: '/images/icon3.png?v=5' },
    { label: 'سياحة الصحة', slug: 'tourisme-de-sante', icon: '/images/icon4.png?v=5' },
    { label: 'سياحة المغامرة', slug: 'tourisme-aventure', icon: '/images/icon5.png?v=5' },
    { label: 'سياحة الأعمال', slug: 'tourisme-affaire', icon: '/images/icon6.png?v=5' },
    { label: 'السياحة البيئية', slug: 'tourisme-ecologique', icon: '/images/icon7.png?v=5' },
    { label: 'السياحة الجوية', slug: 'tourisme-aeronautique', icon: '/images/icon8.png?v=5' },
    { label: 'سياحة السيارات', slug: 'tourisme-automobile', icon: '/images/icon9.png?v=5' },
    { label: 'سياحة الغولف', slug: 'tourisme-sportif', icon: '/images/icon10.png?v=5' },
    { label: 'السياحة البحرية', slug: 'tourisme-nautique', icon: '/images/icon11.png?v=5' },
    { label: 'السياحة تحت الماء', slug: 'tourisme-subaquatique', icon: '/images/icon12.png?v=5' },
  ]),

  'adherer.title': 'لماذا الانضمام إلى Fi2T؟',
  'adherer.badge': "50+\nأعضاء نشطون",
  'adherer.cta': 'انضم الآن',
  'adherer.reasons': JSON.stringify([
    { title: 'التمثيل المؤسسي', desc: 'التمثيل أمام الحكومات والمؤسسات' },
    { title: 'التواصل الاستراتيجي', desc: 'المشاركة في شبكة مهنية منظمة' },
    { title: 'رؤية أكبر', desc: 'تعزيز الظهور والفرص التجارية' },
    { title: 'علامة الجودة', desc: 'الاستفادة من علامة جودة وامتثال' },
    {
      title: 'موارد وخبرة',
      desc: 'الوصول إلى موارد مهنية وتكوينات تعزز التنافسية في السوق التونسي والدولي',
    },
  ]),

  'actualites.title': 'آخر الأخبار',
  'actualites.cta': 'المزيد',
  'actualites.facebook_note':
    'كل أخبارنا منذ تأسيس Fi2T متاحة على صفحتنا الرسمية على فيسبوك.',
  'actualites.facebook_cta': 'عرض على فيسبوك',
  'actualites.facebook_url': 'https://www.facebook.com/F.i.T.Tunisie/',
  'actualites.items': JSON.stringify([
    {
      slug: 'walid-tritar-president-fi2t',
      title: 'السياحة: وليد تريتار، الرئيس الجديد لـ Fi2T',
      desc: 'تم انتخاب وليد تريتار رئيساً جديداً لـ Fi2T للفترة 2026–2029....',
      date: '11 مايو 2026',
      img: '/images/act1.jpg',
    },
    {
      slug: 'secteur-sous-pression',
      title: 'القطاع السياحي: تحت الضغط لكنه صامد...',
      desc: 'يشهد القطاع السياحي العالمي مرحلة صعبة مع أسواق أكثر تطلباً وقرارات سفر متأخرة....',
      date: '22 مايو 2026',
      img: '/images/act2.jpg',
    },
    {
      slug: 'houssem-azouz-centre-ouest',
      title: 'حسام عزوز (رئيس الاتحاد المهني المشترك...',
      desc: 'حسام عزوز — الوسط الغربي للبلاد بما يحمله من آثار وألوان...',
      date: '7 أبريل 2026',
      img: '/images/act3.jpg',
    },
  ]),

  'partners.title': 'الشركاء',
  'partners.items': JSON.stringify([
    { name: 'وزارة السياحة', logo: '/images/partners/ministere-tourisme.png?v=3', url: 'https://www.tourisme.gov.tn/' },
    { name: 'ONTT', logo: '/images/partners/ontt.png?v=3', url: 'https://www.discovertunisia.com/' },
    { name: 'GIZ', logo: '/images/partners/giz.svg?v=3', url: 'https://www.giz.de/' },
    { name: 'Swiss Contact', logo: '/images/partners/swisscontact.svg?v=3', url: 'https://www.swisscontact.org/' },
    { name: 'USAID', logo: '/images/partners/usaid.svg?v=3', url: 'https://www.usaid.gov/' },
    { name: 'الاتحاد الأوروبي', logo: '/images/partners/ue.svg?v=3', url: 'https://european-union.europa.eu/' },
    { name: 'BIOTED', logo: '/images/partners/bioted.png?v=6', url: 'https://www.eco-conseil.be/le-projet-bioted/' },
    { name: 'Leaders International', logo: '/images/partners/leaders-international.png?v=6', url: 'https://leadersinternational.org/' },
  ]),

  'cta.title': 'انضموا إلى رؤيتنا للمستقبل',
  'cta.body': 'كن عضواً في الفيدرالية وشارك بفعالية في بناء\nسياحة تونسية استثنائية.',
  'cta.primary': 'الانضمام إلى الفيدرالية',
  'cta.secondary': 'اتصل بالمكتب',
}
