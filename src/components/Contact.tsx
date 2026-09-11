import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Building2, Check, Mail, Phone } from 'lucide-react'
import { publishingApiUrl } from '../lib/publishingApi'

export function Contact() {
  const { t } = useTranslation()
  const ref = useScrollReveal()
  const subjectListId = useId()
  const subjectSelectRef = useRef<HTMLDivElement>(null)
  const [isSubjectOpen, setIsSubjectOpen] = useState(false)
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0)
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })

  const subjectOptions = [
    { value: 'web', label: t('contact.form.s1') },
    { value: 'mobile', label: t('contact.form.s2') },
    { value: 'ai', label: t('contact.form.s3') },
    { value: 'team', label: t('contact.form.s4') },
    { value: 'consulting', label: t('contact.form.s5') },
    { value: 'other', label: t('contact.form.s6') },
  ]

  const selectedSubject = subjectOptions.find(({ value }) => value === formData.subject)

  useEffect(() => {
    const closeSubjectSelect = (event: MouseEvent) => {
      if (!subjectSelectRef.current?.contains(event.target as Node)) {
        setIsSubjectOpen(false)
      }
    }

    document.addEventListener('mousedown', closeSubjectSelect)
    return () => document.removeEventListener('mousedown', closeSubjectSelect)
  }, [])

  const chooseSubject = (index: number) => {
    setFormData((current) => ({ ...current, subject: subjectOptions[index].value }))
    setActiveSubjectIndex(index)
    setIsSubjectOpen(false)
  }

  const handleSubjectKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setIsSubjectOpen(false)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveSubjectIndex((current) =>
        (current + direction + subjectOptions.length) % subjectOptions.length
      )
      setIsSubjectOpen(true)
      return
    }

    if ((event.key === 'Enter' || event.key === ' ') && isSubjectOpen) {
      event.preventDefault()
      chooseSubject(activeSubjectIndex)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.subject) {
      setIsSubjectOpen(true)
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch(`${publishingApiUrl}/v1/contact`, {
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
                <div className="contact__detail-icon" aria-hidden="true"><Building2 /></div>
                <span>NIP: 7343126810</span>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon" aria-hidden="true"><Phone /></div>
                <a href="tel:+48886555201">+48 886 555 201</a>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon" aria-hidden="true"><Mail /></div>
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
            <div className="contact__select" ref={subjectSelectRef}>
              <button
                type="button"
                className={`contact__select-trigger ${isSubjectOpen ? 'contact__select-trigger--open' : ''}`}
                aria-label={t('contact.form.subject')}
                aria-haspopup="listbox"
                aria-expanded={isSubjectOpen}
                aria-controls={subjectListId}
                onClick={() => setIsSubjectOpen((open) => !open)}
                onKeyDown={handleSubjectKeyDown}
                disabled={status === 'submitting'}
              >
                <span className={selectedSubject ? '' : 'contact__select-placeholder'}>
                  {selectedSubject?.label ?? t('contact.form.subject')}
                </span>
                <span className="contact__select-chevron" aria-hidden="true" />
              </button>

              {isSubjectOpen && (
                <div className="contact__select-menu" id={subjectListId} role="listbox">
                  {subjectOptions.map((option, index) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={formData.subject === option.value}
                      className={`contact__select-option ${activeSubjectIndex === index ? 'contact__select-option--active' : ''}`}
                      key={option.value}
                      onMouseEnter={() => setActiveSubjectIndex(index)}
                      onClick={() => chooseSubject(index)}
                    >
                      {option.label}
                      {formData.subject === option.value && (
                        <Check className="contact__select-check" size={18} aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
