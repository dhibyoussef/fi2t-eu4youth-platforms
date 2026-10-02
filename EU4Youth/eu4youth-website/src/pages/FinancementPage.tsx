import { type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/projects'
import { EditableText } from '../cms/EditableText'
import { CmsSection } from '../cms/EditableImage'
import { EditableJsonList } from '../cms/EditableJsonList'
import { CountUp } from '../cms/CountUp'
import { useContent } from '../cms/ContentProvider'
import { useEditMode } from '../cms/EditModeProvider'
import { assetUrl } from '../lib/assetUrl'
import { parseLocaleJsonList } from '../cms/parseLocaleJson'
import FunderFlags from '../components/FunderFlags'
import './financement.css'

type Locale = 'fr' | 'en' | 'ar'

/** Locale-aware partner/period when CMS rows leave those fields empty. */
const PROJECT_META: Record<
  Locale,
  Record<string, { partner: string; period: string }>
> = {
  fr: {
    jeuness: {
      partner: 'Organisation internationale du Travail (OIT)',
      period: 'Septembre 2019 – Août 2024',
    },
    go4youth: {
      partner: 'Banque mondiale / ANETI',
      period: 'Septembre 2021 – Juin 2027',
    },
    swafy: {
      partner: 'Agence Nationale de Promotion de la Recherche (ANPR)',
      period: 'Juin 2022 – Juin 2027',
    },
    irada4youth: {
      partner: 'CGDR + Offices de Développement Régional',
      period: '2022 – 2027',
    },
    maghroumin: {
      partner:
        'Consortium EUNIC : AECID (Espagne) · FIIAPP (Espagne) · British Council (Royaume-Uni)',
      period: 'Janvier 2022 – Décembre 2026',
    },
    fe3ila: {
      partner: 'CILG-VNG International (Pays-Bas)',
      period: '2021 – 2026',
    },
  },
  en: {
    jeuness: {
      partner: 'International Labour Organization (ILO)',
      period: 'September 2019 – August 2024',
    },
    go4youth: {
      partner: 'World Bank / ANETI',
      period: 'September 2021 – June 2027',
    },
    swafy: {
      partner: 'National Agency for Research Promotion (ANPR)',
      period: 'June 2022 – June 2027',
    },
    irada4youth: {
      partner: 'CGDR + Regional Development Offices',
      period: '2022 – 2027',
    },
    maghroumin: {
      partner:
        'EUNIC Consortium: AECID (Spain) · FIIAPP (Spain) · British Council (United Kingdom)',
      period: 'January 2022 – December 2026',
    },
    fe3ila: {
      partner: 'CILG-VNG International (Netherlands)',
      period: '2021 – 2026',
    },
  },
  ar: {
    jeuness: {
      partner: 'منظمة العمل الدولية (OIT)',
      period: 'سبتمبر 2019 – أغسطس 2024',
    },
    go4youth: {
      partner: 'البنك الدولي / الوكالة الوطنية للتشغيل',
      period: 'سبتمبر 2021 – يونيو 2027',
    },
    swafy: {
      partner: 'الوكالة الوطنية لترقية البحث (ANPR)',
      period: 'يونيو 2022 – يونيو 2027',
    },
    irada4youth: {
      partner: 'المندوبية العامة للتنمية الجهوية + مكاتب التنمية الجهوية',
      period: '2022 – 2027',
    },
    maghroumin: {
      partner:
        'كونسورتيوم EUNIC: AECID (إسبانيا) · FIIAPP (إسبانيا) · المجلس البريطاني (المملكة المتحدة)',
      period: 'يناير 2022 – ديسمبر 2026',
    },
    fe3ila: {
      partner: 'CILG-VNG International (هولندا)',
      period: '2021 – 2026',
    },
  },
}

function fundingNote(slug: string, locale: Locale) {
  if (slug === 'fe3ila') {
    if (locale === 'en') return 'European Union, with a contribution from the Kingdom of the Netherlands'
    if (locale === 'ar') return 'الاتحاد الأوروبي، مع مساهمة مملكة هولندا'
    return 'Union européenne, avec la contribution du Royaume des Pays-Bas'
  }
  if (slug === 'irada4youth') {
    if (locale === 'en') return 'Grant contract funded 100% by the European Union'
    if (locale === 'ar') return 'عقد منحة مموَّل بنسبة 100% من الاتحاد الأوروبي'
    return 'Contrat de subvention financé à 100 % par l’Union européenne'
  }
  if (locale === 'en') return 'Funded by the European Union under EU4Youth'
  if (locale === 'ar') return 'بتمويل من الاتحاد الأوروبي في إطار EU4Youth'
  return "Financé par l'Union européenne dans le cadre d'EU4Youth"
}

const FACTS_FALLBACK = [
  { value: '60 M€', label: 'BUDGET GLOBAL', note: "Financé par l'Union européenne" },
  { value: '2019–2027', label: 'PÉRIODE', note: 'Convention signée en juin 2019' },
  { value: '6', label: 'PROJETS', note: 'Complémentaires et coordonnés' },
  { value: '24', label: 'GOUVERNORATS', note: 'Une présence nationale' },
]

const THEMES_FALLBACK = [
  {
    title: 'EMPLOI ET ENTREPRENEURIAT',
    text:
      "Le financement soutient l'accès à l'emploi décent, l'entrepreneuriat, l'économie sociale et solidaire, la recherche appliquée et les filières économiques porteuses.",
  },
  {
    title: 'CULTURE ET SPORT',
    text:
      "Il renforce les opérateurs, les espaces et les initiatives qui font de la culture et du sport des leviers d'inclusion, d'expression et d'employabilité.",
  },
  {
    title: 'PARTICIPATION DES JEUNES',
    text:
      'Il accompagne les communes, les institutions et la société civile pour associer durablement les jeunes aux politiques publiques qui les concernent.',
  },
]

const STRUCTURE_FALLBACK = [
  {
    title: 'Programme-cadre',
    body: "EU4Youth regroupe six projets distincts sous une vision commune. Le programme fixe les objectifs globaux, la gouvernance d'ensemble et les mécanismes de coordination.",
  },
  {
    title: 'Convention de financement',
    body: 'Signée en juin 2019 entre la Commission européenne et le gouvernement tunisien, elle formalise le budget, la durée, les objectifs et les conditions de mise en œuvre. Sa durée a été portée à 96 mois par avenant en décembre 2021.',
  },
  {
    title: 'Supervision',
    body: "La Délégation de l'Union européenne en Tunisie assure la supervision stratégique des six projets. Les institutions tunisiennes et les partenaires de mise en œuvre portent l'exécution opérationnelle et le reporting.",
  },
]

const PROJECTS_FALLBACK = PROJECTS.map((project) => {
  const meta = PROJECT_META.fr[project.slug]
  return {
    slug: project.slug,
    acronym: project.acronym,
    budget: project.budget,
    composante: project.composante,
    funding: fundingNote(project.slug, 'fr'),
    partner: meta?.partner || project.partner,
    period: meta?.period || project.period,
    logo: `/img/logo-${project.slug}.png`,
  }
})

function projectsFallbackFor(locale: Locale) {
  return PROJECTS.map((project) => {
    const meta = PROJECT_META[locale][project.slug]
    return {
      slug: project.slug,
      acronym: project.acronym,
      budget: project.budget,
      composante: project.composante,
      funding: fundingNote(project.slug, locale),
      partner: meta?.partner || project.partner,
      period: meta?.period || project.period,
      logo: `/img/logo-${project.slug}.png`,
    }
  })
}

function parseJsonRows(raw: string, locale = 'fr'): Record<string, unknown>[] | null {
  return parseLocaleJsonList(raw, locale)
}

function ListDock({ children }: { children: ReactNode }) {
  return <div className="fin-edit-region">{children}</div>
}

function Pencil({
  section,
  field,
  fallback,
  label,
}: {
  section: string
  field: string
  fallback: string
  label?: string
}) {
  return (
    <EditableText
      chipOnly
      className="fin-pencil"
      section={section}
      field={field}
      fallback={fallback}
      label={label}
    />
  )
}

function linesOf(raw: string, fallback: string[]) {
  const parts = raw.split('\n').map((line) => line.trim()).filter(Boolean)
  return parts.length ? parts : fallback
}

export default function FinancementPage() {
  const { get } = useContent()
  const { locale: rawLocale } = useEditMode()
  const locale: Locale = rawLocale === 'en' || rawLocale === 'ar' ? rawLocale : 'fr'
  const titleLines = linesOf(get('hero.title', 'FINANCEMENT\nUNION EUROPÉENNE'), [
    'FINANCEMENT',
    'UNION EUROPÉENNE',
  ])
  const labelFallback =
    locale === 'ar'
      ? { funding: 'التمويل', partner: 'الشريك', period: 'الفترة' }
      : locale === 'en'
        ? { funding: 'Funding', partner: 'Partner', period: 'Period' }
        : { funding: 'Financement', partner: 'Partenaire', period: 'Période' }
  const fundingLabel = get('projects.fundingLabel', labelFallback.funding)
  const partnerLabel = get('projects.partnerLabel', labelFallback.partner)
  const periodLabel = get('projects.periodLabel', labelFallback.period)
  const discoverLabel = get('projects.more', 'Découvrir le projet')
  const forwardMark = locale === 'ar' ? '«' : '»'
  const localeProjectsFallback = projectsFallbackFor(locale)
  const factRows = parseJsonRows(get('facts.items', JSON.stringify(FACTS_FALLBACK)), locale)
  const facts = (factRows?.length ? factRows : FACTS_FALLBACK).map((row) => ({
    value: String(row.value || ''),
    label: String(row.label || ''),
    note: String(row.note || ''),
  }))
  const themeRows = parseJsonRows(get('purpose.items', JSON.stringify(THEMES_FALLBACK)), locale)
  const themes = (themeRows?.length ? themeRows : THEMES_FALLBACK).map((row) => ({
    title: String(row.title || ''),
    text: String(row.text || ''),
  }))
  const structureRows = parseJsonRows(get('structure.items', JSON.stringify(STRUCTURE_FALLBACK)), locale)
  const structure = (structureRows?.length ? structureRows : STRUCTURE_FALLBACK).map((row) => ({
    title: String(row.title || ''),
    body: String(row.body || ''),
  }))
  const projectRows = parseJsonRows(
    get('projects.items', JSON.stringify(localeProjectsFallback)),
    locale,
  )
  const projects = (projectRows?.length ? projectRows : localeProjectsFallback).map((row) => {
    const slug = String(row.slug || '')
    const source = PROJECTS.find((item) => item.slug === slug)
    const meta = PROJECT_META[locale][slug]
    const preferMeta = locale !== 'fr'
    return {
      slug,
      acronym: String(row.acronym || source?.acronym || slug),
      budget: String(row.budget || source?.budget || ''),
      composante: String(row.composante || source?.composante || ''),
      funding: String(row.funding || fundingNote(slug, locale)),
      partner: String(
        preferMeta
          ? meta?.partner || row.partner || source?.partner || ''
          : row.partner || meta?.partner || source?.partner || '',
      ),
      period: String(
        preferMeta
          ? meta?.period || row.period || source?.period || ''
          : row.period || meta?.period || source?.period || '',
      ),
      logo: assetUrl(String(row.logo || `/img/logo-${slug}.png`)),
      theme: source?.theme || 'jeuness',
    }
  })
  return (
    <div className="page page--financement">
      <CmsSection id="hero" className="fin-hero" labelledBy="fin-title">
        <div className="fin-hero__copy">
          <EditableText
            section="hero"
            field="badge"
            fallback="LE PROGRAMME EU4YOUTH"
            as="p"
            className="fin-hero__eyebrow"
            label="Badge"
          />
          <EditableText
            section="hero"
            field="title"
            fallback={'FINANCEMENT\nUNION EUROPÉENNE'}
            as="h1"
            id="fin-title"
            className="fin-hero__title"
            label="Titre"
          >
            {titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </EditableText>
          <EditableText
            section="hero"
            field="body"
            fallback="EU4Youth est le programme d’appui à la jeunesse tunisienne financé par l’Union européenne et mis en œuvre en partenariat avec les institutions tunisiennes et les acteurs nationaux et internationaux engagés en faveur des jeunes."
            as="p"
            className="fin-hero__lead"
            label="Chapô"
          />
        </div>

        <div className="fin-hero__aside">
          <div className="fin-hero__figure" aria-label="Budget global de 60 millions d’euros">
            <span className="fin-hero__amount" dir="ltr">
              <span>
                <CountUp value={get('hero.amount', '60')} />
              </span>
              <strong>{get('hero.unit', 'M€')}</strong>
            </span>
            <small>{get('hero.figureLabel', 'BUDGET GLOBAL')}</small>
            <Pencil section="hero" field="amount" fallback="60" label="Compteur (60)" />
          </div>

          <span className="fin-hero__flags">
            <FunderFlags variant="footer" />
          </span>
        </div>
      </CmsSection>

      <CmsSection id="facts" className="fin-facts" labelledBy="fin-facts-title">
        <EditableText
          section="facts"
          field="title"
          fallback="LE FINANCEMENT EN CHIFFRES"
          as="h2"
          id="fin-facts-title"
          label="Titre"
        >
          {get('facts.title', 'LE FINANCEMENT EN CHIFFRES')}
        </EditableText>
        <EditableText
          section="facts"
          field="intro"
          fallback="Doté d’un budget de 60 millions d’euros pour 2019–2027, EU4Youth est la plus importante enveloppe européenne dédiée à la jeunesse tunisienne. La convention de financement a été signée en juin 2019."
          as="p"
          className="fin-facts__intro"
          label="Introduction"
        />
        <ListDock>
          <EditableJsonList
            section="facts"
            field="items"
            label="Chiffres"
            className="fin-list-cms"
            wrapItems={false}
            manageLabel="Gérer les chiffres"
            fallback={FACTS_FALLBACK}
            fields={[
              { key: 'value', label: 'Valeur (le compteur s’arrête ici)' },
              { key: 'label', label: 'Libellé' },
              { key: 'note', label: 'Note' },
            ]}
            emptyItem={{ value: '', label: '', note: '' }}
            renderItem={() => null}
          />
          <ul className="fin-facts__grid">
            {facts.map((fact, index) => (
              <li
                key={`${fact.label}-${index}`}
                className={index === 0 ? 'fin-fact fin-fact--featured' : 'fin-fact'}
              >
                <span className="fin-fact__value">
                  <CountUp value={fact.value} />
                </span>
                <span className="fin-fact__label">{fact.label}</span>
                <span className="fin-fact__note">{fact.note}</span>
              </li>
            ))}
          </ul>
        </ListDock>
      </CmsSection>

      <CmsSection id="projects" className="fin-projects" labelledBy="fin-projects-title">
        <div className="fin-projects__heading">
          <div>
            <EditableText
              section="projects"
              field="eyebrow"
              fallback="BUDGETS PUBLIÉS DES PROJETS"
              as="p"
              label="Sur-titre"
            >
              {get('projects.eyebrow', 'BUDGETS PUBLIÉS DES PROJETS')}
            </EditableText>
            <EditableText
              section="projects"
              field="title"
              fallback="LES SIX PROJETS"
              as="h2"
              id="fin-projects-title"
              label="Titre"
            >
              {get('projects.title', 'LES SIX PROJETS')}
            </EditableText>
          </div>
          <EditableText
            section="projects"
            field="body"
            fallback="Chaque projet dispose de son propre budget, partenaire de mise en œuvre et périmètre d’action. Les montants ci-dessous sont les enveloppes publiées ; leur somme ne reconstitue pas seule le budget global du programme."
            as="p"
            label="Texte"
          />
        </div>

        <p className="fin-project-pencils">
          <Pencil section="projects" field="fundingLabel" fallback="Financement" label="Libellé financement" />
          <Pencil section="projects" field="partnerLabel" fallback="Partenaire" label="Libellé partenaire" />
          <Pencil section="projects" field="periodLabel" fallback="Période" label="Libellé période" />
          <Pencil section="projects" field="more" fallback="Découvrir le projet" label="Lien projet" />
        </p>

        <ListDock>
          <EditableJsonList
            section="projects"
            field="items"
            label="Budgets des projets"
            className="fin-list-cms"
            wrapItems={false}
            manageLabel="Gérer les budgets"
            fallback={PROJECTS_FALLBACK}
            fields={[
              { key: 'slug', label: 'Identifiant' },
              { key: 'acronym', label: 'Acronyme' },
              { key: 'budget', label: 'Budget' },
              { key: 'composante', label: 'Composante' },
              { key: 'funding', label: 'Financement', multiline: true },
              { key: 'partner', label: 'Partenaire', multiline: true },
              { key: 'period', label: 'Période' },
              { key: 'logo', label: 'Logo (chemin /img/…)' },
            ]}
            emptyItem={{
              slug: 'nouveau',
              acronym: 'Nouveau',
              budget: '',
              composante: '',
              funding: "Financé par l'Union européenne dans le cadre d'EU4Youth",
              partner: '',
              period: '',
              logo: '/img/logo-jeuness.png',
            }}
            renderItem={() => null}
          />
          <ul className="fin-projects__grid">
            {projects.map((project) => (
              <li
                key={project.slug}
                className="fin-project"
                style={{ '--project-colour': `var(--p-${project.theme})` } as CSSProperties}
              >
                <Link to={`/projets/${project.slug}`}>
                  <div className="fin-project__head">
                    <img src={project.logo} alt="" aria-hidden="true" />
                    <span>{project.acronym}</span>
                  </div>
                  <p className="fin-project__budget">{project.budget}</p>
                  <p className="fin-project__component">{project.composante}</p>
                  <dl>
                    <div>
                      <dt>{fundingLabel}</dt>
                      <dd>{project.funding}</dd>
                    </div>
                    <div>
                      <dt>{partnerLabel}</dt>
                      <dd>{project.partner}</dd>
                    </div>
                    <div>
                      <dt>{periodLabel}</dt>
                      <dd>{project.period}</dd>
                    </div>
                  </dl>
                  <span className="fin-project__more">
                    {discoverLabel.replace(/\s*[»«→←]+\s*$/u, '').trim()}{' '}
                    <b aria-hidden="true">{forwardMark}</b>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </ListDock>
      </CmsSection>

      <CmsSection id="purpose" className="fin-purpose" labelledBy="fin-purpose-title">
        <EditableText
          section="purpose"
          field="title"
          fallback={'UN FINANCEMENT\nAU SERVICE DES TERRITOIRES'}
          as="h2"
          id="fin-purpose-title"
          label="Titre"
        >
          {(() => {
            const lines = linesOf(
              get('purpose.title', 'UN FINANCEMENT\nAU SERVICE DES TERRITOIRES'),
              ['UN FINANCEMENT', 'AU SERVICE DES TERRITOIRES'],
            )
            return (
              <>
                {lines[0]}
                {lines[1] ? <span>{lines[1]}</span> : null}
              </>
            )
          })()}
        </EditableText>
        <ListDock>
          <EditableJsonList
            section="purpose"
            field="items"
            label="Axes de financement"
            className="fin-list-cms"
            wrapItems={false}
            manageLabel="Gérer les axes"
            fallback={THEMES_FALLBACK}
            fields={[
              { key: 'title', label: 'Titre' },
              { key: 'text', label: 'Texte', multiline: true },
            ]}
            emptyItem={{ title: '', text: '' }}
            renderItem={() => null}
          />
          <div className="fin-purpose__grid">
            {themes.map((theme, index) => (
              <article key={`${theme.title}-${index}`}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{theme.title}</h3>
                <p>{theme.text}</p>
              </article>
            ))}
          </div>
        </ListDock>
      </CmsSection>

      <CmsSection id="structure" className="fin-structure" labelledBy="fin-structure-title">
        <EditableText
          section="structure"
          field="title"
          fallback="COMMENT LE FINANCEMENT EST ORGANISÉ"
          as="h2"
          id="fin-structure-title"
          label="Titre"
        >
          {get('structure.title', 'COMMENT LE FINANCEMENT EST ORGANISÉ')}
        </EditableText>
        <ListDock>
          <EditableJsonList
            section="structure"
            field="items"
            label="Organisation"
            className="fin-list-cms"
            wrapItems={false}
            manageLabel="Gérer l’organisation"
            fallback={STRUCTURE_FALLBACK}
            fields={[
              { key: 'title', label: 'Titre' },
              { key: 'body', label: 'Texte', multiline: true },
            ]}
            emptyItem={{ title: '', body: '' }}
            renderItem={() => null}
          />
          <div className="fin-structure__grid">
            {structure.map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </ListDock>
      </CmsSection>

      <CmsSection id="cta" className="fin-cta" labelledBy="fin-cta-title">
        <div>
          <EditableText
            section="cta"
            field="eyebrow"
            fallback="ALLER PLUS LOIN"
            as="p"
            label="Sur-titre"
          >
            {get('cta.eyebrow', 'ALLER PLUS LOIN')}
          </EditableText>
          <EditableText
            section="cta"
            field="title"
            fallback="DÉCOUVRIR LES ACTIONS FINANCÉES"
            as="h2"
            id="fin-cta-title"
            label="Titre"
          >
            {get('cta.title', 'DÉCOUVRIR LES ACTIONS FINANCÉES')}
          </EditableText>
        </div>
        <div className="fin-cta__actions">
          <Link className="btn btn--fill-blue" to="/projets">
            <EditableText
              section="cta"
              field="projects"
              fallback="Voir les six projets"
              as="span"
              multiline={false}
              label="Bouton projets"
            >
              {get('cta.projects', 'Voir les six projets')}
            </EditableText>{' '}
            <span aria-hidden="true">{forwardMark}</span>
          </Link>
          <Link className="btn btn--line-orange" to="/publications">
            <EditableText
              section="cta"
              field="publications"
              fallback="Publications et ressources"
              as="span"
              multiline={false}
              label="Bouton publications"
            >
              {get('cta.publications', 'Publications et ressources')}
            </EditableText>{' '}
            <span aria-hidden="true">{forwardMark}</span>
          </Link>
        </div>
      </CmsSection>
    </div>
  )
}
