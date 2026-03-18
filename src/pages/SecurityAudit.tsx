import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

export function SecurityAudit() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  const SECTIONS = [
    { icon: '🛡️', key: 'pentests' },
    { icon: '💻', key: 'code' },
    { icon: '☁️', key: 'cloud' },
    { icon: '🤖', key: 'ai' },
  ]

  return (
    <div className="security-page">
      <section className="hero" style={{ paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="section__container" ref={ref}>
          <Link to="/services" className="blog-post__back" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
            ← {t('services.back')}
          </Link>
          <div className="hero__badge">
            <span className="hero__badge-dot" style={{ backgroundColor: '#ef4444' }} />
            {t('security_audit.label')}
          </div>
          
          <h1 className="hero__title" data-text={`${t('security_audit.title_start')} ${t('security_audit.gradient')}`}>
            {t('security_audit.title_start')}
            <span className="hero__title-gradient">{t('security_audit.gradient')}</span>
          </h1>
          
          <p className="hero__subtitle">
            {t('security_audit.description')}
          </p>

          <div className="hero__actions">
            <Link to="/contact" className="btn btn--primary">
              {t('security_audit.cta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(255,0,0,0.02)' }}>
        <div className="section__container">
          <div className="bento-grid">
            {SECTIONS.map((s) => (
              <div key={s.key} className="bento-item bento-item--col-2" style={{ borderLeft: '4px solid #ef4444' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{s.icon}</div>
                <h3 className="section__title" style={{ fontSize: '1.5rem', textAlign: 'left' }}>
                  {t(`security_audit.sections.${s.key}.title`)}
                </h3>
                <p className="hero__stat-nam" style={{ textAlign: 'left', opacity: 1 }}>
                  {t(`security_audit.sections.${s.key}.desc`)}
                </p>
                <div className="scanning-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__container">
          <div className="about__modern" style={{ gridTemplateColumns: '1fr' }}>
            <div className="bento-item bento-item--col-4" style={{ textAlign: 'center', background: 'var(--color-bg-alt)' }}>
              <h2 className="section__title">Nasz Proces Audytowy</h2>
              <div className="security-process">
                <div className="process-step">
                  <div className="step-num">01</div>
                  <h4>Reconnaissance</h4>
                  <p>Gathering all public information about the infrastructure.</p>
                </div>
                <div className="process-step">
                  <div className="step-num">02</div>
                  <h4>Vulnerability Scan</h4>
                  <p>Automated deep scanning of all entry points.</p>
                </div>
                <div className="process-step">
                  <div className="step-num">03</div>
                  <h4>Manual Analysis</h4>
                  <p>Experts trying to break the system manually.</p>
                </div>
                <div className="process-step">
                  <div className="step-num">04</div>
                  <h4>Final Report</h4>
                  <p>Detailed documentation and remediation plan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
