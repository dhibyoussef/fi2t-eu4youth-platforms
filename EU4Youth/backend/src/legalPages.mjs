/** Programme-accurate legal copy. Identity numbers and host legal name stay editable in the CMS. */

export function legalDocuments(L) {
  return [
    {
      slug: 'confidentialite',
      path: '/confidentialite',
      title: 'Confidentialité',
      mark: L('01', '01', '01'),
      badge: L('PROTECTION DES DONNÉES', 'DATA PROTECTION', 'حماية المعطيات'),
      heading: L('POLITIQUE DE CONFIDENTIALITÉ', 'PRIVACY POLICY', 'سياسة الخصوصية'),
      introTitle: L(
        'Comment ce site utilise vos données',
        'How this site uses your data',
        'كيف يستخدم هذا الموقع بياناتكم',
      ),
      intro: L(
        'Cette politique décrit les données personnelles collectées sur le site public EU4Youth Tunisie, pourquoi elles sont utilisées et quels sont vos droits. L’éditeur peut préciser ici l’identité juridique complète du responsable de traitement.',
        'This policy describes the personal data collected on the EU4Youth Tunisia public site, why it is used and what your rights are. The publisher can complete the full legal identity of the controller here.',
        'تصف هذه السياسة البيانات الشخصية المجمّعة على الموقع العمومي لـ EU4Youth تونس، ولماذا تُستخدم، وما هي حقوقكم.',
      ),
      nav: L('Sommaire de la politique', 'Policy contents', 'فهرس السياسة'),
      chapters: [
        {
          id: 'responsable',
          number: '01',
          title: L('Responsable du traitement', 'Data controller', 'المسؤول عن المعالجة'),
          body: L(
            'Le site présente le programme EU4Youth Tunisie, financé par l’Union européenne et mis en œuvre avec des partenaires tunisiens et internationaux. Le responsable du traitement des données collectées via le site est l’équipe de coordination du programme, joignable depuis la page Contact. La dénomination juridique, le représentant et l’adresse postale officiels doivent être confirmés par l’éditeur dans cette rubrique.',
            'The site presents the EU4Youth Tunisia programme, funded by the European Union and implemented with Tunisian and international partners. The controller of data collected via the site is the programme coordination team, reachable from the Contact page. The official legal name, representative and postal address should be confirmed by the publisher in this section.',
            'يعرض الموقع برنامج EU4Youth تونس المموّل من الاتحاد الأوروبي والمنفَّذ مع شركاء تونسيين ودوليين. المسؤول عن معالجة البيانات المجمّعة عبر الموقع هو فريق تنسيق البرنامج، ويمكن التواصل معه من صفحة الاتصال.',
          ),
        },
        {
          id: 'donnees',
          number: '02',
          title: L('Données collectées', 'Data collected', 'البيانات المجمّعة'),
          body: L(
            'Lorsque vous utilisez le formulaire de contact, nous pouvons collecter votre identité, organisation, fonction, e-mail, téléphone, profil, projet concerné, zone géographique, objet et message, ainsi que votre consentement. Une inscription à la newsletter ne retient que l’e-mail. La recherche conserve la requête saisie. Le site mémorise aussi la langue d’affichage et votre choix d’accepter ou de refuser les cookies, sur votre navigateur.',
            'When you use the contact form we may collect your identity, organisation, role, email, phone, profile, related project, area, subject and message, plus your consent. A newsletter sign-up only keeps the email. Search keeps the query you typed. The site also stores display language and your cookie choice in the browser.',
            'عند استخدام نموذج الاتصال قد نجمع الهوية والمنظمة والوظيفة والبريد والهاتف والملف والمشروع والمنطقة والموضوع والرسالة والموافقة. الاشتراك في النشرة يحتفظ بالبريد فقط. البحث يحتفظ بالاستعلام. يُخزَّن أيضاً لغة العرض واختيار الكوكيز في المتصفح.',
          ),
        },
        {
          id: 'finalites',
          number: '03',
          title: L('Finalités et bases juridiques', 'Purposes and legal bases', 'الأغراض والأسس القانونية'),
          body: L(
            'Les données de contact servent à traiter votre demande. L’e-mail de newsletter sert uniquement à l’envoi d’informations du programme, tant que vous restez inscrit. La langue et le choix cookies servent au fonctionnement du site. La base est votre demande (exécution de mesures liées à une mission d’intérêt public du programme) ou votre consentement (newsletter, cookies non indispensables).',
            'Contact data is used to handle your request. The newsletter email is used only to send programme information while you remain subscribed. Language and cookie choice keep the site working. The basis is your request (public-interest mission of the programme) or your consent (newsletter, non-essential cookies).',
            'تُستخدم بيانات الاتصال لمعالجة طلبكم. بريد النشرة يُستخدم فقط لإرسال معلومات البرنامج ما دمتم مشتركين. اللغة واختيار الكوكيز لتشغيل الموقع. الأساس هو طلبكم أو موافقتكم.',
          ),
        },
        {
          id: 'destinataires',
          number: '04',
          title: L('Destinataires des données', 'Data recipients', 'متلقّو البيانات'),
          body: L(
            'Les messages sont lus par l’équipe du programme. Si votre demande concerne un projet précis, elle peut être transmise au partenaire de mise en œuvre concerné. L’hébergeur technique peut traiter des journaux de connexion nécessaires à la sécurité. Aucune donnée n’est vendue. Les prestataires n’interviennent que pour l’hébergement, la maintenance ou l’envoi d’e-mails.',
            'Messages are read by the programme team. If your request concerns a specific project, it may be forwarded to the relevant implementing partner. The technical host may process connection logs needed for security. No data is sold. Providers only act for hosting, maintenance or email sending.',
            'تُقرأ الرسائل من فريق البرنامج. إذا تعلق الطلب بمشروع معيّن يمكن إحالته إلى الشريك المنفّذ المعني. قد يعالج المضيف التقني سجلات الاتصال اللازمة للأمن. لا تُباع أي بيانات.',
          ),
        },
        {
          id: 'conservation',
          number: '05',
          title: L('Durées de conservation', 'Retention periods', 'مدد الاحتفاظ'),
          body: L(
            'Les messages de contact sont conservés le temps du traitement puis jusqu’à 12 mois. L’e-mail de newsletter est conservé jusqu’à votre désinscription. La langue et le choix cookies restent dans votre navigateur jusqu’à 13 mois, ou jusqu’à ce que vous les effaciez. Les journaux techniques suivent la durée nécessaire à la sécurité du service.',
            'Contact messages are kept for the time needed to handle them, then up to 12 months. Newsletter email is kept until you unsubscribe. Language and cookie choice stay in your browser for up to 13 months, or until you delete them. Technical logs follow the period needed for service security.',
            'تُحفظ رسائل الاتصال طوال المعالجة ثم حتى 12 شهراً. بريد النشرة حتى إلغاء الاشتراك. اللغة واختيار الكوكيز في المتصفح حتى 13 شهراً أو حتى حذفها.',
          ),
        },
        {
          id: 'droits',
          number: '06',
          title: L('Vos droits', 'Your rights', 'حقوقكم'),
          body: L(
            'Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou l’opposition, et retirer un consentement (newsletter, cookies) à tout moment. Adressez votre demande via la page Contact en précisant « données personnelles ». Vous pouvez également saisir l’Instance nationale de protection des données personnelles (INPDP) en Tunisie.',
            'You may request access, rectification, erasure, restriction or objection, and withdraw consent (newsletter, cookies) at any time. Send your request via the Contact page, mentioning “personal data”. You may also contact Tunisia’s national personal data protection authority (INPDP).',
            'يمكنكم طلب النفاذ والتصحيح والمحو والتقييد والاعتراض وسحب الموافقة في أي وقت عبر صفحة الاتصال مع ذكر «بيانات شخصية». يمكن أيضاً اللجوء إلى الهيئة الوطنية لحماية المعطيات الشخصية.',
          ),
        },
        {
          id: 'contact',
          number: '07',
          title: L('Contact et réclamations', 'Contact and complaints', 'الاتصال والتظلّمات'),
          body: L(
            'Pour toute question sur cette politique ou pour exercer vos droits, utilisez le formulaire de la page Contact. Mentionnez l’objet de votre demande afin qu’elle soit orientée vers la bonne équipe.',
            'For any question about this policy or to exercise your rights, use the Contact page form. State the purpose of your request so it can be routed to the right team.',
            'لأي سؤال حول هذه السياسة أو لممارسة حقوقكم استخدموا نموذج صفحة الاتصال واذكروا موضوع الطلب.',
          ),
        },
      ],
    },
    {
      slug: 'mentions-legales',
      path: '/mentions-legales',
      title: 'Mentions légales',
      mark: L('02', '02', '02'),
      badge: L('INFORMATIONS LÉGALES', 'LEGAL INFORMATION', 'معلومات قانونية'),
      heading: L('MENTIONS LÉGALES', 'LEGAL NOTICE', 'إشعارات قانونية'),
      introTitle: L(
        'Éditeur, hébergement et conditions d’usage',
        'Publisher, hosting and terms of use',
        'الناشر والاستضافة وشروط الاستخدام',
      ),
      intro: L(
        'Ces mentions identifient le site public du programme EU4Youth Tunisie. Les champs d’identification formelle (forme juridique, représentant, hébergeur nommé) restent modifiables dans le CMS dès confirmation par l’éditeur.',
        'These notices identify the EU4Youth Tunisia public site. Formal identification fields (legal form, representative, named host) remain editable in the CMS once confirmed by the publisher.',
        'تحدّد هذه الإشعارات الموقع العمومي لبرنامج EU4Youth تونس. تبقى بيانات الهوية الرسمية قابلة للتعديل في نظام الإدارة بعد تأكيد المحرر.',
      ),
      nav: L('Sommaire des mentions légales', 'Legal notice contents', 'فهرس الإشعارات القانونية'),
      chapters: [
        {
          id: 'editeur',
          number: '01',
          title: L('Éditeur du site', 'Site publisher', 'ناشر الموقع'),
          body: L(
            'Ce site est édité pour le programme EU4Youth Tunisie, programme d’appui à la jeunesse tunisienne financé par l’Union européenne. Il présente les six projets, les opportunités, l’agenda, les publications et les ressources du programme. L’éditeur complète ici la dénomination, l’adresse et le représentant légal dès qu’ils sont officiellement désignés.',
            'This site is published for the EU4Youth Tunisia programme, supporting Tunisian youth and funded by the European Union. It presents the six projects, opportunities, agenda, publications and resources. The publisher completes the legal name, address and representative here once they are officially designated.',
            'يُنشر هذا الموقع لصالح برنامج EU4Youth تونس لدعم الشباب التونسي بتمويل من الاتحاد الأوروبي. يعرض المشاريع الستة والفرص والأجندة والمنشورات والموارد.',
          ),
        },
        {
          id: 'publication',
          number: '02',
          title: L('Direction de la publication', 'Publication director', 'إدارة النشر'),
          body: L(
            'La direction de la publication est assurée par l’équipe de coordination du programme EU4Youth Tunisie. Les contenus factuels (chiffres, appels, dates) relèvent des sources des projets et peuvent être mis à jour depuis le CMS.',
            'Publication is directed by the EU4Youth Tunisia coordination team. Factual content (figures, calls, dates) comes from project sources and can be updated in the CMS.',
            'تتولى إدارة النشر فريق تنسيق برنامج EU4Youth تونس. المحتوى الوقائعي يأتي من مصادر المشاريع ويمكن تحديثه من نظام الإدارة.',
          ),
        },
        {
          id: 'hebergement',
          number: '03',
          title: L('Hébergement', 'Hosting', 'الاستضافة'),
          body: L(
            'Le site est hébergé sur l’infrastructure technique mise à disposition pour le programme. Le nom, l’adresse et le contact de l’hébergeur doivent figurer dans cette rubrique dès validation par l’éditeur (le CMS permet de les renseigner sans modifier le code).',
            'The site is hosted on the technical infrastructure provided for the programme. The host’s name, address and contact should appear in this section once validated by the publisher (the CMS can store them without a code change).',
            'يُستضاف الموقع على البنية التقنية الموضوعة تحت تصرّف البرنامج. يُذكر اسم المضيف وعنوانه وجهات الاتصال في هذا الباب بعد مصادقة المحرر.',
          ),
        },
        {
          id: 'propriete',
          number: '04',
          title: L('Propriété intellectuelle', 'Intellectual property', 'الملكية الفكرية'),
          body: L(
            'Les textes, visuels, logos et documents téléchargeables du site sont protégés. Le logo EU4Youth, les emblèmes de la République tunisienne et de l’Union européenne, ainsi que les identités des projets, restent la propriété de leurs titulaires. Toute reproduction non autorisée est interdite, hors citations courtes avec mention de la source ou usages prévus par la loi.',
            'Site texts, visuals, logos and downloadable files are protected. The EU4Youth logo, Tunisian and EU emblems, and project identities remain the property of their owners. Unauthorised reproduction is forbidden, except short quotations with credit or uses allowed by law.',
            'النصوص والصور والشعارات والملفات محمية. شعار EU4Youth وشعارا الجمهورية التونسية والاتحاد الأوروبي وهويات المشاريع ملك لأصحابها. يُمنع أي استنساخ غير مرخّص.',
          ),
        },
        {
          id: 'responsabilite',
          number: '05',
          title: L('Responsabilité', 'Liability', 'المسؤولية'),
          body: L(
            'Le site vise une information fiable sur le programme. Les contenus n’engagent que leurs auteurs et ne constituent pas un avis juridique. Comme indiqué en pied de page, le site a été produit avec le soutien financier de l’Union européenne ; son contenu relève de la seule responsabilité du programme EU4Youth Tunisie et ne reflète pas nécessairement la position de l’Union européenne.',
            'The site aims to provide reliable information about the programme. Content is not legal advice. As stated in the footer, the site was produced with EU financial support; its content is the sole responsibility of EU4Youth Tunisia and does not necessarily reflect the EU’s views.',
            'يسعى الموقع إلى تقديم معلومات موثوقة عن البرنامج. كما هو مذكور في التذييل، أُنتج الموقع بدعم مالي من الاتحاد الأوروبي ومحتواه مسؤولية برنامج EU4Youth تونس وحدها.',
          ),
        },
        {
          id: 'liens',
          number: '06',
          title: L('Liens externes', 'External links', 'روابط خارجية'),
          body: L(
            'Le site peut renvoyer vers des pages de partenaires, d’institutions ou de documents hébergés ailleurs. Ces sites disposent de leurs propres mentions. EU4Youth Tunisie n’est pas responsable de leur contenu ni de leurs pratiques de confidentialité.',
            'The site may link to partner, institution or third-party document pages. Those sites have their own notices. EU4Youth Tunisia is not responsible for their content or privacy practices.',
            'قد يربط الموقع بصفحات شركاء أو مؤسسات أو وثائق خارجية لها إشعاراتها الخاصة. EU4Youth تونس غير مسؤولة عن محتواها.',
          ),
        },
        {
          id: 'contact',
          number: '07',
          title: L('Contact', 'Contact', 'الاتصال'),
          body: L(
            'Pour signaler une erreur, demander une autorisation de réutilisation ou joindre l’équipe, utilisez la page Contact. Les délais de réponse dépendent de la nature de la demande et du projet concerné.',
            'To report an error, request reuse permission or reach the team, use the Contact page. Response times depend on the request and the project concerned.',
            'للإبلاغ عن خطأ أو طلب إعادة استخدام أو التواصل مع الفريق استخدموا صفحة الاتصال.',
          ),
        },
      ],
    },
    {
      slug: 'accessibilite',
      path: '/accessibilite',
      title: 'Accessibilité',
      mark: L('03', '03', '03'),
      badge: L('ACCÈS AU SERVICE', 'ACCESS TO THE SERVICE', 'النفاذ إلى الخدمة'),
      heading: L('ACCESSIBILITÉ', 'ACCESSIBILITY', 'النفاذ'),
      introTitle: L(
        'État d’accessibilité de ce site',
        'Accessibility status of this site',
        'وضع نفاذية هذا الموقع',
      ),
      intro: L(
        'EU4Youth Tunisie vise un site utilisable par le plus grand nombre. Cette déclaration décrit l’engagement, le niveau de conformité actuel et la manière de signaler un obstacle. Elle sera mise à jour après un audit formel.',
        'EU4Youth Tunisia aims for a site usable by as many people as possible. This statement describes the commitment, current conformance and how to report a barrier. It will be updated after a formal audit.',
        'يسعى EU4Youth تونس إلى موقع قابل للاستخدام لأكبر عدد ممكن. يصف هذا البيان الالتزام ومستوى المطابقة الحالي وكيفية الإبلاغ عن عائق.',
      ),
      nav: L('Sommaire de la déclaration d’accessibilité', 'Accessibility statement contents', 'فهرس بيان النفاذ'),
      chapters: [
        {
          id: 'engagement',
          number: '01',
          title: L('Engagement d’accessibilité', 'Accessibility commitment', 'التزام النفاذ'),
          body: L(
            'Le programme s’engage à rendre ce site perceptible, utilisable et compréhensible : structure de titres, contrastes, navigation au clavier, textes alternatifs sur les images porteuses d’information, et pages légales, contact et recherche accessibles sans souris.',
            'The programme is committed to making this site perceivable, operable and understandable: heading structure, contrast, keyboard navigation, alternative text on informative images, and legal, contact and search pages usable without a mouse.',
            'يلتزم البرنامج بجعل الموقع قابلاً للإدراك والاستخدام والفهم: هيكل العناوين والتباين والتنقل بلوحة المفاتيح ونصوص بديلة للصور المعلوماتية.',
          ),
        },
        {
          id: 'referentiel',
          number: '02',
          title: L('Référentiel et niveau de conformité', 'Standard and conformance level', 'المرجع ومستوى المطابقة'),
          body: L(
            'Le référentiel visé est WCAG 2.2, niveau AA, en cohérence avec les bonnes pratiques européennes pour les sites publics. À ce jour, aucun audit externe complet n’a été publié : la conformité est donc partielle / non évaluée. Cette mention sera remplacée par le résultat d’audit dès qu’il sera disponible.',
            'The target standard is WCAG 2.2 level AA, in line with European good practice for public sites. No full external audit has been published yet, so conformance is partial / not assessed. This wording will be replaced with the audit result when available.',
            'المرجع المستهدف هو WCAG 2.2 المستوى AA. حتى الآن لم يُنشر تدقيق خارجي كامل، لذا فالمطابقة جزئية / غير مقيَّمة.',
          ),
        },
        {
          id: 'perimetre',
          number: '03',
          title: L('Périmètre de la déclaration', 'Scope of the statement', 'نطاق البيان'),
          body: L(
            'La déclaration couvre les pages publiques du site (accueil, programme, projets, carte, opportunités, actualités, publications, agenda, stories, glossaire, contact, recherche, plan du site et pages légales). Les documents PDF téléchargeables et les lecteurs vidéo tiers peuvent avoir un niveau d’accessibilité différent.',
            'The statement covers public pages (home, programme, projects, map, opportunities, news, publications, agenda, stories, glossary, contact, search, sitemap and legal pages). Downloadable PDFs and third-party video players may have a different accessibility level.',
            'يغطي البيان الصفحات العمومية. ملفات PDF ومحرّكات الفيديو الخارجية قد يكون لها مستوى نفاذ مختلف.',
          ),
        },
        {
          id: 'resultats',
          number: '04',
          title: L('Résultats de l’évaluation', 'Evaluation results', 'نتائج التقييم'),
          body: L(
            'En attendant un rapport d’audit, l’équipe corrige en continu les défauts signalés (liens, formulaires, focus clavier, langues). Un pourcentage de conformité et la date d’audit seront indiqués ici après évaluation.',
            'Until an audit report exists, the team continuously fixes reported issues (links, forms, keyboard focus, languages). A conformance percentage and audit date will appear here after evaluation.',
            'إلى حين تقرير تدقيق تُصلح الفريق العيوب المبلّغ عنها. ستظهر هنا نسبة المطابقة وتاريخ التدقيق بعد التقييم.',
          ),
        },
        {
          id: 'non-conformites',
          number: '05',
          title: L('Contenus non accessibles', 'Non-accessible content', 'محتويات غير يسيرة النفاذ'),
          body: L(
            'Peuvent rester difficiles d’accès : certaines cartes interactives, documents PDF hérités, visuels décoratifs sans alternative, ou contenus embarqués depuis des plateformes externes. Signalez-les via Contact pour qu’une alternative puisse être proposée.',
            'Some interactive maps, legacy PDFs, decorative visuals without alternatives, or embedded third-party content may remain hard to use. Report them via Contact so an alternative can be offered.',
            'قد تبقى بعض الخرائط التفاعلية وملفات PDF القديمة أو المحتويات المضمّنة صعبة الاستخدام. بلّغوا عبر صفحة الاتصال.',
          ),
        },
        {
          id: 'signalement',
          number: '06',
          title: L('Signaler une difficulté d’accès', 'Report an access issue', 'الإبلاغ عن صعوبة نفاذ'),
          body: L(
            'Si vous ne pouvez pas consulter un contenu, écrivez via la page Contact : indiquez l’URL, le navigateur et la difficulté rencontrée. L’équipe s’efforce d’apporter une alternative (texte, document, rendez-vous).',
            'If you cannot access content, write via the Contact page: include the URL, browser and the difficulty. The team will try to provide an alternative (text, document, appointment).',
            'إذا تعذّر الاطلاع على محتوى اكتبوا عبر صفحة الاتصال مع الرابط والمتصفح ووصف الصعوبة.',
          ),
        },
        {
          id: 'voies-recours',
          number: '07',
          title: L('Voies de recours', 'Remedies', 'سبل التظلّم'),
          body: L(
            'Si la réponse ne vous convient pas, vous pouvez renouveler la demande en précisant qu’il s’agit d’un recours accessibilité. Pour les données personnelles liées à un signalement, l’INPDP demeure l’autorité de contrôle en Tunisie.',
            'If the reply is not satisfactory, you may renew the request stating it is an accessibility appeal. For personal data linked to a report, INPDP remains the supervisory authority in Tunisia.',
            'إذا لم يناسبكم الرد يمكن تجديد الطلب بوصفه تظلّماً على النفاذ. بالنسبة للبيانات الشخصية تبقى الهيئة الوطنية لحماية المعطيات الشخصية جهة الرقابة في تونس.',
          ),
        },
      ],
    },
    {
      slug: 'cookies',
      path: '/cookies',
      title: 'Cookies',
      mark: L('04', '04', '04'),
      badge: L('TRACEURS ET PRÉFÉRENCES', 'TRACKERS AND PREFERENCES', 'متعقّبات وتفضيلات'),
      heading: L('GESTION DES COOKIES', 'COOKIE POLICY', 'إدارة الكوكيز'),
      introTitle: L(
        'Ce que ce site enregistre sur votre appareil',
        'What this site stores on your device',
        'ما الذي يحفظه هذا الموقع على جهازكم',
      ),
      intro: L(
        'Le bandeau cookies permet d’accepter ou de refuser les traceurs non indispensables. Cette page décrit les enregistrements réellement utilisés par le site public et comment modifier votre choix.',
        'The cookie banner lets you accept or refuse non-essential trackers. This page describes what the public site actually stores and how to change your choice.',
        'يتيح شريط الكوكيز قبول أو رفض المتعقّبات غير الضرورية. تصف هذه الصفحة ما يحفظه الموقع فعلاً وكيف تغيّرون اختياركم.',
      ),
      nav: L('Sommaire de la gestion des cookies', 'Cookie policy contents', 'فهرس إدارة الكوكيز'),
      chapters: [
        {
          id: 'definition',
          number: '01',
          title: L('Qu’est-ce qu’un cookie ?', 'What is a cookie?', 'ما هو الكوكي؟'),
          body: L(
            'Un cookie ou un stockage local est un petit fichier ou une clé enregistrée par le navigateur. Il peut être indispensable au fonctionnement (langue, sécurité) ou servir à la mesure d’audience s’il est activé. Ce site n’active de mesure d’audience que si un outil de ce type est déployé et accepté.',
            'A cookie or local storage entry is a small file or key saved by the browser. It can be essential (language, security) or used for audience measurement if enabled. This site only runs audience measurement if such a tool is deployed and accepted.',
            'الكوكي أو التخزين المحلي ملف صغير يحفظه المتصفح. قد يكون ضرورياً للتشغيل أو لقياس الجمهور إن فُعّل. لا يُشغَّل قياس الجمهور هنا إلا إذا نُشرت أداة وقُبلت.',
          ),
        },
        {
          id: 'cookies-utilises',
          number: '02',
          title: L('Cookies et traceurs utilisés', 'Cookies and trackers used', 'الكوكيز والمتعقّبات المستخدمة'),
          body: L(
            'Aujourd’hui le site public enregistre : le choix du bandeau cookies (acceptation ou refus) ; la langue d’interface ; éventuellement un jeton d’édition pour les rédacteurs connectés au CMS. Aucun cookie publicitaire n’est déposé. Si un outil d’analytics est ajouté plus tard, il sera décrit ici et soumis au bandeau.',
            'The public site currently stores: the banner choice (accept or refuse); interface language; and, for logged-in CMS editors, an edit token. No advertising cookie is set. If an analytics tool is added later, it will be described here and gated by the banner.',
            'يحفظ الموقع حالياً اختيار الشريط واللغة وقد يحفظ رمز تحرير للمحررين. لا تُوضع كوكيز إعلانية.',
          ),
        },
        {
          id: 'finalites',
          number: '03',
          title: L('Finalités', 'Purposes', 'الأغراض'),
          body: L(
            'Ces enregistrements servent à se souvenir de votre décision cookies, à afficher le français, l’anglais ou l’arabe, et à permettre la prévisualisation pour les rédacteurs. Ils ne servent pas à de la publicité ciblée.',
            'These records remember your cookie decision, show French, English or Arabic, and allow preview for editors. They are not used for targeted advertising.',
            'تُستخدم لتذكّر قرار الكوكيز وعرض اللغة وتمكين المعاينة للمحررين، وليس للإعلان المستهدف.',
          ),
        },
        {
          id: 'durees',
          number: '04',
          title: L('Durées de conservation', 'Retention periods', 'مدد الاحتفاظ'),
          body: L(
            'Le choix cookies et la langue restent dans le navigateur jusqu’à 13 mois, ou jusqu’à suppression manuelle des données du site. Le jeton d’édition expire avec la session rédacteur.',
            'Cookie choice and language stay in the browser for up to 13 months, or until you clear site data. The edit token expires with the editor session.',
            'يبقى اختيار الكوكيز واللغة في المتصفح حتى 13 شهراً أو حتى مسح بيانات الموقع.',
          ),
        },
        {
          id: 'consentement',
          number: '05',
          title: L('Gestion du consentement', 'Consent management', 'إدارة الموافقة'),
          body: L(
            'Au premier passage, un bandeau propose d’accepter ou de refuser. Refuser n’empêche pas de lire le site : seuls les traceurs non indispensables sont bloqués. Vous pouvez modifier votre choix à tout moment avec le bouton « Modifier mes préférences » sur cette page, qui réaffiche le bandeau.',
            'On a first visit a banner offers accept or refuse. Refusing does not block reading the site: only non-essential trackers are stopped. You can change your choice at any time with “Change my preferences” on this page, which shows the banner again.',
            'في الزيارة الأولى يقترح شريط القبول أو الرفض. الرفض لا يمنع قراءة الموقع. يمكن تغيير الاختيار من زر «تعديل تفضيلاتي» في هذه الصفحة.',
          ),
        },
        {
          id: 'parametrage',
          number: '06',
          title: L('Paramétrage du navigateur', 'Browser settings', 'ضبط المتصفح'),
          body: L(
            'Vous pouvez aussi bloquer ou supprimer les cookies depuis les réglages de votre navigateur. Un blocage total peut dégrader la mémorisation de la langue. Consultez l’aide de Chrome, Firefox, Safari ou Edge pour la procédure.',
            'You can also block or delete cookies in your browser settings. A total block may stop language memory. See Chrome, Firefox, Safari or Edge help for steps.',
            'يمكن أيضاً حظر الكوكيز أو حذفها من إعدادات المتصفح. الحظر الكامل قد يمنع تذكّر اللغة.',
          ),
        },
        {
          id: 'contact',
          number: '07',
          title: L('Contact', 'Contact', 'الاتصال'),
          body: L(
            'Pour une question sur les cookies ou pour exercer un droit lié à ces enregistrements, utilisez la page Contact.',
            'For a question about cookies or a right linked to these records, use the Contact page.',
            'لسؤال حول الكوكيز أو لممارسة حق مرتبط بهذه السجلات استخدموا صفحة الاتصال.',
          ),
        },
      ],
    },
  ]
}

export function legalChapterJson(doc) {
  return {
    fr: doc.chapters.map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title.fr,
      body: row.body.fr,
    })),
    en: doc.chapters.map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title.en,
      body: row.body.en,
    })),
    ar: doc.chapters.map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title.ar,
      body: row.body.ar,
    })),
  }
}
