import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PARTENAIRES } from '../data/apropos'
import { PROJECTS } from '../data/projects'
import { MAP_SHAPES, MAP_VIEWBOX } from '../data/tunisia'
import { EditableText } from '../cms/EditableText'
import { CmsSection } from '../cms/EditableImage'
import { EditableJsonList } from '../cms/EditableJsonList'
import { useContent } from '../cms/ContentProvider'
import { useEditMode } from '../cms/EditModeProvider'
import { assetUrl } from '../lib/assetUrl'
import { parseLocaleJsonList } from '../cms/parseLocaleJson'
import FunderFlags from '../components/FunderFlags'
import './gouvernance.css'

import { spreadMapLabels, MAP_W, MAP_H } from '../data/mapLabels'
import { govDisplayName } from '../data/governorateLabels'

const shapeAt = (name: string) => MAP_SHAPES.find((shape) => shape.name === name)
const GOV_NAMES = Array.from(new Set(MAP_SHAPES.map((shape) => shape.name)))

/** CMS Arabic (and other) aliases → canonical map shape names (French keys). */
const GOV_NAME_ALIASES: Record<string, string> = {
  // Latin variants
  tunis: 'Tunis',
  manouba: 'Manouba',
  'béja': 'Béja',
  beja: 'Béja',
  'médenine': 'Médenine',
  medenine: 'Médenine',
  'kébili': 'Kébili',
  kebili: 'Kébili',
  // Arabic
  تونس: 'Tunis',
  'تُونس': 'Tunis',
  بنزرت: 'Bizerte',
  أريانة: 'Ariana',
  'بن عروس': 'Ben Arous',
  منوبة: 'Manouba',
  نابل: 'Nabeul',
  زغوان: 'Zaghouan',
  باجة: 'Béja',
  جندوبة: 'Jendouba',
  الكاف: 'Le Kef',
  كاف: 'Le Kef',
  سليانة: 'Siliana',
  سوسة: 'Sousse',
  المنستير: 'Monastir',
  منستير: 'Monastir',
  المهدية: 'Mahdia',
  مهدية: 'Mahdia',
  القيروان: 'Kairouan',
  قيروان: 'Kairouan',
  القصرين: 'Kasserine',
  قصرين: 'Kasserine',
  'سيدي بوزيد': 'Sidi Bouzid',
  صفاقس: 'Sfax',
  قفصة: 'Gafsa',
  توزر: 'Tozeur',
  قبلي: 'Kébili',
  قابس: 'Gabès',
  مدنين: 'Médenine',
  تطاوين: 'Tataouine',
}

/** Canonical FR map keys → Arabic display labels (chips + map lettering). */
function canonicalGovName(raw: string): string | null {
  const trimmed = raw.trim().replace(/^ال/, '') // strip leading ال for looser Arabic match
  if (!trimmed) return null
  const direct = GOV_NAMES.find((item) => item.toLowerCase() === trimmed.toLowerCase())
  if (direct) return direct
  // retry with original (some aliases keep ال)
  const original = raw.trim()
  const alias =
    GOV_NAME_ALIASES[original] ||
    GOV_NAME_ALIASES[original.toLowerCase()] ||
    GOV_NAME_ALIASES[trimmed] ||
    GOV_NAME_ALIASES[trimmed.toLowerCase()]
  if (alias && GOV_NAMES.includes(alias)) return alias
  // also try original against GOV_NAMES directly
  const directOrig = GOV_NAMES.find((item) => item.toLowerCase() === original.toLowerCase())
  return directOrig || null
}

function matchGovernorates(raw: string, fallback: string[]) {
  // Latin , ; newline + Arabic comma ،
  const asked = raw
    .split(/[,;\n،]/)
    .map((name) => name.trim())
    .filter(Boolean)
  if (!asked.length) return fallback
  const matched = asked
    .map((name) => canonicalGovName(name))
    .filter((name): name is string => Boolean(name))
  // Prefer canonical hits; if CMS names don't resolve, keep FR/EN fallback so the map still lights.
  return matched.length ? matched : fallback
}

const named = (slug: string) => {
  const project = PROJECTS.find((item) => item.slug === slug)
  if (!project) return []
  return project.governorates.filter((name) => name !== 'Présence nationale')
}

const IMPLEMENTATION = Array.from(
  new Set([...named('jeuness'), ...named('irada4youth'), ...named('fe3ila')]),
)

interface Layer {
  id: string
  number: string
  tab: string
  title: string
  body: string
  readout: string
  national: boolean
  governorates: string[]
  nodes: { name: string; label: string }[]
}

