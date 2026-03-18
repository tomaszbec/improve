import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Contact() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  return (
    <section className="section" id="kontakt" aria-labelledby="contact-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">{t('contact.label')}</span>
          <h2 id="contact-title" className="section__title">
            {t('contact.title')}
          </h2>
          <p className="section__description">
            {t('contact.description')}
          </p>
        </div>

        <div className="contact__grid">
          <div className="contact__info">
            <h3>improve<span>IT</span>.pl</h3>
            <p>
              {t('contact.info_text')}
            </p>

            <address className="contact__details">
              <div className="contact__detail">
                <div className="contact__detail-icon">🏢</div>
                <span>NIP: 7343126810</span>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">📞</div>
                <a href="tel:+48886555201">+48 886 555 201</a>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">✉️</div>
                <a href="mailto:contact@improveit.pl">contact@improveit.pl</a>
              </div>
            </address>
          </div>

          <form
            className="contact__form"
            onSubmit={(e) => e.preventDefault()}
            aria-label={t('contact.label')}
          >
            <div className="contact__row">
              <input
                type="text"
                className="contact__input"
                placeholder={t('contact.form.name')}
                aria-label={t('contact.form.name')}
                required
              />
              <input
                type="email"
                className="contact__input"
                placeholder={t('contact.form.email')}
                aria-label={t('contact.form.email')}
                required
              />
            </div>
            <input
              type="text"
              className="contact__input"
              placeholder={t('contact.form.company')}
              aria-label={t('contact.form.company')}
            />
            <select
              className="contact__input"
              aria-label={t('contact.form.subject')}
              defaultValue=""
            >
              <option value="" disabled>{t('contact.form.subject')}</option>
              <option value="web">{t('contact.form.s1')}</option>
              <option value="mobile">{t('contact.form.s2')}</option>
              <option value="ai">{t('contact.form.s3')}</option>
              <option value="team">{t('contact.form.s4')}</option>
              <option value="consulting">{t('contact.form.s5')}</option>
              <option value="other">{t('contact.form.s6')}</option>
            </select>
            <textarea
              className="contact__textarea"
              placeholder={t('contact.form.message')}
              aria-label={t('contact.form.message')}
              rows={5}
            />
            <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
              {t('contact.form.submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
