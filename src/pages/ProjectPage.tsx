import { useParams, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect } from 'react'

export function ProjectPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const ref = useScrollReveal()

  const slugToKey: Record<string, string> = {
    'autonomous-ai-engineer': 'engineer',
    'ai-travel-agent': 'travel',
    'predictive-finance-analytics': 'finance',
    'ai-medical-imaging': 'medical'
  }

  const projectKey = slugToKey[slug || '']

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!projectKey) return <Navigate to="/" />

  const translatedFeatures = t(`portfolio.items.${projectKey}.features`, { returnObjects: true })
  const features = Array.isArray(translatedFeatures) ? translatedFeatures : []
  
  const translatedTech = t(`portfolio.items.${projectKey}.tech_detailed`, { returnObjects: true })
  const techStack = Array.isArray(translatedTech) ? translatedTech : []

  const projectImages: Record<string, string> = {
    engineer: '/images/ai-dev.png',
    travel: '/images/ai-travel.png',
    finance: '/images/ai-saas.png',
    medical: '/images/ai-medical.png'
  }

  return (
    <div className="project-detail-page">
      <section className="hero" style={{ paddingTop: '10rem', paddingBottom: '4rem', minHeight: 'auto' }}>
        <div className="section__container" ref={ref}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/portfolio" className="blog-post__back" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              ← {t('portfolio.label')}
            </Link>

            <div className="hero__badge" style={{ margin: 0 }}>
              <span className="hero__badge-dot" />
              {t('portfolio.label')} Case Study
            </div>
          </div>
          
          <h1 className="hero__title">
            {t(`portfolio.items.${projectKey}.title`)}
          </h1>
          
          <p className="hero__subtitle" style={{ maxWidth: '800px', margin: '1.5rem 0 3rem' }}>
            {t(`portfolio.items.${projectKey}.full_text`)}
          </p>

          <div className="hero__actions">
            <Link to="/contact" className="btn btn--primary">
              {t('hero.cta_talk')}
            </Link>
          </div>

          <div 
            className="hero__gemini-visual" 
            style={{ 
              backgroundImage: `url(${projectImages[projectKey]})`, 
              opacity: 0.1, 
              filter: 'blur(40px)',
              width: '600px',
              height: '600px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: -1
            }} 
          />
        </div>
      </section>

      <section className="section">
        <div className="section__container">
          <div className="bento-grid">
            <div className="bento-item bento-item--col-2" style={{ textAlign: 'left' }}>
              <h3 className="section__title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                Challenge & Solution
              </h3>
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>The Challenge</h4>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{t(`portfolio.items.${projectKey}.challenge`)}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Our Solution</h4>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{t(`portfolio.items.${projectKey}.solution`)}</p>
              </div>
            </div>

            <div className="bento-item bento-item--col-2" style={{ textAlign: 'left' }}>
              <h3 className="section__title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                Key Features
              </h3>
              <ul className="service-detail__list" style={{ listStyle: 'none', padding: 0 }}>
                {features.map((f: any, i: number) => (
                  <li key={i} className="service-detail__list-item" style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bento-item bento-item--col-2" style={{ textAlign: 'left' }}>
              <h3 className="section__title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                Tech Stack
              </h3>
              <div className="service-card__tags" style={{ justifyContent: 'flex-start', marginTop: '0', flexWrap: 'wrap', gap: '10px', display: 'flex' }}>
                {techStack.map((tech: any) => (
                  <span key={tech} className="service-card__tag" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '999px', color: 'var(--color-primary-light)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bento-item bento-item--col-2">
               <div className="portfolio-card__image" style={{ height: '100%', minHeight: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={projectImages[projectKey]} alt={t(`portfolio.items.${projectKey}.title`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(16, 185, 129, 0.03)', borderTop: '1px solid var(--color-border)' }}>
        <div className="section__container" style={{ textAlign: 'center' }}>
          <h2 className="section__title">Interested in similar results?</h2>
          <p className="section__description" style={{ margin: '0 auto 3rem auto' }}>
            Let's discuss how we can implement advanced AI solutions tailored to your business profile.
          </p>
          <Link to="/contact" className="btn btn--primary" style={{ padding: '1rem 3rem' }}>
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  )
}
