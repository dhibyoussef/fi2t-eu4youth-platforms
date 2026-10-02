import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

const fichesEn = [
  {
    slug: 'jeuness',
    name: "JEUN'ESS",
    tagline: 'SOCIAL AND SOLIDARITY ECONOMY',
    quote: 'The social and solidarity economy, a lever for decent employment for young Tunisians.',
    summary:
      "Jeun'ESS supports the creation and development of social and solidarity economy enterprises led by young people in seven priority inland governorates. The project mobilises three complementary mechanisms: a resilience fund for existing organisations, a social innovation fund for new initiatives, and a market fund for access to new national and international outlets. SSE clubs are also created within local youth structures to develop a collective entrepreneurial culture.",
    theme: 'jeuness',
    composante: 'Employment, employability and entrepreneurship',
    budget: '',
    partner: 'International Labour Office (ILO)',
    territory: '7 governorates: Jendouba, Le Kef, Kasserine, Sidi Bouzid, Kairouan, Gabès, Médenine',
    period: '2021 – 2027',
  },
  {
    slug: 'go4youth',
    name: 'GO4YOUTH',
    tagline: 'GATES FOR OPPORTUNITIES',
    quote: 'Gateways to employment, modernised and open to all young people, everywhere in Tunisia.',
    summary:
      "Go4Youth transforms the service model of ANETI (National Agency for Employment and Self-Employment), which manages a network of 125 offices across Tunisia. The project deploys new profiling and matching tools, digitises services, and strengthens the private intermediation ecosystem. The goal: that every young jobseeker, whatever their governorate, can access modern, effective services adapted to their profile.",
    theme: 'go4youth',
    composante: 'Employment, employability and entrepreneurship',
    budget: '',
    partner: 'World Bank / ANETI',
    territory: 'National — 125 ANETI offices',
    period: 'August 2021 – June 2027',
  },
  {
    slug: 'swafy',
    name: 'SWAFY',
    tagline: 'SCIENCE WITH AND FOR YOUTH',
    quote: 'Research and the sciences, as pathways to employment and to the future.',
    summary:
      'SWAFY proposes an original model linking science promotion among young people, support for partnership research and valorisation of young researchers’ skills. The project funds 235 doctoral and postdoctoral scholarships in socio-economic settings, creates and supports science clubs in secondary schools, universities and youth centres, and organises a National Youth and Science Dialogue. It also contributes to drafting a national roadmap for science promotion to 2035.',
    theme: 'swafy',
    composante: 'Employment, employability and entrepreneurship',
    budget: '',
    partner: 'National Agency for the Promotion of Research (ANPR)',
    territory: 'National',
    period: '2022 – 2027',
  },
  {
    slug: 'irada4youth',
    name: 'IRADA4YOUTH',
    tagline: 'REGIONAL ECONOMIC SECTORS',
    quote: 'Regional economic sectors as employment levers for young people in the territories.',
    summary:
      'Irada4Youth funds job-creating economic projects in promising sectors identified locally, in six inland governorates. Funding goes through targeted regional calls for proposals. The CGDR and Regional Development Offices play a territorial pivot role — coordination, support for project holders, implementation monitoring — in direct link with field actors.',
    theme: 'irada4youth',
    composante: 'Employment, employability and entrepreneurship',
    budget: '',
    partner: 'CGDR + Regional Development Offices',
    territory: 'Zaghouan · Mahdia · Le Kef · Kairouan · Tozeur · Kébili',
    period: '2022 – 2027',
  },
  {
    slug: 'maghroumin',
    name: "MAGHROUM'IN",
    tagline: 'CULTURE AND SPORT',
    quote: "Maghroum'IN — aspiration, desire, the wish to act.",
    summary:
      "Maghroum'IN is the European Union’s first sectoral intervention in sport in Tunisia, and continues cultural actions begun under the Tfanen programme. The project strengthens the capacities of cultural, artistic and sports operators, improves access for vulnerable young people to creative and sports practices, and develops employability in these sectors. It relies on strong territorial anchoring, in direct link with local authorities and field associations.",
    theme: 'maghroumin',
    composante: 'Culture and sport for youth inclusion',
    budget: '',
    partner: 'EUNIC consortium: AECID (Spain) · FIIAPP (Spain) · British Council (United Kingdom)',
    territory: 'National with reinforced territorial anchoring',
    period: 'January 2022 – 2027',
  },
  {
    slug: 'fe3ila',
    name: 'FE3IL.A',
    tagline: 'HE OR SHE ACTS',
    quote: 'Fe3il.a — with and for young people.',
    summary:
      'Fe3il.a places young people at the heart of local and national public policies. The project supports Tunisian municipalities in developing participatory youth strategies — youth consultations, planning workshops, concertation with civil society. At national level, it supports the Ministry of Youth and Sports in its interministerial coordination work. A one-million-euro call for projects directly supports civil society organisations working with young people.',
    theme: 'fe3ila',
    composante: 'Public policies for youth',
    budget: '€9 million',
    partner: 'CILG-VNG International (Netherlands)',
    territory: 'National — partner municipalities and ministry level',
    period: 'June 2021 – 2026',
  },
]

