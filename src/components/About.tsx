import { useTranslation, Trans } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function About() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  return (
    <section className="section" id="o-nas" aria-labelledby="about-title">
      <div className="section__container" ref={ref}>
        <div className="about__new-grid">
          <div className="about__content">
            <span className="section__label">{t('about.label')}</span>
            <h2 id="about-title" className="section__title">
              <Trans
                i18nKey="about.title"
                values={{ gradient: t('about.gradient') }}
                components={{ span: <span className="hero__title-gradient" /> }}
              >
                Partner, który <span className="hero__title-gradient">napędza wzrost</span>
              </Trans>
            </h2>
            <p className="section__description" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>
              {t('about.description')}
            </p>
            
            <div className="about__features-modern">
              <div className="about__modern-item">
                <span className="about__modern-num">01</span>
                <div>
                  <h4>{t('about.features.f1_title')}</h4>
                  <p>{t('about.features.f1_desc')}</p>
                </div>
              </div>
              <div className="about__modern-item">
                <span className="about__modern-num">02</span>
                <div>
                  <h4>{t('about.features.f2_title')}</h4>
                  <p>{t('about.features.f2_desc')}</p>
                </div>
              </div>
              <div className="about__modern-item">
                <span className="about__modern-num">03</span>
                <div>
                  <h4>{t('about.features.f3_title')}</h4>
                  <p>{t('about.features.f3_desc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about__bento-visual">
            <div className="about__bento-top">
              <div className="about__bento-card">
                <div className="about__bento-val">10+</div>
                <div className="about__bento-lab">{t('about.stats.years')}</div>
              </div>
              <div className="about__bento-card about__bento-card--accent">
                <div className="about__bento-val">75</div>
                <div className="about__bento-lab">{t('about.stats.countries')}</div>
              </div>
            </div>
            <div className="about__bento-bottom">
              <div className="about__bento-card about__bento-card--wide">
                <div className="about__bento-val">80+</div>
                <div className="about__bento-lab">{t('about.stats.clients')}</div>
                <div className="about__bento-glow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
