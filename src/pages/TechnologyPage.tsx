import { useParams, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect } from 'react'

export function TechnologyPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const ref = useScrollReveal()

  // Map slug to translation key
  const slugToKey: Record<string, string> = {
    'go-development': 'go',
    'python-development': 'python',
    'node-development': 'node',
    'php-development': 'php',
    'react-development': 'react',
    'vue-development': 'vue',
    'angular-development': 'angular',
    'next-js-development': 'next',
    'typescript-development': 'typescript',
    'dotnet-development': 'dotnet',
    'java-development': 'java',
    'flutter-development': 'flutter',
    'react-native-development': 'reactnative',
    'swift-development': 'swift',
    'kotlin-development': 'kotlin',
    'postgresql-development': 'postgres',
    'mongodb-development': 'mongo',
    'redis-development': 'redis',
    'docker-development': 'docker',
    'kubernetes-development': 'k8s',
    'aws-development': 'aws',
    'azure-development': 'azure',
    'graphql-development': 'graphql',
    'tensorflow-development': 'tensorflow',
    'figma-development': 'figma'
  }

  const techKey = slugToKey[slug || '']

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!techKey) return <Navigate to="/" />

  const translatedFeatures = t(`tech.items.${techKey}.features`, { returnObjects: true })
  const features = Array.isArray(translatedFeatures) ? translatedFeatures : []
  
  const translatedTech = t(`tech.items.${techKey}.tech`, { returnObjects: true })
  const techStack = Array.isArray(translatedTech) ? translatedTech : []

  return (
    <div className="service-detail-page">
      <section className="hero" style={{ paddingTop: '10rem', paddingBottom: '4rem', minHeight: 'auto' }}>
        <div className="section__container" ref={ref}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/technologies" className="blog-post__back" style={{ display: 'inline-flex' }}>
              ← {t('services.back')}
            </Link>

            <div className="hero__badge" style={{ margin: 0 }}>
              <span className="hero__badge-dot" />
              {t('tech.label')}
            </div>
          </div>
          
          <h1 className="hero__title">
            {t(`tech.items.${techKey}.title`)}
          </h1>
          
          <p className="hero__subtitle" style={{ maxWidth: '800px', margin: '1.5rem 0 3rem' }}>
            {t(`tech.items.${techKey}.full_text`)}
          </p>

          <div className="hero__actions">
            <Link to="/contact" className="btn btn--primary">
              {t('hero.cta_talk')}
            </Link>
          </div>
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
                  <li key={i} className="service-detail__list-item" style={{ marginBottom: '1rem' }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bento-item bento-item--col-2">
              <h3 className="section__title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                Toolbox & Frameworks
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
          <h2 className="section__title">Ready to build something great?</h2>
          <p className="section__description" style={{ margin: '0 auto 3rem auto' }}>
            Our {t(`tech.items.${techKey}.title`)} experts are ready to turn your vision into reality.
          </p>
          <Link to="/contact" className="btn btn--primary" style={{ padding: '1rem 3rem' }}>
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}
