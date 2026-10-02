import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const storePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'backend', 'data', 'store.json')
const store = JSON.parse(readFileSync(storePath, 'utf8'))

const presentations = {
  jeuness: {
    fr: [
      'Jeun’ESS accompagne le développement d’un écosystème ESS structuré, inclusif et durable en Tunisie, capable de générer des opportunités économiques pour les jeunes, en particulier dans les régions prioritaires.',
      'À travers une approche territoriale et participative, Jeun’ESS soutient les jeunes porteurs de projets, les organisations de l’économie sociale et solidaire et les acteurs publics locaux.',
      'Le projet agit sur plusieurs leviers complémentaires : accès au financement, accompagnement technique, accès au marché, engagement des jeunes et ancrage territorial de l’ESS.',
    ],
    en: [
      'Jeun’ESS supports the development of a structured, inclusive and sustainable SSE ecosystem in Tunisia, capable of generating economic opportunities for young people, particularly in priority regions.',
      'Through a territorial and participatory approach, Jeun’ESS supports young project holders, social and solidarity economy organisations and local public actors.',
      'The project works across several complementary levers: access to finance, technical support, market access, youth engagement and the territorial embedding of SSE.',
    ],
    ar: [
      'يساهم مشروع Jeun’ESS في دعم تطوير منظومة منظمة وشاملة ومستدامة للاقتصاد الاجتماعي والتضامني في تونس، قادرة على إحداث فرص اقتصادية للشباب، ولا سيما في الجهات ذات الأولوية.',
      'ومن خلال مقاربة ترابية وتشاركية، يدعم المشروع الشباب أصحاب المشاريع، والمنظمات العاملة في الاقتصاد الاجتماعي والتضامني، والفاعلين العموميين المحليين.',
      'ويعمل المشروع عبر مجموعة من المحاور المتكاملة، تشمل النفاذ إلى التمويل، والمرافقة الفنية، والنفاذ إلى الأسواق، وانخراط الشباب، وترسيخ الاقتصاد الاجتماعي والتضامني في الجهات.',
    ],
  },
  go4youth: {
    fr: [
      'GO4Youth vise à renforcer l’efficacité des services publics et privés d’accompagnement vers l’emploi afin d’offrir aux chercheurs d’emploi, en particulier aux jeunes et aux groupes vulnérables, un accompagnement plus personnalisé, plus accessible et davantage adapté aux évolutions du marché du travail.',
      'Le projet accompagne notamment la réforme stratégique de l’Agence Nationale pour l’Emploi et le Travail Indépendant (ANETI) à travers la mise en œuvre de la Vision ANETI 2030.',
      'GO4Youth contribue ainsi à l’objectif d’EU4Youth visant à améliorer l’inclusion économique et sociale des jeunes à travers le développement de l’employabilité, l’accès à l’emploi décent et le renforcement des services d’intermédiation sur le marché du travail.',
    ],
    en: [
      'GO4Youth aims to enhance the effectiveness of public and private employment support services in order to provide jobseekers, particularly young people and vulnerable groups, with more personalised, accessible support that is better adapted to developments in the labour market.',
      'The project notably supports the strategic reform of the National Employment and Self-Employment Agency (ANETI) through the implementation of the ANETI Vision 2030.',
      'GO4Youth thus contributes to EU4Youth’s objective of improving the economic and social inclusion of young people through the development of employability, access to decent employment and the strengthening of labour market intermediation services.',
    ],
    ar: [
      'يهدف مشروع GO4Youth إلى تعزيز فعالية خدمات المرافقة نحو التشغيل التي يقدمها القطاعان العام والخاص، بما يتيح للباحثين عن عمل، ولا سيما الشباب والفئات الهشة، مرافقة أكثر تخصيصًا، وأكثر سهولة في الوصول، وأكثر ملاءمة للتطورات التي يشهدها سوق العمل.',
      'ويدعم المشروع، على وجه الخصوص، الإصلاح الاستراتيجي للوكالة الوطنية للتشغيل والعمل المستقل (ANETI)، من خلال تنفيذ رؤية ANETI 2030.',
      'وبذلك، يساهم GO4Youth في تحقيق هدف EU4Youth الرامي إلى تعزيز الإدماج الاقتصادي والاجتماعي للشباب من خلال تطوير قابلية التشغيل، وتحسين الوصول إلى العمل اللائق، وتعزيز خدمات الوساطة في سوق العمل.',
    ],
  },
  swafy: {
    fr: [
      'Science With And For Youth (SWAFY) contribue à renforcer la place de la recherche scientifique, de l’innovation et de la créativité dans le développement économique et social en Tunisie, en plaçant les jeunes au cœur des dynamiques scientifiques et technologiques.',
      'Le projet agit à la fois sur l’employabilité des jeunes chercheurs et chercheuses, le développement de l’entrepreneuriat scientifique et le rapprochement entre les établissements de recherche, les acteurs socio-économiques et les besoins de la société.',
      'À travers ses différentes composantes, SWAFY soutient également la diffusion de la culture scientifique, l’accès aux opportunités liées aux sciences et aux technologies dans les différentes régions du pays, ainsi que la participation des jeunes aux réflexions et aux politiques publiques dans les domaines de la science, de la technologie et de l’innovation.',
    ],
    en: [
      'Science With And For Youth (SWAFY) contributes to strengthening the role of scientific research, innovation and creativity in Tunisia’s economic and social development, by placing young people at the heart of scientific and technological dynamics.',
      'The project addresses the employability of young researchers, the development of scientific entrepreneurship, and the strengthening of links between research institutions, socio-economic actors and the needs of society.',
      'Through its different components, SWAFY also supports the dissemination of scientific culture, equitable access to opportunities related to science and technology across Tunisia’s regions, and the participation of young people in discussions and public policies related to science, technology and innovation.',
    ],
    ar: [
      'يساهم مشروع العلم مع الشباب ومن أجلهم (SWAFY) في تعزيز دور البحث العلمي والابتكار والإبداع في التنمية الاقتصادية والاجتماعية في تونس، من خلال وضع الشباب في صميم الديناميكيات العلمية والتكنولوجية.',
      'ويركز المشروع على تعزيز قابلية تشغيل الباحثين والباحثات الشباب، وتطوير ريادة الأعمال العلمية، وتقريب مؤسسات البحث من الفاعلين الاجتماعيين والاقتصاديين واحتياجات المجتمع.',
      'ومن خلال مكوناته المختلفة، يدعم SWAFY كذلك نشر الثقافة العلمية، وتعزيز النفاذ المنصف إلى الفرص المرتبطة بالعلوم والتكنولوجيا في مختلف جهات البلاد، ومشاركة الشباب في النقاشات والسياسات العمومية المتعلقة بالعلوم والتكنولوجيا والابتكار.',
    ],
  },
  irada4youth: {
    fr: [
      'IRADA4YOUTH contribue à un développement économique endogène, durable et inclusif dans des gouvernorats tunisiens prioritaires. En s’appuyant sur la valorisation des ressources et des potentialités économiques locales, le projet vise à stimuler l’entrepreneuriat des jeunes, renforcer leur employabilité et favoriser la création d’emplois durables et décents.',
      'Le projet accompagne également le développement d’un écosystème régional d’appui aux jeunes entrepreneurs et encourage les synergies entre les acteurs publics et privés. Une attention particulière est accordée aux transitions énergétique, écologique et numérique, ainsi qu’à l’innovation et à la valorisation des ressources locales.',
    ],
    en: [
      'IRADA4YOUTH contributes to sustainable and inclusive endogenous economic development in priority regions of Tunisia. By building on local resources and economic potential, the project aims to stimulate youth entrepreneurship, strengthen young people’s employability and promote the creation of sustainable and decent jobs.',
      'The project also supports the development of a strong regional ecosystem for young entrepreneurs and encourages synergies between public and private stakeholders. Particular attention is given to the energy, ecological and digital transitions, as well as to innovation and the valorisation of local resources.',
    ],
    ar: [
      'يساهم مشروع IRADA4YOUTH في تحقيق تنمية اقتصادية محلية ذاتية ومستدامة وشاملة في عدد من المناطق ذات الأولوية في تونس. ومن خلال تثمين الموارد والإمكانات الاقتصادية المحلية، يهدف المشروع إلى دعم ريادة الأعمال لدى الشباب، وتعزيز قابليتهم للتشغيل، والمساهمة في إحداث مواطن شغل مستدامة ولائقة.',
      'كما يدعم المشروع تطوير منظومة جهوية فعّالة لمرافقة الشباب أصحاب المشاريع، ويشجع على تعزيز التكامل بين مختلف الفاعلين من القطاعين العام والخاص. ويولي المشروع اهتمامًا خاصًا بالتحولات الطاقية والبيئية والرقمية، إلى جانب الابتكار وتثمين الموارد المحلية.',
    ],
  },
  maghroumin: {
    fr: [
      "Maghroum'IN est un projet de renforcement de l'inclusion et de la participation des jeunes tunisien.ne.s en situation de vulnérabilité dans la vie publique, à travers la création, la culture et le sport, en prenant en considération les différentes formes d'exclusion auxquelles ces jeunes sont confrontés.",
      "Structuré autour de trois axes d'intervention complémentaires — services publics, dynamiques communautaires et inclusion économique —, Maghroum'IN combine appui institutionnel, fonds de subvention à la société civile et accompagnement à l'entrepreneuriat, afin d'agir simultanément sur l'offre publique, la participation citoyenne et les perspectives économiques des jeunes dans les filières du sport et de la culture.",
    ],
    en: [
      "Maghroum'IN is a project that strengthens the inclusion and participation of vulnerable young Tunisian women and men in public life through creation, culture and sport, taking into account the different forms of exclusion they face.",
      "Structured around three complementary areas of intervention — public services, community dynamics and economic inclusion — Maghroum'IN combines institutional support, civil society grant funds and entrepreneurship support, acting simultaneously on the public offer, civic participation and young people’s economic prospects in the sport and culture sectors.",
    ],
    ar: [
      'مشروع "مغرومين" مشروع يهدف إلى تعزيز إدماج الشباب التونسي في وضعية هشاشة ومشاركتهم في الحياة العامة، من خلال الإبداع والثقافة والرياضة، مع مراعاة مختلف أشكال الإقصاء التي يواجهها هؤلاء الشباب.',
      'يرتكز المشروع، في هيكلته، على ثلاثة محاور متكاملة ويجمع بين الدعم المؤسساتي، وصناديق الدعم الموجهة لمنظمات المجتمع المدني، ومرافقة المبادرات الريادية، بهدف التأثير في آن واحد على جودة الخدمات العمومية والمشاركة المواطنية والآفاق الاقتصادية للشباب في قطاعي الرياضة والثقافة.',
    ],
  },
  fe3ila: {
    fr: [
      'Pour et avec les jeunes dans l’action publique',
      'Fe3il.a vise à renforcer la prise en compte des jeunes et des enjeux liés à la jeunesse dans les politiques publiques, aux niveaux local et national. Le projet accompagne les acteurs publics, les collectivités locales, les organisations de la société civile et les jeunes dans le développement de mécanismes de participation, de concertation et d’action adaptés aux réalités des territoires.',
      'Une attention particulière est accordée à la participation des jeunes en situation de vulnérabilité et/ou de marginalisation, ainsi qu’à leur inclusion dans les dynamiques de développement local et socio-économique.',
    ],
    en: [
      'Public action, for and with young people',
      'Fe3il.a works to strengthen the inclusion of young people and youth-related issues in public policies at both local and national levels. The project supports public institutions, local authorities, civil society organisations and young people in developing participatory, consultative and action-oriented mechanisms that respond to local realities.',
      'Particular attention is given to the participation of young people in vulnerable and/or marginalised situations, and to their inclusion in local and socio-economic development processes.',
    ],
    ar: [
      'من أجل الشباب وبمشاركتهم في العمل العمومي',
      'يهدف مشروع فاعل.ة إلى تعزيز إدماج الشباب والقضايا المرتبطة بهم في السياسات العمومية على المستويين المحلي والوطني. ويرافق المشروع المؤسسات العمومية والجماعات المحلية ومنظمات المجتمع المدني والشباب في تطوير آليات للمشاركة والتشاور والعمل، بما يستجيب لخصوصيات وواقع مختلف المناطق.',
      'ويولي المشروع اهتماماً خاصاً بمشاركة الشباب الذين يعيشون أوضاع هشاشة و/أو تهميش، وبإدماجهم في مسارات التنمية المحلية والاقتصادية والاجتماعية.',
    ],
  },
}

for (const [slug, bag] of Object.entries(presentations)) {
  const p = store.projects.find((x) => x.slug === slug)
  if (!p) throw new Error(`missing ${slug}`)
  p.presentation = bag
  console.log('ok', slug)
}

writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8')
console.log('saved')