const LAYERS: Layer[] = [
  {
    id: 'ue',
    number: '01',
    tab: 'Union européenne',
    title: 'SUPERVISION STRATÉGIQUE',
    body:
      "La Délégation de l'Union européenne en Tunisie supervise l'ensemble du programme depuis Tunis : cohérence des six projets, dialogue institutionnel et suivi.",
    readout: 'Portée nationale — un interlocuteur institutionnel unique',
    national: true,
    governorates: [],
    nodes: [{ name: 'Tunis', label: "Délégation de l'UE" }],
  },
  {
    id: 'cadre',
    number: '02',
    tab: 'Cadre interministériel',
    title: 'COORDINATION NATIONALE',
    body:
      'Le cadre de concertation interministériel, présidé par le Ministère de l’Économie et de la Planification, réunit ministères, ONJ, agences, DUE et chefs d’équipe.',
    readout: 'Portée nationale — présidence du MEP, suivi semestriel',
    national: true,
    governorates: [],
    nodes: [{ name: 'Tunis', label: 'MEP — présidence' }],
  },
  {
    id: 'partenaires',
    number: '03',
    tab: 'Mise en œuvre',
    title: 'PILOTAGE OPÉRATIONNEL',
    body:
      'Les partenaires de mise en œuvre déploient les projets dans les gouvernorats ciblés. Trois projets — GO4Youth, SWAFY et Maghroum’IN — ont une ambition de couverture large ; leur cartographie détaillée reste liée aux sources de déploiement (BETI, régions, mapping).',
    readout: `${IMPLEMENTATION.length} gouvernorats nommés dans les fiches projets`,
    national: false,
    governorates: IMPLEMENTATION,
    nodes: [],
  },
  {
    id: 'territoires',
    number: '04',
    tab: 'Territoires et jeunes',
    title: 'PARTICIPATION LOCALE',
    body:
      'Avec Fe3il.a, huit communes partenaires construisent des stratégies jeunesse participatives : consultations, forums et espaces de décision ouverts aux jeunes.',
    readout: '8 communes partenaires réparties sur 7 gouvernorats',
    national: false,
    governorates: named('fe3ila'),
    nodes: [],
  },
]

const ACTORS_FALLBACK = [
  {
    number: '01',
    title: "L'UNION EUROPÉENNE",
    body:
      "La Délégation de l'Union européenne en Tunisie assure la supervision stratégique des six projets, veille à la cohérence du programme et constitue l'interlocuteur institutionnel de référence auprès des autorités tunisiennes.",
  },
  {
    number: '02',
    title: 'CADRE INTERMINISTÉRIEL',
    body:
      'Présidé par le Ministère de l’Économie et de la Planification, ce cadre réunit les ministères concernés, l’ONJ, les agences partenaires, la DUE et les chefs d’équipe des projets pour le suivi et la coordination nationale.',
  },
  {
    number: '03',
    title: 'PARTENAIRES DE MISE EN ŒUVRE',
    body:
      'Chaque organisation signe un contrat de subvention avec la DUE et est responsable des résultats, de la gestion financière et du reporting de son projet.',
  },
  {
    number: '04',
    title: 'TERRITOIRES ET JEUNES',
    body:
      'Communes, services régionaux, associations et jeunes participent à la conception, à la mise en œuvre et au suivi des actions, notamment dans les consultations et comités locaux.',
  },
]

const MEMBERS_FALLBACK = [
  'Ministère de l’Économie et de la Planification (présidence)',
  'Ministères partenaires du programme',
  'Observatoire National de la Jeunesse',
  'Agences partenaires (ANETI, ANPR, CGDR…)',
  'Délégation de l’Union européenne',
  'Chefs d’équipe des six projets',
].map((text) => ({ text }))

const INSTITUTION_FALLBACK = [
  ...PARTENAIRES.tabs[1].logos.map((logo) => ({ src: logo.src, alt: logo.alt })),
  { src: '', alt: 'Ministère de l’Éducation' },
]

const PROJECTS_FALLBACK = PROJECTS.map((project) => ({
  slug: project.slug,
  acronym: project.acronym,
  partner: project.partner,
  composante: project.composante,
  logo: `/img/logo-${project.slug}.png`,
}))

const ACCOUNTABILITY_FALLBACK = [
  {
    title: 'Reporting régulier',
    body: 'Les partenaires de mise en œuvre produisent des rapports d’activité semestriels et annuels à destination de la DUE, selon des modèles standardisés.',
  },
  {
    title: 'Coordination des six projets',
    body: 'EU4Youth vise à coordonner les projets entre eux et avec les autres programmes européens en Tunisie pour produire un impact cohérent et démultiplié.',
  },
  {
    title: 'Redevabilité locale',
    body: 'Le programme renforce aussi la redevabilité des communes envers leurs citoyens, notamment les jeunes, à travers les processus participatifs soutenus par Fe3il.a.',
  },
]

