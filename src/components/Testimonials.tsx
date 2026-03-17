import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Testimonials() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  const TESTIMONIALS = [
    {
      quote: t('testimonials.items.t1.quote'),
      name: 'Clement P.',
      role: t('testimonials.items.t1.role'),
      initials: 'CP',
    },
    {
      quote: t('testimonials.items.t2.quote'),
      name: 'Alok A.',
      role: t('testimonials.items.t2.role'),
      initials: 'AA',
    },
    {
      quote: t('testimonials.items.t3.quote'),
      name: 'Aleksander G.',
      role: t('testimonials.items.t3.role'),
      initials: 'AG',
    },
  ]

  return (
    <section className="section" id="opinie" aria-labelledby="testimonials-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">{t('testimonials.label')}</span>
          <h2 id="testimonials-title" className="section__title">
            {t('testimonials.title')}
          </h2>
          <p className="section__description">
            {t('testimonials.description')}
          </p>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <article key={i} className="testimonial-card">
              <div className="testimonial-card__stars">★★★★★</div>
              <blockquote className="testimonial-card__quote">
                „{t.quote}"
              </blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
