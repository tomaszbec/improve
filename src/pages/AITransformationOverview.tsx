import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Code2,
  Headphones,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Workflow,
} from 'lucide-react'
import { localizedSiteUrl, usePageSeo, siteUrl } from '../lib/seo'

const services = [
  { key: 'ecommerce', slug: 'ecommerce', icon: ShoppingCart },
  { key: 'customerService', slug: 'customer-service', icon: Headphones },
  { key: 'sales', slug: 'sales', icon: TrendingUp },
  { key: 'operations', slug: 'operations', icon: Workflow },
  { key: 'knowledge', slug: 'knowledge', icon: BookOpen },
  { key: 'softwareDevelopment', slug: 'software-development', icon: Code2 },
  { key: 'aiGuard', slug: 'ai-guard', icon: ShieldCheck },
] as const

export function AITransformationOverview() {
  const { t } = useTranslation()
  const steps = t('ai_services.model.steps', { returnObjects: true }) as string[]
  const faqs = t('ai_services.faqs', { returnObjects: true }) as Array<{ question: string; answer: string }>
  const title = t('ai_services.seo.title')
  const description = t('ai_services.seo.description')
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: title,
        description,
        url: localizedSiteUrl('/services/ai-transformation'),
        provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'improveIT.pl', url: siteUrl },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: title,
          itemListElement: services.map(({ key, slug }) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: t(`ai_services.items.${key}.title`),
              url: localizedSiteUrl(`/services/ai-transformation/${slug}`),
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  }), [description, faqs, t, title])

  usePageSeo({ title, description, path: '/services/ai-transformation', schema })

  return (
    <div className="ai-services-page">
      <section className="ai-services-hero">
        <div className="section__container ai-services-hero__grid">
          <div>
            <div className="blog-breadcrumbs">
              <Link to="/services">{t('services.label')}</Link>
              <span className="blog-breadcrumbs__separator">/</span>
              <span aria-current="page">{t('ai_services.breadcrumb')}</span>
            </div>
            <div className="hero__badge"><span className="hero__badge-dot" />{t('ai_services.hero.badge')}</div>
            <h1>{t('ai_services.hero.title_start')} <span>{t('ai_services.hero.title_accent')}</span></h1>
            <p className="ai-services-hero__lead">{t('ai_services.hero.lead')}</p>
            <p className="ai-services-hero__description">{t('ai_services.hero.description')}</p>
            <div className="ai-services-hero__actions">
              <a href="#obszary-transformacji" className="btn btn--primary">{t('ai_services.hero.cta_services')} <ArrowRight aria-hidden="true" /></a>
              <Link to="/contact" className="btn btn--outline">{t('ai_services.hero.cta_talk')}</Link>
            </div>
          </div>

          <div className="ai-services-map" aria-label={t('ai_services.map.label')}>
            <div className="ai-services-map__core"><Bot aria-hidden="true" /><strong>AI</strong><span>{t('ai_services.map.core')}</span></div>
            <div className="ai-services-map__orbit">
              {services.map(({ key, icon: Icon }) => (
                <div key={key}>
                  <Icon aria-hidden="true" /><span>{t(`ai_services.items.${key}.short`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section ai-services-catalog" id="obszary-transformacji">
        <div className="section__container">
          <div className="section__header">
            <span className="section__label">{t('ai_services.catalog.label')}</span>
            <h2 className="section__title">{t('ai_services.catalog.title')}</h2>
            <p className="section__description">{t('ai_services.catalog.description')}</p>
          </div>
          <div className="ai-services-catalog__grid">
            {services.map(({ key, slug, icon: Icon }, index) => {
              const bullets = t(`ai_services.items.${key}.bullets`, { returnObjects: true }) as string[]
              return (
                <Link className={`ai-services-card ${index === 0 ? 'ai-services-card--featured' : ''}`} to={`/services/ai-transformation/${slug}`} key={key}>
                  <div className="ai-services-card__top"><div className="service-card__icon"><Icon aria-hidden="true" /></div><span>0{index + 1}</span></div>
                  <p className="ai-services-card__eyebrow">{t(`ai_services.items.${key}.title`)}</p>
                  <h3>{t(`ai_services.items.${key}.headline`)}</h3>
                  <p>{t(`ai_services.items.${key}.description`)}</p>
                  <ul>{bullets.map((bullet) => <li key={bullet}><span />{bullet}</li>)}</ul>
                  <strong>{t('ai_services.catalog.more')} <ArrowRight aria-hidden="true" /></strong>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section ai-services-model">
        <div className="section__container ai-services-model__grid">
          <div>
            <span className="section__label">{t('ai_services.model.label')}</span>
            <h2 className="section__title">{t('ai_services.model.title')}</h2>
            <p>{t('ai_services.model.description')}</p>
          </div>
          <ol>
            {steps.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}
          </ol>
        </div>
        <div className="section__container ai-services-model__note"><SearchCheck aria-hidden="true" /><p>{t('ai_services.model.note')}</p></div>
      </section>

      <section className="section">
        <div className="section__container business-service-faq">
          <div className="section__header">
            <span className="section__label">FAQ</span>
            <h2 className="section__title">{t('ai_services.faq_title')}</h2>
          </div>
          <div className="business-service-faq__list">
            {faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__container ai-services-cta">
          <span className="section__label">{t('ai_services.cta.label')}</span>
          <h2>{t('ai_services.cta.title')}</h2>
          <p>{t('ai_services.cta.description')}</p>
          <Link className="btn btn--primary" to="/contact">{t('ai_services.cta.button')} <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  )
}
