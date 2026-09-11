import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizedSiteUrl, siteUrl, usePageSeo } from '../lib/seo'

type Metric = { label: string; value: string }
type Section = { title: string; text: string; bullets?: string[] }
type Faq = { question: string; answer: string }
type Source = { label: string; url: string }
export type SeoPage = {
  path: string
  cluster: string
  kind?: string
  title: string
  subtitle: string
  description: string
  directAnswer: string
  image: string
  metrics: Metric[]
  sections: Section[]
  faqs: Faq[]
  sources?: Source[]
  related?: string[]
}

type SeoData = { pages: SeoPage[] }

const normalized = (path: string) => path.length > 1 ? path.replace(/\/$/, '') : path

export function SeoLandingPage() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const isPolish = i18n.resolvedLanguage?.startsWith('pl') ?? true
  const [data, setData] = useState<SeoData | null>(null)

  useEffect(() => {
    fetch(`/content/seo-pages${isPolish ? '.pl' : ''}.json`)
      .then((response) => response.ok ? response.json() : Promise.reject(response.status))
      .then(setData)
      .catch(() => setData({ pages: [] }))
  }, [isPolish])

  const page = useMemo(() => data?.pages.find((item) => normalized(item.path) === normalized(pathname)), [data, pathname])

  const schema = useMemo(() => page ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${localizedSiteUrl(page.path)}#webpage`,
        name: page.title,
        description: page.description,
        url: localizedSiteUrl(page.path),
        inLanguage: isPolish ? 'pl-PL' : 'en-US',
        isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isPolish ? 'Strona główna' : 'Home', item: localizedSiteUrl('/') },
          { '@type': 'ListItem', position: 2, name: page.title, item: localizedSiteUrl(page.path) },
        ],
      },
    ],
  } : undefined, [isPolish, page])

  usePageSeo({
    title: page?.title || (isPolish ? 'Przewodnik technologiczny' : 'Technology guide'),
    description: page?.description || (isPolish ? 'Praktyczne materiały improveIT.pl.' : 'Practical resources from improveIT.pl.'),
    path: normalized(pathname),
    image: page?.image,
    schema,
  })

  if (!data) return <div className="seo-loading" aria-live="polite">{isPolish ? 'Ładowanie…' : 'Loading…'}</div>
  if (!page) return <div className="seo-loading">{isPolish ? 'Nie znaleziono strony.' : 'Page not found.'}</div>

  const related = (page.related || [])
    .map((path) => data.pages.find((item) => normalized(item.path) === normalized(path)))
    .filter((item): item is SeoPage => Boolean(item))

  const hubChildren = page.kind === 'hub'
    ? data.pages.filter((item) => item.cluster === page.cluster && item.kind !== 'hub')
    : []

  return (
    <article className="seo-page">
      <header className="seo-hero">
        <img className="seo-hero__image" src={page.image} alt="" fetchPriority="high" />
        <div className="seo-hero__shade" />
        <div className="container seo-hero__content">
          <nav className="seo-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isPolish ? 'Strona główna' : 'Home'}</Link><span>/</span><span>{page.cluster}</span>
          </nav>
          <p className="seo-eyebrow">{page.cluster}</p>
          <h1>{page.title}</h1>
          <p className="seo-hero__subtitle">{page.subtitle}</p>
          <p className="seo-hero__description">{page.description}</p>
          <div className="seo-actions">
            <Link className="btn btn--primary" to="/contact">{isPolish ? 'Porozmawiaj z ekspertem' : 'Talk to an expert'} →</Link>
            <a className="btn btn--secondary" href="#guide">{isPolish ? 'Poznaj przewodnik' : 'Explore the guide'}</a>
          </div>
        </div>
      </header>

      <div className="container seo-body" id="guide">
        <section className="seo-answer" aria-label="Direct answer">
          <span>{isPolish ? 'W skrócie' : 'In brief'}</span><p>{page.directAnswer}</p>
        </section>

        <section className="seo-metrics" aria-label="Key metrics">
          {page.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
        </section>

        {hubChildren.length > 0 && (
          <section className="seo-section">
            <p className="seo-eyebrow">{isPolish ? 'Poznaj framework' : 'Explore the framework'}</p>
            <h2>{isPolish ? 'Optymalizacja AI: od przejrzystości do wartości biznesowej' : 'AI optimization, from visibility to business value'}</h2>
            <div className="seo-card-grid">
              {hubChildren.map((item) => (
                <Link to={normalized(item.path)} className="seo-card" key={item.path}>
                  <h3>{item.title}</h3><p>{item.description}</p><span>{isPolish ? 'Czytaj przewodnik' : 'Read guide'} →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {page.sections.map((section, index) => (
          <section className="seo-section seo-section--split" key={section.title}>
            <div><span className="seo-step">0{index + 1}</span><h2>{section.title}</h2></div>
            <div><p>{section.text}</p>{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</div>
          </section>
        ))}

        {page.sources && page.sources.length > 0 && (
          <section className="seo-sources"><h2>{isPolish ? 'Źródła podstawowe' : 'Primary sources'}</h2>{page.sources.map((source) => <a href={source.url} rel="noreferrer" target="_blank" key={source.url}>{source.label} ↗</a>)}</section>
        )}

        <section className="seo-section seo-faq"><p className="seo-eyebrow">FAQ</p><h2>{isPolish ? 'Pytania zadawane przez zespoły' : 'Questions teams ask'}</h2>
          {page.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
        </section>

        {related.length > 0 && <section className="seo-related"><h2>{isPolish ? 'Czytaj dalej' : 'Continue exploring'}</h2><div>{related.map((item) => <Link to={normalized(item.path)} key={item.path}>{item.title}<span>→</span></Link>)}</div></section>}

        <section className="seo-cta"><p className="seo-eyebrow">{isPolish ? 'Popraw ekonomię AI' : 'Improve AI economics'}</p><h2>{isPolish ? 'Zamień telemetrię AI w trafne decyzje.' : 'Turn AI telemetry into decisions.'}</h2><p>{isPolish ? 'Pomożemy zaprojektować pomiary, zasady zarządzania i optymalizację AI w Twojej organizacji inżynieryjnej.' : 'We can help you design measurement, governance and optimization for your engineering organization.'}</p><Link className="btn btn--primary" to="/contact">{isPolish ? 'Rozpocznij rozmowę' : 'Start a conversation'} →</Link></section>
      </div>
    </article>
  )
}