const LAYER_FALLBACK = LAYERS.map((item) => ({
  id: item.id,
  number: item.number,
  tab: item.tab,
  title: item.title,
  body: item.body,
  readout: item.readout,
  national: item.national ? 'oui' : 'non',
  governorates: item.governorates.join(', '),
  nodes: item.nodes.map((node) => `${node.name}|${node.label}`).join('\n'),
}))

function parseJsonRows(raw: string, locale = 'fr'): Record<string, unknown>[] | null {
  return parseLocaleJsonList(raw, locale)
}

function ListDock({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={['gov-edit-region', className].filter(Boolean).join(' ')}>{children}</div>
}

function linesOf(raw: string, fallback: string[]) {
  const parts = raw.split('\n').map((line) => line.trim()).filter(Boolean)
  return parts.length ? parts : fallback
}

function parseNodes(raw: string, fallback: Layer['nodes']) {
  const rows = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split('|')
      return { name: name.trim(), label: rest.join('|').trim() || name.trim() }
    })
    .map((node) => {
      const name = canonicalGovName(node.name)
      if (!name) return null
      return { name, label: node.label }
    })
    .filter((node): node is { name: string; label: string } => Boolean(node))
  return rows.length ? rows : fallback
}

function asLayers(raw: string, locale = 'fr'): Layer[] {
  const list = parseJsonRows(raw, locale)
  if (!list?.length) return LAYERS
  return list.map((row, index) => {
    const fb = LAYERS[index] ?? LAYERS[0]
    const national = /^(oui|yes|true|1|national)$/i.test(String(row.national || fb.national))
    const governorates = national
      ? []
      : matchGovernorates(String(row.governorates || ''), fb.governorates)
    return {
      id: String(row.id || fb.id || `layer-${index}`),
      number: String(row.number || fb.number || String(index + 1).padStart(2, '0')),
      tab: String(row.tab || fb.tab),
      title: String(row.title || fb.title),
      body: String(row.body || fb.body),
      readout: String(row.readout || fb.readout),
      national,
      governorates,
      nodes: parseNodes(String(row.nodes || ''), fb.nodes),
    }
  })
}

