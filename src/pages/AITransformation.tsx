import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Headphones,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { publishingApiUrl } from '../lib/publishingApi'
import { localizedSiteUrl, usePageSeo, siteUrl } from '../lib/seo'
import { CustomSelect } from '../components/CustomSelect'

type QuoteStatus = 'idle' | 'submitting' | 'success' | 'error'

const opportunityIcons = [Bot, SearchCheck, Workflow, BarChart3]

export function AITransformation() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<QuoteStatus>('idle')
  const [quoteAttempted, setQuoteAttempted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    platform: '',
    scale: '',
    budget: '',
    message: '',
  })

  const heroPoints = t('ai_transformation.hero.points', { returnObjects: true }) as string[]
  const opportunities = t('ai_transformation.opportunities.items', { returnObjects: true }) as Array<{ title: string; text: string }>
  const process = t('ai_transformation.process.steps', { returnObjects: true }) as Array<{ title: string; text: string; result: string }>
  const scopeItems = t('ai_transformation.pricing.items', { returnObjects: true }) as string[]
  const platformOptions = t('ai_transformation.quote.platform_options', { returnObjects: true }) as string[]
  const scaleOptions = t('ai_transformation.quote.scale_options', { returnObjects: true }) as string[]
  const budgetOptions = t('ai_transformation.quote.budget_options', { returnObjects: true }) as string[]
  const faqs = t('ai_services.faqs', { returnObjects: true }) as Array<{ question: string; answer: string }>

  const title = t('ai_transformation.seo.title')
  const description = t('ai_transformation.seo.description')
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: title,
        description,
        url: localizedSiteUrl('/services/ai-transformation/ecommerce'),
        provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'improveIT.pl', url: siteUrl },
        areaServed: ['Poland', 'European Union', 'Worldwide'],
        serviceType: 'AI transformation for e-commerce',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  }), [description, faqs, title])

  usePageSeo({
    title,
    description,
    path: '/services/ai-transformation/ecommerce',
    schema,
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.platform || !formData.scale || !formData.budget) {
      setQuoteAttempted(true)
      return
    }

    setStatus('submitting')

    const details = [
      `${t('ai_transformation.quote.website')}: ${formData.website || '-'}`,
      `${t('ai_transformation.quote.platform')}: ${formData.platform || '-'}`,
      `${t('ai_transformation.quote.scale')}: ${formData.scale || '-'}`,
      `${t('ai_transformation.quote.budget')}: ${formData.budget || '-'}`,
      '',
      formData.message,
    ].join('\n')

    try {
      const response = await fetch(`${publishingApiUrl}/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          subject: 'ai-transformation',
          message: details,
        }),
      })
      const result = await response.json()

      if (response.ok && result.status === 'success') {
        setStatus('success')
        setQuoteAttempted(false)
        setFormData({ name: '', email: '', company: '', website: '', platform: '', scale: '', budget: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="ai-transformation-page">
      <section className="ai-transformation-hero">
        <div className="section__container ai-transformation-hero__grid">
          <div className="ai-transformation-hero__content">
            <div className="blog-breadcrumbs">
              <Link to="/services/ai-transformation">{t('ai_services.breadcrumb')}</Link>
              <span className="blog-breadcrumbs__separator">/</span>
              <span aria-current="page">E-commerce → AI</span>
            </div>
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              {t('ai_transformation.hero.badge')}
            </div>
            <h1 className="ai-transformation-hero__title">
              E-commerce <span>→ AI</span>
            </h1>
            <p className="ai-transformation-hero__lead">{t('ai_transformation.hero.title')}</p>
            <p className="ai-transformation-hero__description">{t('ai_transformation.hero.description')}</p>
            <ul className="ai-transformation-hero__points">
              {heroPoints.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}
            </ul>
            <div className="ai-transformation-hero__actions">
              <a className="btn btn--primary" href="#wycena-ai">
                {t('ai_transformation.hero.cta_quote')} <ArrowRight aria-hidden="true" />
              </a>
              <a className="btn btn--outline" href="#proces-ai">{t('ai_transformation.hero.cta_process')}</a>
            </div>
          </div>

          <div className="ai-transformation-console" aria-label={t('ai_transformation.console.label')}>
            <div className="ai-transformation-console__bar">
              <span /><span /><span />
              <strong>{t('ai_transformation.console.label')}</strong>
            </div>
            <div className="ai-transformation-console__body">
              <div className="ai-transformation-console__store">
                <ShoppingCart aria-hidden="true" />
                <div>
                  <span>{t('ai_transformation.console.store')}</span>
                  <strong>{t('ai_transformation.console.status')}</strong>
                </div>
              </div>
              <div className="ai-transformation-console__flow" aria-hidden="true">
                <span>DATA</span><ArrowRight /><span className="is-active">AI</span><ArrowRight /><span>GROWTH</span>
              </div>
              <div className="ai-transformation-console__checks">
                <div><SearchCheck aria-hidden="true" /><span>{t('ai_transformation.console.audit')}</span><strong>01</strong></div>
                <div><Sparkles aria-hidden="true" /><span>{t('ai_transformation.console.implementation')}</span><strong>02</strong></div>
                <div><Headphones aria-hidden="true" /><span>{t('ai_transformation.console.support')}</span><strong>03</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-transformation-proof" aria-label={t('ai_transformation.proof.label')}>
        <div className="section__container ai-transformation-proof__grid">
          <div><SearchCheck aria-hidden="true" /><span>{t('ai_transformation.proof.audit')}</span></div>
          <div><ShieldCheck aria-hidden="true" /><span>{t('ai_transformation.proof.delivery')}</span></div>
          <div><Headphones aria-hidden="true" /><span>{t('ai_transformation.proof.support')}</span></div>
        </div>
      </section>

      <section className="section ai-transformation-opportunities">
        <div className="section__container">
          <div className="section__header">
            <span className="section__label">{t('ai_transformation.opportunities.label')}</span>
            <h2 className="section__title">{t('ai_transformation.opportunities.title')}</h2>
            <p className="section__description">{t('ai_transformation.opportunities.description')}</p>
          </div>
          <div className="ai-transformation-opportunities__grid">
            {opportunities.map((item, index) => {
              const Icon = opportunityIcons[index]
              return (
                <article key={item.title} className="ai-transformation-opportunity">
                  <div className="service-card__icon"><Icon aria-hidden="true" /></div>
                  <span className="ai-transformation-opportunity__number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section ai-transformation-process" id="proces-ai">
        <div className="section__container">
          <div className="ai-transformation-process__heading">
            <div>
              <span className="section__label">{t('ai_transformation.process.label')}</span>
              <h2 className="section__title">{t('ai_transformation.process.title')}</h2>
            </div>
            <p>{t('ai_transformation.process.description')}</p>
          </div>
          <div className="ai-transformation-process__steps">
            {process.map((step, index) => (
              <article key={step.title}>
                <span className="ai-transformation-process__number">0{index + 1}</span>
                <div className="ai-transformation-process__icon">
                  {index === 0 ? <SearchCheck aria-hidden="true" /> : index === 1 ? <Sparkles aria-hidden="true" /> : <Headphones aria-hidden="true" />}
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <strong><Check aria-hidden="true" />{step.result}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__container business-service-faq">
          <div className="section__header">
            <span className="section__label">FAQ</span>
            <h2 className="section__title">{t('ai_services.faq_title')}</h2>
          </div>
          <div className="business-service-faq__list">
            {faqs.slice(0, 4).map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="section ai-transformation-quote" id="wycena-ai">
        <div className="section__container ai-transformation-quote__grid">
          <div className="ai-transformation-quote__intro">
            <span className="section__label">{t('ai_transformation.pricing.label')}</span>
            <h2 className="section__title">{t('ai_transformation.pricing.title')}</h2>
            <p>{t('ai_transformation.pricing.description')}</p>
            <ul>
              {scopeItems.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
            </ul>
            <div className="ai-transformation-quote__promise">
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>{t('ai_transformation.pricing.promise_title')}</strong>
                <span>{t('ai_transformation.pricing.promise_text')}</span>
              </div>
            </div>
          </div>

          <form className="ai-quote-form" onSubmit={handleSubmit}>
            <div className="ai-quote-form__heading">
              <div className="service-card__icon"><Sparkles aria-hidden="true" /></div>
              <div>
                <span>{t('ai_transformation.quote.eyebrow')}</span>
                <h3>{t('ai_transformation.quote.title')}</h3>
              </div>
            </div>
            <div className="ai-quote-form__row">
              <label>{t('ai_transformation.quote.name')}<input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} /></label>
              <label>{t('ai_transformation.quote.email')}<input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} /></label>
            </div>
            <div className="ai-quote-form__row">
              <label>{t('ai_transformation.quote.company')}<input value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} /></label>
              <label>{t('ai_transformation.quote.website')}<input type="url" placeholder="https://" value={formData.website} onChange={(event) => setFormData({ ...formData, website: event.target.value })} /></label>
            </div>
            <div className="ai-quote-form__row">
              <div className="ai-quote-form__field">
                <span>{t('ai_transformation.quote.platform')}</span>
                <CustomSelect
                  ariaLabel={t('ai_transformation.quote.platform')}
                  value={formData.platform}
                  placeholder={t('ai_transformation.quote.choose')}
                  options={platformOptions.map((option) => ({ value: option, label: option }))}
                  onChange={(platform) => setFormData({ ...formData, platform })}
                  disabled={status === 'submitting'}
                  invalid={quoteAttempted && !formData.platform}
                />
              </div>
              <div className="ai-quote-form__field">
                <span>{t('ai_transformation.quote.scale')}</span>
                <CustomSelect
                  ariaLabel={t('ai_transformation.quote.scale')}
                  value={formData.scale}
                  placeholder={t('ai_transformation.quote.choose')}
                  options={scaleOptions.map((option) => ({ value: option, label: option }))}
                  onChange={(scale) => setFormData({ ...formData, scale })}
                  disabled={status === 'submitting'}
                  invalid={quoteAttempted && !formData.scale}
                />
              </div>
            </div>
            <div className="ai-quote-form__field">
              <span>{t('ai_transformation.quote.budget')}</span>
              <CustomSelect
                ariaLabel={t('ai_transformation.quote.budget')}
                value={formData.budget}
                placeholder={t('ai_transformation.quote.choose')}
                options={budgetOptions.map((option) => ({ value: option, label: option }))}
                onChange={(budget) => setFormData({ ...formData, budget })}
                disabled={status === 'submitting'}
                invalid={quoteAttempted && !formData.budget}
              />
            </div>
            <label>{t('ai_transformation.quote.message')}<textarea required rows={4} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder={t('ai_transformation.quote.message_placeholder')} /></label>
            <button type="submit" className="btn btn--primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? t('ai_transformation.quote.sending') : t('ai_transformation.quote.submit')} <ArrowRight aria-hidden="true" />
            </button>
            <p className="ai-quote-form__note">{t('ai_transformation.quote.note')}</p>
            {status === 'success' && <p className="ai-quote-form__status ai-quote-form__status--success" role="status">{t('ai_transformation.quote.success')}</p>}
            {status === 'error' && <p className="ai-quote-form__status ai-quote-form__status--error" role="alert">{t('ai_transformation.quote.error')}</p>}
          </form>
        </div>
      </section>
    </div>
  )
}
