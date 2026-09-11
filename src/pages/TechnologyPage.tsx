import { useMemo } from 'react'
import { ArrowRight, Check, Code2 } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { localizedSiteUrl, siteUrl, usePageSeo } from '../lib/seo'

const slugToKey = {
  'go-development': 'go', 'python-development': 'python', 'node-development': 'node', 'php-development': 'php',
  'react-development': 'react', 'vue-development': 'vue', 'angular-development': 'angular', 'next-js-development': 'next',
  'typescript-development': 'typescript', 'dotnet-development': 'dotnet', 'java-development': 'java',
  'flutter-development': 'flutter', 'react-native-development': 'reactnative', 'swift-development': 'swift',
  'kotlin-development': 'kotlin', 'postgresql-development': 'postgres', 'mongodb-development': 'mongo',
  'redis-development': 'redis', 'docker-development': 'docker', 'kubernetes-development': 'k8s',
  'aws-development': 'aws', 'azure-development': 'azure', 'graphql-development': 'graphql',
  'tensorflow-development': 'tensorflow', 'figma-development': 'figma',
} as const

type TechnologyData = {
  title: string
  description: string
  full_text: string
  features: string[]
  tech: string[]
  seo_title?: string
  seo_description?: string
}

type Faq = { question: string; answer: string }

export function TechnologyPage() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const techKey = slugToKey[slug as keyof typeof slugToKey]
  const data = techKey ? t(`tech.items.${techKey}`, { returnObjects: true }) as TechnologyData : null
  const faqs = t('technology_page.faqs', { returnObjects: true }) as Faq[]
  const title = data?.seo_title || data?.title || t('tech.title')
  const description = data?.seo_description || data?.full_text || t('tech.description')

  const schema = useMemo(() => data ? ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: data.title,
        serviceType: data.title,
        description,
        url: localizedSiteUrl(`/technologies/${slug}`),
        provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'improveIT.pl', url: siteUrl },
        areaServed: ['Poland', 'European Union', 'Worldwide'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  }) : undefined, [data, description, faqs, slug])

  usePageSeo({ title, description, path: `/technologies/${slug}`, schema })

  if (!techKey || !data) return <Navigate to="/services" replace />

  return (
    <article className="business-service-page technology-service-page">
      <header className="business-service-hero">
        <div className="section__container business-service-hero__grid">
          <div>
            <nav className="blog-breadcrumbs" aria-label={t('technology_page.breadcrumb_label')}>
              <Link to="/services">{t('services.label')}</Link><span className="blog-breadcrumbs__separator">/</span><span aria-current="page">{data.title}</span>
            </nav>
            <div className="hero__badge"><span className="hero__badge-dot" />{t('technology_page.badge')}</div>
            <h1>{data.title}</h1>
            <p className="business-service-hero__lead">{data.full_text}</p>
            <div className="business-service-hero__actions">
              <Link to="/contact" className="btn btn--primary">{t('technology_page.cta')} <ArrowRight aria-hidden="true" /></Link>
              <a href="#kompetencje" className="btn btn--outline">{t('technology_page.scope')}</a>
            </div>
          </div>
          <div className="business-service-hero__panel technology-service-panel" aria-hidden="true">
            <Code2 />
            {data.tech.slice(0, 3).map((technology, index) => <div key={technology}><span>0{index + 1}</span><strong>{technology}</strong></div>)}
          </div>
        </div>
      </header>

      <section className="section business-service-answer">
        <div className="section__container"><span>{t('technology_page.direct_answer_label')}</span><p>{data.description} {t('technology_page.direct_answer_suffix')}</p></div>
      </section>

      <section className="section business-service-scope" id="kompetencje">
        <div className="section__container">
          <div className="section__header"><span className="section__label">{t('technology_page.scope_label')}</span><h2 className="section__title">{t('technology_page.scope_title', { technology: data.title })}</h2><p className="section__description">{t('technology_page.scope_description')}</p></div>
          <div className="business-service-scope__grid">
            {data.features.map((feature, index) => <article key={feature}><span>0{index + 1}</span><Check aria-hidden="true" /><h3>{feature}</h3></article>)}
          </div>
          <div className="business-service-tech"><strong>{t('technology_page.stack_title')}</strong><div>{data.tech.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
        </div>
      </section>

      <section className="section business-service-faq">
        <div className="section__container">
          <div className="section__header"><span className="section__label">FAQ</span><h2 className="section__title">{t('technology_page.faq_title', { technology: data.title })}</h2></div>
          <div className="business-service-faq__list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
          <p className="business-service-updated">{t('technology_page.updated')}</p>
        </div>
      </section>

      <section className="section">
        <div className="section__container ai-services-cta">
          <span className="section__label">{t('technology_page.cta_label')}</span>
          <h2>{t('technology_page.cta_title')}</h2>
          <p>{t('technology_page.cta_text')}</p>
          <div className="business-service-hero__actions" style={{ justifyContent: 'center' }}>
            <Link className="btn btn--primary" to="/contact">{t('technology_page.cta')} <ArrowRight aria-hidden="true" /></Link>
            <Link className="btn btn--outline" to="/services/software-modernization">{t('technology_page.modernization_link')}</Link>
          </div>
        </div>
      </section>
    </article>
  )
}