export default function GouvernancePage() {
  const { get } = useContent()
  const { locale } = useEditMode()
  const [layer, setLayer] = useState(0)
  const titleLines = linesOf(get('hero.title', 'GOUVERNANCE\nET PILOTAGE'), ['GOUVERNANCE', 'ET PILOTAGE'])
  const modelTitle = linesOf(get('model.title', 'UNE GOUVERNANCE\nPARTAGÉE'), [
    'UNE GOUVERNANCE',
    'PARTAGÉE',
  ])
  const mapTitle = linesOf(get('map.title', 'LA GOUVERNANCE\nSUR LE TERRITOIRE'), [
    'LA GOUVERNANCE',
    'SUR LE TERRITOIRE',
  ])
  const frameworkTitle = linesOf(
    get('framework.title', 'CADRE DE CONCERTATION\nINTERMINISTÉRIEL'),
    ['CADRE DE CONCERTATION', 'INTERMINISTÉRIEL'],
  )

  const actorRows = parseJsonRows(get('model.items', JSON.stringify(ACTORS_FALLBACK)), locale)
  const actors = (actorRows?.length ? actorRows : ACTORS_FALLBACK).map((row) => ({
    number: String(row.number || ''),
    title: String(row.title || ''),
    body: String(row.body || ''),
  }))

  const layers = asLayers(get('map.layers', JSON.stringify(LAYER_FALLBACK)), locale)
  const active = layers[Math.min(layer, Math.max(0, layers.length - 1))] ?? layers[0]
  const litNames = active?.national ? MAP_SHAPES.map((shape) => shape.name) : active?.governorates ?? []
  const lettered = Boolean(active && !active.national && active.governorates.length <= 8)
  const mapLabels =
    lettered && active
      ? spreadMapLabels(
          MAP_SHAPES.filter((shape) => shape.label && active.governorates.includes(shape.name)),
        )
      : []

  const memberRows = parseJsonRows(get('framework.members', JSON.stringify(MEMBERS_FALLBACK)), locale)
  const members = (memberRows?.length ? memberRows : MEMBERS_FALLBACK).map((row) =>
    String(row.text || ''),
  )

  const institutionRows = parseJsonRows(
    get('institutions.items', JSON.stringify(INSTITUTION_FALLBACK)),
    locale,
  )
  const institutions = (institutionRows?.length ? institutionRows : INSTITUTION_FALLBACK).map(
    (row) => ({
      src: String(row.src || ''),
      alt: String(row.alt || ''),
    }),
  )

  const partnerRows = parseJsonRows(
    get('implementation.items', JSON.stringify(PROJECTS_FALLBACK)),
    locale,
  )
  const partners = (partnerRows?.length ? partnerRows : PROJECTS_FALLBACK).map((row) => {
    const slug = String(row.slug || '')
    const source = PROJECTS.find((item) => item.slug === slug)
    return {
      slug,
      acronym: String(row.acronym || source?.acronym || slug),
      partner: String(row.partner || source?.partner || ''),
      composante: String(row.composante || source?.composante || ''),
      logo: assetUrl(String(row.logo || `/img/logo-${slug}.png`)),
    }
  })

  const accountRows = parseJsonRows(
    get('accountability.items', JSON.stringify(ACCOUNTABILITY_FALLBACK)),
    locale,
  )
  const accounts = (accountRows?.length ? accountRows : ACCOUNTABILITY_FALLBACK).map((row) => ({
    title: String(row.title || ''),
    body: String(row.body || ''),
  }))

  const euBody = paragraphs(
    get(
      'eu.body',
      "EU4Youth s’inscrit dans le Partenariat UE–Tunisie pour la Jeunesse, annoncé conjointement en décembre 2016. La Délégation de l’Union européenne assure le pilotage stratégique et le suivi des six projets.\n\nLa convention de financement signée en juin 2019 fixe les objectifs globaux, le budget, la durée et les conditions de mise en œuvre du programme.",
    ),
  )
  const frameworkBody = paragraphs(
    get(
      'framework.body',
      'Mécanisme de gouvernance d’EU4Youth réunissant les représentants des ministères concernés, de l’ONJ, des agences partenaires, de la DUE et des chefs d’équipe des projets. Présidé par le Ministère de l’Économie et de la Planification, il assure le suivi et la coordination du programme au niveau national.\n\nLes comités de suivi semestriel du programme réunissent ces acteurs pour partager les avancées, les bonnes pratiques et les synergies entre projets.',
    ),
  )
  const youthBody = paragraphs(
    get(
      'youth.body',
      'Associer les jeunes à la conception et à la mise en œuvre des activités qui les concernent — pas seulement comme bénéficiaires, mais comme acteurs — est un principe transversal du programme.\n\nEU4Youth construit des mécanismes durables de représentation et de participation dans la vie citoyenne et l’action publique : stratégies jeunesse locales, forums, consultations et espaces destinés à devenir permanents dans les communes, les comités de pilotage et les processus de consultation.',
    ),
  )

  if (!active) return null

  return (
    <div className="page page--gouvernance">
      <CmsSection id="hero" className="gov-hero" labelledBy="gov-title">
        <div className="gov-hero__copy">
          <EditableText
            section="hero"
            field="badge"
            fallback="LE PROGRAMME EU4YOUTH"
            as="p"
            className="gov-hero__eyebrow"
            label="Badge"
          />
          <EditableText
            section="hero"
            field="title"
            fallback={'GOUVERNANCE\nET PILOTAGE'}
            as="h1"
            id="gov-title"
            className="gov-hero__title"
            label="Titre"
          >
            {titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </EditableText>
        </div>
        <div className="gov-hero__art" aria-hidden="true">
          <div className="gov-hero__rings">
            <span />
            <span />
            <span />
          </div>
          <svg className="gov-hero__map" viewBox={MAP_VIEWBOX}>
            {MAP_SHAPES.map((shape, index) => (
              <path key={`${shape.name}-${index}`} d={shape.d} />
            ))}
          </svg>
        </div>
      </CmsSection>

      <CmsSection id="model" className="gov-model" labelledBy="gov-model-title">
        <EditableText
          section="model"
          field="title"
          fallback={'UNE GOUVERNANCE\nPARTAGÉE'}
          as="h2"
          id="gov-model-title"
          className="gov-model__title"
          label="Titre"
        >
          {modelTitle[0]}
          {modelTitle[1] ? <span>{modelTitle[1]}</span> : null}
        </EditableText>
        <EditableText
          section="model"
          field="intro"
          fallback="Le programme coordonne six projets complémentaires à travers une supervision stratégique européenne, un cadre de concertation interministériel et des partenaires opérationnels ancrés dans les territoires."
          as="p"
          className="gov-model__intro"
          label="Introduction"
        />
        <ListDock>
          <EditableJsonList
            section="model"
            field="items"
            label="Niveaux de gouvernance"
            className="gov-list-cms"
            wrapItems={false}
            manageLabel="Gérer les niveaux"
            fallback={ACTORS_FALLBACK}
            fields={[
              { key: 'number', label: 'Numéro' },
              { key: 'title', label: 'Titre' },
              { key: 'body', label: 'Texte', multiline: true },
            ]}
            emptyItem={{ number: '05', title: '', body: '' }}
            renderItem={() => null}
          />
          <ol className="gov-levels">
            {actors.map((actor) => (
              <li key={`${actor.number}-${actor.title}`}>
                <span className="gov-level__number">{actor.number}</span>
                <div>
                  <h3>{actor.title}</h3>
                  <p>{actor.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </ListDock>
      </CmsSection>

      <CmsSection id="map" className="gov-map" labelledBy="gov-map-title">
        <div className="gov-map__head">
          <EditableText
            section="map"
            field="eyebrow"
            fallback="DU NATIONAL AU LOCAL"
            as="p"
            className="gov-map__eyebrow"
            label="Sur-titre"
          />
          <EditableText
            section="map"
            field="title"
            fallback={'LA GOUVERNANCE\nSUR LE TERRITOIRE'}
            as="h2"
            id="gov-map-title"
            className="gov-map__title"
            label="Titre"
          >
            {locale === 'ar' ? (
              mapTitle.join(' ')
            ) : (
              <>
                {mapTitle[0]}
                {mapTitle[1] ? <span>{mapTitle[1]}</span> : null}
              </>
            )}
          </EditableText>
          <EditableText
            section="map"
            field="body"
            fallback="Chaque niveau de pilotage agit à une échelle différente. Choisissez un niveau pour voir où il intervient en Tunisie."
            as="p"
            label="Texte"
          />
        </div>

        <div className="gov-map__body">
          <ListDock className="gov-map__controls">
            <EditableJsonList
              section="map"
              field="layers"
              label="Couches de la carte"
              className="gov-list-cms"
              wrapItems={false}
              manageLabel="Gérer la carte"
              fallback={LAYER_FALLBACK}
              fields={[
                { key: 'id', label: 'Identifiant interne' },
                { key: 'number', label: 'Numéro' },
                { key: 'tab', label: 'Onglet' },
                { key: 'title', label: 'Titre du panneau' },
                { key: 'body', label: 'Texte', multiline: true },
                { key: 'readout', label: 'Légende sous le texte' },
                {
                  key: 'national',
                  label: 'Portée',
                  options: ['oui', 'non'],
                  optionLabels: {
                    oui: 'Tout le pays',
                    non: 'Choisir des gouvernorats',
                  },
                  multiple: false,
                },
                {
                  key: 'governorates',
                  label: 'Gouvernorats allumés',
                  options: GOV_NAMES,
                  multiple: true,
                },
                { key: 'nodes', label: 'Points (Ville|Libellé, une ligne chacun)', multiline: true },
              ]}
              emptyItem={{
                id: 'nouveau',
                number: '05',
                tab: 'Nouveau niveau',
                title: 'NOUVEAU',
                body: '',
                readout: '',
                national: 'non',
                governorates: '',
                nodes: '',
              }}
              renderItem={() => null}
            />
            <ul className="gov-map__picks" aria-label="Niveaux de gouvernance">
              {layers.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={index === layer}
                    className={`gov-pick${index === layer ? ' gov-pick--on' : ''}`}
                    onClick={() => setLayer(index)}
                  >
                    <span className="gov-pick__number">{item.number}</span>
                    <span className="gov-pick__tab">{item.tab}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ListDock>

          <div className="gov-map__plate">
            <svg
              className="gov-map__svg"
              viewBox={MAP_VIEWBOX}
              role="img"
              aria-label={
                active.national
                  ? `${active.tab} : ${
                      locale === 'ar'
                        ? 'تغطية وطنية'
                        : locale === 'en'
                          ? 'national coverage'
                          : 'portée nationale'
                    }`
                  : `${active.tab} : ${active.governorates.map((name) => govDisplayName(name, locale)).join(', ')}`
              }
            >
              {MAP_SHAPES.map((shape, index) => {
                const lit = litNames.includes(shape.name)
                return (
                  <path
                    key={`${shape.name}-${index}`}
                    className={`gov-map__gov${lit ? ' gov-map__gov--on' : ''}`}
                    d={shape.d}
                  />
                )
              })}
            </svg>

            {mapLabels.map((label) => {
              const shown = govDisplayName(label.name, locale)
              return (
                <span
                  key={label.name}
                  className="gov-map__label"
                  style={{ left: `${label.x}%`, top: `${label.y}%` }}
                >
                  {locale === 'ar' ? shown : shown.toUpperCase()}
                </span>
              )
            })}

            {active.nodes.map((node) => {
              const shape = shapeAt(node.name)
              if (!shape) return null
              return (
                <span
                  key={node.label}
                  className="gov-map__node"
                  style={{
                    left: `${(shape.cx / MAP_W) * 100}%`,
                    top: `${(shape.cy / MAP_H) * 100}%`,
                  }}
                >
                  <em aria-hidden="true" />
                  <b>
                    {(() => {
                      const canon = canonicalGovName(node.label) || canonicalGovName(node.name)
                      return canon ? govDisplayName(canon, locale) : node.label
                    })()}
                  </b>
                </span>
              )
            })}
          </div>

          <div className="gov-map__copy">
            <span className="gov-map__number" aria-hidden="true">
              {active.number}
            </span>
            <h3>{active.title}</h3>
            <p>{active.body}</p>
            <p className="gov-map__readout" role="status">
              {active.readout}
            </p>
            {!active.national && !lettered && (
              <ul className="gov-map__chips">
                {active.governorates.map((name) => (
                  <li key={name}>{govDisplayName(name, locale)}</li>
                ))}
              </ul>
            )}
            <ul className="gov-map__legend">
              <li className="gov-map__legend--on">
                {get(
                  'map.legendOn',
                  locale === 'ar'
                    ? 'الولايات المعنية'
                    : locale === 'en'
                      ? 'Territories covered'
                      : 'Territoires concernés',
                )}
              </li>
              <li>
                {get(
                  'map.legendOff',
                  locale === 'ar'
                    ? 'ولايات أخرى'
                    : locale === 'en'
                      ? 'Other governorates'
                      : 'Autres gouvernorats',
                )}
              </li>
            </ul>
          </div>
        </div>
      </CmsSection>

      <CmsSection id="eu" className="gov-eu" labelledBy="gov-eu-title">
        <div className="gov-eu__copy">
          <EditableText
            section="eu"
            field="eyebrow"
            fallback="SUPERVISION STRATÉGIQUE"
            as="p"
            className="gov-eu__eyebrow"
            label="Sur-titre"
          />
          <EditableText
            section="eu"
            field="title"
            fallback="L’UNION EUROPÉENNE"
            as="h2"
            id="gov-eu-title"
            className="gov-eu__title"
            label="Titre"
          />
          <EditableText
            section="eu"
            field="body"
            fallback={
              "EU4Youth s’inscrit dans le Partenariat UE–Tunisie pour la Jeunesse, annoncé conjointement en décembre 2016. La Délégation de l’Union européenne assure le pilotage stratégique et le suivi des six projets.\n\nLa convention de financement signée en juin 2019 fixe les objectifs globaux, le budget, la durée et les conditions de mise en œuvre du programme."
            }
            as="div"
            label="Texte"
          >
            {euBody.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </EditableText>
        </div>
        <span className="gov-eu__flags">
          <FunderFlags variant="footer" />
        </span>
      </CmsSection>

      <CmsSection id="framework" className="gov-framework" labelledBy="gov-framework-title">
        <div className="gov-framework__copy">
          <EditableText
            section="framework"
            field="eyebrow"
            fallback="COORDINATION NATIONALE"
            as="p"
            label="Sur-titre"
          >
            {get('framework.eyebrow', 'COORDINATION NATIONALE')}
          </EditableText>
          <EditableText
            section="framework"
            field="title"
            fallback={'CADRE DE CONCERTATION\nINTERMINISTÉRIEL'}
            as="h2"
            id="gov-framework-title"
            label="Titre"
          >
            {frameworkTitle[0]}
            {frameworkTitle[1] ? (
              <>
                <br />
                {frameworkTitle[1]}
              </>
            ) : null}
          </EditableText>
          <EditableText
            section="framework"
            field="body"
            fallback="Mécanisme de gouvernance d’EU4Youth réunissant les représentants des ministères concernés, de l’ONJ, des agences partenaires, de la DUE et des chefs d’équipe des projets. Présidé par le Ministère de l’Économie et de la Planification, il assure le suivi et la coordination du programme au niveau national.\n\nLes comités de suivi semestriel du programme réunissent ces acteurs pour partager les avancées, les bonnes pratiques et les synergies entre projets."
            as="div"
            label="Texte"
          >
            {frameworkBody.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </EditableText>
        </div>
        <ListDock>
          <EditableJsonList
            section="framework"
            field="members"
            label="Composition du cadre"
            className="gov-list-cms"
            wrapItems={false}
            manageLabel="Gérer la composition"
            fallback={MEMBERS_FALLBACK}
            fields={[{ key: 'text', label: 'Membre', multiline: true }]}
            emptyItem={{ text: '' }}
            renderItem={() => null}
          />
          <ul className="gov-framework__members" aria-label="Composition du cadre">
            {members.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </ListDock>
      </CmsSection>

      <CmsSection id="institutions" className="gov-institutions" labelledBy="gov-institutions-title">
        <EditableText
          section="institutions"
          field="title"
          fallback="LES INSTITUTIONS TUNISIENNES"
          as="h2"
          id="gov-institutions-title"
          label="Titre"
        >
          {get('institutions.title', 'LES INSTITUTIONS TUNISIENNES')}
        </EditableText>
        <EditableText
          section="institutions"
          field="body"
          fallback="Les ministères et institutions tunisiennes sont des partenaires centraux du programme. Ils président les cadres de concertation, accompagnent la mise en œuvre et portent l’appropriation institutionnelle des acquis."
          as="p"
          label="Texte"
        />
        <ListDock>
          <EditableJsonList
            section="institutions"
            field="items"
            label="Logos institutions"
            className="gov-list-cms"
            wrapItems={false}
            manageLabel="Gérer les logos"
            fallback={INSTITUTION_FALLBACK}
            fields={[
              { key: 'src', label: 'Image (vide = pastille texte)' },
              { key: 'alt', label: 'Nom / texte alternatif' },
            ]}
            emptyItem={{ src: '/img/org-aneti.webp', alt: 'Nouvelle institution' }}
            renderItem={() => null}
          />
          <ul className="gov-institutions__grid">
            {institutions.map((institution) =>
              institution.src ? (
                <li key={institution.alt}>
                  <img src={assetUrl(institution.src)} alt={institution.alt} />
                </li>
              ) : (
                <li key={institution.alt} className="gov-institutions__text">
                  <span>{institution.alt}</span>
                </li>
              ),
            )}
          </ul>
        </ListDock>
      </CmsSection>

      <CmsSection id="implementation" className="gov-implementation" labelledBy="gov-implementation-title">
        <div className="gov-implementation__heading">
          <div>
            <EditableText
              section="implementation"
              field="eyebrow"
              fallback="PILOTAGE OPÉRATIONNEL"
              as="p"
              label="Sur-titre"
            >
              {get('implementation.eyebrow', 'PILOTAGE OPÉRATIONNEL')}
            </EditableText>
            <EditableText
              section="implementation"
              field="title"
              fallback="LES PARTENAIRES DE MISE EN ŒUVRE"
              as="h2"
              id="gov-implementation-title"
              label="Titre"
            >
              {get('implementation.title', 'LES PARTENAIRES DE MISE EN ŒUVRE')}
            </EditableText>
          </div>
          <EditableText
            section="implementation"
            field="body"
            fallback="Chaque partenaire assure la gestion opérationnelle d’un projet : résultats, gestion financière et reporting auprès de la DUE."
            as="p"
            label="Texte"
          />
        </div>
        <ListDock>
          <EditableJsonList
            section="implementation"
            field="items"
            label="Partenaires opérationnels"
            className="gov-list-cms"
            wrapItems={false}
            manageLabel="Gérer les partenaires"
            fallback={PROJECTS_FALLBACK}
            fields={[
              { key: 'slug', label: 'Identifiant' },
              { key: 'acronym', label: 'Acronyme' },
              { key: 'partner', label: 'Partenaire', multiline: true },
              { key: 'composante', label: 'Composante' },
              { key: 'logo', label: 'Logo' },
            ]}
            emptyItem={{
              slug: 'nouveau',
              acronym: 'Nouveau',
              partner: '',
              composante: '',
              logo: '/img/logo-jeuness.png',
            }}
            renderItem={() => null}
          />
          <ul className="gov-projects">
            {partners.map((project) => (
              <li key={project.slug}>
                <Link to={`/projets/${project.slug}`}>
                  <img src={project.logo} alt="" aria-hidden="true" />
                  <div>
                    <h3>{project.acronym}</h3>
                    <p>{project.partner}</p>
                    <span>{project.composante}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </ListDock>
      </CmsSection>

      <CmsSection id="accountability" className="gov-accountability" labelledBy="gov-accountability-title">
        <EditableText
          section="accountability"
          field="title"
          fallback="SUIVI, REPORTING ET REDEVABILITÉ"
          as="h2"
          id="gov-accountability-title"
          label="Titre"
        >
          {get('accountability.title', 'SUIVI, REPORTING ET REDEVABILITÉ')}
        </EditableText>
        <ListDock>
          <EditableJsonList
            section="accountability"
            field="items"
            label="Redevabilité"
            className="gov-list-cms"
            wrapItems={false}
            manageLabel="Gérer les blocs"
            fallback={ACCOUNTABILITY_FALLBACK}
            fields={[
              { key: 'title', label: 'Titre' },
              { key: 'body', label: 'Texte', multiline: true },
            ]}
            emptyItem={{ title: '', body: '' }}
            renderItem={() => null}
          />
          <div className="gov-accountability__grid">
            {accounts.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </ListDock>
      </CmsSection>

      <CmsSection id="youth" className="gov-youth" labelledBy="gov-youth-title">
        <div>
          <EditableText
            section="youth"
            field="eyebrow"
            fallback="PARTICIPATION"
            as="p"
            label="Sur-titre"
          >
            {get('youth.eyebrow', 'PARTICIPATION')}
          </EditableText>
          <EditableText
            section="youth"
            field="title"
            fallback="LES JEUNES, ACTEURS DU PILOTAGE"
            as="h2"
            id="gov-youth-title"
            label="Titre"
          >
            {get('youth.title', 'LES JEUNES, ACTEURS DU PILOTAGE')}
          </EditableText>
        </div>
        <EditableText
          section="youth"
          field="body"
          fallback="Associer les jeunes à la conception et à la mise en œuvre des activités qui les concernent — pas seulement comme bénéficiaires, mais comme acteurs — est un principe transversal du programme.\n\nEU4Youth construit des mécanismes durables de représentation et de participation dans la vie citoyenne et l’action publique : stratégies jeunesse locales, forums, consultations et espaces destinés à devenir permanents dans les communes, les comités de pilotage et les processus de consultation."
          as="div"
          className="gov-youth__copy"
          label="Texte"
        >
          {youthBody.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </EditableText>
      </CmsSection>

      <CmsSection id="legacy" className="gov-legacy" labelledBy="gov-legacy-title">
        <div>
          <EditableText
            section="legacy"
            field="eyebrow"
            fallback="UNE ARCHITECTURE DURABLE"
            as="p"
            label="Sur-titre"
          >
            {get('legacy.eyebrow', 'UNE ARCHITECTURE DURABLE')}
          </EditableText>
          <EditableText
            section="legacy"
            field="title"
            fallback="PILOTER AUJOURD’HUI, CONSOLIDER DEMAIN"
            as="h2"
            id="gov-legacy-title"
            label="Titre"
          >
            {get('legacy.title', 'PILOTER AUJOURD’HUI, CONSOLIDER DEMAIN')}
          </EditableText>
        </div>
        <EditableText
          section="legacy"
          field="body"
          fallback="Le programme a construit des bases durables : une architecture de gouvernance interministérielle qui réunit, dans un cadre formel et régulier, les ministères et les partenaires autour des enjeux de la jeunesse. Des capacités renforcées dans des dizaines d’organisations, d’institutions, de communes et d’associations."
          as="p"
          label="Texte"
        />
      </CmsSection>

      <CmsSection id="cta" className="gov-cta" labelledBy="gov-cta-title">
        <EditableText
          section="cta"
          field="title"
          fallback="EXPLORER LE PROGRAMME"
          as="h2"
          id="gov-cta-title"
          label="Titre"
        >
          {get('cta.title', 'EXPLORER LE PROGRAMME')}
        </EditableText>
        <div className="gov-cta__actions">
          <Link className="btn btn--fill-blue" to="/programme/a-propos">
            <EditableText
              section="cta"
              field="about"
              fallback="À propos d’EU4Youth"
              as="span"
              multiline={false}
              label="Bouton à propos"
            >
              {get('cta.about', 'À propos d’EU4Youth')}
            </EditableText>{' '}
            <span aria-hidden="true">»</span>
          </Link>
          <Link className="btn btn--line-orange" to="/programme/financement">
            <EditableText
              section="cta"
              field="funding"
              fallback="Financement UE"
              as="span"
              multiline={false}
              label="Bouton financement"
            >
              {get('cta.funding', 'Financement UE')}
            </EditableText>{' '}
            <span aria-hidden="true">»</span>
          </Link>
        </div>
      </CmsSection>
    </div>
  )
}

function paragraphs(raw: string) {
  return raw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
