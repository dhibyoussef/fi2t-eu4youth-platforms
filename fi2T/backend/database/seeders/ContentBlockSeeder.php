<?php

namespace Database\Seeders;

use App\Models\ContentBlock;
use Illuminate\Database\Seeder;

class ContentBlockSeeder extends Seeder
{
    /** @param array<string, string> $defaults */
    private function blocksFromDefaults(string $page, array $defaults): array
    {
        $blocks = [];

        foreach ($defaults as $compoundKey => $value) {
            [$section, $key] = explode('.', $compoundKey, 2);
            $type = match (true) {
                $key === 'image' => 'image',
                in_array($key, ['items', 'pillars'], true) => 'json',
                default => 'text',
            };
            $locale = ($type === 'image') ? '_all' : 'fr';

            $blocks[] = [
                'page' => $page,
                'section' => $section,
                'key' => $key,
                'locale' => $locale,
                'type' => $type,
                'label' => ucfirst($section) . ' — ' . ucfirst(str_replace('_', ' ', $key)),
                'value' => $value,
            ];
        }

        return $blocks;
    }

    public function run(): void
    {
        $blocks = [
            // Home — hero
            ['page' => 'home', 'section' => 'hero', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Hero — Image', 'value' => '/hero.jpg'],
            ['page' => 'home', 'section' => 'hero', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Hero — Titre', 'value' => 'Le futur du tourisme tunisien se construit ici !'],
            ['page' => 'home', 'section' => 'hero', 'key' => 'subtitle', 'locale' => 'fr', 'type' => 'text', 'label' => 'Hero — Sous-titre', 'value' => 'Unir, innover et valoriser le tourisme tunisien'],
            ['page' => 'home', 'section' => 'hero', 'key' => 'cta_primary', 'locale' => 'fr', 'type' => 'text', 'label' => 'Hero — CTA principal', 'value' => 'Découvrir la Fédération'],
            ['page' => 'home', 'section' => 'hero', 'key' => 'cta_secondary', 'locale' => 'fr', 'type' => 'text', 'label' => 'Hero — CTA secondaire', 'value' => 'Adhérer maintenant'],

            // About
            ['page' => 'home', 'section' => 'about', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'About — Titre', 'value' => 'Qui sommes-nous ?'],
            ['page' => 'home', 'section' => 'about', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'About — Texte', 'value' => "La Fédération Interprofessionnelle du Tourisme Tunisien est un syndicat professionnel patronal indépendant fondé en mars 2016 par divers opérateurs du tourisme tunisien, venant d’activités différentes : agences de voyages, hébergements alternatifs, loisirs, animation, sports, transports…\nLa Fi2T est ouverte à tous les acteurs du tourisme tunisien ayant un lien direct avec le secteur. Les adhérents peuvent être des personnes morales, des personnes physiques, des associations, des syndicats."],
            ['page' => 'home', 'section' => 'about', 'key' => 'cta', 'locale' => 'fr', 'type' => 'text', 'label' => 'About — CTA', 'value' => 'Voir plus'],
            ['page' => 'home', 'section' => 'about', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'About — Image', 'value' => '/images/qui-sommes-nous-card.jpg?v=home5'],
            ['page' => 'home', 'section' => 'about', 'key' => 'badge', 'locale' => 'fr', 'type' => 'text', 'label' => 'About — Badge', 'value' => "10+\nANNÉES D'ENGAGEMENT"],

            // Objectifs
            ['page' => 'home', 'section' => 'objectifs', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Objectifs — Titre', 'value' => 'Objectifs'],
            ['page' => 'home', 'section' => 'objectifs', 'key' => 'intro', 'locale' => 'fr', 'type' => 'text', 'label' => 'Objectifs — Intro', 'value' => "La Fi2T a pour objectif de fédérer différents opérateurs de tourisme au sein d'un même syndicat professionnel patronal, en vue :"],
            ['page' => 'home', 'section' => 'objectifs', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Objectifs — Liste', 'value' => json_encode([
                ['title' => 'Vision stratégique', 'desc' => 'D’apporter sa contribution en matière de vision stratégique et pratique pour la diversification et l’innovation touristique en Tunisie.'],
                ['title' => 'Intérêts des membres', 'desc' => 'Sauvegarder les intérêts économiques et sociaux de ses membres'],
                ['title' => 'Synergie', 'desc' => 'Créer une synergie entre les différents opérateurs du tourisme tunisien'],
                ['title' => 'Développement', 'desc' => 'Contribuer au développement et à l’essor du tourisme tunisien'],
                ['title' => 'Diversification', 'desc' => 'Soutenir la diversification du tourisme tunisien'],
                ['title' => 'Commercialisation', 'desc' => 'Promouvoir et soutenir la commercialisation de la diversité des produits touristiques tunisiens'],
            ], JSON_UNESCAPED_UNICODE)],

            // Groupements
            ['page' => 'home', 'section' => 'groupements', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Groupements — Titre', 'value' => 'Les Groupements Professionnels'],
            ['page' => 'home', 'section' => 'groupements', 'key' => 'intro', 'locale' => 'fr', 'type' => 'text', 'label' => 'Groupements — Intro', 'value' => ""],
            ['page' => 'home', 'section' => 'groupements', 'key' => 'bg', 'locale' => '_all', 'type' => 'image', 'label' => 'Groupements — Fond', 'value' => '/images/bg 1.png'],
            ['page' => 'home', 'section' => 'groupements', 'key' => 'items', 'locale' => '_all', 'type' => 'json', 'label' => 'Groupements — Cartes', 'value' => json_encode([
                ['label' => 'Agences de voyages', 'slug' => 'agences-de-voyages', 'icon' => '/images/icon1.png?v=5'],
                ['label' => 'Hébergement alternatif', 'slug' => 'hebergements-alternatifs', 'icon' => '/images/icon2.png?v=5'],
                ['label' => 'Tourisme culturel', 'slug' => 'tourisme-culturel', 'icon' => '/images/icon3.png?v=5'],
                ['label' => 'Tourisme de santé', 'slug' => 'tourisme-de-sante', 'icon' => '/images/icon4.png?v=5'],
                ['label' => "Tourisme d'aventure", 'slug' => 'tourisme-aventure', 'icon' => '/images/icon5.png?v=5'],
                ['label' => "Tourisme d'affaires", 'slug' => 'tourisme-affaire', 'icon' => '/images/icon6.png?v=5'],
                ['label' => 'Tourisme écologique', 'slug' => 'tourisme-ecologique', 'icon' => '/images/icon7.png?v=5'],
                ['label' => 'Tourisme aéronautique', 'slug' => 'tourisme-aeronautique', 'icon' => '/images/icon8.png?v=5'],
                ['label' => 'Tourisme automobile', 'slug' => 'tourisme-automobile', 'icon' => '/images/icon9.png?v=5'],
                ['label' => 'Tourisme golfique', 'slug' => 'tourisme-sportif', 'icon' => '/images/icon10.png?v=5'],
                ['label' => 'Tourisme nautique', 'slug' => 'tourisme-nautique', 'icon' => '/images/icon11.png?v=5'],
                ['label' => 'Tourisme subaquatique', 'slug' => 'tourisme-subaquatique', 'icon' => '/images/icon12.png?v=5'],
            ], JSON_UNESCAPED_UNICODE)],

            // Adherer
            ['page' => 'home', 'section' => 'adherer', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhérer — Titre', 'value' => 'Pourquoi adhérer à la Fi2T ?'],
            ['page' => 'home', 'section' => 'adherer', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Adhérer — Image', 'value' => '/images/Rectangle 27.png'],
            ['page' => 'home', 'section' => 'adherer', 'key' => 'badge', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhérer — Badge', 'value' => "50+\nMEMBRES ACTIFS"],
            ['page' => 'home', 'section' => 'adherer', 'key' => 'cta', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhérer — CTA', 'value' => 'Adhérer maintenant'],
            ['page' => 'home', 'section' => 'adherer', 'key' => 'reasons', 'locale' => 'fr', 'type' => 'json', 'label' => 'Adhérer — Raisons', 'value' => json_encode([
                ['title' => 'Représentation Institutionnelle', 'desc' => 'Être représenté auprès des gouvernements et institutions'],
                ['title' => 'Réseautage Stratégique', 'desc' => 'Participer à un réseau professionnel structuré'],
                ['title' => 'Visibilité Accrue', 'desc' => 'Améliorer sa visibilité et ses opportunités commerciales'],
                ['title' => 'Label de Qualité', 'desc' => "Bénéficier d'un label de qualité et de conformité"],
                ['title' => 'Ressources & Expertise', 'desc' => 'Accéder à des ressources professionnelles et formations, renforçant ainsi sa compétitivité sur le marché tunisien et international'],
            ], JSON_UNESCAPED_UNICODE)],

            // Actualites home
            ['page' => 'home', 'section' => 'actualites', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Actualités — Titre', 'value' => 'Dernières Actualités'],
            ['page' => 'home', 'section' => 'actualites', 'key' => 'cta', 'locale' => 'fr', 'type' => 'text', 'label' => 'Actualités — CTA', 'value' => 'Voir plus'],
            ['page' => 'home', 'section' => 'actualites', 'key' => 'facebook_note', 'locale' => 'fr', 'type' => 'text', 'label' => 'Actualités — Note Facebook', 'value' => 'Toute notre actualité depuis la création de la Fi2T est contenue dans notre page Facebook officielle.'],
            ['page' => 'home', 'section' => 'actualites', 'key' => 'facebook_cta', 'locale' => 'fr', 'type' => 'text', 'label' => 'Actualités — CTA Facebook', 'value' => 'Voir sur Facebook'],
            ['page' => 'home', 'section' => 'actualites', 'key' => 'facebook_url', 'locale' => '_all', 'type' => 'text', 'label' => 'Actualités — URL Facebook', 'value' => 'https://www.facebook.com/F.i.T.Tunisie/'],
            ['page' => 'home', 'section' => 'partners', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Partenaires — Titre', 'value' => 'Partenaires'],
            ['page' => 'home', 'section' => 'partners', 'key' => 'items', 'locale' => '_all', 'type' => 'json', 'label' => 'Partenaires — Logos', 'value' => json_encode([
                ['name' => 'Ministère du Tourisme', 'logo' => '/images/partners/ministere-tourisme.png?v=3', 'url' => 'https://www.tourisme.gov.tn/'],
                ['name' => 'ONTT', 'logo' => '/images/partners/ontt.png?v=3', 'url' => 'https://www.discovertunisia.com/'],
                ['name' => 'GIZ', 'logo' => '/images/partners/giz.svg?v=3', 'url' => 'https://www.giz.de/'],
                ['name' => 'Swiss Contact', 'logo' => '/images/partners/swisscontact.svg?v=3', 'url' => 'https://www.swisscontact.org/'],
                ['name' => 'USAID', 'logo' => '/images/partners/usaid.svg?v=3', 'url' => 'https://www.usaid.gov/'],
                ['name' => 'Union Européenne', 'logo' => '/images/partners/ue.svg?v=3', 'url' => 'https://european-union.europa.eu/'],
                ['name' => 'BIOTED', 'logo' => '/images/partners/bioted.png?v=6', 'url' => 'https://www.eco-conseil.be/le-projet-bioted/'],
                ['name' => 'Leaders International', 'logo' => '/images/partners/leaders-international.png?v=6', 'url' => 'https://leadersinternational.org/'],
            ], JSON_UNESCAPED_UNICODE)],

            ['page' => 'home', 'section' => 'actualites', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Actualités — Cartes', 'value' => json_encode([
                ['slug' => 'walid-tritar-president-fi2t', 'title' => 'Tourisme: Walid Tritar, nouveau Président de la Fi2T', 'desc' => 'Walid Tritar, a été élu nouveau Président de la Fi2T (Fédération interprofessionnelle du tourisme tunisien) pour la période 2026-2029....', 'date' => '11 Mai 2026', 'img' => '/images/act1.jpg'],
                ['slug' => 'secteur-sous-pression', 'title' => 'Secteur touristique: sous pression, mais résilient...', 'desc' => 'Le secteur touristique mondiale, traverse une phase, avec des marché plus prédenr et des décisions de voyage de plus en plus tardive....', 'date' => '22 Mai 2026', 'img' => '/images/act2.jpg'],
                ['slug' => 'houssem-azouz-centre-ouest', 'title' => 'Houssem Azouz (Président de la Fédération interprofessionnelle...', 'desc' => 'Houssem Azouz Le Centre Ouest du pays frappé par l’immensité de ses vestiges et leur couleur...', 'date' => '7 Avril 2026', 'img' => '/images/act3.jpg'],
            ], JSON_UNESCAPED_UNICODE)],

            // CTA
            ['page' => 'home', 'section' => 'cta', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'CTA — Titre', 'value' => 'Rejoignez notre vision pour le futur'],
            ['page' => 'home', 'section' => 'cta', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'CTA — Texte', 'value' => "Devenez membre de la Fédération et participez activement à la construction\nd'un tourisme tunisien d'exception."],
            ['page' => 'home', 'section' => 'cta', 'key' => 'bg', 'locale' => '_all', 'type' => 'image', 'label' => 'CTA — Fond', 'value' => '/images/bg--1.png'],
            ['page' => 'home', 'section' => 'cta', 'key' => 'primary', 'locale' => 'fr', 'type' => 'text', 'label' => 'CTA — Bouton 1', 'value' => 'Rejoindre la fédération'],
            ['page' => 'home', 'section' => 'cta', 'key' => 'secondary', 'locale' => 'fr', 'type' => 'text', 'label' => 'CTA — Bouton 2', 'value' => 'Contacter le bureau'],

            // Qui sommes-nous
            ['page' => 'qui-sommes-nous', 'section' => 'hero', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Bannière — Image', 'value' => '/images/qui-sommes-nous-banner.png?v=8'],
            ['page' => 'qui-sommes-nous', 'section' => 'hero', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bannière — Titre', 'value' => 'Qui sommes-nous'],
            ['page' => 'qui-sommes-nous', 'section' => 'mission', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Mission — Titre', 'value' => 'Notre Histoire & Mission'],
            ['page' => 'qui-sommes-nous', 'section' => 'mission', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'Mission — Texte', 'value' => "La Fédération Interprofessionnelle du Tourisme Tunisien est un syndicat professionnel patronal indépendant fondé en mars 2016 par divers opérateurs du tourisme tunisien, venant d’activités différentes : agences de voyages, hébergements alternatifs, loisirs, animation, sports, transports…\nLa Fi2T est ouverte à tous les acteurs du tourisme tunisien ayant un lien direct avec le secteur. Les adhérents peuvent être des personnes morales, des personnes physiques, des associations, des syndicats."],
            ['page' => 'qui-sommes-nous', 'section' => 'mission', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Mission — Image', 'value' => '/images/qui-sommes-nous-mission-card.png?v=1'],
            ['page' => 'qui-sommes-nous', 'section' => 'values', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Objectifs — Titre', 'value' => 'Objectifs'],
            ['page' => 'qui-sommes-nous', 'section' => 'values', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Objectifs — Cartes', 'value' => json_encode([
                ['title' => 'VISION STRATÉGIQUE', 'desc' => 'Apporter sa contribution en matière de vision stratégique et pratique pour la diversification et l’innovation touristique en Tunisie.', 'icon' => '/images/value-innovation.svg'],
                ['title' => 'INTÉRÊTS DES MEMBRES', 'desc' => 'Sauvegarder les intérêts économiques et sociaux de ses membres.', 'icon' => '/images/value-integrity.svg'],
                ['title' => 'SYNERGIE', 'desc' => 'Créer une synergie entre les différents opérateurs du tourisme tunisien.', 'icon' => '/images/value-synergie.svg'],
                ['title' => 'DÉVELOPPEMENT', 'desc' => 'Contribuer au développement et à l’essor du tourisme tunisien.', 'icon' => '/images/value-excellence.svg'],
                ['title' => 'DIVERSIFICATION', 'desc' => 'Soutenir la diversification du tourisme tunisien.', 'icon' => '/images/value-representation.svg'],
                ['title' => 'COMMERCIALISATION', 'desc' => 'Promouvoir et soutenir la commercialisation de la diversité des produits touristiques tunisiens.', 'icon' => '/images/value-durabilite.svg'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'qui-sommes-nous', 'section' => 'diversify', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Diversification — Titre', 'value' => 'Pourquoi diversifier et innover ?'],
            ['page' => 'qui-sommes-nous', 'section' => 'diversify', 'key' => 'intro', 'locale' => 'fr', 'type' => 'text', 'label' => 'Diversification — Intro', 'value' => 'La diversification des produits touristiques n’est pas un luxe, c’est plutôt :'],
            ['page' => 'qui-sommes-nous', 'section' => 'diversify', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Diversification — Points', 'value' => json_encode([
                ['title' => 'Adaptation à la demande', 'desc' => 'Une adaptation à la demande touristique mondiale et nationale, de plus en plus segmentée'],
                ['title' => 'Extension temporelle', 'desc' => 'Une extension de l’activité touristique dans le temps'],
                ['title' => 'Extension spatiale', 'desc' => 'Une extension de l’activité touristique dans l’espace'],
                ['title' => 'Optimisation des revenus', 'desc' => 'La réalisation de meilleures recettes en devises par l’attraction de clientèles à fort pouvoir d’achat'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'qui-sommes-nous', 'section' => 'join', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhésion — Titre', 'value' => "Prêt à rejoindre l'excellence ?"],
            ['page' => 'qui-sommes-nous', 'section' => 'join', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhésion — Texte', 'value' => 'Contribuez activement à la transformation du tourisme tunisien en devenant membre de notre fédération interprofessionnelle.'],
            ['page' => 'qui-sommes-nous', 'section' => 'join', 'key' => 'cta', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhésion — Bouton', 'value' => 'Devenir membre'],

            // Organisation
            ['page' => 'organisation', 'section' => 'hero', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Bannière — Image', 'value' => '/images/qui-sommes-nous-banner.png?v=8'],
            ['page' => 'organisation', 'section' => 'hero', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bannière — Titre', 'value' => 'Organisation'],
            ['page' => 'organisation', 'section' => 'stats', 'key' => 'value_groupements', 'locale' => 'fr', 'type' => 'text', 'label' => 'Chiffre — Groupements', 'value' => '12'],
            ['page' => 'organisation', 'section' => 'stats', 'key' => 'label_groupements', 'locale' => 'fr', 'type' => 'text', 'label' => 'Libellé — Groupements', 'value' => 'GROUPEMENTS'],
            ['page' => 'organisation', 'section' => 'stats', 'key' => 'value_regions', 'locale' => 'fr', 'type' => 'text', 'label' => 'Chiffre — Régions', 'value' => '11'],
            ['page' => 'organisation', 'section' => 'stats', 'key' => 'label_regions', 'locale' => 'fr', 'type' => 'text', 'label' => 'Libellé — Régions', 'value' => 'RÉGIONS'],
            ['page' => 'organisation', 'section' => 'stats', 'key' => 'mandate_years', 'locale' => 'fr', 'type' => 'text', 'label' => 'Chiffre — Mandat', 'value' => '03'],
            ['page' => 'organisation', 'section' => 'stats', 'key' => 'label_mandate', 'locale' => 'fr', 'type' => 'text', 'label' => 'Libellé — Mandat', 'value' => 'ANS DE MANDAT'],
            ['page' => 'organisation', 'section' => 'intro', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Intro — Titre', 'value' => 'Organisation'],
            ['page' => 'organisation', 'section' => 'intro', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'Intro — Texte', 'value' => "La Fi2T est composée :\n- D’un Conseil d’Administration composé de 5 membres : 1 Président, 2 Vice-Présidents, 1 Secrétaire Général et 1 Trésorier\n- D’un Conseil Exécutif : composé des membres du Conseil d’Administration, des membres dirigeants des Groupements Professionnels et des membres dirigeants des Bureaux Régionaux.\n- Les Groupements Professionnels sont dirigés par 3 membres : 1 Président, 1 Vice-Président et 1 Secrétaire Général\n- Les Bureaux Régionaux sont dirigés par 3 membres : 1 Président, 1 Vice-Président et 1 Secrétaire Général\nLes membres de ces différentes structures sont élus pour un mandat de 3 ans identique au mandat du Conseil d’Administration."],
            ['page' => 'organisation', 'section' => 'board', 'key' => 'page_title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bureau — Titre page', 'value' => 'Le Conseil d’administration'],
            ['page' => 'organisation', 'section' => 'board', 'key' => 'lead', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bureau — Chapô', 'value' => 'Le Conseil d’Administration de la Fi2T est composé de 5 membres élus lors de l’assemblée constitutive.'],
            ['page' => 'organisation', 'section' => 'board', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bureau — Titre', 'value' => 'Composition actuelle'],
            ['page' => 'organisation', 'section' => 'board', 'key' => 'members', 'locale' => 'fr', 'type' => 'json', 'label' => 'Bureau — Membres', 'value' => json_encode([
                ['name' => 'Mr Walid Tritar', 'role' => 'PRÉSIDENT', 'image' => '/images/org-board/walid-tritar.svg?v=1'],
                ['name' => 'Mme Chahla Khekhia', 'role' => 'VICE-PRÉSIDENTE', 'image' => '/images/org-board/chahla-khekhia.svg?v=1'],
                ['name' => 'Mr Marouene Noureddine', 'role' => 'VICE-PRÉSIDENT', 'image' => '/images/org-board/marouene-noureddine.svg?v=1'],
                ['name' => 'Mme Kaouthar Meddeb', 'role' => 'TRÉSORIÈRE', 'image' => '/images/org-board/kaouthar-meddeb.svg?v=1'],
                ['name' => 'Mr Hassen Haddar', 'role' => 'SECRÉTAIRE GÉNÉRAL', 'image' => '/images/org-board/hassen-haddar.svg?v=1'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'organisation', 'section' => 'outgoing', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bureau sortant — Titre', 'value' => 'Bureau sortant'],
            ['page' => 'organisation', 'section' => 'outgoing', 'key' => 'members', 'locale' => 'fr', 'type' => 'json', 'label' => 'Bureau sortant — Membres', 'value' => json_encode([
                ['name' => 'Mr Houssem Ben Azouz', 'role' => 'Ex-Président ; Président d’Honneur et Coordinateur Général', 'image' => '/images/org-board/houssem-ben-azouz.svg?v=1'],
                ['name' => 'Mr Ahmed Oubaia', 'role' => 'Ex-Vice-Président et Président d’Honneur', 'image' => '/images/org-board/ahmed-oubaia.svg?v=1'],
                ['name' => 'Mr Néjib Gana', 'role' => 'Ex-Secrétaire Général et Président d’Honneur', 'image' => '/images/org-board/nejib-gana.svg?v=1'],
                ['name' => 'Mr Omar Cherif', 'role' => 'Ex-Trésorier et Président d’Honneur', 'image' => '/images/org-board/omar-cherif.svg?v=1'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'organisation', 'section' => 'headquarters', 'key' => 'page_title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Siège — Titre page', 'value' => 'Le Siège'],
            ['page' => 'organisation', 'section' => 'headquarters', 'key' => 'lead', 'locale' => 'fr', 'type' => 'text', 'label' => 'Siège — Chapô', 'value' => 'L’équipe permanente du siège accompagne les adhérents, les groupements et les bureaux régionaux au quotidien.'],
            ['page' => 'organisation', 'section' => 'headquarters', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Siège — Titre', 'value' => 'Le bureau du siège de la Fi2T'],
            ['page' => 'organisation', 'section' => 'headquarters', 'key' => 'staff', 'locale' => 'fr', 'type' => 'json', 'label' => 'Siège — Équipe', 'value' => json_encode([
                ['initials' => 'KB', 'name' => "Mlle Khawla B'Chir", 'role' => 'Directrice Exécutive'],
                ['initials' => 'HI', 'name' => 'Mlle Hiba Inoubli', 'role' => 'Webmaster'],
                ['initials' => 'SS', 'name' => 'Mlle Sarra Sallemi', 'role' => 'Affaires administratives et comptables'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'organisation', 'section' => 'regional', 'key' => 'page_title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Régional — Titre page', 'value' => 'Les Bureaux Régionaux'],
            ['page' => 'organisation', 'section' => 'regional', 'key' => 'lead', 'locale' => 'fr', 'type' => 'text', 'label' => 'Régional — Chapô', 'value' => 'Présents sur tout le territoire, les bureaux régionaux sont dirigés par 3 membres : 1 Président, 1 Vice-Président et 1 Secrétaire Général.'],
            ['page' => 'organisation', 'section' => 'regional', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Régional — Titre', 'value' => 'Les Bureaux Régionaux'],
            ['page' => 'organisation', 'section' => 'regional', 'key' => 'map_label', 'locale' => 'fr', 'type' => 'text', 'label' => 'Régional — Libellé carte', 'value' => 'Bureaux Régionaux'],
            ['page' => 'organisation', 'section' => 'regional', 'key' => 'map_image', 'locale' => '_all', 'type' => 'image', 'label' => 'Régional — Carte', 'value' => '/images/org-regional-map-card.png?v=2'],
            ['page' => 'organisation', 'section' => 'regional', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Régional — Bureaux', 'value' => json_encode([
                ['name' => 'Mr Nebil Azouz', 'region' => 'Bizerte'],
                ['name' => 'Mr Marouene Noureddine', 'region' => 'Ain Draham/Tabarka'],
                ['name' => 'Mme Raoudha Chennoufi', 'region' => 'Le Kef'],
                ['name' => 'Mr Foued Ben Ammar', 'region' => 'Hammamet/Nabeul'],
                ['name' => 'Mr Akram Bouzguarrou', 'region' => 'Sousse'],
                ['name' => 'Mr Khaled Hayouni', 'region' => 'Monastir/Mahdia'],
                ['name' => 'Mr Belgacem Kalawi', 'region' => 'Kairouan'],
                ['name' => 'Mr Alaeddine Khodhri', 'region' => 'Gabes'],
                ['name' => 'Mr Hatem Mejlissi', 'region' => 'Djerba'],
                ['name' => 'Mr Taoufik Bettoumi', 'region' => 'Douz'],
                ['name' => 'Mr Naceur Zaalane', 'region' => 'Tozeur'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'organisation', 'section' => 'groupements', 'key' => 'page_title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Groupements — Titre page', 'value' => 'Les Groupements Professionnels'],
            ['page' => 'organisation', 'section' => 'groupements', 'key' => 'lead', 'locale' => 'fr', 'type' => 'text', 'label' => 'Groupements — Chapô', 'value' => ""],
            ['page' => 'organisation', 'section' => 'groupements', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Groupements — Titre', 'value' => 'Les Groupements Professionnels'],
            ['page' => 'organisation', 'section' => 'groupements', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Groupements — Cartes', 'value' => json_encode([
                ['label' => 'Agences de voyages', 'slug' => 'agences-de-voyages', 'icon' => '/images/icon1.png?v=5'],
                ['label' => 'Hébergement alternatif', 'slug' => 'hebergements-alternatifs', 'icon' => '/images/icon2.png?v=5'],
                ['label' => 'Tourisme culturel', 'slug' => 'tourisme-culturel', 'icon' => '/images/icon3.png?v=5'],
                ['label' => 'Tourisme de santé', 'slug' => 'tourisme-de-sante', 'icon' => '/images/icon4.png?v=5'],
                ['label' => "Tourisme d'aventure", 'slug' => 'tourisme-aventure', 'icon' => '/images/icon5.png?v=5'],
                ['label' => "Tourisme d'affaires", 'slug' => 'tourisme-affaire', 'icon' => '/images/icon6.png?v=5'],
                ['label' => 'Tourisme écologique', 'slug' => 'tourisme-ecologique', 'icon' => '/images/icon7.png?v=5'],
                ['label' => 'Tourisme aéronautique', 'slug' => 'tourisme-aeronautique', 'icon' => '/images/icon8.png?v=5'],
                ['label' => 'Tourisme automobile', 'slug' => 'tourisme-automobile', 'icon' => '/images/icon9.png?v=5'],
                ['label' => 'Tourisme golfique', 'slug' => 'tourisme-sportif', 'icon' => '/images/icon10.png?v=5'],
                ['label' => 'Tourisme nautique', 'slug' => 'tourisme-nautique', 'icon' => '/images/icon11.png?v=5'],
                ['label' => 'Tourisme subaquatique', 'slug' => 'tourisme-subaquatique', 'icon' => '/images/icon12.png?v=5'],
            ], JSON_UNESCAPED_UNICODE)],

            // Actualités
            ['page' => 'actualites', 'section' => 'hero', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Bannière — Image', 'value' => '/images/desert-banner.jpg?v=1'],
            ['page' => 'actualites', 'section' => 'hero', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bannière — Titre', 'value' => 'Actualités'],
            ['page' => 'actualites', 'section' => 'facebook', 'key' => 'note', 'locale' => 'fr', 'type' => 'text', 'label' => 'Facebook — Note', 'value' => 'Toute notre actualité depuis la création de la Fi2T est contenue dans notre page Facebook officielle.'],
            ['page' => 'actualites', 'section' => 'facebook', 'key' => 'cta', 'locale' => 'fr', 'type' => 'text', 'label' => 'Facebook — CTA', 'value' => 'Voir sur Facebook'],
            ['page' => 'actualites', 'section' => 'facebook', 'key' => 'url', 'locale' => '_all', 'type' => 'text', 'label' => 'Facebook — URL', 'value' => 'https://www.facebook.com/F.i.T.Tunisie/'],
            ['page' => 'actualites', 'section' => 'grid', 'key' => 'per_page', 'locale' => '_all', 'type' => 'text', 'label' => 'Actualités — Par page', 'value' => '9'],
            ['page' => 'actualites', 'section' => 'grid', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Actualités — Cartes', 'value' => json_encode(require __DIR__ . '/data/actualites-articles.php', JSON_UNESCAPED_UNICODE)],
            ['page' => 'actualites', 'section' => 'article', 'key' => 'banner', 'locale' => '_all', 'type' => 'image', 'label' => 'Article — Bannière', 'value' => '/images/article-banner.jpg?v=1'],

            // Contact
            ['page' => 'contact', 'section' => 'hero', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Bannière — Image', 'value' => '/images/desert-banner.jpg?v=1'],
            ['page' => 'contact', 'section' => 'hero', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bannière — Titre', 'value' => 'Contact'],
            ['page' => 'contact', 'section' => 'info', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Info — Titre', 'value' => 'Informations de contact'],
            ['page' => 'contact', 'section' => 'info', 'key' => 'per_page', 'locale' => '_all', 'type' => 'text', 'label' => 'Info — Par page', 'value' => '3'],
            ['page' => 'contact', 'section' => 'info', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Info — Coordonnées', 'value' => json_encode([
                ['icon' => '/images/icon-address.svg', 'label' => 'Adresse', 'value' => "Rue du Lac Turkana, Les Berges du\nLac 1\n1053 Tunis, Tunisie"],
                ['icon' => '/images/icon-phone.svg', 'label' => 'Téléphone', 'value' => '+216 29 710 507'],
                ['icon' => '/images/icon-email.svg', 'label' => 'Email', 'value' => 'contact@fit-tunisie.org'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'contact', 'section' => 'form', 'key' => 'label_name', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label nom', 'value' => 'Nom complet'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'placeholder_name', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder nom', 'value' => 'Nom et prénom'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'label_email', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label email', 'value' => 'Adresse email'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'placeholder_email', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder email', 'value' => 'nom@exemple.com'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'label_subject', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label sujet', 'value' => 'Sujet'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'placeholder_subject', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder sujet', 'value' => 'Ex: Demande de...'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'label_message', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label message', 'value' => 'Message'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'placeholder_message', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder message', 'value' => 'Votre message ici...'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'submit', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Bouton', 'value' => 'Envoyer'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'success', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Message de succès', 'value' => 'Merci — votre message a bien été envoyé.'],

            // Fiche adhésion
            ['page' => 'fiche-adhesion', 'section' => 'hero', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Bannière — Image', 'value' => '/images/desert-banner.jpg?v=1'],
            ['page' => 'fiche-adhesion', 'section' => 'hero', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Bannière — Titre', 'value' => 'Fiche adhésion'],
            ['page' => 'fiche-adhesion', 'section' => 'intro', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Intro — Titre', 'value' => 'Rejoignez la FI2T'],
            ['page' => 'fiche-adhesion', 'section' => 'intro', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'Intro — Texte', 'value' => "Devenez membre de la Fédération Interprofessionnelle du Tourisme Tunisien et participez activement à la modernisation, la diversification et la professionnalisation du tourisme tunisien."],
            ['page' => 'fiche-adhesion', 'section' => 'adherer', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhésion — Titre', 'value' => 'Pourquoi adhérer à la Fi2T ?'],
            ['page' => 'fiche-adhesion', 'section' => 'adherer', 'key' => 'image', 'locale' => '_all', 'type' => 'image', 'label' => 'Adhésion — Image', 'value' => '/images/Rectangle 27.png'],
            ['page' => 'fiche-adhesion', 'section' => 'adherer', 'key' => 'badge', 'locale' => 'fr', 'type' => 'text', 'label' => 'Adhésion — Badge', 'value' => "50+\nMEMBRES ACTIFS"],
            ['page' => 'fiche-adhesion', 'section' => 'adherer', 'key' => 'badge_pos', 'locale' => '_all', 'type' => 'json', 'label' => 'Adhésion — Position badge', 'value' => '{"right":-26,"bottom":-41}'],
            ['page' => 'fiche-adhesion', 'section' => 'adherer', 'key' => 'per_page', 'locale' => '_all', 'type' => 'text', 'label' => 'Adhésion — Par page', 'value' => '5'],
            ['page' => 'fiche-adhesion', 'section' => 'adherer', 'key' => 'reasons', 'locale' => 'fr', 'type' => 'json', 'label' => 'Adhésion — Avantages', 'value' => json_encode([
                ['title' => 'Représentation Institutionnelle', 'desc' => 'Être représenté auprès des gouvernements et institutions'],
                ['title' => 'Réseautage Stratégique', 'desc' => 'Participer à un réseau professionnel structuré'],
                ['title' => 'Visibilité Accrue', 'desc' => 'Améliorer sa visibilité et ses opportunités commerciales'],
                ['title' => 'Label de Qualité', 'desc' => 'Bénéficier d’un label de qualité et de conformité'],
                ['title' => 'Ressources & Expertise', 'desc' => 'Accéder à des ressources professionnelles et formations, renforçant ainsi sa compétitivité sur le marché tunisien et international'],
            ], JSON_UNESCAPED_UNICODE)],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Titre', 'value' => 'Demande d’adhésion'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'label_org', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label raison sociale', 'value' => 'RAISON SOCIALE'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'placeholder_org', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder raison sociale', 'value' => 'Nom de votre structure'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'label_contact', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label contact', 'value' => 'NOM DU CONTACT'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'placeholder_contact', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder contact', 'value' => 'Nom et prénom'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'label_email', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label email', 'value' => 'ADRESSE EMAIL'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'placeholder_email', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder email', 'value' => 'nom@exemple.com'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'label_phone', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label téléphone', 'value' => 'TÉLÉPHONE'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'placeholder_phone', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder téléphone', 'value' => '+216 XX XXX XXX'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'label_activity', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label activité', 'value' => 'ACTIVITÉ / GROUPEMENT'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'placeholder_activity', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder activité', 'value' => 'Ex: Agences de voyages'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'label_message', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Label message', 'value' => 'MESSAGE'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'placeholder_message', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Placeholder message', 'value' => 'Présentez brièvement votre activité…'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'submit', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Bouton', 'value' => 'Envoyer la demande'],
            ['page' => 'fiche-adhesion', 'section' => 'form', 'key' => 'success', 'locale' => 'fr', 'type' => 'text', 'label' => 'Formulaire — Message de succès', 'value' => 'Merci — votre demande d’adhésion a bien été envoyée.'],

            // Global footer / settings / navigation
            ['page' => 'global', 'section' => 'header', 'key' => 'logo', 'locale' => '_all', 'type' => 'image', 'label' => 'Logo du site', 'value' => '/logo.png'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'home', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Accueil', 'value' => 'Accueil'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'apropos', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — A propos', 'value' => 'A propos'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'about', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Qui sommes-nous', 'value' => 'Qui sommes-nous ?'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'objectifs', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Objectifs', 'value' => 'Objectifs'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'diversify', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Diversifier', 'value' => 'Pourquoi diversifier et innover ?'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'adherer', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Adhérer', 'value' => 'Pourquoi adhérer à la Fi2T ?'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'news', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Actualité', 'value' => 'Actualité'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'organisation', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Organisation', 'value' => 'Organisation'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'board', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Conseil d’administration', 'value' => 'Le Conseil d’administration'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'regional', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Bureaux régionaux', 'value' => 'Les Bureaux Régionaux'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'groupements', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Groupements', 'value' => 'Les Groupements Professionnels'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'headquarters', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Siège', 'value' => 'Le Siège'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'membership', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Fiche adhésion', 'value' => 'Fiche adhésion'],
            ['page' => 'global', 'section' => 'nav', 'key' => 'contact', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nav — Contact', 'value' => 'Contact'],
            ['page' => 'global', 'section' => 'settings', 'key' => 'hotel_name', 'locale' => 'fr', 'type' => 'text', 'label' => 'Nom du site', 'value' => 'FI2T'],
            ['page' => 'global', 'section' => 'settings', 'key' => 'tagline', 'locale' => 'fr', 'type' => 'text', 'label' => 'Slogan', 'value' => 'Fédération Interprofessionnelle du Tourisme Tunisien'],
            ['page' => 'global', 'section' => 'footer', 'key' => 'about', 'locale' => 'fr', 'type' => 'text', 'label' => 'Footer — À propos', 'value' => 'La Fédération Interprofessionnelle du Tourisme Tunisien œuvre pour le rayonnement et la modernisation du secteur.'],
            ['page' => 'global', 'section' => 'footer', 'key' => 'address', 'locale' => 'fr', 'type' => 'text', 'label' => 'Footer — Adresse', 'value' => "Résidence MERIEM - Appt N°2 -\nLes Berges du Lac 1\n1053 Tunis, Tunisie"],
            ['page' => 'global', 'section' => 'footer', 'key' => 'phone_1', 'locale' => 'fr', 'type' => 'text', 'label' => 'Footer — Téléphone 1', 'value' => '+216 29 710 507'],
            ['page' => 'global', 'section' => 'footer', 'key' => 'phone_2', 'locale' => 'fr', 'type' => 'text', 'label' => 'Footer — Téléphone 2', 'value' => '+216 24 940 022'],
            ['page' => 'global', 'section' => 'footer', 'key' => 'email', 'locale' => 'fr', 'type' => 'text', 'label' => 'Footer — Email', 'value' => 'contact@fit-tunisie.org'],
            ['page' => 'global', 'section' => 'footer', 'key' => 'email', 'locale' => 'en', 'type' => 'text', 'label' => 'Footer — Email', 'value' => 'contact@fit-tunisie.org'],
            ['page' => 'global', 'section' => 'footer', 'key' => 'email', 'locale' => 'ar', 'type' => 'text', 'label' => 'Footer — Email', 'value' => 'contact@fit-tunisie.org'],
            ['page' => 'global', 'section' => 'footer', 'key' => 'newsletter', 'locale' => 'fr', 'type' => 'text', 'label' => 'Footer — Newsletter', 'value' => 'Restez informé de nos dernières initiatives.'],
            ['page' => 'global', 'section' => 'settings', 'key' => 'email', 'locale' => '_all', 'type' => 'text', 'label' => 'E-mail principal', 'value' => 'contact@fit-tunisie.org'],
            ['page' => 'global', 'section' => 'forms', 'key' => 'notify_contact', 'locale' => '_all', 'type' => 'text', 'label' => 'Contact — e-mail de réception', 'value' => 'contact@fit-tunisie.org'],
            ['page' => 'global', 'section' => 'forms', 'key' => 'notify_newsletter', 'locale' => '_all', 'type' => 'text', 'label' => 'Newsletter — e-mail de réception', 'value' => 'newsletter.fi2t@fit-tunisie.org'],
            ['page' => 'global', 'section' => 'forms', 'key' => 'notify_adhesion', 'locale' => '_all', 'type' => 'text', 'label' => 'Adhésion — e-mail de réception', 'value' => 'adhesion.fi2t@fit-tunisie.org'],
        ];

        $groupementDefaults = require __DIR__ . '/data/groupement-blocks.php';
        foreach ($groupementDefaults as $page => $defaults) {
            $blocks = array_merge($blocks, $this->blocksFromDefaults($page, $defaults));
        }

        $i18nBlocks = require __DIR__ . '/data/fi2t-i18n-blocks.php';
        $blocks = array_merge($blocks, $i18nBlocks);

        // Prefer per-locale JSON over legacy `_all` text JSON (so EN/AR can differ)
        ContentBlock::query()
            ->where('page', 'home')
            ->whereIn('key', ['items', 'reasons'])
            ->where('locale', '_all')
            ->where('type', 'json')
            ->each(function (ContentBlock $block) {
                ContentBlock::updateOrCreate(
                    [
                        'page' => $block->page,
                        'section' => $block->section,
                        'key' => $block->key,
                        'locale' => 'fr',
                    ],
                    [
                        'type' => 'json',
                        'label' => $block->label,
                        'value' => $block->value,
                        'sort_order' => $block->sort_order,
                    ]
                );
                $block->delete();
            });

        foreach ($blocks as $block) {
            ContentBlock::updateOrCreate(
                [
                    'page' => $block['page'],
                    'section' => $block['section'],
                    'key' => $block['key'],
                    'locale' => $block['locale'],
                ],
                $block
            );
        }

        // Ensure every FR text/json block has EN + AR sibling rows (empty if not yet translated)
        $knownI18n = [];
        foreach ($i18nBlocks as $block) {
            $knownI18n[$block['page'].'|'.$block['section'].'.'.$block['key'].'|'.$block['locale']] = $block['value'];
        }

        ContentBlock::query()
            ->where('locale', 'fr')
            ->whereIn('type', ['text', 'json'])
            ->get()
            ->each(function (ContentBlock $fr) use ($knownI18n) {
                foreach (['en', 'ar'] as $locale) {
                    $id = $fr->page.'|'.$fr->section.'.'.$fr->key.'|'.$locale;
                    $knownValue = $knownI18n[$id] ?? null;

                    if ($knownValue !== null && $knownValue !== '') {
                        ContentBlock::updateOrCreate(
                            [
                                'page' => $fr->page,
                                'section' => $fr->section,
                                'key' => $fr->key,
                                'locale' => $locale,
                            ],
                            [
                                'type' => $fr->type,
                                'label' => $fr->label,
                                'value' => $knownValue,
                                'sort_order' => $fr->sort_order,
                            ]
                        );
                    } else {
                        ContentBlock::firstOrCreate(
                            [
                                'page' => $fr->page,
                                'section' => $fr->section,
                                'key' => $fr->key,
                                'locale' => $locale,
                            ],
                            [
                                'type' => $fr->type,
                                'label' => $fr->label,
                                'value' => '',
                                'sort_order' => $fr->sort_order,
                            ]
                        );
                    }
                }
            });
    }
}
