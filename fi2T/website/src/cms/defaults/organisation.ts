import { groupementsJson } from '../../lib/groupements'

export const ORGANISATION_DEFAULTS: Record<string, string> = {
  'hero.image': '/images/qui-sommes-nous-banner.png?v=8',
  'hero.title': 'Organisation',

  'intro.title': 'Organisation',
  'intro.body':
    'La Fi2T est composée :\n- D’un Conseil d’Administration composé de 5 membres : 1 Président, 2 Vice-Présidents, 1 Secrétaire Général et 1 Trésorier\n- D’un Conseil Exécutif : composé des membres du Conseil d’Administration, des membres dirigeants des Groupements Professionnels et des membres dirigeants des Bureaux Régionaux.\n- Les Groupements Professionnels sont dirigés par 3 membres : 1 Président, 1 Vice-Président et 1 Secrétaire Général\n- Les Bureaux Régionaux sont dirigés par 3 membres : 1 Président, 1 Vice-Président et 1 Secrétaire Général\nLes membres de ces différentes structures sont élus pour un mandat de 3 ans identique au mandat du Conseil d’Administration.',

  /* Values are auto-calculated on the page — only labels are CMS-editable. */
  'stats.label_groupements': 'GROUPEMENTS',
  'stats.label_regions': 'RÉGIONS',
  'stats.label_mandate': 'ANS DE MANDAT',

  'board.page_title': 'Le Conseil d’administration',
  'board.lead':
    'Le Conseil d’Administration de la Fi2T est composé de 5 membres élus lors de l’assemblée constitutive.',
  'board.title': 'Composition actuelle',
  'board.members': JSON.stringify([
    { name: 'Mr Walid Tritar', role: 'PRÉSIDENT', image: '/images/org-board/walid-tritar.svg?v=1' },
    { name: 'Mme Chahla Khekhia', role: 'VICE-PRÉSIDENTE', image: '/images/org-board/chahla-khekhia.svg?v=1' },
    { name: 'Mr Marouene Noureddine', role: 'VICE-PRÉSIDENT', image: '/images/org-board/marouene-noureddine.svg?v=1' },
    { name: 'Mme Kaouthar Meddeb', role: 'TRÉSORIÈRE', image: '/images/org-board/kaouthar-meddeb.svg?v=1' },
    { name: 'Mr Hassen Haddar', role: 'SECRÉTAIRE GÉNÉRAL', image: '/images/org-board/hassen-haddar.svg?v=1' },
  ]),

  'outgoing.title': 'Bureau sortant',
  'outgoing.members': JSON.stringify([
    {
      name: 'Mr Houssem Ben Azouz',
      role: 'Ex-Président ; Président d’Honneur et Coordinateur Général',
      image: '/images/org-board/houssem-ben-azouz.svg?v=1',
    },
    {
      name: 'Mr Ahmed Oubaia',
      role: 'Ex-Vice-Président et Président d’Honneur',
      image: '/images/org-board/ahmed-oubaia.svg?v=1',
    },
    {
      name: 'Mr Néjib Gana',
      role: 'Ex-Secrétaire Général et Président d’Honneur',
      image: '/images/org-board/nejib-gana.svg?v=1',
    },
    {
      name: 'Mr Omar Cherif',
      role: 'Ex-Trésorier et Président d’Honneur',
      image: '/images/org-board/omar-cherif.svg?v=1',
    },
  ]),

  'headquarters.page_title': 'Le Siège',
  'headquarters.lead':
    'L’équipe permanente du siège accompagne les adhérents, les groupements et les bureaux régionaux au quotidien.',
  'headquarters.title': 'Le bureau du siège de la Fi2T',
  'headquarters.staff': JSON.stringify([
    { initials: 'KB', name: "Mlle Khawla B'Chir", role: 'Directrice Exécutive' },
    { initials: 'HI', name: 'Mlle Hiba Inoubli', role: 'Webmaster' },
    { initials: 'SS', name: 'Mlle Sarra Sallemi', role: 'Affaires administratives et comptables' },
  ]),

  'regional.page_title': 'Les Bureaux Régionaux',
  'regional.lead':
    'Présents sur tout le territoire, les bureaux régionaux sont dirigés par 3 membres : 1 Président, 1 Vice-Président et 1 Secrétaire Général.',
  'regional.title': 'Les Bureaux Régionaux',
  'regional.map_label': 'Bureaux Régionaux',
  'regional.map_image': '/images/org-regional-map-card.png?v=2',
  'regional.items': JSON.stringify([
    { name: 'Mr Nebil Azouz', region: 'Bizerte' },
    { name: 'Mr Marouene Noureddine', region: 'Ain Draham/Tabarka' },
    { name: 'Mme Raoudha Chennoufi', region: 'Le Kef' },
    { name: 'Mr Foued Ben Ammar', region: 'Hammamet/Nabeul' },
    { name: 'Mr Akram Bouzguarrou', region: 'Sousse' },
    { name: 'Mr Khaled Hayouni', region: 'Monastir/Mahdia' },
    { name: 'Mr Belgacem Kalawi', region: 'Kairouan' },
    { name: 'Mr Alaeddine Khodhri', region: 'Gabes' },
    { name: 'Mr Hatem Mejlissi', region: 'Djerba' },
    { name: 'Mr Taoufik Bettoumi', region: 'Douz' },
    { name: 'Mr Naceur Zaalane', region: 'Tozeur' },
  ]),

  'groupements.page_title': 'Les Groupements Professionnels',
  'groupements.lead': '',
  'groupements.title': 'Les Groupements Professionnels',
  'groupements.items': groupementsJson(),
}
