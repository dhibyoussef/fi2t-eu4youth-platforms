/**
 * Continue trilingual pack sync: programme bodies, EU Tunisie themes, project KPIs.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const storePath = join(root, 'backend', 'data', 'store.json')
const backupPath = join(root, 'backend', 'data', `store.json.bak-trilingual-cont-${Date.now()}`)

function setBlock(store, page, section, key, locale, value) {
  let block = store.content.blocks.find(
    (b) => b.page === page && b.section === section && b.key === key && b.locale === locale,
  )
  if (!block) {
    block = {
      id: store.content.nextBlockId++,
      page,
      section,
      key,
      locale,
      type: typeof value === 'string' && value.trim().startsWith('[') ? 'json' : 'text',
      label: key,
      value,
    }
    store.content.blocks.push(block)
  } else {
    block.value = value
  }
}

function setAll(store, page, section, key, values) {
  for (const [locale, value] of Object.entries(values)) setBlock(store, page, section, key, locale, value)
}

copyFileSync(storePath, backupPath)
const store = JSON.parse(readFileSync(storePath, 'utf8'))

// ---------- POURQUOI ----------
setAll(store, 'a-propos', 'pourquoi', 'body', {
  fr: `La Tunisie est un pays jeune. Les moins de 35 ans représentent plus de la moitié de la population. Cette réalité démographique porte en elle une énergie créatrice, une force d'innovation et un désir de contribution que les communautés et le pays tout entier ont intérêt à valoriser.

Les jeunes Tunisiennes et Tunisiens expriment des aspirations fortes en matière d'emploi, de participation, de mobilité, de culture et d'engagement. Leurs initiatives, leurs projets, leurs idées circulent dans les quartiers, les universités, les associations et les communes. Ils représentent une ressource essentielle pour le développement économique, social et territorial.

Pourtant, tous n'ont pas accès aux mêmes possibilités. Les territoires connaissent des dynamiques diverses : là où une région dispose d'un bassin d'emploi dense et d'infrastructures accessibles, une région peut présenter un éloignement des centres de formation, un accès limité aux marchés ou d'une moindre présence d'espaces culturels et sportifs. Ces disparités sont réelles et se vivent différemment selon que l'on grandit à Tunis ou à Kébili, à Sfax ou à Jendouba.

Sur le marché du travail, les transitions entre la formation et l'emploi restent un défi pour de nombreux jeunes, en particulier pour celles et ceux qui portent plusieurs facteurs de vulnérabilité cumulés : chômage, précarité, distance géographique, écart entre compétences et besoins des employeurs. Les jeunes femmes, les habitants des zones rurales, les porteurs de handicap font face à des obstacles spécifiques qui demandent des réponses adaptées.

En matière de culture, de sport et de participation civique, les opportunités existent; les maisons de la culture, les clubs sportifs, les associations, les structures communales sont autant de lieux d'apprentissage, de rencontre et d'expression. Mais ces espaces ont besoin d'être renforcés, accessibles à tous, en lien avec les communes et les acteurs de terrain.

C'est dans cette réalité complexe, vivante et riche de potentiels que s'inscrit EU4Youth comme un investissement dans les capacités de toute une jeunesse et dans les territoires qui la portent.`,
  en: `Tunisia is a young country. People under 35 make up more than half of the population. This demographic reality carries with it a creative energy, a drive for innovation and a will to contribute that communities — and the country as a whole — have every reason to draw on.

Young Tunisian women and men express strong aspirations around employment, participation, mobility, culture and engagement. Their initiatives, projects and ideas circulate through neighbourhoods, universities, associations and municipalities. They are a vital resource for economic, social and local development.

Yet not everyone has access to the same opportunities. Conditions vary widely across the country: while one region may have a dense job market and accessible infrastructure, another may be far from training centres, have limited access to markets, or fewer cultural and sports facilities. These disparities are real, and they are experienced differently depending on whether one grows up in Tunis or Kébili, Sfax or Jendouba.

In the labour market, the transition from training to employment remains a challenge for many young people — particularly those facing several compounding vulnerabilities: unemployment, precarity, geographic distance, and a mismatch between skills and employer needs. Young women, residents of rural areas, and young people with disabilities face specific barriers that call for tailored responses.

In culture, sport and civic participation, opportunities do exist: cultural centres (maisons de la culture), sports clubs, associations and municipal structures are all places to learn, meet and express oneself. But these spaces need to be strengthened and made accessible to everyone, working hand in hand with municipalities and local actors.

It is in this complex, living reality — full of potential — that EU4Youth positions itself as an investment in the capacities of an entire generation, and in the places where they build their lives.`,
  ar: `تونس بلد فتيّ؛ إذ يمثل من هم دون سن 35 سنة أكثر من نصف عدد السكان. ويحمل هذا الواقع الديمغرافي طاقة إبداعية وقدرة على الابتكار ورغبة في الإسهام، من مصلحة المجتمعات المحلية والبلاد ككل استثمارها.

يُعبّر الشباب التونسي، ذكورًا وإناثًا، عن تطلعات قوية في مجالات التشغيل والمشاركة والتنقل والثقافة والانخراط. وتتنقل مبادراتهم ومشاريعهم وأفكارهم بين الأحياء والجامعات والجمعيات والبلديات. وهم يمثلون موردًا أساسيًا للتنمية الاقتصادية والاجتماعية والمحلية.

غير أن الفرص ليست متكافئة بين الجميع. فالجهات تعرف ديناميكيات متفاوتة: ففي حين تتوفر لجهة ما سوق شغل نشيطة وبنية تحتية ميسّرة، قد تعاني جهة أخرى من بُعد مراكز التكوين ومحدودية النفاذ إلى الأسواق وقلة الفضاءات الثقافية والرياضية. وهذه الفوارق حقيقية، ويختلف الإحساس بها بين من ينشأ في تونس العاصمة أو قبلي، وبين صفاقس وجندوبة.

وفي سوق الشغل، لا يزال الانتقال من التكوين إلى التشغيل يمثل تحديًا للعديد من الشباب، وخاصة من يجمعون بين عدة عوامل هشاشة: البطالة، الهشاشة الاجتماعية، البُعد الجغرافي، والفجوة بين الكفاءات المتوفرة واحتياجات أرباب العمل. وتواجه الشابات، وسكان المناطق الريفية، والشباب في وضعية إعاقة عوائق خاصة تستدعي استجابات ملائمة.

وفي مجالات الثقافة والرياضة والمشاركة المواطنية، توجد فرص فعلية؛ فدور الثقافة والأندية الرياضية والجمعيات والهياكل البلدية تشكل فضاءات للتعلّم واللقاء والتعبير. غير أن هذه الفضاءات بحاجة إلى تعزيز وإلى أن تصبح في متناول الجميع، بالتنسيق مع البلديات والفاعلين الميدانيين.

وفي خضم هذا الواقع المركّب والحيّ والغني بالإمكانات، يندرج EU4Youth كاستثمار في قدرات جيل بأكمله وفي الجهات التي تحتضنه.`,
})

// ---------- VISION ----------
setAll(store, 'a-propos', 'vision', 'title', {
  fr: 'VISION',
  en: 'VISION',
  ar: 'الرؤية',
})
setAll(store, 'a-propos', 'vision', 'lead', {
  fr: 'EU4Youth part d’une conviction fondamentale : les jeunes Tunisiennes et Tunisiens sont des acteurs à part entière du changement.',
  en: 'EU4Youth starts from a core conviction: young Tunisian women and men are agents of change in their own right.',
  ar: 'ينطلق EU4Youth من قناعة أساسية: الشابات والشبان التونسيون فاعلون كاملو الأهلية في التغيير.',
})
setAll(store, 'a-propos', 'vision', 'body', {
  fr: "Le programme se construit sur une logique d'investissement dans les capacités, dans les opportunités et dans les conditions d'autonomisation et d’intégration socioéconomique dans tous les territoires du pays.\n\nCette vision se décline en sept principes transversaux qui guident l'ensemble des projets :",
  en: 'The programme is built on investing in capacities, in opportunities, and in the conditions for empowerment and socio-economic integration across every part of the country.\n\nThis vision translates into seven cross-cutting principles that guide all the projects:',
  ar: 'ويقوم البرنامج على منطق الاستثمار في القدرات، وفي الفرص، وفي شروط التمكين والإدماج الاقتصادي والاجتماعي في كل جهات البلاد.\n\nوتترجم هذه الرؤية إلى سبعة مبادئ أفقية توجّه جميع المشاريع:',
})
setAll(store, 'a-propos', 'vision', 'principles', {
  fr: JSON.stringify([
    { text: 'Créer des opportunités réelles de développement personnel et professionnel pour les jeunes, là où ils vivent.' },
    { text: 'Prioriser celles et ceux qui font face aux obstacles les plus importants : éloignement géographique, précarité, chômage, discrimination.' },
    { text: 'Associer les jeunes à la conception et à la mise en oeuvre des activités qui les concernent pas seulement comme bénéficiaires, mais comme acteurs.' },
    { text: 'Ancrer les interventions dans les territoires, au niveau des communes, des gouvernorats et des écosystèmes locaux.' },
    { text: 'Construire des mécanismes durables de représentation et de participation des jeunes dans la vie citoyenne et l’action publique.' },
    { text: 'Capitaliser sur les expériences passées et les dynamiques déjà engagées, pour construire sur ce qui fonctionne.' },
    { text: 'Coordonner les six projets entre eux et avec les autres programmes européens en Tunisie pour produire un impact cohérent et démultiplié.' },
  ]),
  en: JSON.stringify([
    { text: 'Create real opportunities for personal and professional development for young people, where they live.' },
    { text: 'Prioritise those facing the greatest barriers: geographic distance, precarity, unemployment, discrimination.' },
    { text: 'Involve young people in designing and implementing the activities that concern them not only as beneficiaries, but as actors.' },
    { text: 'Root interventions in local realities, at the level of municipalities, governorates and local ecosystems.' },
    { text: 'Build lasting mechanisms for youth representation and participation in civic life and public action.' },
    { text: 'Build on past experience and existing momentum, drawing on what already works.' },
    { text: 'Coordinate the six projects with one another, and with other European programmes in Tunisia, for a coherent and amplified impact.' },
  ]),
  ar: JSON.stringify([
    { text: 'إتاحة فرص حقيقية للتنمية الشخصية والمهنية للشباب، في أماكن إقامتهم.' },
    { text: 'إعطاء الأولوية لمن يواجهون أكبر العوائق: البُعد الجغرافي، الهشاشة، البطالة، التمييز.' },
    { text: 'إشراك الشباب في تصميم وتنفيذ الأنشطة التي تعنيهم، لا كمستفيدين فقط بل كفاعلين.' },
    { text: 'ترسيخ التدخلات في الجهات، على مستوى البلديات والولايات والمنظومات المحلية.' },
    { text: 'بناء آليات مستدامة لتمثيل الشباب ومشاركتهم في الحياة المواطنية والشأن العام.' },
    { text: 'الاستثمار في التجارب السابقة والديناميكيات القائمة، والبناء على ما أثبت نجاعته.' },
    { text: 'التنسيق بين المشاريع الستة فيما بينها ومع البرامج الأوروبية الأخرى في تونس، لتحقيق أثر متماسك ومضاعف.' },
  ]),
})
setAll(store, 'a-propos', 'vision', 'closing', {
  fr: "À ces principes s'ajoutent des engagements transversaux partagés par tous les projets : intégration systématique de la dimension genre, attention aux besoins spécifiques des jeunes femmes, des jeunes porteurs de handicap et des jeunes des zones rurales ou enclavées ainsi que la dimension environnement et durabilité.\n\nEU4Youth accompagne les aspirations des jeunes Tunisiennes et Tunisiens en renforçant les opportunités, les partenariats et les initiatives qui contribuent au développement des territoires.",
  en: 'These principles are underpinned by commitments shared across all projects: the systematic integration of a gender dimension; attention to the specific needs of young women, young people with disabilities, and young people in rural or remote areas; and a focus on environment and sustainability.\n\nEU4Youth supports the aspirations of young Tunisian women and men by strengthening the opportunities, partnerships and initiatives that contribute to the development of their communities.',
  ar: 'وتضاف إلى هذه المبادئ التزامات أفقية مشتركة بين جميع المشاريع: الإدماج المنهجي لبُعد النوع الاجتماعي، والاهتمام بالاحتياجات الخاصة للشابات والشباب في وضعية إعاقة وشباب المناطق الريفية أو النائية، إضافة إلى بُعد البيئة والاستدامة.\n\nيرافق EU4Youth تطلعات الشباب التونسي من خلال تعزيز الفرص والشراكات والمبادرات التي تسهم في تنمية جهاتهم.',
})

// ---------- OBJECTIFS (a-propos + objectifs page) ----------
const objectifsItems = {
  fr: [
    {
      kicker: '',
      title: 'OBJECTIF\nGÉNÉRAL',
      body: "Contribuer à l'amélioration de l'inclusion économique, sociale et citoyenne des jeunes Tunisiennes et Tunisiens, à travers une approche ancrée dans les territoires et dans les dynamiques locales.",
    },
    {
      kicker: 'OS1',
      title: 'EMPLOI, EMPLOYABILITÉ\nET ENTREPRENEURIAT',
      body: "Renforcer l'accès des jeunes à des emplois décents, développer leurs compétences et leurs capacités entrepreneuriales, soutenir les filières économiques porteuses dans les régions ciblées.\n\nCela passe par le soutien à l'économie sociale et solidaire, la modernisation des services publics d'intermédiation sur le marché du travail, l'appui à la recherche et à la créativité des jeunes chercheurs, et le financement de projets économiques dans des filières identifiées localement.",
    },
    {
      kicker: 'OS2',
      title: 'CULTURE ET SPORT\nPOUR L’INCLUSION',
      body: "Renforcer l'inclusion et la participation des jeunes à travers l'accès à la culture et au sport, en renforçant les capacités des opérateurs culturels et sportifs, en améliorant les espaces de pratique et en développant l'employabilité dans ces secteurs.\n\nLa culture et le sport ne sont pas des accessoires dans la vie d'un jeune; ils en sont des conditions fondamentales d'épanouissement, de confiance en soi et d'appartenance sociale.",
    },
    {
      kicker: 'OS3',
      title: 'POLITIQUES PUBLIQUES\nET PARTICIPATION',
      body: "Renforcer la place des jeunes dans la conception et la mise en œuvre des politiques publiques, au niveau local comme au niveau national.\n\nLes politiques en faveur de la jeunesse ne peuvent être efficaces que si les jeunes eux-mêmes y participent. EU4Youth travaille avec les communes tunisiennes et le Ministère de la Jeunesse et des Sports pour créer des espaces réels de consultation, de représentation et de participation.",
    },
  ],
  en: [
    {
      kicker: '',
      title: 'OVERALL\nOBJECTIVE',
      body: 'To contribute to improving the economic, social and civic inclusion of young Tunisian women and men, through an approach rooted in local realities and dynamics.',
    },
    {
      kicker: 'SO1',
      title: 'EMPLOYMENT, EMPLOYABILITY\nAND ENTREPRENEURSHIP',
      body: "Improve young people's access to decent jobs, build their skills and entrepreneurial capacities, and support promising economic sectors in targeted regions.\n\nThis includes support for the social and solidarity economy, the modernisation of public labour-market intermediation services, support for research and creativity among young researchers, and financing for economic projects in locally identified sectors.",
    },
    {
      kicker: 'SO2',
      title: 'CULTURE AND SPORT\nFOR INCLUSION',
      body: "Strengthen young people's inclusion and participation through access to culture and sport, by building the capacities of cultural and sports operators, improving practice spaces, and developing employability in these sectors.\n\nCulture and sport are not incidental to a young person's life — they are fundamental to personal fulfilment, self-confidence and a sense of belonging.",
    },
    {
      kicker: 'SO3',
      title: 'PUBLIC POLICY\nAND YOUTH PARTICIPATION',
      body: "Strengthen young people's role in designing and implementing public policy, at both local and national level.\n\nYouth policies can only be effective if young people themselves take part in shaping them. EU4Youth works with Tunisian municipalities and the Ministry of Youth and Sports to create genuine spaces for consultation, representation and participation.",
    },
  ],
  ar: [
    {
      kicker: '',
      title: 'الهدف\nالعام',
      body: 'الإسهام في تحسين الإدماج الاقتصادي والاجتماعي والمواطني للشابات والشبان التونسيين، من خلال مقاربة مترسّخة في واقع الجهات وديناميكياتها.',
    },
    {
      kicker: 'هـخ 1',
      title: 'التشغيل والقابلية للتشغيل\nوريادة الأعمال',
      body: 'تعزيز فرص نفاذ الشباب إلى الشغل اللائق، وتطوير كفاءاتهم وقدراتهم على ريادة الأعمال، ودعم القطاعات الاقتصادية الواعدة في الجهات المستهدفة.\n\nويمر ذلك عبر دعم الاقتصاد الاجتماعي والتضامني، وتحديث خدمات الوساطة العمومية في سوق الشغل، ودعم البحث العلمي وإبداعية الباحثين الشباب، وتمويل مشاريع اقتصادية في قطاعات محدَّدة محليًا.',
    },
    {
      kicker: 'هـخ 2',
      title: 'الثقافة والرياضة\nمن أجل الإدماج',
      body: 'تعزيز إدماج الشباب ومشاركتهم عبر النفاذ إلى الثقافة والرياضة، من خلال تعزيز قدرات الفاعلين الثقافيين والرياضيين، وتحسين فضاءات الممارسة، وتطوير القابلية للتشغيل في هذين القطاعين.\n\nفالثقافة والرياضة ليستا كماليتين في حياة الشاب؛ بل هما شرطان أساسيان للتفتح والثقة بالنفس والانتماء الاجتماعي.',
    },
    {
      kicker: 'هـخ 3',
      title: 'السياسات العمومية\nومشاركة الشباب',
      body: 'تعزيز حضور الشباب في تصميم السياسات العمومية وتنفيذها، على المستويين المحلي والوطني.\n\nفالسياسات الموجّهة للشباب لا يمكن أن تكون فاعلة إلا بمشاركة الشباب أنفسهم فيها. ويعمل EU4Youth مع البلديات التونسية ووزارة الشباب والرياضة على إحداث فضاءات فعلية للتشاور والتمثيل والمشاركة.',
    },
  ],
}
for (const locale of ['fr', 'en', 'ar']) {
  setBlock(store, 'a-propos', 'objectifs', 'items', locale, JSON.stringify(objectifsItems[locale]))
  setBlock(store, 'objectifs', 'objectives', 'items', locale, JSON.stringify(objectifsItems[locale]))
}
setAll(store, 'a-propos', 'objectifs', 'title', {
  fr: 'OBJECTIFS DU PROGRAMME',
  en: 'PROGRAMME OBJECTIVES',
  ar: 'أهداف البرنامج',
})
setAll(store, 'objectifs', 'objectives', 'title', {
  fr: 'OBJECTIFS DU PROGRAMME',
  en: 'PROGRAMME OBJECTIVES',
  ar: 'أهداف البرنامج',
})

// objectifs hero mirrors vision
setAll(store, 'objectifs', 'hero', 'badge', {
  fr: 'OBJECTIFS',
  en: 'OBJECTIVES',
  ar: 'الأهداف',
})
setAll(store, 'objectifs', 'hero', 'title', {
  fr: 'UNE VISION\nPARTAGÉE',
  en: 'A SHARED\nVISION',
  ar: 'رؤية\nمشتركة',
})
setAll(store, 'objectifs', 'hero', 'vision', {
  fr: 'EU4Youth part d’une conviction fondamentale : les jeunes Tunisiennes et Tunisiens sont des acteurs à part entière du changement.',
  en: 'EU4Youth starts from a core conviction: young Tunisian women and men are agents of change in their own right.',
  ar: 'ينطلق EU4Youth من قناعة أساسية: الشابات والشبان التونسيون فاعلون كاملو الأهلية في التغيير.',
})
setAll(store, 'objectifs', 'hero', 'visionBody', {
  fr: "Le programme se construit sur une logique d'investissement dans les capacités, dans les opportunités et dans les conditions d'autonomisation et d’intégration socioéconomique dans tous les territoires du pays.",
  en: 'The programme is built on investing in capacities, in opportunities, and in the conditions for empowerment and socio-economic integration across every part of the country.',
  ar: 'ويقوم البرنامج على منطق الاستثمار في القدرات، وفي الفرص، وفي شروط التمكين والإدماج الاقتصادي والاجتماعي في كل جهات البلاد.',
})
setAll(store, 'objectifs', 'hero', 'principles', {
  fr: store.content.blocks.find((b) => b.page === 'a-propos' && b.section === 'vision' && b.key === 'principles' && b.locale === 'fr').value,
  en: store.content.blocks.find((b) => b.page === 'a-propos' && b.section === 'vision' && b.key === 'principles' && b.locale === 'en').value,
  ar: store.content.blocks.find((b) => b.page === 'a-propos' && b.section === 'vision' && b.key === 'principles' && b.locale === 'ar').value,
})
setAll(store, 'objectifs', 'hero', 'closing', {
  fr: store.content.blocks.find((b) => b.page === 'a-propos' && b.section === 'vision' && b.key === 'closing' && b.locale === 'fr').value,
  en: store.content.blocks.find((b) => b.page === 'a-propos' && b.section === 'vision' && b.key === 'closing' && b.locale === 'en').value,
  ar: store.content.blocks.find((b) => b.page === 'a-propos' && b.section === 'vision' && b.key === 'closing' && b.locale === 'ar').value,
})

// ---------- TERRITOIRES ----------
setAll(store, 'a-propos', 'territoires', 'title', {
  fr: 'UNE ACTION AU PLUS PRÈS DES JEUNES',
  en: 'ACTION CLOSE TO YOUNG PEOPLE',
  ar: 'عمل قريب من الشباب',
})
setAll(store, 'a-propos', 'territoires', 'body', {
  fr: `De Bizerte à Ben Guerdane, de Jendouba à Tataouine, EU4Youth accompagne les jeunes Tunisiennes et Tunisiens dans les 24 gouvernorats du pays, à travers six projets et avec la mobilisation de partenaires aux niveaux national, régional et local.

Cette présence dans les territoires permet d’adapter les formes d’appui aux réalités et aux priorités de chaque contexte. Elle s’appuie sur les stratégies et priorités nationales de développement et de jeunesse, les mécanismes de consultation et de participation des jeunes, ainsi que sur le dialogue avec les institutions et les acteurs engagés dans les territoires.

Selon les contextes et les objectifs de chaque projet, cet appui peut prendre différentes formes : accompagnement des initiatives portées par les jeunes, renforcement des capacités des acteurs et structures qui les accompagnent, soutien à leur participation, développement d’opportunités, mise en réseau ou encore appui aux dynamiques locales.

La diversité des partenaires mobilisés contribue à créer des passerelles entre les différents niveaux d’intervention. Institutions nationales, structures régionales, collectivités locales, organisations de la société civile, acteurs de la jeunesse et partenaires du développement contribuent, chacun dans leur champ, à la mise en œuvre des actions et à leur ancrage dans les territoires.

Les six projets du programme combinent ainsi des interventions ciblées dans certains gouvernorats et des actions à portée nationale, avec une complémentarité entre leurs approches.

Cette diversité d’intervention permet à EU4Youth de faire dialoguer les expériences issues des différents territoires et de favoriser la circulation des pratiques, des initiatives et des opportunités entre les jeunes et les acteurs qui les accompagnent.

Une action nationale, des réalités territoriales différentes, un même objectif : renforcer les possibilités offertes aux jeunes Tunisiennes et Tunisiens.`,
  en: `From Bizerte to Ben Guerdane, from Jendouba to Tataouine, EU4Youth supports young Tunisian women and men across all 24 governorates, through six projects and with partners mobilised at national, regional and local level.

This presence on the ground allows support to be adapted to the realities and priorities of each context. It draws on national development and youth strategies and priorities, on mechanisms for youth consultation and participation, and on dialogue with institutions and actors engaged in local territories.

Depending on the context and the objectives of each project, this support can take different forms: accompanying youth-led initiatives, building the capacities of the actors and structures that support them, backing their participation, developing opportunities, building networks, or supporting local dynamics.

The range of partners mobilised helps build bridges between different levels of intervention. National institutions, regional structures, local authorities, civil society organisations, youth actors and development partners each contribute, within their own field, to implementing actions and rooting them in local territories.

The six projects combine targeted interventions in specific governorates with nationwide actions, with complementary approaches across the board.

This diversity of intervention allows EU4Youth to bring together experiences from different territories, and to encourage the circulation of practices, initiatives and opportunities among young people and the actors who support them.

One national effort, different local realities, a shared goal: expanding the opportunities open to young Tunisian women and men.`,
  ar: `من بنزرت إلى بن قردان، ومن جندوبة إلى تطاوين، يرافق EU4Youth الشابات والشبان التونسيين في الولايات الـ24 جميعها، عبر ستة مشاريع وبتعبئة شركاء على المستويات الوطنية والجهوية والمحلية.

ويتيح هذا الحضور الميداني تكييف أشكال الدعم مع واقع وأولويات كل سياق. ويستند هذا العمل إلى الاستراتيجيات والأولويات الوطنية للتنمية والشباب، وإلى آليات تشاور الشباب ومشاركتهم، وكذلك إلى الحوار مع المؤسسات والفاعلين الناشطين في الجهات.

وبحسب السياقات وأهداف كل مشروع، يمكن أن يتخذ هذا الدعم أشكالًا مختلفة: مرافقة المبادرات التي يقودها الشباب، تعزيز قدرات الفاعلين والهياكل التي ترافقهم، دعم مشاركتهم، تطوير الفرص، التشبيك، أو دعم الديناميكيات المحلية.

ويسهم تنوّع الشركاء المعبَّئين في خلق جسور بين مختلف مستويات التدخل؛ إذ تساهم المؤسسات الوطنية والهياكل الجهوية والجماعات المحلية ومنظمات المجتمع المدني والفاعلون الشبابيون وشركاء التنمية، كل في مجاله، في تنفيذ الأنشطة وترسيخها في الجهات.

وتجمع المشاريع الستة بذلك بين تدخلات موجّهة في بعض الولايات وأنشطة ذات بُعد وطني، مع تكامل بين مقارباتها.

ويتيح هذا التنوع في التدخل لبرنامج EU4Youth أن يُحاور التجارب النابعة من مختلف الجهات، وأن يشجّع تداول الممارسات والمبادرات والفرص بين الشباب والفاعلين المرافقين لهم.

عمل وطني، وواقع جهوي متنوّع، وهدف واحد: توسيع الفرص المتاحة أمام الشابات والشبان التونسيين.`,
})

// ---------- IMPACT CHIFFRES ----------
setAll(store, 'a-propos', 'impact', 'title', {
  fr: 'EU4YOUTH EN CHIFFRES',
  en: 'EU4YOUTH IN FIGURES',
  ar: 'EU4YOUTH بالأرقام',
})
setAll(store, 'a-propos', 'impact', 'body', {
  fr: 'Depuis 2019, EU4Youth mobilise des jeunes, des institutions, des organisations et des acteurs de terrain dans les 24 gouvernorats de Tunisie. À travers ses six projets, le programme intervient sur plusieurs dimensions de la vie des jeunes : participation, emploi et entrepreneuriat, culture, sport, recherche et économie sociale et solidaire.',
  en: "Since 2019, EU4Youth has mobilised young people, institutions, organisations and local actors across Tunisia's 24 governorates. Through its six projects, the programme works across several dimensions of young people's lives: participation, employment and entrepreneurship, culture, sport, research, and the social and solidarity economy.",
  ar: 'منذ سنة 2019، يعبّئ EU4Youth الشباب والمؤسسات والمنظمات والفاعلين الميدانيين في الولايات الـ24 لتونس. ويتدخل البرنامج، عبر مشاريعه الستة، على عدة أبعاد من حياة الشباب: المشاركة، التشغيل وريادة الأعمال، الثقافة، الرياضة، البحث العلمي، والاقتصاد الاجتماعي والتضامني.',
})
setAll(store, 'a-propos', 'impact', 'items', {
  fr: JSON.stringify([
    { value: '3', label: 'AXES\nD’INTERVENTION', note: '', featured: '' },
    { value: '6', label: 'PROJETS\nCOMPLÉMENTAIRES', note: '', featured: '' },
    { value: '24', label: 'GOUVERNORATS\nCOUVERTS', note: '', featured: '' },
    { value: '2019–2027', label: 'DURÉE DU\nPROGRAMME', note: '', featured: '' },
    { value: '+300', label: 'PROJETS PORTÉS\nPAR DES JEUNES', note: '', featured: '1' },
    { value: '+100', label: 'INITIATIVES\nASSOCIATIVES', note: '', featured: '' },
    { value: '+300', label: 'CLUBS CRÉÉS\nOU APPUYÉS', note: '', featured: '' },
  ]),
  en: JSON.stringify([
    { value: '3', label: 'AREAS OF\nINTERVENTION', note: '', featured: '' },
    { value: '6', label: 'COMPLEMENTARY\nPROJECTS', note: '', featured: '' },
    { value: '24', label: 'GOVERNORATES\nCOVERED', note: '', featured: '' },
    { value: '2019–2027', label: 'PROGRAMME\nDURATION', note: '', featured: '' },
    { value: '+300', label: 'YOUTH-LED\nPROJECTS', note: '', featured: '1' },
    { value: '+100', label: 'ASSOCIATIVE\nINITIATIVES', note: '', featured: '' },
    { value: '+300', label: 'CLUBS CREATED\nOR SUPPORTED', note: '', featured: '' },
  ]),
  ar: JSON.stringify([
    { value: '3', label: 'محاور\nالتدخل', note: '', featured: '' },
    { value: '6', label: 'مشاريع\nمتكاملة', note: '', featured: '' },
    { value: '24', label: 'ولاية\nمعنية', note: '', featured: '' },
    { value: '2019–2027', label: 'مدة\nالبرنامج', note: '', featured: '' },
    { value: '+300', label: 'مشروع يقوده\nشباب', note: '', featured: '1' },
    { value: '+100', label: 'مبادرة\nجمعياتية', note: '', featured: '' },
    { value: '+300', label: 'نادٍ مُحدث\nأو مدعوم', note: '', featured: '' },
  ]),
})

// ---------- AVENIR ----------
setAll(store, 'a-propos', 'avenir', 'title', {
  fr: 'DES ACQUIS À FAIRE VIVRE',
  en: 'ACHIEVEMENTS TO BUILD ON',
  ar: 'مكاسب ينبغي مواصلة إحيائها',
})
setAll(store, 'a-propos', 'avenir', 'body', {
  fr: 'À l’horizon 2027, EU4Youth aura contribué à faire émerger et à renforcer des pratiques, des compétences, des réseaux et des outils qui peuvent continuer à être mobilisés au-delà des projets.\n\nL’enjeu des prochaines années est de consolider ces acquis, de documenter les enseignements de l’expérience et de favoriser leur appropriation par les acteurs qui travaillent avec et pour les jeunes.',
  en: 'By 2027, EU4Youth will have helped establish and strengthen practices, skills, networks and tools that can continue to be drawn on beyond the life of the projects.\n\nThe task ahead is to consolidate these achievements, document the lessons learned, and support their uptake by the actors who work with and for young people.',
  ar: 'بحلول سنة 2027، سيكون EU4Youth قد أسهم في بروز وتعزيز ممارسات وكفاءات وشبكات وأدوات يمكن مواصلة تعبئتها بعد انتهاء المشاريع.\n\nويتمثل رهان السنوات القادمة في تدعيم هذه المكاسب، وتوثيق الدروس المستخلصة من التجربة، وتيسير تملّكها من قبل الفاعلين العاملين مع الشباب ومن أجلهم.',
})
setAll(store, 'a-propos', 'avenir', 'items', {
  fr: JSON.stringify([
    { kicker: '', title: 'DES PRATIQUES ET DES CAPACITÉS RENFORCÉES', body: 'Au fil de sa mise en œuvre, EU4Youth a contribué au renforcement des capacités d’organisations, d’institutions, de communes, d’associations et de structures de jeunesse. Les projets ont également permis de développer et d’expérimenter des pratiques en matière de participation des jeunes, de dialogue et de coopération entre différents acteurs.' },
    { kicker: '', title: 'DES CONNAISSANCES MISES EN PARTAGE', body: 'Les projets ont produit des cartographies, des études, des analyses et des ressources sur différentes dimensions de la jeunesse, notamment les mécanismes de participation des jeunes et les secteurs liés à la culture, au sport, à l’emploi et à l’entrepreneuriat. Ces ressources constituent un capital de connaissances mobilisable par les acteurs qui interviennent dans le champ de la jeunesse.' },
    { kicker: '', title: 'DES RÉSEAUX ET DES COLLABORATIONS', body: 'La mise en œuvre des projets a permis de mettre en relation des institutions, des communes, des associations, des structures de jeunesse, des acteurs culturels et sportifs, des acteurs de l’emploi et de l’entrepreneuriat, des universités et des organisations internationales. Ces relations peuvent faciliter la circulation des expériences, le développement de collaborations et la mise en réseau des acteurs au-delà des actions directement portées par les projets.' },
    { kicker: '', title: 'DES INITIATIVES ET DES ESPACES À CONSOLIDER', body: 'Les projets ont accompagné différentes formes d’initiatives et d’espaces : initiatives dans le domaine de l’économie sociale et solidaire, projets culturels et sportifs, clubs, initiatives associatives, espaces de participation des jeunes, actions de recherche et initiatives menées au niveau municipal. La continuité de ces initiatives et espaces dépendra de leur appropriation par les acteurs concernés, des ressources disponibles et des cadres dans lesquels ils pourront continuer à être mobilisés.' },
    { kicker: '', title: 'UNE EXPÉRIENCE À TRANSMETTRE', body: 'Au-delà des actions et des résultats propres à chaque projet, EU4Youth a permis de constituer une expérience collective réunissant jeunes, institutions, organisations et acteurs de terrain. Les méthodes, outils, partenariats et enseignements issus de cette expérience peuvent être documentés, partagés et réutilisés afin d’alimenter de futures actions en faveur de la jeunesse. L’héritage d’EU4Youth se construit ainsi autant dans les résultats obtenus que dans la capacité des acteurs à poursuivre, adapter et transmettre ce qui a été expérimenté.' },
  ]),
  en: JSON.stringify([
    { kicker: '', title: 'STRONGER PRACTICES AND CAPACITIES', body: 'Over the course of its implementation, EU4Youth has helped strengthen the capacities of organisations, institutions, municipalities, associations and youth structures. The projects have also helped develop and test practices around youth participation, dialogue and cooperation between different actors.' },
    { kicker: '', title: 'KNOWLEDGE SHARED', body: 'The projects have produced mappings, studies, analyses and resources on different aspects of youth — including mechanisms for youth participation, and the culture, sport, employment and entrepreneurship sectors. These resources form a body of knowledge that actors working in the youth field can draw on.' },
    { kicker: '', title: 'NETWORKS AND COLLABORATIONS', body: 'Implementing the projects has connected institutions, municipalities, associations, youth structures, cultural and sports actors, employment and entrepreneurship actors, universities and international organisations. These connections can help experience travel further, support new collaborations, and extend networks among actors beyond the actions directly carried out by the projects.' },
    { kicker: '', title: 'INITIATIVES AND SPACES TO CONSOLIDATE', body: 'The projects have supported a range of initiatives and spaces: social and solidarity economy initiatives, cultural and sports projects, clubs, associative initiatives, spaces for youth participation, research activities, and initiatives carried out at municipal level. Whether these initiatives and spaces continue will depend on their uptake by the actors involved, the resources available, and the frameworks within which they can keep being drawn on.' },
    { kicker: '', title: 'AN EXPERIENCE TO PASS ON', body: "Beyond the actions and results specific to each project, EU4Youth has helped build up a shared body of experience bringing together young people, institutions, organisations and local actors. The methods, tools, partnerships and lessons from this experience can be documented, shared and reused to inform future action in support of young people. EU4Youth's legacy, then, lies as much in the results achieved as in the ability of those involved to carry forward, adapt and pass on what has been tried and tested." },
  ]),
  ar: JSON.stringify([
    { kicker: '', title: 'قدرات معزّزة', body: 'أسهم EU4Youth، على مدى تنفيذه، في تعزيز قدرات منظمات ومؤسسات وبلديات وجمعيات وهياكل شبابية. كما مكّنت المشاريع من تطوير واختبار ممارسات في مجالات مشاركة الشباب والحوار والتعاون بين مختلف الفاعلين.' },
    { kicker: '', title: 'معارف مشتركة', body: 'أنتجت المشاريع خرائط ودراسات وتحاليل وموارد حول مختلف أبعاد قضايا الشباب، لا سيما آليات مشاركة الشباب والقطاعات المرتبطة بالثقافة والرياضة والتشغيل وريادة الأعمال. وتشكّل هذه الموارد رصيدًا معرفيًا يمكن للفاعلين العاملين في مجال الشباب الاستفادة منه.' },
    { kicker: '', title: 'شبكات وتعاون', body: 'أتاح تنفيذ المشاريع الربط بين مؤسسات وبلديات وجمعيات وهياكل شبابية وفاعلين ثقافيين ورياضيين وفاعلين في مجالي التشغيل وريادة الأعمال وجامعات ومنظمات دولية. ويمكن أن تسهّل هذه العلاقات تداول التجارب، وتطوير أشكال تعاون جديدة، وتوسيع شبكة الفاعلين إلى ما هو أبعد من الأنشطة التي نفّذتها المشاريع مباشرة.' },
    { kicker: '', title: 'مبادرات وفضاءات', body: 'رافقت المشاريع أشكالًا متنوعة من المبادرات والفضاءات: مبادرات في مجال الاقتصاد الاجتماعي والتضامني، مشاريع ثقافية ورياضية، أندية، مبادرات جمعياتية، فضاءات لمشاركة الشباب، أنشطة بحثية، ومبادرات منفَّذة على المستوى البلدي. وتبقى استمرارية هذه المبادرات والفضاءات رهينة تملّكها من قبل الفاعلين المعنيين، والموارد المتاحة، والأطر التي يمكن أن تتواصل تعبئتها ضمنها.' },
    { kicker: '', title: 'تجربة جديرة بالنقل', body: 'إلى جانب الأنشطة والنتائج الخاصة بكل مشروع، أتاح EU4Youth تكوين تجربة جماعية جمعت الشباب والمؤسسات والمنظمات والفاعلين الميدانيين. ويمكن توثيق المنهجيات والأدوات والشراكات والدروس المستخلصة من هذه التجربة ومشاركتها وإعادة توظيفها لإثراء أعمال مستقبلية لفائدة الشباب. وهكذا يتشكّل إرث EU4Youth بقدر ما في النتائج المحققة، بقدر ما في قدرة الفاعلين على مواصلة ما تمت تجربته، وتكييفه، ونقله.' },
  ]),
})

// ---------- PARTNERS ----------
setAll(store, 'a-propos', 'partners', 'title', {
  fr: 'UN PARTENARIAT ENTRE L’UNION EUROPÉENNE, LES INSTITUTIONS TUNISIENNES ET LES ACTEURS DE TERRAIN',
  en: 'A PARTNERSHIP BETWEEN THE EUROPEAN UNION, TUNISIAN INSTITUTIONS AND LOCAL ACTORS',
  ar: 'شراكة بين الاتحاد الأوروبي والمؤسسات التونسية والفاعلين الميدانيين',
})
setAll(store, 'a-propos', 'partners', 'body', {
  fr: 'EU4Youth repose sur la mobilisation de partenaires nationaux et internationaux aux différents niveaux de mise en œuvre du programme. Cette coopération associe des institutions tunisiennes, des organisations internationales et de nombreux acteurs présents dans les territoires, avec des contributions qui varient selon les projets et les thématiques.',
  en: "EU4Youth relies on national and international partners mobilised at every level of the programme's implementation. This cooperation brings together Tunisian institutions, international organisations, and numerous actors present in local territories, with contributions that vary by project and theme.",
  ar: 'يقوم EU4Youth على تعبئة شركاء وطنيين ودوليين على مختلف مستويات تنفيذ البرنامج. ويجمع هذا التعاون بين مؤسسات تونسية ومنظمات دولية وعدد كبير من الفاعلين الحاضرين في الجهات، بمساهمات تتفاوت بحسب المشاريع والمواضيع.',
})

console.log('programme bodies synced')

// ---------- EU EN TUNISIE ----------
setAll(store, 'eu-en-tunisie', 'hero', 'title', {
  fr: "L’UNION EUROPÉENNE\nEN TUNISIE",
  en: 'THE EUROPEAN UNION\nIN TUNISIA',
  ar: 'الاتحاد الأوروبي\nفي تونس',
})
setAll(store, 'eu-en-tunisie', 'intro', 'body', {
  fr: "L’Union européenne accompagne la Tunisie à travers une coopération qui couvre des domaines variés, en lien avec les enjeux sociaux, économiques, territoriaux et environnementaux du pays. Son action s’articule autour de thématiques complémentaires, allant des droits humains et de l’égalité à l’emploi, l’innovation, le développement économique, la transition écologique et le développement territorial.\n\nDécouvrez les principaux domaines d’intervention de l’Union européenne en Tunisie et explorez les projets qui contribuent à ces différentes dynamiques.",
  en: "The European Union supports Tunisia through cooperation spanning a wide range of areas, addressing the country's social, economic, territorial, and environmental challenges. Its work is structured around complementary themes, from human rights and equality to employment, innovation, economic development, ecological transition, and territorial development.\n\nDiscover the main areas in which the European Union is active in Tunisia and explore the projects that contribute to these different dynamics.",
  ar: 'يرافق الاتحاد الأوروبي تونس من خلال تعاون يشمل مجالات متنوعة، ترتبط بالتحديات الاجتماعية والاقتصادية والترابية والبيئية التي تواجهها البلاد. ويتمحور عمله حول محاور متكاملة، تمتد من حقوق الإنسان والمساواة إلى التشغيل والابتكار والتنمية الاقتصادية والانتقال البيئي والتنمية الترابية.\n\nاكتشفوا أهم مجالات تدخل الاتحاد الأوروبي في تونس واطلعوا على المشاريع التي تساهم في هذه الديناميكيات المختلفة.',
})
setAll(store, 'eu-en-tunisie', 'themes', 'title', {
  fr: 'THÉMATIQUES',
  en: 'THEMATIC AREAS',
  ar: 'المحاور',
})

const euThemes = {
  fr: [
    { title: 'Égalité Femmes-Hommes', body: 'L’action de l’Union européenne contribue à promouvoir l’égalité entre les femmes et les hommes et à renforcer leur participation dans les différents domaines de la vie sociale et économique. Elle soutient des initiatives visant à favoriser l’égalité des chances et à mieux prendre en compte les enjeux liés au genre.' },
    { title: 'Droits humains et société civile', body: 'L’Union européenne soutient la promotion et la protection des droits humains ainsi que le rôle de la société civile. Cette coopération contribue à renforcer les capacités des acteurs associatifs et leur participation à la vie publique et sociale.' },
    { title: 'Santé', body: 'La coopération européenne intervient dans le domaine de la santé, en appui aux dynamiques visant à améliorer les systèmes et les services de santé. Elle accompagne également les acteurs concernés dans leurs efforts pour répondre aux enjeux sanitaires.' },
    { title: 'Changement climatique et énergie', body: 'Face aux enjeux liés au changement climatique, l’Union européenne soutient les dynamiques de transition vers des modèles plus durables. Son action porte notamment sur les questions liées à l’énergie, à l’adaptation au changement climatique et à la transition énergétique.' },
    { title: 'Développement régional et local', body: 'L’Union européenne contribue au développement équilibré des territoires et au renforcement des dynamiques locales. Les interventions dans ce domaine visent notamment à soutenir le développement régional et les acteurs qui contribuent à la cohésion et au développement des territoires.' },
    { title: 'Environnement, développement durable et eau', body: 'La coopération européenne soutient la protection de l’environnement et la promotion de modes de développement plus durables. Elle porte également sur la gestion et la préservation des ressources en eau, ainsi que sur les enjeux environnementaux qui concernent les territoires.' },
    { title: 'Agriculture', body: 'L’agriculture constitue un domaine important de la coopération entre l’Union européenne et la Tunisie. L’action européenne accompagne les dynamiques liées au développement agricole et à la durabilité du secteur, en lien avec les enjeux économiques, territoriaux et environnementaux.' },
    { title: 'Médias & Culture', body: 'L’Union européenne soutient les secteurs des médias et de la culture, qui contribuent au pluralisme, à la création et à la diversité culturelle. La coopération vise également à renforcer les acteurs et les initiatives qui participent au développement de ces secteurs.' },
    { title: 'Education, recherche, innovation', body: 'L’Union européenne soutient l’éducation, la recherche et l’innovation comme leviers de développement et d’ouverture. Cette coopération contribue à favoriser l’accès aux connaissances, le développement des compétences et les dynamiques d’innovation.' },
    { title: 'Emploi et formation professionnelle', body: 'L’action européenne contribue au développement de l’emploi et au renforcement de la formation professionnelle. Elle vise notamment à soutenir l’acquisition de compétences et à favoriser une meilleure adéquation entre les compétences et les opportunités professionnelles.' },
    { title: 'Démocratie et gouvernance', body: 'L’Union européenne accompagne les dynamiques liées à la démocratie et à la gouvernance. Son action soutient notamment le renforcement des institutions, des pratiques de gouvernance et de la participation à la vie publique.' },
    { title: 'Développement économique et appui au secteur privé', body: 'L’Union européenne soutient le développement économique et les acteurs du secteur privé en Tunisie. La coopération contribue notamment à créer un environnement favorable à l’activité économique, à l’entrepreneuriat et au développement des entreprises.' },
  ],
  en: [
    { title: 'Gender Equality', body: 'EU action helps promote equality between women and men and strengthen their participation in various areas of social and economic life. It supports initiatives that foster equal opportunities and give greater consideration to gender-related issues.' },
    { title: 'Human Rights and Civil Society', body: 'The European Union supports the promotion and protection of human rights, as well as the role of civil society. This cooperation helps strengthen the capacities of civil society actors and their participation in public and social life.' },
    { title: 'Health', body: 'European cooperation is active in the field of health, supporting efforts to improve health systems and services. It also accompanies relevant actors in addressing health-related challenges.' },
    { title: 'Climate Change and Energy', body: 'In response to the challenges posed by climate change, the European Union supports the transition toward more sustainable models. Its action focuses in particular on energy issues, climate change adaptation, and energy transition.' },
    { title: 'Regional and Local Development', body: 'The European Union contributes to balanced territorial development and to strengthening local dynamics. Interventions in this area aim in particular to support regional development and the actors that contribute to territorial cohesion and development.' },
    { title: 'Environment, Sustainable Development and Water', body: 'European cooperation supports environmental protection and the promotion of more sustainable development models. It also addresses the management and preservation of water resources, as well as environmental issues affecting local territories.' },
    { title: 'Agriculture', body: 'Agriculture is an important area of cooperation between the European Union and Tunisia. EU action supports dynamics related to agricultural development and the sustainability of the sector, in connection with economic, territorial, and environmental challenges.' },
    { title: 'Media and Culture', body: 'The European Union supports the media and culture sectors, which contribute to pluralism, creativity, and cultural diversity. This cooperation also aims to strengthen the actors and initiatives that contribute to the development of these sectors.' },
    { title: 'Education, Research and Innovation', body: 'The European Union supports education, research, and innovation as drivers of development and openness. This cooperation helps foster access to knowledge, skills development, and innovation dynamics.' },
    { title: 'Employment and Vocational Training', body: 'EU action contributes to employment development and to strengthening vocational training. It aims in particular to support skills acquisition and to promote a better match between skills and professional opportunities.' },
    { title: 'Democracy and Governance', body: 'The European Union supports dynamics related to democracy and governance. Its action supports in particular the strengthening of institutions, governance practices, and participation in public life.' },
    { title: 'Economic Development and Private Sector Support', body: 'The European Union supports economic development and private sector actors in Tunisia. This cooperation helps create an environment conducive to economic activity, entrepreneurship, and business development.' },
  ],
  ar: [
    { title: 'المساواة بين المرأة والرجل', body: 'يساهم عمل الاتحاد الأوروبي في تعزيز المساواة بين المرأة والرجل وتدعيم مشاركتهما في مختلف مجالات الحياة الاجتماعية والاقتصادية. ويدعم مبادرات تهدف إلى تكافؤ الفرص وإيلاء القضايا المتعلقة بالنوع الاجتماعي مزيدا من الاهتمام.' },
    { title: 'حقوق الإنسان والمجتمع المدني', body: 'يدعم الاتحاد الأوروبي تعزيز وحماية حقوق الإنسان وكذلك دور المجتمع المدني. ويساهم هذا التعاون في تدعيم قدرات الفاعلين الجمعياتيين ومشاركتهم في الحياة العامة والاجتماعية.' },
    { title: 'الصحة', body: 'يتدخل التعاون الأوروبي في مجال الصحة، دعما للديناميكيات الرامية إلى تحسين الأنظمة والخدمات الصحية. كما يرافق الفاعلين المعنيين في جهودهم للاستجابة للتحديات الصحية.' },
    { title: 'تغير المناخ والطاقة', body: 'في مواجهة التحديات المرتبطة بتغير المناخ، يدعم الاتحاد الأوروبي ديناميكيات الانتقال نحو نماذج أكثر استدامة. ويركز عمله بشكل خاص على المسائل المتعلقة بالطاقة والتكيف مع تغير المناخ والانتقال الطاقي.' },
    { title: 'التنمية الجهوية والمحلية', body: 'يساهم الاتحاد الأوروبي في التنمية المتوازنة للمناطق وتدعيم الديناميكيات المحلية. وتهدف التدخلات في هذا المجال بشكل خاص إلى دعم التنمية الجهوية والفاعلين الذين يساهمون في التماسك والتنمية الترابيين.' },
    { title: 'البيئة والتنمية المستدامة والمياه', body: 'يدعم التعاون الأوروبي حماية البيئة وترويج أنماط تنمية أكثر استدامة. كما يشمل التصرف في الموارد المائية والحفاظ عليها، إضافة إلى القضايا البيئية المتعلقة بالمناطق.' },
    { title: 'الفلاحة', body: 'تشكل الفلاحة مجالا هاما من مجالات التعاون بين الاتحاد الأوروبي وتونس. ويرافق العمل الأوروبي الديناميكيات المرتبطة بالتنمية الفلاحية واستدامة القطاع، في ارتباط بالتحديات الاقتصادية والترابية والبيئية.' },
    { title: 'الإعلام والثقافة', body: 'يدعم الاتحاد الأوروبي قطاعي الإعلام والثقافة، اللذين يساهمان في التعددية والإبداع والتنوع الثقافي. ويهدف هذا التعاون أيضا إلى تدعيم الفاعلين والمبادرات التي تساهم في تطوير هذين القطاعين.' },
    { title: 'التربية والبحث والابتكار', body: 'يدعم الاتحاد الأوروبي التربية والبحث والابتكار باعتبارها روافع للتنمية والانفتاح. ويساهم هذا التعاون في تيسير النفاذ إلى المعرفة وتطوير الكفاءات وديناميكيات الابتكار.' },
    { title: 'التشغيل والتكوين المهني', body: 'يساهم العمل الأوروبي في تطوير التشغيل وتدعيم التكوين المهني. ويهدف بشكل خاص إلى دعم اكتساب الكفاءات وتيسير ملاءمة أفضل بين الكفاءات والفرص المهنية.' },
    { title: 'الديمقراطية والحوكمة', body: 'يرافق الاتحاد الأوروبي الديناميكيات المرتبطة بالديمقراطية والحوكمة. ويدعم عمله بشكل خاص تدعيم المؤسسات وممارسات الحوكمة والمشاركة في الحياة العامة.' },
    { title: 'التنمية الاقتصادية ودعم القطاع الخاص', body: 'يدعم الاتحاد الأوروبي التنمية الاقتصادية والفاعلين في القطاع الخاص في تونس. ويساهم هذا التعاون بشكل خاص في خلق بيئة مواتية للنشاط الاقتصادي وريادة الأعمال وتطوير المؤسسات.' },
  ],
}
for (const locale of ['fr', 'en', 'ar']) {
  setBlock(store, 'eu-en-tunisie', 'themes', 'items', locale, JSON.stringify(euThemes[locale]))
}
setAll(store, 'eu-en-tunisie', 'explore', 'title', {
  fr: 'Explorer les projets de l’Union européenne en Tunisie',
  en: 'Explore European Union Projects in Tunisia',
  ar: 'مشاريع الاتحاد الأوروبي في تونس',
})
setAll(store, 'eu-en-tunisie', 'explore', 'body', {
  fr: 'Ces thématiques prennent forme à travers de nombreux projets et initiatives déployés dans différents territoires. Explorez-les à travers la cartographie des projets de l’Union européenne en Tunisie ou approfondissez l’action européenne sur le site officiel de la Délégation de l’Union européenne en Tunisie.',
  en: 'These themes take shape through numerous projects and initiatives implemented across different territories. Explore them through the mapping of European Union projects in Tunisia, or learn more about EU action on the official website of the Delegation of the European Union to Tunisia.',
  ar: 'تتجسد هذه المحاور من خلال العديد من المشاريع والمبادرات المنجزة في مختلف المناطق. اكتشفوها من خلال خريطة مشاريع الاتحاد الأوروبي في تونس، أو تعمقوا في عمل الاتحاد الأوروبي عبر الموقع الرسمي لوفد الاتحاد الأوروبي في تونس.',
})
setAll(store, 'eu-en-tunisie', 'explore', 'mapCta', {
  fr: 'Explorer les projets de l’UE en Tunisie',
  en: 'Explore EU projects in Tunisia',
  ar: 'اكتشاف مشاريع الاتحاد الأوروبي في تونس',
})
setAll(store, 'eu-en-tunisie', 'explore', 'siteCta', {
  fr: 'Découvrir l’action de l’UE en Tunisie',
  en: 'Learn more about EU action in Tunisia',
  ar: 'التعرف على عمل الاتحاد الأوروبي في تونس',
})

console.log('eu-en-tunisie synced')

// ---------- PROJECT KPIs (Jeun'ESS exact from doc; others keep existing if already good) ----------
const jeuness = store.projects.find((p) => p.slug === 'jeuness')
if (jeuness) {
  jeuness.kpis = {
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
  jeuness.specificObjectives = {
    fr: [
      { title: 'Faciliter l’accès au financement des initiatives ESS', body: 'Développer des mécanismes financiers adaptés aux besoins des jeunes entrepreneurs sociaux et des organisations ESS.' },
      { title: 'Soutenir la création et la consolidation d’activités économiques à impact social', body: 'Accompagner les initiatives nouvelles et existantes afin de renforcer leur viabilité économique et leur impact territorial.' },
      { title: 'Renforcer l’accès au marché des organisations ESS', body: 'Améliorer la visibilité, la commercialisation et la compétitivité des produits et services issus de l’économie sociale et solidaire.' },
      { title: 'Renforcer le rôle des acteurs territoriaux', body: 'Mobiliser les collectivités locales et les structures publiques afin d’intégrer l’ESS dans les stratégies locales de développement.' },
      { title: 'Favoriser l’engagement des jeunes dans l’ESS', body: 'Sensibiliser et accompagner les jeunes dans la conception d’initiatives collectives répondant aux besoins de leurs communautés.' },
    ],
    en: [
      { title: 'Facilitate access to finance for SSE initiatives', body: 'Develop financial mechanisms tailored to the needs of young social entrepreneurs and SSE organisations.' },
      { title: 'Support the creation and consolidation of economic activities with social impact', body: 'Accompany new and existing initiatives to strengthen their economic viability and territorial impact.' },
      { title: 'Strengthen market access for SSE organisations', body: 'Improve the visibility, marketing and competitiveness of products and services from the social and solidarity economy.' },
      { title: 'Strengthen the role of territorial actors', body: 'Mobilise local authorities and public structures to integrate SSE into local development strategies.' },
      { title: 'Foster youth engagement in SSE', body: 'Raise awareness and support young people in designing collective initiatives that meet community needs.' },
    ],
    ar: [
      { title: 'تيسير النفاذ إلى التمويل لمبادرات ESS', body: 'تطوير آليات تمويل ملائمة لاحتياجات رواد الأعمال الاجتماعيين الشباب ومنظمات الاقتصاد الاجتماعي والتضامني.' },
      { title: 'دعم إحداث وتدعيم أنشطة اقتصادية ذات أثر اجتماعي', body: 'مرافقة المبادرات الجديدة والقائمة لتعزيز جدواها الاقتصادية وأثرها الجهوي.' },
      { title: 'تعزيز نفاذ منظمات ESS إلى الأسواق', body: 'تحسين إبراز المنتجات والخدمات الصادرة عن الاقتصاد الاجتماعي والتضامني وتسويقها وقدرتها التنافسية.' },
      { title: 'تعزيز دور الفاعلين الترابيين', body: 'تعبئة الجماعات المحلية والهياكل العمومية لإدماج الاقتصاد الاجتماعي والتضامني في استراتيجيات التنمية المحلية.' },
      { title: 'تشجيع انخراط الشباب في ESS', body: 'تحسيس الشباب ومرافقتهم في تصميم مبادرات جماعية تستجيب لاحتياجات مجتمعاتهم.' },
    ],
  }
  console.log('jeuness kpis + specificObjectives updated')
}

writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8')
console.log('saved', storePath)
console.log('backup', backupPath)
