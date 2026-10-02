import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ContentProvider } from '../../cms/ContentProvider'
import EditableHeroBackground from '../../cms/EditableHeroBackground'
import EditableText from '../../cms/EditableText'
import EditToolbar from '../../cms/EditToolbar'

type OrgPageShellProps = {
  titleKey: string
  titleFallback: string
  leadKey?: string
  leadFallback?: string
  children: ReactNode
}

/** Shared shell for Organisation sub-pages — same hero language as the rest of Fi2T. */
export default function OrgPageShell({
  titleKey,
  titleFallback,
  leadKey,
  leadFallback,
  children,
}: OrgPageShellProps) {
  return (
    <ContentProvider page="organisation">
      <div className="fi2t-org-page">
        <section className="fi2t-page-hero fi2t-page-hero--org" data-cms-section="hero">
          <EditableHeroBackground
            page="organisation"
            fallback="/images/qui-sommes-nous-banner.png?v=8"
          />
          <div className="fi2t-page-hero__overlay" aria-hidden="true" />
          <div className="fi2t-page-hero__content">
            <nav className="fi2t-org-crumb" aria-label="Fil d’Ariane">
              <Link to="/organisation">Organisation</Link>
              <span aria-hidden="true">/</span>
              <span>{titleFallback}</span>
            </nav>
            <EditableText
              page="organisation"
              blockKey={titleKey}
              as="h1"
              className="fi2t-page-hero__title"
              fallback={titleFallback}
            />
            <span className="fi2t-page-hero__accent" aria-hidden="true" />
            {leadKey && leadFallback ? (
              <EditableText
                page="organisation"
                blockKey={leadKey}
                as="p"
                className="fi2t-org-crumb__lead"
                multiline
                fallback={leadFallback}
              />
            ) : null}
          </div>
        </section>
        {children}
      </div>
      <EditToolbar />
    </ContentProvider>
  )
}
