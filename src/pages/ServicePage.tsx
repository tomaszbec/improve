import { useMemo } from 'react'
import { ArrowRight, Check, Code2, Headphones, SearchCheck, Settings2 } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePageSeo, siteUrl } from '../lib/seo'

const slugToKey = {
  'custom-software-development': 'software',
  'software-modernization': 'modernization',
  'application-support': 'support',
  'systems-integration': 'integrations',
  'technology-audit': 'audit',
  'devops-cloud': 'devops',
  'ai-agents': 'agents',
  'llm-semantic-search': 'llm',
  'process-automation': 'automation',
  'web-applications': 'web',
  'mobile-apps': 'mobile',
  'ai-infrastructure': 'infra',
} as const

type ServiceData = {
  title: string
  description: string
  full_text: string
  features: string[]
  tech: string[]
  seo_title?: string
  seo_description?: string
}

type Faq = { question: string; answer: string }

export function ServicePage() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const serviceKey = slugToKey[slug as keyof typeof slugToKey]
  const data = serviceKey ? t(`services.items.${serviceKey}`, { returnObjects: true }) as ServiceData : null
  const process = t('service_page.process.steps', { returnObjects: true }) as Array<{ title: string; text: string }>
  const faqs = t('service_page.faqs', { returnObjects: true }) as Faq[]
  const title = data?.seo_title || data?.title || t('services.title')
  const description = data?.seo_description || data?.description || t('services.description')

  const schema = useMemo(() => data ? ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${siteUrl}/services/${slug}#service`,
        name: data.title,
        description,
        serviceType: data.title,
        provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'improveIT.pl', url: siteUrl },
        areaServed: ['Poland', 'European Union', 'Worldwide'],
        url: `${siteUrl}/services/${slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('nav.home'), item: siteUrl },
          { '@type': 'ListItem', position: 2, name: t('services.label'), item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: data.title, item: `${siteUrl}/services/${slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  }) : undefined, [data, description, faqs, slug, t])

  usePageSeo({ title, description, path: `/services/${slug}`, schema })

  if (!serviceKey || !data) return <Navigate to="/services" replace />

  return (
    <article className="business-service-page">
      <header className="business-service-hero">
        <div className="section__container business-service-hero__grid">
          <div>
            <nav className="blog-breadcrumbs" aria-label={t('service_page.breadcrumb_label')}>
              <Link to="/services">{t('services.label')}</Link>
              <span className="blog-breadcrumbs__separator">/</span>
              <span aria-current="page">{data.title}</span>
            </nav>
            <div className="hero__badge"><span className="hero__badge-dot" />{t('service_page.badge')}</div>
            <h1>{data.title}</h1>
            <p className="business-service-hero__lead">{data.full_text}</p>
            <div className="business-service-hero__actions">
              <Link to="/contact" className="btn btn--primary">{t('service_page.cta_quote')} <ArrowRight aria-hidden="true" /></Link>
              <a href="#zakres" className="btn btn--outline">{t('service_page.cta_scope')}</a>
            </div>
          </div>
          <div className="business-service-hero__panel" aria-hidden="true">
            <Code2 />
            <div><span>01</span><strong>{t('service_page.panel.audit')}</strong></div>
            <div><span>02</span><strong>{t('service_page.panel.delivery')}</strong></div>
            <div><span>03</span><strong>{t('service_page.panel.support')}</strong></div>
          </div>
        </div>
      </header>

      <section className="section business-service-answer">
        <div className="section__container">
          <span>{t('service_page.direct_answer_label')}</span>
          <p>{data.description} {t('service_page.direct_answer_suffix')}</p>
        </div>
      </section>

      <section className="section business-service-scope" id="zakres">
        <div className="section__container">
          <div className="section__header">
            <span className="section__label">{t('service_page.scope_label')}</span>
            <h2 className="section__title">{t('service_page.scope_title', { service: data.title })}</h2>
            <p className="section__description">{t('service_page.scope_description')}</p>
          </div>
          <div className="business-service-scope__grid">
            {data.features.map((feature, index) => (
              <article key={feature}><span>0{index + 1}</span><Check aria-hidden="true" /><h3>{feature}</h3></article>
            ))}
          </div>
          <div className="business-service-tech">
            <strong>{t('service_page.tech_title')}</strong>
            <div>{data.tech.map((technology) => <span key={technology}>{technology}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="section business-service-process">
        <div className="section__container">
          <div className="section__header">
            <span className="section__label">{t('service_page.process.label')}</span>
            <h2 className="section__title">{t('service_page.process.title')}</h2>
          </div>
          <ol>
            {process.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                {index === 0 ? <SearchCheck aria-hidden="true" /> : index === process.length - 1 ? <Headphones aria-hidden="true" /> : <Settings2 aria-hidden="true" />}
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section business-service-faq">
        <div className="section__container">
          <div className="section__header">
            <span className="section__label">FAQ</span>
            <h2 className="section__title">{t('service_page.faq_title')}</h2>
          </div>
          <div className="business-service-faq__list">
            {faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
          <p className="business-service-updated">{t('service_page.updated')}</p>
        </div>
      </section>

      <section className="section">
        <div className="section__container ai-services-cta">
          <span className="section__label">{t('service_page.cta_label')}</span>
          <h2>{t('service_page.cta_title')}</h2>
          <p>{t('service_page.cta_text')}</p>
          <Link className="btn btn--primary" to="/contact">{t('service_page.cta_quote')} <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </article>
  )
}
