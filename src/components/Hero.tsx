import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Hero() {
  const { t } = useTranslation()
  const ref = useRef(null)

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="section__container" ref={ref}>
        <div className="hero__grid">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              {t('hero.badge')}
            </div>

            <h1 
              id="hero-title" 
              className="hero__title"
              data-text={`${t('hero.title_start')} ${t('hero.title_gradient')}`}
            >
              {t('hero.title_start')}{' '}
              <span className="hero__title-gradient">{t('hero.title_gradient')}</span>
            </h1>

            <p className="hero__subtitle">
              {t('hero.subtitle')}
            </p>

            <div className="hero__actions">
              <Link to="/contact" className="btn btn--primary">
                {t('hero.cta_talk')}
              </Link>
              <Link to="/portfolio" className="btn btn--outline">
                {t('hero.cta_portfolio')}
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__gemini-visual" style={{ backgroundImage: 'url(/v2/neural_core.png)' }} />
            <div className="hero__visual-card">
              <div className="hero__visual-header">
                <div className="hero__visual-dot" />
                <div className="hero__visual-dot" />
                <div className="hero__visual-dot" />
                <span>ai_agent_v1.log</span>
              </div>
              <div className="hero__visual-body">
                <div className="hero__code-line"><span>&gt;</span> Initializing neural core...</div>
                <div className="hero__code-line"><span>&gt;</span> Connecting to vector database...</div>
                <div className="hero__code-line"><span>&gt;</span> Analyzing business patterns...</div>
                <div className="hero__code-line hero__code-line--success"><span>&gt;</span> Efficiency optimized: +42%</div>
                <div className="hero__code-line"><span>&gt;</span> Awaiting next objective...</div>
              </div>
            </div>
            
            <div className="hero__floating-stats">
              <div className="hero__mini-stat">
                <div className="hero__stat-icon">📈</div>
                <div>
                  <div className="hero__stat-val">80+</div>
                  <div className="hero__stat-nam">{t('hero.stat_clients')}</div>
                </div>
              </div>
              <div className="hero__mini-stat">
                <div className="hero__stat-icon">🌍</div>
                <div>
                  <div className="hero__stat-val">75</div>
                  <div className="hero__stat-nam">{t('hero.stat_countries')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
