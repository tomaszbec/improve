import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, BrainCircuit, Check, Code2, Database, Globe2, Heart, MapPin, Rocket, Users } from 'lucide-react'
import { usePageSeo, siteUrl } from '../lib/seo'
import { publishingApiUrl } from '../lib/publishingApi'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { CustomSelect } from '../components/CustomSelect'

const roles = [
  { key: 'ai', icon: BrainCircuit, tags: ['Python', 'LLM', 'RAG', 'MCP'] },
  { key: 'fullstack', icon: Code2, tags: ['React', 'TypeScript', 'Go', 'PostgreSQL'] },
  { key: 'data', icon: Database, tags: ['Python', 'SQL', 'Analytics', 'AWS'] },
] as const

const values = [
  { key: 'impact', icon: Rocket },
  { key: 'ai', icon: BrainCircuit },
  { key: 'team', icon: Users },
  { key: 'global', icon: Globe2 },
] as const

export function Carriers() {
  const { t, i18n } = useTranslation()
  const formRef = useRef<HTMLElement>(null)
  const [selectedRole, setSelectedRole] = useState('open')
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', profile: '', message: '' })
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: t('carriers.seo_title'),
        description: t('carriers.seo_description'),
        url: `${siteUrl}/carriers`,
        inLanguage: i18n.language === 'pl' ? 'pl-PL' : 'en-US',
        isPartOf: { '@type': 'WebSite', name: 'improveIT.pl', url: siteUrl },
        about: { '@type': 'Organization', name: 'improveIT.pl', url: siteUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('blog.home'), item: siteUrl },
          { '@type': 'ListItem', position: 2, name: t('nav.carriers'), item: `${siteUrl}/carriers` },
        ],
      },
    ],
  }
  usePageSeo({ title: t('carriers.seo_title'), description: t('carriers.seo_description'), path: '/carriers', image: '/images/carriers-hero.png', schema })

  const openApplication = (role: string) => {
    setSelectedRole(role)
    setFormStatus('idle')
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  const submitApplication = async (event: FormEvent) => {
    event.preventDefault()
    setFormStatus('submitting')
    try {
      const roleLabel = selectedRole === 'open' ? t('carriers.spontaneous') : t(`carriers.roles.${selectedRole}.title`)
      const response = await fetch(`${publishingApiUrl}/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.profile,
          subject: `career:${selectedRole}`,
          message: `${t('carriers.form.role')}: ${roleLabel}\n\n${formData.message}`,
        }),
      })
      const result = await response.json()
      if (!response.ok || result.status !== 'success') throw new Error('Application failed')
      setFormStatus('success')
      setFormData({ name: '', email: '', profile: '', message: '' })
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <div className="carriers-page">
      <section className="carriers-hero">
        <img className="carriers-hero__image" src="/images/carriers-hero.png" alt="" />
        <div className="carriers-hero__shade" />
        <div className="section__container carriers-hero__content">
          <Breadcrumbs className="carriers-breadcrumbs" label={t('blog.breadcrumbs')} items={[{ label: t('blog.home'), to: '/' }, { label: t('nav.carriers') }]} />
          <span className="section__label">{t('carriers.eyebrow')}</span>
          <h1>{t('carriers.title_start')} <span>{t('carriers.title_accent')}</span></h1>
          <p>{t('carriers.intro')}</p>
          <div className="carriers-actions">
            <a className="btn btn--primary" href="#open-roles">{t('carriers.view_roles')} <ArrowRight /></a>
            <Link className="btn btn--outline" to="/about">{t('carriers.about_us')}</Link>
          </div>
        </div>
      </section>

      <section className="carriers-section" id="open-roles">
        <div className="section__container">
          <div className="carriers-section__heading">
            <div><span className="section__label">{t('carriers.roles_label')}</span><h2>{t('carriers.roles_title')}</h2><p>{t('carriers.roles_intro')}</p></div>
            <button type="button" onClick={() => openApplication('open')} className="btn btn--outline">{t('carriers.spontaneous')}</button>
          </div>
          <div className="carriers-roles">
            {roles.map(({ key, icon: Icon, tags }) => (
              <article className="carriers-role" key={key}>
                <div className="carriers-role__icon"><Icon /></div>
                <div className="carriers-role__copy">
                  <div className="carriers-role__title"><h3>{t(`carriers.roles.${key}.title`)}</h3><span>{t('carriers.new')}</span></div>
                  <div className="carriers-role__location"><MapPin /> {t('carriers.location')}</div>
                  <p>{t(`carriers.roles.${key}.description`)}</p>
                </div>
                <div className="carriers-role__side"><div className="carriers-role__tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button type="button" onClick={() => openApplication(key)}>{t('carriers.details')} <ArrowRight /></button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="carriers-section carriers-section--muted">
        <div className="section__container">
          <div className="carriers-section__heading carriers-section__heading--compact"><div><h2>{t('carriers.values_heading_start')} <span>/ {t('carriers.values_heading_accent')}</span></h2></div></div>
          <div className="carriers-values">
            {values.map(({ key, icon: Icon }) => <article key={key}><Icon /><div><h3>{t(`carriers.values.${key}.title`)}</h3><p>{t(`carriers.values.${key}.description`)}</p></div></article>)}
          </div>
          <div className="carriers-profile">
            <div><Heart /><div><h2>{t('carriers.profile_title')}</h2><p>{t('carriers.profile_intro')}</p></div></div>
            <ul>{(['passion', 'growth', 'ownership', 'collaboration'] as const).map((key) => <li key={key}><Check /> {t(`carriers.profile.${key}`)}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="carriers-contact" ref={formRef} id="application-form">
        <div className="section__container carriers-application">
          <div className="carriers-application__intro"><span className="section__label">{t('carriers.contact_label')}</span><h2>{t('carriers.contact_title')}</h2><p>{t('carriers.contact_text')}</p></div>
          <form className="carriers-application__form" onSubmit={submitApplication}>
            <div className="carriers-application__field">
              <span>{t('carriers.form.role')}</span>
              <CustomSelect
                ariaLabel={t('carriers.form.role')}
                value={selectedRole}
                placeholder={t('carriers.spontaneous')}
                options={[
                  { value: 'open', label: t('carriers.spontaneous') },
                  ...roles.map(({ key }) => ({ value: key, label: t(`carriers.roles.${key}.title`) })),
                ]}
                onChange={setSelectedRole}
                disabled={formStatus === 'submitting'}
              />
            </div>
            <div className="carriers-application__row">
              <label><span>{t('carriers.form.name')}</span><input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} disabled={formStatus === 'submitting'} /></label>
              <label><span>{t('carriers.form.email')}</span><input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} disabled={formStatus === 'submitting'} /></label>
            </div>
            <label><span>{t('carriers.form.profile')}</span><input type="url" placeholder="https://" value={formData.profile} onChange={(event) => setFormData({ ...formData, profile: event.target.value })} disabled={formStatus === 'submitting'} /></label>
            <label><span>{t('carriers.form.message')}</span><textarea rows={5} required value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} disabled={formStatus === 'submitting'} /></label>
            <button className="btn btn--primary" type="submit" disabled={formStatus === 'submitting'}>{formStatus === 'submitting' ? t('carriers.form.sending') : t('carriers.form.submit')} <ArrowRight /></button>
            {formStatus === 'success' && <p className="carriers-application__status carriers-application__status--success" role="status">{t('carriers.form.success')}</p>}
            {formStatus === 'error' && <p className="carriers-application__status carriers-application__status--error" role="alert">{t('carriers.form.error')}</p>}
          </form>
        </div>
      </section>
    </div>
  )
}
