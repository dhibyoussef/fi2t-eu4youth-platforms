export const QUI_SOMMES_NOUS_DEFAULTS: Record<string, string> = {
  'hero.image': '/images/qui-sommes-nous-banner.png?v=8',
  'hero.title': 'Qui sommes-nous',

  'mission.title': 'Notre Histoire & Mission',
  // Single \n, not \n\n: the artboard runs both paragraphs at the same 29px
  // pitch with no blank line between them.
  'mission.body':
    'La Fédération Interprofessionnelle du Tourisme Tunisien est un syndicat professionnel patronal indépendant fondé en mars 2016 par divers opérateurs du tourisme tunisien, venant d’activités différentes : agences de voyages, hébergements alternatifs, loisirs, animation, sports, transports…\nLa Fi2T est ouverte à tous les acteurs du tourisme tunisien ayant un lien direct avec le secteur. Les adhérents peuvent être des personnes morales, des personnes physiques, des associations, des syndicats.',
  'mission.image': '/images/qui-sommes-nous-mission-card.png?v=1',

  'values.title': 'Objectifs',
  'values.items': JSON.stringify([
    {
      title: 'VISION STRATÉGIQUE',
      desc: 'Apporter sa contribution en matière de vision stratégique et pratique pour la diversification et l’innovation touristique en Tunisie.',
      icon: '/images/value-innovation.svg',
    },
    {
      title: 'INTÉRÊTS DES MEMBRES',
      desc: 'Sauvegarder les intérêts économiques et sociaux de ses membres.',
      icon: '/images/value-integrity.svg',
    },
    {
      title: 'SYNERGIE',
      desc: 'Créer une synergie entre les différents opérateurs du tourisme tunisien.',
      icon: '/images/value-synergie.svg',
    },
    {
      title: 'DÉVELOPPEMENT',
      desc: 'Contribuer au développement et à l’essor du tourisme tunisien.',
      icon: '/images/value-excellence.svg',
    },
    {
      title: 'DIVERSIFICATION',
      desc: 'Soutenir la diversification du tourisme tunisien.',
      icon: '/images/value-representation.svg',
    },
    {
      title: 'COMMERCIALISATION',
      desc: 'Promouvoir et soutenir la commercialisation de la diversité des produits touristiques tunisiens.',
      icon: '/images/value-durabilite.svg',
    },
  ]),

  'diversify.title': 'Pourquoi diversifier et innover ?',
  'diversify.intro': 'La diversification des produits touristiques n’est pas un luxe, c’est plutôt :',
  'diversify.items': JSON.stringify([
    {
      title: 'Adaptation à la demande',
      desc: 'Une adaptation à la demande touristique mondiale et nationale, de plus en plus segmentée',
    },
    {
      title: 'Extension temporelle',
      desc: 'Une extension de l’activité touristique dans le temps',
    },
    {
      title: 'Extension spatiale',
      desc: 'Une extension de l’activité touristique dans l’espace',
    },
    {
      title: 'Optimisation des revenus',
      desc: 'La réalisation de meilleures recettes en devises par l’attraction de clientèles à fort pouvoir d’achat',
    },
  ]),

  'join.title': "Prêt à rejoindre l'excellence ?",
  'join.body':
    'Contribuez activement à la transformation du tourisme tunisien en devenant membre de notre fédération interprofessionnelle.',
  'join.cta': 'Devenir membre',
}
