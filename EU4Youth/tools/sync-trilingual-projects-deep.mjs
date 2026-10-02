/**
 * Deep-sync project KPIs, specificObjectives (string[]), components from trilingual docs.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const storePath = join(root, 'backend', 'data', 'store.json')
const backupPath = join(root, 'backend', 'data', `store.json.bak-trilingual-proj-${Date.now()}`)

copyFileSync(storePath, backupPath)
const store = JSON.parse(readFileSync(storePath, 'utf8'))

function find(slug) {
  const p = store.projects.find((x) => x.slug === slug)
  if (!p) throw new Error(`missing ${slug}`)
  return p
}

function objLines(items) {
  return items.map(({ title, body }) => (body ? `${title} — ${body}` : title))
}

// ---------- JEUN'ESS ----------
{
  const p = find('jeuness')
  p.specificObjectives = {
    fr: objLines([
      { title: 'Faciliter l’accès au financement des initiatives ESS', body: 'Développer des mécanismes financiers adaptés aux besoins des jeunes entrepreneurs sociaux et des organisations ESS.' },
      { title: 'Soutenir la création et la consolidation d’activités économiques à impact social', body: 'Accompagner les initiatives nouvelles et existantes afin de renforcer leur viabilité économique et leur impact territorial.' },
      { title: 'Renforcer l’accès au marché des organisations ESS', body: 'Améliorer la visibilité, la commercialisation et la compétitivité des produits et services issus de l’économie sociale et solidaire.' },
      { title: 'Renforcer le rôle des acteurs territoriaux', body: 'Mobiliser les collectivités locales et les structures publiques afin d’intégrer l’ESS dans les stratégies locales de développement.' },
      { title: 'Favoriser l’engagement des jeunes dans l’ESS', body: 'Sensibiliser et accompagner les jeunes dans la conception d’initiatives collectives répondant aux besoins de leurs communautés.' },
    ]),
    en: objLines([
      { title: 'Facilitate access to finance for SSE initiatives', body: 'Develop financial mechanisms tailored to the needs of young social entrepreneurs and SSE organisations.' },
      { title: 'Support the creation and consolidation of economic activities with social impact', body: 'Accompany new and existing initiatives to strengthen their economic viability and territorial impact.' },
      { title: 'Strengthen market access for SSE organisations', body: 'Improve the visibility, marketing and competitiveness of products and services from the social and solidarity economy.' },
      { title: 'Strengthen the role of territorial actors', body: 'Mobilise local authorities and public structures to integrate SSE into local development strategies.' },
      { title: 'Foster youth engagement in SSE', body: 'Raise awareness and support young people in designing collective initiatives that meet community needs.' },
    ]),
    ar: objLines([
      { title: 'تيسير النفاذ إلى التمويل لمبادرات ESS', body: 'تطوير آليات تمويل ملائمة لاحتياجات رواد الأعمال الاجتماعيين الشباب ومنظمات الاقتصاد الاجتماعي والتضامني.' },
      { title: 'دعم إحداث وتدعيم أنشطة اقتصادية ذات أثر اجتماعي', body: 'مرافقة المبادرات الجديدة والقائمة لتعزيز جدواها الاقتصادية وأثرها الجهوي.' },
      { title: 'تعزيز نفاذ منظمات ESS إلى الأسواق', body: 'تحسين إبراز المنتجات والخدمات الصادرة عن الاقتصاد الاجتماعي والتضامني وتسويقها وقدرتها التنافسية.' },
      { title: 'تعزيز دور الفاعلين الترابيين', body: 'تعبئة الجماعات المحلية والهياكل العمومية لإدماج الاقتصاد الاجتماعي والتضامني في استراتيجيات التنمية المحلية.' },
      { title: 'تشجيع انخراط الشباب في ESS', body: 'تحسيس الشباب ومرافقتهم في تصميم مبادرات جماعية تستجيب لاحتياجات مجتمعاتهم.' },
    ]),
  }
  p.kpis = {
    fr: [
      { value: '304', label: 'projets ESS soutenus' },
      { value: '186', label: 'structures accompagnées' },
      { value: '3 721', label: 'emplois soutenus' },
      { value: '765', label: 'jeunes incubés' },
      { value: '373', label: 'personnes formées à l’accompagnement ESS' },
      { value: '49', label: 'clubs LIMITL’ESS créés' },
      { value: '87', label: 'structures valorisées dans des salons' },
      { value: '140+', label: 'produits ESS référencés' },
    ],
    en: [
      { value: '304', label: 'SSE projects supported' },
      { value: '186', label: 'structures accompanied' },
      { value: '3,721', label: 'jobs supported' },
      { value: '765', label: 'young people incubated' },
      { value: '373', label: 'people trained in SSE support' },
      { value: '49', label: 'LIMITL’ESS clubs created' },
      { value: '87', label: 'structures showcased at fairs' },
      { value: '140+', label: 'SSE products listed' },
    ],
    ar: [
      { value: '304', label: 'مشروع اقتصاد اجتماعي وتضامني مدعوم' },
      { value: '186', label: 'هيكل مرافق' },
      { value: '3 721', label: 'موطن شغل مدعوم' },
      { value: '765', label: 'شاب في الحاضنة' },
      { value: '373', label: 'شخص مكوَّن في مرافقة ESS' },
      { value: '49', label: 'نادي LIMITL’ESS مُحدث' },
      { value: '87', label: 'هيكل مُبرز في معارض' },
      { value: '140+', label: 'منتج ESS مُدرج' },
    ],
  }
  // Keep existing component names/marks; refresh descriptions from doc
  const jeunComp = {
    fr: [
      { name: 'Social Innovation Fund (SIF)', tagline: 'Accompagner les jeunes entrepreneurs sociaux dans la création d’activités durables', description: 'Le Social Innovation Fund soutient les jeunes porteurs de projets à fort impact social à travers un parcours complet d’incubation combinant formation, mentorat, accompagnement individuel et financement. L’objectif est de transformer des idées innovantes en initiatives économiques structurées capables de générer des emplois durables dans les régions prioritaires.', results: [], sectors: ['Agriculture et transformation agroalimentaire', 'Artisanat', 'Tourisme durable et écotourisme', 'Services numériques à impact social', 'Économie circulaire', 'Culture et éducation', 'Environnement', 'Santé et bien-être communautaire'] },
      { name: 'Re-Fund Challenge', tagline: 'Consolider les organisations ESS existantes et préserver l’emploi', description: 'Le Re-Fund Challenge accompagne les structures ESS existantes affectées par la crise de la COVID-19 afin de renforcer leur résilience économique, préserver les emplois et soutenir leur développement. Le dispositif repose sur un parcours combinant diagnostic, accompagnement technique, renforcement des capacités et financement.', results: [], sectors: ['Agriculture et agroalimentaire', 'Artisanat traditionnel', 'Apiculture', 'Tapis et tissage', 'Produits naturels', 'Commerce équitable', 'Services liés à l’autonomie économique des femmes rurales'] },
      { name: 'Market Fund', tagline: 'Développer l’accès au marché des structures ESS', description: 'Le Market Fund accompagne les organisations soutenues par Jeun’ESS dans l’amélioration de leurs performances commerciales et leur accès aux marchés. Il intervient notamment sur le développement des stratégies commerciales, l’amélioration de la visibilité des produits ESS, le référencement, la mise en réseau avec les distributeurs et le développement de solutions de commercialisation physiques et digitales.', results: [], sectors: ['Agroalimentaire', 'Artisanat et design local', 'Cosmétique naturelle', 'Mode éthique', 'Produits écologiques', 'Tourisme responsable', 'Commerce électronique solidaire'] },
      { name: 'LIMITL’ESS Clubs – Enactus', tagline: 'Développer l’entrepreneuriat social auprès des étudiants', description: 'Développé en partenariat avec Enactus Tunisie, le dispositif vise à sensibiliser les étudiants à l’économie sociale et solidaire et à renforcer leurs compétences entrepreneuriales. À travers des formations, des bootcamps, des ateliers pratiques et des compétitions, les étudiants développent des projets collectifs à impact social et environnemental.', results: [], sectors: ['Agriculture et agroalimentaire', 'Technologies et innovation', 'Cosmétique naturelle', 'Économie circulaire', 'Énergie verte', 'Tourisme durable', 'Artisanat et textile', 'Éducation et formation'] },
      { name: 'LIMITL’ESS Génération', tagline: 'Encourager l’innovation sociale dans les espaces jeunesse et culturels', description: 'Les clubs LIMITL’ESS Génération, implantés dans les Maisons de jeunes et les Maisons de culture, permettent aux jeunes de découvrir l’économie sociale et solidaire à travers une approche pratique et participative. Le dispositif combine sensibilisation, ateliers pratiques, accompagnement et développement de projets collectifs. Le parcours se conclut par le Challenge LIMITL’ESS.', results: [], sectors: ['Éducation et orientation', 'Médias et communication', 'Environnement et écologie', 'Arts visuels et design', 'Artisanat local', 'Agriculture et apiculture', 'Innovation sociale locale'] },
      { name: 'Community Fund', tagline: 'Intégrer l’ESS dans les dynamiques territoriales', description: 'Le Community Fund vise à renforcer les capacités des acteurs publics et territoriaux afin d’intégrer l’économie sociale et solidaire dans les politiques locales de développement.', results: [], sectors: [] },
    ],
    en: [
      { name: 'Social Innovation Fund (SIF)', tagline: 'Support young social entrepreneurs in creating sustainable activities', description: 'The Social Innovation Fund supports young people with high-impact social projects through a full incubation pathway combining training, mentoring, individual coaching and funding. The aim is to turn innovative ideas into structured economic initiatives capable of generating lasting jobs in priority regions.', results: [], sectors: ['Agriculture and agri-food processing', 'Crafts', 'Sustainable tourism and ecotourism', 'Digital services with social impact', 'Circular economy', 'Culture and education', 'Environment', 'Community health and wellbeing'] },
      { name: 'Re-Fund Challenge', tagline: 'Consolidate existing SSE organisations and preserve jobs', description: 'The Re-Fund Challenge supports existing SSE structures affected by the COVID-19 crisis to strengthen their economic resilience, preserve jobs and support their development. The mechanism combines diagnosis, technical support, capacity building and funding.', results: [], sectors: ['Agriculture and agri-food', 'Traditional crafts', 'Beekeeping', 'Carpets and weaving', 'Natural products', 'Fair trade', 'Services linked to the economic autonomy of rural women'] },
      { name: 'Market Fund', tagline: 'Develop market access for SSE structures', description: 'The Market Fund helps Jeun’ESS-supported organisations improve their commercial performance and market access — commercial strategies, product visibility, listing, networking with distributors, and physical and digital sales solutions.', results: [], sectors: ['Agri-food', 'Crafts and local design', 'Natural cosmetics', 'Ethical fashion', 'Ecological products', 'Responsible tourism', 'Solidarity e-commerce'] },
      { name: 'LIMITL’ESS Clubs – Enactus', tagline: 'Develop social entrepreneurship among students', description: 'Developed in partnership with Enactus Tunisia, this mechanism raises student awareness of the social and solidarity economy and strengthens entrepreneurial skills through training, bootcamps, practical workshops and competitions.', results: [], sectors: ['Agriculture and agri-food', 'Technology and innovation', 'Natural cosmetics', 'Circular economy', 'Green energy', 'Sustainable tourism', 'Crafts and textiles', 'Education and training'] },
      { name: 'LIMITL’ESS Génération', tagline: 'Encourage social innovation in youth and cultural spaces', description: 'LIMITL’ESS Génération clubs, based in youth centres and culture houses, let young people discover the social and solidarity economy through a practical, participatory approach, culminating in the LIMITL’ESS Challenge.', results: [], sectors: ['Education and guidance', 'Media and communication', 'Environment and ecology', 'Visual arts and design', 'Local crafts', 'Agriculture and beekeeping', 'Local social innovation'] },
      { name: 'Community Fund', tagline: 'Integrate SSE into territorial dynamics', description: 'The Community Fund strengthens the capacities of public and territorial actors to integrate the social and solidarity economy into local development policies.', results: [], sectors: [] },
    ],
    ar: [
      { name: 'Social Innovation Fund (SIF)', tagline: 'مرافقة رواد الأعمال الاجتماعيين الشباب في إحداث أنشطة مستدامة', description: 'يدعم صندوق الابتكار الاجتماعي الشباب أصحاب المشاريع ذات الأثر الاجتماعي القوي عبر مسار احتضان كامل يجمع بين التكوين والإرشاد والمرافقة الفردية والتمويل، بهدف تحويل الأفكار المبتكرة إلى مبادرات اقتصادية مهيكلة قادرة على إحداث مواطن شغل مستدامة في الجهات ذات الأولوية.', results: [], sectors: ['الفلاحة والتحويل الغذائي', 'الصناعات التقليدية', 'السياحة المستدامة والسياحة البيئية', 'الخدمات الرقمية ذات الأثر الاجتماعي', 'الاقتصاد الدائري', 'الثقافة والتعليم', 'البيئة', 'الصحة والرفاه المجتمعي'] },
      { name: 'Re-Fund Challenge', tagline: 'تدعيم منظمات ESS القائمة والحفاظ على مواطن الشغل', description: 'يرافق Re-Fund Challenge هياكل الاقتصاد الاجتماعي والتضامني القائمة المتأثرة بأزمة كوفيد-19 لتعزيز صمودها الاقتصادي والحفاظ على مواطن الشغل ودعم تطورها، عبر تشخيص ومرافقة فنية وتعزيز قدرات وتمويل.', results: [], sectors: ['الفلاحة والصناعات الغذائية', 'الصناعات التقليدية', 'تربية النحل', 'السجاد والنسيج', 'المنتجات الطبيعية', 'التجارة العادلة', 'خدمات مرتبطة بالاستقلالية الاقتصادية للنساء الريفيات'] },
      { name: 'Market Fund', tagline: 'تطوير نفاذ هياكل ESS إلى الأسواق', description: 'يرافق Market Fund المنظمات المدعومة من Jeun’ESS في تحسين أدائها التجاري ونفاذها إلى الأسواق: الاستراتيجيات التجارية، إبراز المنتجات، الإدراج المرجعي، التشبيك مع الموزعين، وحلول التسويق المادية والرقمية.', results: [], sectors: ['الصناعات الغذائية', 'الحرف والتصميم المحلي', 'مستحضرات التجميل الطبيعية', 'الموضة الأخلاقية', 'المنتجات البيئية', 'السياحة المسؤولة', 'التجارة الإلكترونية التضامنية'] },
      { name: 'LIMITL’ESS Clubs – Enactus', tagline: 'تطوير ريادة الأعمال الاجتماعية لدى الطلبة', description: 'بالشراكة مع Enactus تونس، يهدف الجهاز إلى تحسيس الطلبة بالاقتصاد الاجتماعي والتضامني وتعزيز كفاءاتهم الريادية عبر تكوينات وورشات ومسابقات لتطوير مشاريع جماعية ذات أثر اجتماعي وبيئي.', results: [], sectors: ['الفلاحة والصناعات الغذائية', 'التكنولوجيا والابتكار', 'مستحضرات التجميل الطبيعية', 'الاقتصاد الدائري', 'الطاقة الخضراء', 'السياحة المستدامة', 'الحرف والنسيج', 'التعليم والتكوين'] },
      { name: 'LIMITL’ESS Génération', tagline: 'تشجيع الابتكار الاجتماعي في فضاءات الشباب والثقافة', description: 'أندية LIMITL’ESS Génération، المثبتة في دور الشباب ودور الثقافة، تتيح للشباب اكتشاف الاقتصاد الاجتماعي والتضامني عبر مقاربة عملية وتشاركية، وتختتم بـ Challenge LIMITL’ESS.', results: [], sectors: ['التعليم والتوجيه', 'الإعلام والاتصال', 'البيئة والإيكولوجيا', 'الفنون البصرية والتصميم', 'الحرف المحلية', 'الفلاحة وتربية النحل', 'الابتكار الاجتماعي المحلي'] },
      { name: 'Community Fund', tagline: 'إدماج ESS في الديناميكيات الترابية', description: 'يهدف Community Fund إلى تعزيز قدرات الفاعلين العموميين والترابيين لإدماج الاقتصاد الاجتماعي والتضامني في سياسات التنمية المحلية.', results: [], sectors: [] },
    ],
  }
  // Preserve mark fields from existing FR components if any
  const prevFr = Array.isArray(p.components?.fr) ? p.components.fr : Array.isArray(p.components) ? p.components : []
  for (const locale of ['fr', 'en', 'ar']) {
    jeunComp[locale] = jeunComp[locale].map((c, i) => {
      const prev = prevFr[i] || prevFr.find((x) => x.name === c.name)
      return { ...c, mark: prev?.mark || c.mark || '' }
    })
  }
  p.components = jeunComp
  console.log('jeuness deep-synced')
}

// ---------- MAGHROUM'IN ----------
{
  const p = find('maghroumin')
  p.specificObjectives = {
    fr: [
      'Renforcer l’autonomie des jeunes en situation de vulnérabilité dans les domaines du sport et de la culture.',
      'Soutenir et encourager leur engagement durable en faveur du changement dans les domaines du sport et de la culture.',
      'Favoriser leur représentation et veiller à ce qu’ils soient entendu.e.s dans les processus de prise de décision concernant leur vie culturelle et sportive.',
    ],
    en: [
      'Strengthen the autonomy of vulnerable young people in the fields of sport and culture.',
      'Support and encourage their sustained engagement in favour of change in the fields of sport and culture.',
      'Promote their representation and ensure that their voices are heard in decision-making processes concerning their cultural and sporting life.',
    ],
    ar: [
      'تعزيز استقلالية الشباب في وضعية هشاشة في مجالي الرياضة والثقافة.',
      'دعم وتشجيع انخراطهم المستدام في مسار التغيير في مجالي الرياضة والثقافة.',
      'تعزيز تمثيليتهم والحرص على الاستماع إلى آرائهم في مسارات اتخاذ القرار المتعلقة بحياتهم الثقافية والرياضية.',
    ],
  }
  p.kpis = {
    fr: [
      { value: '64', label: 'initiatives associatives appuyées (FESC, FAS, FOCUS)' },
      { value: '72', label: 'projets portés par des jeunes appuyés (PEEJ)' },
      { value: '26', label: 'structures de la jeunesse appuyées' },
      { value: '4', label: 'structures de la culture appuyées' },
    ],
    en: [
      { value: '64', label: 'community initiatives supported (FESC, FAS, FOCUS)' },
      { value: '72', label: 'youth-led projects supported (PEEJ)' },
      { value: '26', label: 'youth facilities supported' },
      { value: '4', label: 'culture facilities supported' },
    ],
    ar: [
      { value: '64', label: 'مبادرة جمعياتية مدعومة (FESC وFAS وFOCUS)' },
      { value: '72', label: 'مشروع يقوده شباب مدعوم (PEEJ)' },
      { value: '26', label: 'هيكل شباب مدعوم' },
      { value: '4', label: 'هيكل ثقافي مدعوم' },
    ],
  }
  p.components = {
    fr: [
      { name: 'Services publics', tagline: 'Offre culturelle et sportive plus attractive et inclusive', description: 'Appui aux initiatives locales et nationales (Programme Services Jeunes, SIX-CARRÉ, Hubs créatifs) et assistance technique aux ministères partenaires (MAC, MJS), avec des échanges entre pairs et des coopérations techniques.', results: ['19 structures publiques de proximité appuyées', '7 maisons de jeunes (SIX-CARRÉ)', '4 structures culturelles pilotes (Hubs créatifs)'], sectors: [] },
      { name: 'Dynamiques communautaires', tagline: 'Engagement des jeunes et appui associatif', description: 'Fonds FESC, FAS et FOCUS pour soutenir projets et structures associatives sportives et culturelles ; Labs d’apprentissage et Maghroum’IN Academy pour renforcer l’autonomie des jeunes et la collaboration entre acteurs.', results: ['64 initiatives associatives appuyées'], sectors: [] },
      { name: 'Inclusion économique', tagline: 'Programme Entrepreneuriat et Emploi des Jeunes (PEEJ)', description: 'Structurer et formaliser l’écosystème économique des filières sport et culture : créer et préserver des emplois, stimuler l’entrepreneuriat et l’innovation via les parcours Incubation et Accélération.', results: ['72 projets portés par des jeunes appuyés'], sectors: ['Sport', 'Culture'] },
    ],
    en: [
      { name: 'Public services', tagline: 'More attractive and inclusive cultural and sports offer', description: 'Support for local and national initiatives (Youth Services Programme, SIX-CARRÉ, Creative Hubs) and technical assistance to partner ministries (MAC, MJS), with peer exchanges and technical cooperation.', results: ['19 local public facilities supported', '7 youth centres (SIX-CARRÉ)', '4 pilot culture facilities (Creative Hubs)'], sectors: [] },
      { name: 'Community dynamics', tagline: 'Youth engagement and associative support', description: 'FESC, FAS and FOCUS funds to support sports and culture associative projects and structures; learning labs and Maghroum’IN Academy to strengthen youth autonomy and collaboration among actors.', results: ['64 community initiatives supported'], sectors: [] },
      { name: 'Economic inclusion', tagline: 'Youth Entrepreneurship and Employment Programme (PEEJ)', description: 'Structure and formalise the economic ecosystem of the sport and culture sectors: create and preserve jobs, stimulate entrepreneurship and innovation through Incubation and Acceleration pathways.', results: ['72 youth-led projects supported'], sectors: ['Sport', 'Culture'] },
    ],
    ar: [
      { name: 'الخدمات العمومية', tagline: 'عرض ثقافي ورياضي أكثر جاذبية وشمولية', description: 'دعم المبادرات المحلية والوطنية (برنامج خدمات الشباب، SIX-CARRÉ، الفضاءات الإبداعية) ومساعدة فنية للوزارات الشريكة، مع تبادل بين الأقران وتعاون فني.', results: ['19 هيكلًا عموميًا للقرب مدعومًا', '7 دور شباب (SIX-CARRÉ)', '4 هياكل ثقافية رائدة'], sectors: [] },
      { name: 'الديناميكيات المجتمعية', tagline: 'انخراط الشباب والدعم الجمعياتي', description: 'صناديق FESC وFAS وFOCUS لدعم مشاريع وهياكل جمعياتية رياضية وثقافية؛ ومختبرات تعلّم وأكاديمية مغرومين لتعزيز استقلالية الشباب والتعاون بين الفاعلين.', results: ['64 مبادرة جمعياتية مدعومة'], sectors: [] },
      { name: 'الإدماج الاقتصادي', tagline: 'برنامج ريادة الأعمال وتشغيل الشباب (PEEJ)', description: 'هيكلة وإضفاء الطابع الرسمي على المنظومة الاقتصادية لقطاعي الرياضة والثقافة: إحداث مواطن شغل والحفاظ عليها، وتحفيز ريادة الأعمال والابتكار عبر مساري الاحتضان والتسريع.', results: ['72 مشروعًا يقوده شباب مدعومًا'], sectors: ['الرياضة', 'الثقافة'] },
    ],
  }
  console.log('maghroumin deep-synced')
}

// ---------- FE3ILA ----------
{
  const p = find('fe3ila')
  p.specificObjectives = {
    fr: objLines([
      { title: 'Participation et prise en compte de la jeunesse au niveau local', body: 'Les jeunes et les problématiques liées à la jeunesse sont inclus dans la conception et la mise en œuvre des initiatives et politiques publiques locales, en cohérence avec la planification municipale, identifiés et mis en œuvre en concertation avec les organisations de la société civile de la commune.' },
      { title: 'Prise en compte de la jeunesse dans les politiques publiques et la gouvernance', body: 'Les jeunes et les problématiques liées à la jeunesse sont inclus dans les politiques nationales et les systèmes de gouvernance régionaux et locaux de mise en œuvre de dites politiques.' },
    ]),
    en: objLines([
      { title: 'Youth participation and inclusion at local level', body: "Young people and youth-related issues are integrated into the design and implementation of local initiatives and public policies, in line with municipal planning processes and developed and implemented in consultation with civil society organisations at municipal level." },
      { title: 'Youth inclusion in public policies and governance', body: 'Young people and youth-related issues are integrated into national policies and into regional and local governance systems responsible for implementing these policies.' },
    ]),
    ar: objLines([
      { title: 'مشاركة الشباب وإدماج قضاياهم على المستوى المحلي', body: 'إدماج الشباب والقضايا المرتبطة بهم في تصميم وتنفيذ المبادرات والسياسات العمومية المحلية، بما ينسجم مع مسارات التخطيط البلدي، وبالتشاور مع منظمات المجتمع المدني على المستوى المحلي.' },
      { title: 'إدماج الشباب في السياسات العمومية والحوكمة', body: 'إدماج الشباب والقضايا المرتبطة بهم في السياسات الوطنية وفي منظومات الحوكمة الجهوية والمحلية المكلفة بتنفيذ هذه السياسات.' },
    ]),
  }
  p.kpis = {
    fr: [
      { value: '24', label: 'gouvernorats couverts' },
      { value: '61', label: 'initiatives associatives soutenues' },
      { value: '113', label: 'micro-projets portés par des jeunes' },
      { value: '11', label: 'projets sportifs accompagnés' },
      { value: '8', label: 'communes accompagnées' },
      { value: '8', label: 'forums des jeunes créés' },
      { value: '8', label: 'plateformes intersectorielles créées' },
      { value: '8', label: 'PDL sensibles à la jeunesse accompagnés' },
      { value: '47', label: 'associations sportives équipées' },
    ],
    en: [
      { value: '24', label: 'governorates covered' },
      { value: '61', label: 'civil society initiatives supported' },
      { value: '113', label: 'youth-led micro-projects supported' },
      { value: '11', label: 'sports projects supported' },
      { value: '8', label: 'municipalities supported' },
      { value: '8', label: 'youth forums established' },
      { value: '8', label: 'cross-sectoral platforms established' },
      { value: '8', label: 'youth-sensitive LDPs supported' },
      { value: '47', label: 'sports associations equipped' },
    ],
    ar: [
      { value: '24', label: 'ولاية مشمولة' },
      { value: '61', label: 'مبادرة جمعياتية مدعومة' },
      { value: '113', label: 'مشروع مصغّر يقوده شباب' },
      { value: '11', label: 'مشروع رياضي مُرافق' },
      { value: '8', label: 'بلدية مُرافقة' },
      { value: '8', label: 'منتدى شباب مُحدث' },
      { value: '8', label: 'منصة متعددة القطاعات مُحدثة' },
      { value: '8', label: 'مخطط تنمية محلية يراعي الشباب' },
      { value: '47', label: 'جمعية رياضية مجهَّزة' },
    ],
  }
  p.components = {
    fr: [
      { name: '1. Participation des jeunes et gouvernance locale', tagline: '', description: 'Appui aux municipalités dans les processus de planification et de programmation locale, avec la participation des jeunes aux processus de décision et la prise en compte de leurs besoins spécifiques. Appui financier et technique à des actions bénéficiant directement aux jeunes ; accompagnement des dispositifs participatifs ; capitalisation auprès des instances décisionnelles.', results: [], sectors: [] },
      { name: '2. Jeunesse dans les politiques publiques nationales', tagline: '', description: 'Renforcement des mécanismes de coordination et de concertation multipartite ; renforcement de la place des jeunes dans les politiques nationales ; appui à l’administration pour renforcer son expertise en matière de jeunesse et d’inclusion des jeunes.', results: [], sectors: [] },
      { name: '3. Mobilisation et renforcement des organisations de la société civile', tagline: '', description: 'Appui financier et technique aux associations mobilisant des jeunes pour leur participation à la vie publique locale ; mise à disposition de matériels et d’équipements sportifs au profit des organisations de la société civile.', results: [], sectors: [] },
      { name: '4. Autonomisation et intégration socio-économique des jeunes', tagline: '', description: 'Soutien à des micro-projets d’insertion socio-économique ; soutien aux jeunes professeurs d’éducation physique et entraîneurs sportifs ; mise en fonctionnement du terrain de mini-foot dans la commune de Smar, à Tataouine.', results: [], sectors: [] },
    ],
    en: [
      { name: '1. Youth participation and local governance', tagline: '', description: 'Supporting municipalities in local planning and programming, promoting young people’s participation in decision-making and ensuring their specific needs are reflected in territorial planning. Financial and technical support for actions benefiting young people; strengthening participatory governance; documenting approaches with decision-makers.', results: [], sectors: [] },
      { name: '2. Youth in national public policies', tagline: '', description: 'Strengthening multi-stakeholder coordination and consultation mechanisms; strengthening the place of young people in national policies; supporting public administrations in building expertise on youth issues and youth inclusion.', results: [], sectors: [] },
      { name: '3. Mobilising and strengthening civil society organisations', tagline: '', description: 'Financial and technical support to associations engaging young people in local public life; providing sports equipment and materials to civil society organisations.', results: [], sectors: [] },
      { name: '4. Youth empowerment and socio-economic inclusion', tagline: '', description: 'Supporting micro-projects promoting socio-economic inclusion; supporting young physical education teachers and sports coaches; supporting the mini-football pitch in Smar, Tataouine.', results: [], sectors: [] },
    ],
    ar: [
      { name: '1. مشاركة الشباب والحوكمة المحلية', tagline: '', description: 'مرافقة البلديات في مسارات التخطيط والبرمجة المحلية، بما يعزز مشاركة الشباب في اتخاذ القرار ويضمن مراعاة احتياجاتهم. دعم مالي وتقني للأنشطة التي تعود بالنفع على الشباب؛ وتعزيز آليات الحوكمة التشاركية؛ وتوثيق المقاربات لدى صناع القرار.', results: [], sectors: [] },
      { name: '2. الشباب في السياسات العمومية الوطنية', tagline: '', description: 'تعزيز آليات التنسيق والتشاور متعددة الأطراف؛ وتعزيز حضور الشباب ضمن السياسات الوطنية؛ ودعم الإدارات العمومية لتعزيز خبراتها في قضايا الشباب وإدماجهم.', results: [], sectors: [] },
      { name: '3. تعبئة وتعزيز قدرات منظمات المجتمع المدني', tagline: '', description: 'تقديم دعم مالي وتقني للجمعيات التي تعمل على تعزيز مشاركة الشباب في الحياة العامة المحلية؛ وتوفير المعدات والتجهيزات الرياضية لفائدة منظمات المجتمع المدني.', results: [], sectors: [] },
      { name: '4. تمكين الشباب وإدماجهم الاقتصادي والاجتماعي', tagline: '', description: 'دعم مشاريع مصغّرة للإدماج الاجتماعي والاقتصادي؛ ودعم أساتذة التربية البدنية والمدربين الرياضيين الشباب؛ وتشغيل ملعب كرة القدم المصغّرة ببلدية سمار بتطاوين.', results: [], sectors: [] },
    ],
  }
  console.log('fe3ila deep-synced')
}

// ---------- GO4YOUTH ----------
{
  const p = find('go4youth')
  p.specificObjectives = {
    fr: objLines([
      { title: 'Améliorer les services de l’ANETI destinés aux chercheurs d’emploi', body: 'Le projet accompagne la refonte de l’offre de services de l’ANETI afin de proposer un accompagnement plus personnalisé, basé sur le profil, les besoins et le parcours de chaque chercheur d’emploi.' },
      { title: 'Renforcer les services de l’ANETI destinés aux entreprises', body: 'GO4Youth soutient le développement d’une approche davantage orientée vers les besoins des entreprises afin d’améliorer la mise en relation entre employeurs et chercheurs d’emploi.' },
      { title: 'Accélérer la transformation digitale de l’ANETI', body: 'Le projet accompagne la digitalisation progressive des services et processus internes afin d’améliorer l’efficacité opérationnelle de l’institution et l’expérience des utilisateurs.' },
      { title: 'Renforcer l’écosystème de l’employabilité', body: 'Professionnaliser les acteurs privés intervenant dans l’accompagnement vers l’emploi et développer des partenariats opérationnels avec l’ANETI.' },
    ]),
    en: objLines([
      { title: 'Improving ANETI services for jobseekers', body: 'The project supports the redesign of ANETI’s service offering in order to provide more personalised support based on the profile, needs and pathway of each jobseeker.' },
      { title: 'Strengthening ANETI services for businesses', body: 'GO4Youth supports the development of an approach that is more responsive to the needs of businesses in order to improve matching between employers and jobseekers.' },
      { title: 'Accelerating ANETI’s digital transformation', body: 'The project supports the gradual digitalisation of services and internal processes in order to improve the institution’s operational efficiency and user experience.' },
      { title: 'Strengthening the employability ecosystem', body: 'Professionalise private actors involved in employment support and develop operational partnerships with ANETI.' },
    ]),
    ar: objLines([
      { title: 'تحسين خدمات ANETI الموجهة للباحثين عن عمل', body: 'يدعم المشروع إعادة تصميم باقة الخدمات التي تقدمها ANETI، بهدف توفير مرافقة أكثر تخصيصًا، تستند إلى ملف كل باحث عن عمل واحتياجاته ومساره.' },
      { title: 'تعزيز خدمات ANETI الموجهة للمؤسسات', body: 'يدعم GO4Youth تطوير مقاربة أكثر استجابة لاحتياجات المؤسسات لتحسين الربط بين المشغّلين والباحثين عن عمل.' },
      { title: 'تسريع التحول الرقمي لـ ANETI', body: 'يرافق المشروع الرقمنة التدريجية للخدمات والإجراءات الداخلية لتحسين الفعالية التشغيلية للمؤسسة وتجربة المستعملين.' },
      { title: 'تعزيز منظومة القابلية للتشغيل', body: 'مهننة الفاعلين الخواص العاملين في المرافقة نحو التشغيل وتطوير شراكات تشغيلية مع ANETI.' },
    ]),
  }
  p.kpis = {
    fr: [
      { value: '3', label: 'nouveaux services créés ou améliorés (sur un objectif de 8)' },
      { value: '6', label: 'BETI où les outils d’accompagnement sont testés' },
      { value: '19', label: 'cahiers des charges pour les services numériques' },
    ],
    en: [
      { value: '3', label: 'new or improved services created (out of a target of 8)' },
      { value: '6', label: 'BETI offices where support tools are tested' },
      { value: '19', label: 'technical specifications for digital services' },
    ],
    ar: [
      { value: '3', label: 'خدمات جديدة أو محسَّنة (من هدف 8)' },
      { value: '6', label: 'مكتب تشغيل اختُبرت فيه أدوات المرافقة' },
      { value: '19', label: 'كراس شروط للخدمات الرقمية' },
    ],
  }
  p.components = {
    fr: [
      { name: '1. Refonte des services aux chercheurs d’emploi', tagline: 'Fournir de nouveaux services adaptés aux profils et besoins', description: 'Élaboration d’une stratégie et d’une feuille de route pour la refonte des services de l’ANETI ; développement d’un système de profilage ; création de boîtes à outils pour les chercheurs d’emploi proches du marché et les personnes en reconversion ; benchmarks internationaux.', results: ['Stratégie et feuille de route validées et adoptées', '3 nouveaux services créés ou améliorés (sur un objectif de 8)', 'Système de profilage opérationnel', 'Outils d’accompagnement testés dans 6 BETI'], sectors: [] },
      { name: '2. Développement des services aux entreprises', tagline: 'Encourager davantage d’entreprises à recruter via l’ANETI', description: 'Diagnostic des besoins des entreprises tunisiennes ; nouvelle stratégie de services aux employeurs ; amélioration des outils de gestion des programmes actifs d’emploi ; analyses sur les besoins en compétences du marché.', results: ['Stratégie et feuille de route pour les services aux entreprises en cours de validation', 'Benchmark international validé', 'Étude sur les besoins des entreprises réalisée', 'Outil digital de gestion des programmes actifs d’emploi développé et testé'], sectors: [] },
      { name: '3. Digitalisation des services et processus de l’ANETI', tagline: 'Augmenter l’efficacité grâce à la transformation digitale', description: 'Définition d’une stratégie digitale institutionnelle ; identification des services prioritaires à digitaliser ; élaboration des cahiers des charges techniques ; accompagnement de l’ANETI dans la mise en œuvre des solutions numériques.', results: ['Stratégie et feuille de route digitales validées', '19 cahiers des charges pour les services numériques développés et en cours de déploiement'], sectors: [] },
    ],
    en: [
      { name: '1. Redesigning services for jobseekers', tagline: 'Provide new services tailored to profiles and needs', description: 'Developing a strategy and roadmap for redesigning ANETI services; jobseeker profiling system; toolkits for jobseekers close to the labour market and people in career transition; international benchmarks.', results: ['Strategy and roadmap validated and adopted', '3 new or improved services created (out of a target of 8)', 'Operational profiling system', 'Support tools tested in 6 BETI'], sectors: [] },
      { name: '2. Developing services for businesses', tagline: 'Encourage more businesses to recruit through ANETI', description: 'Assessing Tunisian business needs; new employer services strategy; improving management tools for active labour market programmes; labour market skills analyses.', results: ['Business services strategy and roadmap under validation', 'International benchmark validated', 'Study on Tunisian business needs completed', 'Digital tool for active labour market programmes developed and tested'], sectors: [] },
      { name: '3. Digitalising ANETI services and processes', tagline: 'Increase efficiency through digital transformation', description: 'Defining an institutional digital strategy; identifying priority services; developing technical specifications; supporting ANETI in implementing digital solutions.', results: ['Digital strategy and roadmap validated', '19 technical specifications for digital services developed and being rolled out'], sectors: [] },
    ],
    ar: [
      { name: '1. إعادة تصميم الخدمات الموجهة للباحثين عن عمل', tagline: 'توفير خدمات جديدة ملائمة للملفات والاحتياجات', description: 'إعداد استراتيجية وخارطة طريق لإعادة تصميم خدمات ANETI؛ تطوير نظام لتحديد ملفات الباحثين عن عمل؛ إنشاء أدوات مرافقة؛ ومقارنات دولية.', results: ['استراتيجية وخارطة طريق مصادق عليهما', '3 خدمات جديدة أو محسَّنة (من هدف 8)', 'نظام تحديد ملفات تشغيلي', 'أدوات مرافقة مختبرة في 6 مكاتب تشغيل'], sectors: [] },
      { name: '2. تطوير الخدمات الموجهة للمؤسسات', tagline: 'تشجيع المزيد من المؤسسات على التشغيل عبر ANETI', description: 'تشخيص احتياجات المؤسسات التونسية؛ استراتيجية جديدة لخدمات المشغّلين؛ تحسين أدوات التصرف في البرامج النشطة للتشغيل؛ وتحليلات حول احتياجات الكفاءات.', results: ['استراتيجية وخارطة طريق لخدمات المؤسسات بصدد المصادقة', 'مقارنة دولية مصادق عليها', 'دراسة حول احتياجات المؤسسات منجزة', 'أداة رقمية للبرامج النشطة مطوَّرة ومختبرة'], sectors: [] },
      { name: '3. رقمنة خدمات وإجراءات ANETI', tagline: 'رفع الفعالية عبر التحول الرقمي', description: 'تعريف استراتيجية رقمية مؤسساتية؛ تحديد الخدمات ذات الأولوية للرقمنة؛ إعداد كراسات الشروط الفنية؛ ومرافقة ANETI في تنفيذ الحلول الرقمية.', results: ['استراتيجية وخارطة طريق رقميتان مصادق عليهما', '19 كراس شروط للخدمات الرقمية بصدد التنفيذ'], sectors: [] },
    ],
  }
  console.log('go4youth deep-synced')
}

// ---------- SWAFY ----------
{
  const p = find('swafy')
  p.specificObjectives = {
    fr: [
      'Renforcer l’employabilité des jeunes chercheurs et chercheuses.',
      'Développer la créativité et l’esprit entrepreneurial des jeunes.',
      'Renforcer la participation des jeunes dans les politiques Science, Technologie et Innovation.',
    ],
    en: [
      'Strengthen the employability of young researchers.',
      'Develop young people’s creativity and entrepreneurial spirit.',
      'Strengthen youth participation in Science, Technology and Innovation policies.',
    ],
    ar: [
      'تعزيز قابلية التشغيل للباحثين والباحثات الشباب.',
      'تطوير الإبداعية والروح الريادية لدى الشباب.',
      'تعزيز مشاركة الشباب في سياسات العلوم والتكنولوجيا والابتكار.',
    ],
  }
  p.kpis = {
    fr: [
      { value: '235', label: 'bourses MOBIDOC doctorales et post-doctorales prévues' },
      { value: '3', label: 'composantes structurantes' },
      { value: '24', label: 'gouvernorats couverts' },
    ],
    en: [
      { value: '235', label: 'MOBIDOC doctoral and post-doctoral grants planned' },
      { value: '3', label: 'structuring components' },
      { value: '24', label: 'governorates covered' },
    ],
    ar: [
      { value: '235', label: 'منحة MOBIDOC للدكتوراه وما بعد الدكتوراه' },
      { value: '3', label: 'مكوّنات هيكلية' },
      { value: '24', label: 'ولاية مشمولة' },
    ],
  }
  p.components = {
    fr: [
      { name: 'MOBIDOC', tagline: 'Bourses de recherche partenariale', description: 'La composante MOBIDOC soutient la mobilité et l’insertion professionnelle des jeunes chercheurs et chercheuses à travers le développement de collaborations entre les structures de recherche et le milieu socio-économique. Elle prévoit le financement de 235 bourses doctorales et postdoctorales pour des travaux de recherche appliquée répondant aux besoins des entreprises, des institutions et des acteurs du développement.', results: ['235 bourses doctorales et postdoctorales'], sectors: [] },
      { name: 'Jeunesse Créative', tagline: 'Culture scientifique, créativité et innovation', description: 'La composante Jeunesse Créative vise à renforcer la culture scientifique auprès des jeunes et à soutenir les acteurs engagés dans la diffusion des sciences, de l’innovation et de la créativité. Elle accompagne les structures publiques, associatives et entrepreneuriales actives dans ce domaine.', results: [], sectors: [] },
      { name: 'Débat Jeunesse et Science', tagline: 'Dialogue entre jeunesse, science et politiques publiques', description: 'La composante Débat Jeunesse et Science crée un espace de dialogue entre les jeunes, les institutions, les chercheurs et les acteurs de l’écosystème scientifique. Elle contribue à une feuille de route Jeunesse-Science et à un congrès national Jeunesse-Science.', results: [], sectors: [] },
    ],
    en: [
      { name: 'MOBIDOC', tagline: 'Partnership research grants', description: 'The MOBIDOC component supports the mobility and professional integration of young researchers through collaborations between research institutions and the socio-economic sector. It provides funding for 235 doctoral and post-doctoral grants for applied research addressing the needs of businesses, institutions and development stakeholders.', results: ['235 doctoral and post-doctoral grants'], sectors: [] },
      { name: 'Jeunesse Créative', tagline: 'Scientific culture, creativity and innovation', description: 'The Jeunesse Créative component strengthens scientific culture among young people and supports stakeholders involved in disseminating science, innovation and creativity across public, civil society and entrepreneurial organisations.', results: [], sectors: [] },
      { name: 'Débat Jeunesse et Science', tagline: 'Dialogue between youth, science and public policy', description: 'The Débat Jeunesse et Science component provides a space for dialogue between young people, institutions, researchers and scientific ecosystem actors. It contributes to a Youth-Science roadmap and a national Youth-Science congress.', results: [], sectors: [] },
    ],
    ar: [
      { name: 'MOBIDOC', tagline: 'منح بحث تشاركي', description: 'تدعم مكوّنة MOBIDOC تنقل الباحثين والباحثات الشباب وإدماجهم المهني عبر تطوير التعاون بين هياكل البحث والوسط الاجتماعي والاقتصادي. وتوفر تمويلاً لـ 235 منحة دكتوراه وما بعد الدكتوراه لأعمال بحث تطبيقية تستجيب لاحتياجات المؤسسات والفاعلين في التنمية.', results: ['235 منحة دكتوراه وما بعد الدكتوراه'], sectors: [] },
      { name: 'Jeunesse Créative', tagline: 'الثقافة العلمية والإبداع والابتكار', description: 'تهدف مكوّنة Jeunesse Créative إلى تعزيز الثقافة العلمية لدى الشباب ودعم الفاعلين المنخرطين في نشر العلوم والابتكار والإبداع، ومرافقة الهياكل العمومية والجمعياتية وريادة الأعمال الناشطة في هذا المجال.', results: [], sectors: [] },
      { name: 'Débat Jeunesse et Science', tagline: 'حوار بين الشباب والعلوم والسياسات العمومية', description: 'تخلق مكوّنة Débat Jeunesse et Science فضاء حوار بين الشباب والمؤسسات والباحثين وفاعلي المنظومة العلمية، وتساهم في خارطة طريق شباب-علوم وفي مؤتمر وطني شباب-علوم.', results: [], sectors: [] },
    ],
  }
  console.log('swafy deep-synced')
}

// ---------- IRADA4YOUTH ----------
{
  const p = find('irada4youth')
  p.specificObjectives = {
    fr: objLines([
      { title: 'Renforcer la contribution du secteur privé à la création de richesses', body: 'Le projet vise à renforcer la contribution du secteur privé à la création de richesses au niveau local et à améliorer la dynamique de développement interne des régions ciblées.' },
      { title: 'Créer des emplois durables et décents', body: 'IRADA4YOUTH contribue à la création d’emplois décents dans les territoires ciblés, notamment à travers l’appui à des projets économiques portés par des jeunes.' },
      { title: 'Améliorer l’employabilité des jeunes', body: 'Le projet vise à améliorer l’employabilité des jeunes de 35 ans et moins, en renforçant leurs capacités et en facilitant leur accès à des opportunités économiques et entrepreneuriales.' },
      { title: 'Promouvoir des initiatives entrepreneuriales innovantes', body: 'IRADA4YOUTH encourage les jeunes à développer de nouvelles idées d’investissement et à créer leurs propres projets, notamment dans des domaines innovants.' },
    ]),
    en: objLines([
      { title: "Strengthening the private sector's contribution to wealth creation", body: 'The project aims to strengthen the contribution of the private sector to local wealth creation and improve internal development dynamics in the target regions.' },
      { title: 'Creating sustainable and decent jobs', body: 'IRADA4YOUTH contributes to the creation of decent jobs in the target territories, particularly through support for economic projects led by young people.' },
      { title: "Improving young people's employability", body: 'The project aims to improve the employability of young people aged 35 and under by strengthening their capacities and facilitating their access to economic and entrepreneurial opportunities.' },
      { title: 'Promoting innovative entrepreneurial initiatives', body: 'IRADA4YOUTH encourages young people to develop new investment ideas and create their own projects, particularly in innovative fields.' },
    ]),
    ar: objLines([
      { title: 'تعزيز مساهمة القطاع الخاص في خلق الثروة', body: 'يهدف المشروع إلى تعزيز مساهمة القطاع الخاص في خلق الثروة على المستوى المحلي وتحسين ديناميكيات التنمية الداخلية في المناطق المستهدفة.' },
      { title: 'إحداث مواطن شغل مستدامة ولائقة', body: 'يساهم IRADA4YOUTH في إحداث مواطن شغل لائقة في المناطق المستهدفة، ولا سيما من خلال دعم المشاريع الاقتصادية التي يقودها الشباب.' },
      { title: 'تحسين قابلية الشباب للتشغيل', body: 'يهدف المشروع إلى تحسين قابلية تشغيل الشباب بعمر 35 سنة فأقل، من خلال تعزيز قدراتهم وتيسير نفاذهم إلى الفرص الاقتصادية وريادة الأعمال.' },
      { title: 'تشجيع المبادرات الريادية المبتكرة', body: 'يشجع IRADA4YOUTH الشباب على تطوير أفكار استثمارية جديدة وإحداث مشاريعهم الخاصة، ولا سيما في مجالات مبتكرة.' },
    ]),
  }
  p.kpis = {
    fr: [
      { value: '6', label: 'gouvernorats ciblés' },
      { value: '50', label: 'projets économiques soutenus' },
      { value: '3', label: 'appels à propositions programmés' },
      { value: '3', label: 'partenaires de développement régional (ODNO, ODCO, ODS)' },
    ],
    en: [
      { value: '6', label: 'governorates targeted' },
      { value: '50', label: 'economic projects supported' },
      { value: '3', label: 'calls for proposals planned' },
      { value: '3', label: 'regional development partners (ODNO, ODCO, ODS)' },
    ],
    ar: [
      { value: '6', label: 'ولايات مستهدفة' },
      { value: '50', label: 'مشروع اقتصادي مدعوم' },
      { value: '3', label: 'دعوات لتقديم مقترحات مبرمجة' },
      { value: '3', label: 'شركاء تنمية جهوية (ODNO وODCO وODS)' },
    ],
  }
  p.components = {
    fr: [
      { name: '1. Valoriser le potentiel économique local', tagline: '', description: 'Le projet s’appuie sur les ressources, les spécificités et les potentialités économiques propres à chaque territoire. Les financements et initiatives soutenus s’inscrivent notamment dans les transitions énergétique, écologique et numérique, la valorisation des ressources naturelles locales, l’accès aux outils numériques, l’innovation et l’entrepreneuriat social.', results: [], sectors: [] },
      { name: '2. Stimuler l’entrepreneuriat des jeunes', tagline: '', description: 'IRADA4YOUTH encourage l’auto-entrepreneuriat et le développement de l’initiative privée chez les jeunes. Le projet accompagne les jeunes dans la transformation de leurs idées en projets concrets et favorise l’émergence d’initiatives entrepreneuriales innovantes dans les territoires ciblés.', results: [], sectors: [] },
      { name: '3. Renforcer l’écosystème régional d’appui', tagline: '', description: 'Le projet accompagne la mise en place et le renforcement d’un écosystème régional performant en faveur des jeunes entrepreneurs, en s’appuyant sur les acteurs locaux et régionaux afin de renforcer leurs capacités et d’améliorer les services proposés.', results: [], sectors: [] },
    ],
    en: [
      { name: '1. Harnessing local economic potential', tagline: '', description: 'The project builds on the resources, specific characteristics and economic potential of each territory. Funding and initiatives focus on the energy, ecological and digital transitions, valorisation of local natural resources, access to digital tools, innovation and social entrepreneurship.', results: [], sectors: [] },
      { name: '2. Stimulating youth entrepreneurship', tagline: '', description: 'IRADA4YOUTH promotes self-employment and private initiative among young people. The project supports young people in turning their ideas into concrete projects and encourages innovative entrepreneurial initiatives in the target territories.', results: [], sectors: [] },
      { name: '3. Strengthening the regional support ecosystem', tagline: '', description: 'The project supports the establishment and strengthening of an effective regional ecosystem for young entrepreneurs, working with local and regional stakeholders to strengthen capacities and improve services.', results: [], sectors: [] },
    ],
    ar: [
      { name: '1. تثمين الإمكانات الاقتصادية المحلية', tagline: '', description: 'يستند المشروع إلى الموارد والخصوصيات والإمكانات الاقتصادية لكل جهة. وتندرج التمويلات والمبادرات المدعومة ضمن التحولات الطاقية والبيئية والرقمية، وتثمين الموارد الطبيعية المحلية، والنفاذ إلى الأدوات الرقمية، والابتكار، وريادة الأعمال الاجتماعية.', results: [], sectors: [] },
      { name: '2. تحفيز ريادة الأعمال لدى الشباب', tagline: '', description: 'يشجع IRADA4YOUTH العمل المستقل وتطوير المبادرة الخاصة لدى الشباب. ويرافق المشروع الشباب في تحويل أفكارهم إلى مشاريع ملموسة ويدعم بروز مبادرات ريادية مبتكرة في المناطق المستهدفة.', results: [], sectors: [] },
      { name: '3. تعزيز المنظومة الجهوية للمرافقة', tagline: '', description: 'يرافق المشروع إرساء وتعزيز منظومة جهوية فعّالة لفائدة الشباب أصحاب المشاريع، بالاستناد إلى الفاعلين المحليين والجهويين لتعزيز قدراتهم وتحسين الخدمات المقدمة.', results: [], sectors: [] },
    ],
  }
  console.log('irada4youth deep-synced')
}

writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8')
console.log('saved', storePath)
console.log('backup', backupPath)
