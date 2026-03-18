import { useParams, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect } from 'react'

export function ServicePage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const ref = useScrollReveal()

  // Map slug to translation key
  const slugToKey: Record<string, string> = {
    'ai-agents': 'agents',
    'llm-semantic-search': 'llm',
    'process-automation': 'automation',
    'web-applications': 'web',
    'mobile-apps': 'mobile',
    'ai-infrastructure': 'infra'
  }

  const serviceKey = slugToKey[slug || '']
  
  const geminiIcons: Record<string, string> = {
    agents: '/v2/agent_node.png',
    llm: '/v2/semantic_brain.png',
    infra: '/v2/neural_core.png'
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!serviceKey) return <Navigate to="/" />

  const translatedFeatures = t(`services.items.${serviceKey}.features`, { returnObjects: true })
  const features = Array.isArray(translatedFeatures) ? translatedFeatures : []
  
  const translatedTech = t(`services.items.${serviceKey}.tech`, { returnObjects: true })
  const techStack = Array.isArray(translatedTech) ? translatedTech : []

  return (
    <div className="service-detail-page">
      <section className="hero" style={{ paddingTop: '10rem', paddingBottom: '4rem', minHeight: 'auto' }}>
        <div className="section__container" ref={ref}>
          <Link to="/services" className="blog-post__back" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
            ← {t('services.back')}
          </Link>

          <div className="hero__badge">
            <span className="hero__badge-dot" />
            {t('services.label')}
          </div>
          
          <h1 className="hero__title">
            {t(`services.items.${serviceKey}.title`)}
          </h1>
          
          <p className="hero__subtitle" style={{ maxWidth: '800px', margin: '1.5rem 0 3rem' }}>
            {t(`services.items.${serviceKey}.full_text`)}
          </p>

          <div className="hero__actions">
            <Link to="/contact" className="btn btn--primary">
              {t('hero.cta_talk')}
            </Link>
          </div>

          {geminiIcons[serviceKey] && (
            <div 
              className="hero__gemini-visual" 
              style={{ 
                backgroundImage: `url(${geminiIcons[serviceKey]})`, 
                opacity: 0.1, 
                filter: 'blur(40px)',
                width: '600px',
                height: '600px'
              }} 
            />
          )}
        </div>
      </section>

      <section className="section">
        <div className="section__container">
          <div className="bento-grid">
            <div className="bento-item bento-item--col-2">
              <h3 className="section__title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                {t('services.label')} & Features
              </h3>
              <ul className="service-detail__list">
                {features.map((f, i) => (
                  <li key={i} className="service-detail__list-item" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bento-item bento-item--col-2">
              <h3 className="section__title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                Tech Stack
              </h3>
              <div className="service-card__tags" style={{ justifyContent: 'flex-start', marginTop: '0', flexWrap: 'wrap' }}>
                {techStack.map((tech) => (
                  <span key={tech} className="service-card__tag" style={{ fontSize: '1rem', padding: '0.6rem 1.2rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(16, 185, 129, 0.03)', borderTop: '1px solid var(--color-border)' }}>
        <div className="section__container" style={{ textAlign: 'center' }}>
          <h2 className="section__title">Ready to Elevate Your Business?</h2>
          <p className="section__description" style={{ margin: '0 auto 3rem auto' }}>
            Our team is ready to implement {t(`services.items.${serviceKey}.title`)} tailored to your needs.
          </p>
          <Link to="/contact" className="btn btn--primary" style={{ padding: '1rem 3rem' }}>
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}
