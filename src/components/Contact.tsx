import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Contact() {
  const { t } = useTranslation()
  const ref = useScrollReveal()
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/contact_process.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        setStatus('success')
        setFormData({ name: '', email: '', company: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus('error')
    }
  }

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
            onSubmit={handleSubmit}
            aria-label={t('contact.label')}
          >
            <div className="contact__row">
              <input
                type="text"
                className="contact__input"
                placeholder={t('contact.form.name')}
                aria-label={t('contact.form.name')}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={status === 'submitting'}
              />
              <input
                type="email"
                className="contact__input"
                placeholder={t('contact.form.email')}
                aria-label={t('contact.form.email')}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={status === 'submitting'}
              />
            </div>
            <input
              type="text"
              className="contact__input"
              placeholder={t('contact.form.company')}
              aria-label={t('contact.form.company')}
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              disabled={status === 'submitting'}
            />
            <select
              className="contact__input"
              aria-label={t('contact.form.subject')}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              disabled={status === 'submitting'}
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
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              disabled={status === 'submitting'}
            />
            <button 
              type="submit" 
              className={`btn btn--primary ${status === 'submitting' ? 'btn--loading' : ''}`}
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? t('contact.form.sending') : t('contact.form.submit')}
            </button>

            {status === 'success' && (
              <p className="contact__status contact__status--success">
                {t('contact.form.success')}
              </p>
            )}
            {status === 'error' && (
              <p className="contact__status contact__status--error">
                {t('contact.form.error')}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