const fichesAr = [
  {
    slug: 'jeuness',
    name: "JEUN'ESS",
    tagline: 'الاقتصاد الاجتماعي والتضامني',
    quote: 'الاقتصاد الاجتماعي والتضامني رافعة لشغل لائق للشباب التونسي.',
    summary:
      "يدعم Jeun'ESS إنشاء وتطوير مؤسسات الاقتصاد الاجتماعي والتضامني التي يقودها الشباب في سبع ولايات ذات أولوية في الداخل. ويُعبّئ المشروع ثلاث آليات متكاملة: صندوق صمود للمنظمات القائمة، وصندوق ابتكار اجتماعي للمبادرات الجديدة، وصندوق سوق للولوج إلى منافذ وطنية ودولية جديدة. كما تُحدث نوادي اقتصاد اجتماعي وتضامني داخل هياكل الشباب المحلية لتنمية ثقافة مقاولاتية جماعية.",
    theme: 'jeuness',
    composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
    budget: '',
    partner: 'مكتب العمل الدولي (OIT)',
    territory: '7 ولايات: جندوبة، الكاف، القصرين، سيدي بوزيد، القيروان، قابس، مدنين',
    period: '2021 – 2027',
  },
  {
    slug: 'go4youth',
    name: 'GO4YOUTH',
    tagline: 'GATES FOR OPPORTUNITIES',
    quote: 'أبواب ولوج إلى التشغيل، محدَّثة ومفتوحة لكل الشباب، في كل أنحاء تونس.',
    summary:
      'يحوّل Go4Youth نموذج خدمة الوكالة الوطنية للتشغيل والعمل المستقل (ANETI)، التي تدير شبكة من 125 مكتباً على كامل التراب التونسي. وينشر المشروع أدوات جديدة للتشخيص والمطابقة، ويُرقمن الخدمات، ويعزّز منظومة الوساطة الخاصة. والهدف: أن يتمكّن كل طالب شغل شاب، أياً كانت ولايته، من الولوج إلى خدمات حديثة وفعّالة وملائمة لملفه.',
    theme: 'go4youth',
    composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
    budget: '',
    partner: 'البنك الدولي / الوكالة الوطنية للتشغيل',
    territory: 'وطني — 125 مكتب ANETI',
    period: 'أغسطس 2021 – يونيو 2027',
  },
  {
    slug: 'swafy',
    name: 'SWAFY',
    tagline: 'SCIENCE WITH AND FOR YOUTH',
    quote: 'البحث والعلوم مسارات نحو التشغيل ونحو المستقبل.',
    summary:
      'يقترح SWAFY نموذجاً أصيلاً يربط تعزيز العلوم لدى الشباب، ودعم البحث التشاركي، وتثمين كفاءات الباحثين الشباب. ويموّل المشروع 235 منحة دكتوراه وما بعد الدكتوراه في الوسط الاجتماعي والاقتصادي، ويُحدث ويدعم نوادي علمية في المعاهد والجامعات ودور الشباب، وينظّم حواراً وطنياً للشباب والعلم. كما يساهم في إعداد خارطة طريق وطنية لتعزيز العلوم في أفق 2035.',
    theme: 'swafy',
    composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
    budget: '',
    partner: 'الوكالة الوطنية للنهوض بالبحث (ANPR)',
    territory: 'وطني',
    period: '2022 – 2027',
  },
  {
    slug: 'irada4youth',
    name: 'IRADA4YOUTH',
    tagline: 'قطاعات اقتصادية جهوية',
    quote: 'قطاعات اقتصادية جهوية كرافعات تشغيل لشباب الأقاليم.',
    summary:
      'يموّل Irada4Youth مشاريع اقتصادية محدثة للتشغيل في قطاعات واعدة محدّدة محلياً، في ست ولايات داخلية. ويمرّ التمويل عبر نداءات مقترحات جهوية مستهدفة. ويضطلع CGDR ومكاتب التنمية الجهوية بدور محوري ترابي — تنسيق، ومرافقة حاملي المشاريع، ومتابعة التنفيذ — بالارتباط المباشر مع فاعلي الميدان.',
    theme: 'irada4youth',
    composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
    budget: '',
    partner: 'CGDR + مكاتب التنمية الجهوية',
    territory: 'زغوان · المهدية · الكاف · القيروان · توزر · قبلي',
    period: '2022 – 2027',
  },
  {
    slug: 'maghroumin',
    name: "MAGHROUM'IN",
    tagline: 'الثقافة والرياضة',
    quote: "Maghroum'IN — الطموح، والرغبة، والرغبة في الفعل.",
    summary:
      "يُعدّ Maghroum'IN أول تدخل قطاعي للاتحاد الأوروبي في مجال الرياضة في تونس، ويندرج في استمرارية الأعمال الثقافية التي انطلقت في إطار برنامج Tfanen. ويعزّز المشروع قدرات الفاعلين الثقافيين والفنيين والرياضيين، ويحسّن ولوج الشباب في وضعية هشاشة إلى الممارسات الإبداعية والرياضية، ويطوّر القابلية للتشغيل في هذه القطاعات. ويرتكز على ترسّخ ترابي قوي، بالارتباط المباشر مع الجماعات المحلية وجمعيات الميدان.",
    theme: 'maghroumin',
    composante: 'الثقافة والرياضة من أجل إدماج الشباب',
    budget: '',
    partner: 'ائتلاف EUNIC: AECID (إسبانيا) · FIIAPP (إسبانيا) · British Council (المملكة المتحدة)',
    territory: 'وطني مع ترسّخ ترابي معزَّز',
    period: 'يناير 2022 – 2027',
  },
  {
    slug: 'fe3ila',
    name: 'FE3IL.A',
    tagline: 'هو أو هي يفعل',
    quote: 'Fe3il.a — مع الشباب ومن أجلهم.',
    summary:
      'يضع Fe3il.a الشباب في صميم السياسات العمومية المحلية والوطنية. ويرافق المشروع البلديات التونسية في تطوير استراتيجيات شباب تشاركية — استشارات الشباب، وورشات التخطيط، وعمليات تشاور مع المجتمع المدني. وعلى المستوى الوطني، يدعم وزارة الشباب والرياضة في عملها التنسيقي بين الوزارات. ويدعم نداء مشاريع بمليون يورو مباشرة منظمات المجتمع المدني العاملة مع الشباب.',
    theme: 'fe3ila',
    composante: 'سياسات عمومية لفائدة الشباب',
    budget: '9 ملايين يورو',
    partner: 'CILG-VNG International (هولندا)',
    territory: 'وطني — بلديات شريكة ومستوى وزاري',
    period: 'يونيو 2021 – 2026',
  },
]

