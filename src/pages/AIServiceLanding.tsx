import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Headphones,
  ShieldCheck,
  TrendingUp,
  Workflow,
} from 'lucide-react'
import { localizedSiteUrl, usePageSeo, siteUrl } from '../lib/seo'

const serviceMap = {
  'customer-service': { key: 'customerService', icon: Headphones },
  sales: { key: 'sales', icon: TrendingUp },
  operations: { key: 'operations', icon: Workflow },
  knowledge: { key: 'knowledge', icon: BookOpen },
  'software-development': { key: 'softwareDevelopment', icon: Code2 },
  'ai-guard': { key: 'aiGuard', icon: ShieldCheck },
} as const

type ServiceData = {
  title: string
  headline: string
  description: string
  bullets: string[]
  seoDescription: string
  capabilitiesTitle: string
  capabilities: Array<{ title: string; text: string }>
  outcomeTitle: string
  outcomeText: string
}

export function AIServiceLanding() {
  const { serviceSlug = '' } = useParams()
  const { t } = useTranslation()
  const config = serviceMap[serviceSlug as keyof typeof serviceMap]
  const data = config ? t(`ai_service_pages.${config.key}`, { returnObjects: true }) as ServiceData : null
  const steps = t('ai_services.model.steps', { returnObjects: true }) as string[]
  const faqs = t('ai_services.faqs', { returnObjects: true }) as Array<{ question: string; answer: string }>
  const schema = useMemo(() => data ? ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: data.title,
        description: data.seoDescription,
        provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'improveIT.pl', url: siteUrl },
        url: localizedSiteUrl(`/services/ai-transformation/${serviceSlug}`),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  }) : undefined, [data, faqs, serviceSlug])

  usePageSeo({
    title: data?.title || t('ai_services.seo.title'),
    description: data?.seoDescription || t('ai_services.seo.description'),
    path: `/services/ai-transformation/${serviceSlug}`,
    schema,
  })

  if (!config || !data) return <Navigate to="/services/ai-transformation" replace />
  const Icon = config.icon

  return (
    <div className="ai-service-detail-page">
      <section className="ai-service-detail-hero">
        <div className="section__container ai-service-detail-hero__grid">
          <div>
            <div className="blog-breadcrumbs">
              <Link to="/services/ai-transformation">{t('ai_services.breadcrumb')}</Link>
              <span className="blog-breadcrumbs__separator">/</span>
              <span aria-current="page">{data.title}</span>
            </div>
            <div className="hero__badge"><span className="hero__badge-dot" />{data.title}</div>
            <h1>{data.headline}</h1>
            <p>{data.description}</p>
            <ul>{data.bullets.map((bullet) => <li key={bullet}><Check aria-hidden="true" />{bullet}</li>)}</ul>
            <div className="ai-services-hero__actions">
              <Link to="/contact" className="btn btn--primary">{t('ai_service_pages.common.cta')} <ArrowRight aria-hidden="true" /></Link>
              <a href="#zakres" className="btn btn--outline">{t('ai_service_pages.common.scope')}</a>
            </div>
          </div>
          <div className="ai-service-detail-visual" aria-hidden="true">
            <div className="ai-service-detail-visual__icon"><Icon /></div>
            <div><span>01</span><strong>{t('ai_service_pages.common.audit')}</strong></div>
            <div><span>02</span><strong>{t('ai_service_pages.common.integrate')}</strong></div>
            <div><span>03</span><strong>{t('ai_service_pages.common.measure')}</strong></div>
            <i /><i /><i />
          </div>
        </div>
      </section>

      <section className="section ai-service-capabilities" id="zakres">
        <div className="section__container">
          <div className="section__header">
            <span className="section__label">{t('ai_service_pages.common.capabilitiesLabel')}</span>
            <h2 className="section__title">{data.capabilitiesTitle}</h2>
          </div>
          <div className="ai-service-capabilities__grid">
            {data.capabilities.map((capability, index) => (
              <article key={capability.title}><span>0{index + 1}</span><h3>{capability.title}</h3><p>{capability.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section ai-service-outcome">
        <div className="section__container ai-service-outcome__grid">
          <div><span className="section__label">{t('ai_service_pages.common.outcomeLabel')}</span><h2>{data.outcomeTitle}</h2></div>
          <div><p>{data.outcomeText}</p><ul>{steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ul></div>
        </div>
      </section>

      <section className="section">
        <div className="section__container business-service-faq">
          <div className="section__header">
            <span className="section__label">FAQ</span>
            <h2 className="section__title">{t('ai_service_pages.common.faqTitle')}</h2>
          </div>
          <div className="business-service-faq__list">
            {faqs.slice(0, 4).map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
          <p className="business-service-updated">{t('ai_service_pages.common.updated')}</p>
        </div>
      </section>

      <section className="section">
        <div className="section__container ai-services-cta">
          <span className="section__label">{t('ai_service_pages.common.ctaLabel')}</span>
          <h2>{t('ai_service_pages.common.ctaTitle')}</h2>
          <p>{t('ai_service_pages.common.ctaText')}</p>
          <Link className="btn btn--primary" to="/contact">{t('ai_service_pages.common.cta')} <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  )
}
