<?php

namespace Database\Seeders;

use App\Models\ContentBlock;
use Illuminate\Database\Seeder;

/**
 * Align preprod CMS copy with the official FI2T brief (objectifs, about, QSN).
 * Safe to re-run: updateOrCreate on specific blocks only.
 *
 *   php artisan db:seed --class=FixBriefContentSeeder --force
 */
class FixBriefContentSeeder extends Seeder
{
    public function run(): void
    {
        $aboutBody = "La Fédération Interprofessionnelle du Tourisme Tunisien est un syndicat professionnel patronal indépendant fondé en mars 2016 par divers opérateurs du tourisme tunisien, venant d’activités différentes : agences de voyages, hébergements alternatifs, loisirs, animation, sports, transports…\nLa Fi2T est ouverte à tous les acteurs du tourisme tunisien ayant un lien direct avec le secteur. Les adhérents peuvent être des personnes morales, des personnes physiques, des associations, des syndicats.";

        $objectifsIntro = "La Fi2T a pour objectif de fédérer différents opérateurs de tourisme au sein d'un même syndicat professionnel patronal, en vue :";

        $objectifsItems = json_encode([
            ['title' => 'Vision stratégique', 'desc' => 'D’apporter sa contribution en matière de vision stratégique et pratique pour la diversification et l’innovation touristique en Tunisie.'],
            ['title' => 'Intérêts des membres', 'desc' => 'Sauvegarder les intérêts économiques et sociaux de ses membres'],
            ['title' => 'Synergie', 'desc' => 'Créer une synergie entre les différents opérateurs du tourisme tunisien'],
            ['title' => 'Développement', 'desc' => 'Contribuer au développement et à l’essor du tourisme tunisien'],
            ['title' => 'Diversification', 'desc' => 'Soutenir la diversification du tourisme tunisien'],
            ['title' => 'Commercialisation', 'desc' => 'Promouvoir et soutenir la commercialisation de la diversité des produits touristiques tunisiens'],
        ], JSON_UNESCAPED_UNICODE);

        $valuesItems = json_encode([
            ['title' => 'VISION STRATÉGIQUE', 'desc' => 'Apporter sa contribution en matière de vision stratégique et pratique pour la diversification et l’innovation touristique en Tunisie.', 'icon' => '/images/value-innovation.svg'],
            ['title' => 'INTÉRÊTS DES MEMBRES', 'desc' => 'Sauvegarder les intérêts économiques et sociaux de ses membres.', 'icon' => '/images/value-integrity.svg'],
            ['title' => 'SYNERGIE', 'desc' => 'Créer une synergie entre les différents opérateurs du tourisme tunisien.', 'icon' => '/images/value-synergie.svg'],
            ['title' => 'DÉVELOPPEMENT', 'desc' => 'Contribuer au développement et à l’essor du tourisme tunisien.', 'icon' => '/images/value-excellence.svg'],
            ['title' => 'DIVERSIFICATION', 'desc' => 'Soutenir la diversification du tourisme tunisien.', 'icon' => '/images/value-representation.svg'],
            ['title' => 'COMMERCIALISATION', 'desc' => 'Promouvoir et soutenir la commercialisation de la diversité des produits touristiques tunisiens.', 'icon' => '/images/value-durabilite.svg'],
        ], JSON_UNESCAPED_UNICODE);

        $blocks = [
            ['page' => 'home', 'section' => 'about', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'About — Texte', 'value' => $aboutBody],
            ['page' => 'home', 'section' => 'objectifs', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Objectifs — Titre', 'value' => 'Objectifs'],
            ['page' => 'home', 'section' => 'objectifs', 'key' => 'intro', 'locale' => 'fr', 'type' => 'text', 'label' => 'Objectifs — Intro', 'value' => $objectifsIntro],
            ['page' => 'home', 'section' => 'objectifs', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Objectifs — Liste', 'value' => $objectifsItems],
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
            ['page' => 'qui-sommes-nous', 'section' => 'mission', 'key' => 'body', 'locale' => 'fr', 'type' => 'text', 'label' => 'Mission — Texte', 'value' => $aboutBody],
            ['page' => 'qui-sommes-nous', 'section' => 'values', 'key' => 'title', 'locale' => 'fr', 'type' => 'text', 'label' => 'Objectifs — Titre', 'value' => 'Objectifs'],
            ['page' => 'qui-sommes-nous', 'section' => 'values', 'key' => 'items', 'locale' => 'fr', 'type' => 'json', 'label' => 'Objectifs — Cartes', 'value' => $valuesItems],
            ['page' => 'qui-sommes-nous', 'section' => 'diversify', 'key' => 'intro', 'locale' => 'fr', 'type' => 'text', 'label' => 'Diversification — Intro', 'value' => 'La diversification des produits touristiques n’est pas un luxe, c’est plutôt :'],
        ];

        foreach ($blocks as $block) {
            ContentBlock::updateOrCreate(
                [
                    'page' => $block['page'],
                    'section' => $block['section'],
                    'key' => $block['key'],
                    'locale' => $block['locale'],
                ],
                [
                    'type' => $block['type'],
                    'label' => $block['label'],
                    'value' => $block['value'],
                ]
            );
        }
    }
}