const structured = {
  'a-propos|projets|fiches': { en: fichesEn, ar: fichesAr },
  'financement|facts|items': {
    en: [
      { value: '60 M€', label: 'OVERALL BUDGET', note: 'Funded by the European Union' },
      { value: '2019–2027', label: 'PERIOD', note: 'Agreement signed in June 2019' },
      { value: '6', label: 'PROJECTS', note: 'Complementary and coordinated' },
      { value: '24', label: 'GOVERNORATES', note: 'A national presence' },
    ],
    ar: [
      { value: '60 M€', label: 'الميزانية الإجمالية', note: 'بتمويل من الاتحاد الأوروبي' },
      { value: '2019–2027', label: 'الفترة', note: 'اتفاقية موقعة في يونيو 2019' },
      { value: '6', label: 'مشاريع', note: 'متكاملة ومنسَّقة' },
      { value: '24', label: 'ولايات', note: 'حضور وطني' },
    ],
  },
  'financement|projects|items': {
    en: [
      {
        slug: 'jeuness',
        acronym: "Jeun'ESS",
        budget: '€9 million',
        composante: 'Employment, employability and entrepreneurship',
        funding: 'Funded by the European Union under EU4Youth',
        partner: 'International Labour Organization (ILO)',
        period: 'September 2019 – August 2024',
        logo: '/img/logo-jeuness.png',
      },
      {
        slug: 'go4youth',
        acronym: 'GO4Youth',
        budget: '€10 million',
        composante: 'Employment, employability and entrepreneurship',
        funding: 'Funded by the European Union under EU4Youth',
        partner: '',
        period: '',
        logo: '/img/logo-go4youth.png',
      },
      {
        slug: 'swafy',
        acronym: 'SWAFY',
        budget: '€9 million',
        composante: 'Employment, employability and entrepreneurship',
        funding: 'Funded by the European Union under EU4Youth',
        partner: '',
        period: '',
        logo: '/img/logo-swafy.png',
      },
      {
        slug: 'irada4youth',
        acronym: 'IRADA4YOUTH',
        budget: '€5 million',
        composante: 'Employment, employability and entrepreneurship',
        funding: 'Grant contract funded 100% by the European Union',
        partner: '',
        period: '',
        logo: '/img/logo-irada4youth.png',
      },
      {
        slug: 'maghroumin',
        acronym: "Maghroum'IN",
        budget: '€15.46 million',
        composante: 'Culture and sport for inclusion',
        funding: 'Funded by the European Union under EU4Youth',
        partner: '',
        period: '',
        logo: '/img/logo-maghroumin.png',
      },
      {
        slug: 'fe3ila',
        acronym: 'Fe3il.a',
        budget: '€9.1 million',
        composante: 'Public policies and youth participation',
        funding: 'European Union, with a contribution from the Kingdom of the Netherlands',
        partner: '',
        period: '',
        logo: '/img/logo-fe3ila.png',
      },
    ],
    ar: [
      {
        slug: 'jeuness',
        acronym: "Jeun'ESS",
        budget: '9 ملايين يورو',
        composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
        funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth',
        partner: 'منظمة العمل الدولية (OIT)',
        period: 'سبتمبر 2019 – أغسطس 2024',
        logo: '/img/logo-jeuness.png',
      },
      {
        slug: 'go4youth',
        acronym: 'GO4Youth',
        budget: '10 ملايين يورو',
        composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
        funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth',
        partner: '',
        period: '',
        logo: '/img/logo-go4youth.png',
      },
      {
        slug: 'swafy',
        acronym: 'SWAFY',
        budget: '9 ملايين يورو',
        composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
        funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth',
        partner: '',
        period: '',
        logo: '/img/logo-swafy.png',
      },
      {
        slug: 'irada4youth',
        acronym: 'IRADA4YOUTH',
        budget: '5 ملايين يورو',
        composante: 'التشغيل والقابلية للتشغيل وريادة الأعمال',
        funding: 'عقد منحة مموَّل بنسبة 100% من الاتحاد الأوروبي',
        partner: '',
        period: '',
        logo: '/img/logo-irada4youth.png',
      },
      {
        slug: 'maghroumin',
        acronym: "Maghroum'IN",
        budget: '15.46 مليون يورو',
        composante: 'الثقافة والرياضة من أجل الإدماج',
        funding: 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth',
        partner: '',
        period: '',
        logo: '/img/logo-maghroumin.png',
      },
      {
        slug: 'fe3ila',
        acronym: 'Fe3il.a',
        budget: '9.1 ملايين يورو',
        composante: 'السياسات العمومية ومشاركة الشباب',
        funding: 'الاتحاد الأوروبي، مع مساهمة مملكة هولندا',
        partner: '',
        period: '',
        logo: '/img/logo-fe3ila.png',
      },
    ],
  },
  'financement|purpose|items': {
    en: [
      {
        title: 'EMPLOYMENT AND ENTREPRENEURSHIP',
        text: 'Funding supports access to decent employment, entrepreneurship, the social and solidarity economy, applied research and promising economic sectors.',
      },
      {
        title: 'CULTURE AND SPORT',
        text: 'It strengthens operators, spaces and initiatives that make culture and sport levers of inclusion, expression and employability.',
      },
      {
        title: 'YOUTH PARTICIPATION',
        text: 'It supports municipalities, institutions and civil society to involve young people sustainably in the public policies that concern them.',
      },
    ],
    ar: [
      {
        title: 'التشغيل وريادة الأعمال',
        text: 'يدعم التمويل الولوج إلى شغل لائق وريادة الأعمال والاقتصاد الاجتماعي والتضامني والبحث التطبيقي والقطاعات الاقتصادية الواعدة.',
      },
      {
        title: 'الثقافة والرياضة',
        text: 'يعزّز الفاعلين والفضاءات والمبادرات التي تجعل الثقافة والرياضة رافعات للإدماج والتعبير والقابلية للتشغيل.',
      },
      {
        title: 'مشاركة الشباب',
        text: 'يرافق البلديات والمؤسسات والمجتمع المدني لإشراك الشباب بشكل مستدام في السياسات العمومية التي تعنيهم.',
      },
    ],
  },
  'financement|structure|items': {
    en: [
      {
        title: 'Framework programme',
        body: 'EU4Youth brings together six distinct projects under a shared vision. The programme sets overall objectives, overall governance and coordination mechanisms.',
      },
      {
        title: 'Financing agreement',
        body: 'Signed in June 2019 between the European Commission and the Tunisian government, it formalises the budget, duration, objectives and implementation conditions. Its duration was extended to 96 months by amendment in December 2021.',
      },
      {
        title: 'Supervision',
        body: 'The Delegation of the European Union in Tunisia provides strategic supervision of the six projects. Tunisian institutions and implementing partners carry operational execution and reporting.',
      },
    ],
    ar: [
      {
        title: 'برنامج إطار',
        body: 'يجمع EU4Youth ستة مشاريع متميزة تحت رؤية مشتركة. ويحدد البرنامج الأهداف العامة والحوكمة الشاملة وآليات التنسيق.',
      },
      {
        title: 'اتفاقية التمويل',
        body: 'وُقّعت في يونيو 2019 بين المفوضية الأوروبية والحكومة التونسية، وهي تُضفي الطابع الرسمي على الميزانية والمدة والأهداف وشروط التنفيذ. ومُدّدت مدتها إلى 96 شهراً بمقتضى ملحق في ديسمبر 2021.',
      },
      {
        title: 'الإشراف',
        body: 'تتولى بعثة الاتحاد الأوروبي في تونس الإشراف الاستراتيجي على المشاريع الستة. وتحمل المؤسسات التونسية وشركاء التنفيذ التنفيذ العملياتي والتقارير.',
      },
    ],
  },
}

writeFileSync(join(root, 'structured-b.json'), JSON.stringify(structured, null, 2))
console.log('Wrote structured-b', Object.keys(structured).length)
