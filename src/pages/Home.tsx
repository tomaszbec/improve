import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Services } from '../components/Services'
import { About } from '../components/About'
import { Technologies } from '../components/Technologies'
import { Portfolio } from '../components/Portfolio'
import { Testimonials } from '../components/Testimonials'
import { Contact } from '../components/Contact'
import { useTranslation } from 'react-i18next'
import { localizedSiteUrl, siteUrl, usePageSeo } from '../lib/seo'
import { useMemo } from 'react'

export function Home() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  const isPolish = i18n.resolvedLanguage?.startsWith('pl') ?? true
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'improveIT.pl',
        alternateName: 'improve IT',
        url: siteUrl,
        logo: `${siteUrl}/favicon.svg`,
        description: t('home_seo.description'),
        email: 'contact@improveit.pl',
        telephone: '+48886555201',
        areaServed: ['PL', 'Europe', 'Worldwide'],
        knowsAbout: ['Software development', 'Artificial intelligence', 'Web applications', 'Mobile applications', 'Cloud infrastructure', 'Software modernization', 'Application support', 'Technology audits'],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'improveIT.pl',
        url: localizedSiteUrl('/'),
        inLanguage: isPolish ? 'pl-PL' : 'en-US',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  }), [isPolish, t])

  usePageSeo({ title: t('home_seo.title'), description: t('home_seo.description'), path: '/', schema })

  useEffect(() => {
    // Handle HTML5 routing scroll
    const sectionId = pathname.substring(1)
    if (sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [pathname])

  return (
    <main>
      <Hero />
      <div id="services"><Services /></div>
      <div id="about"><About /></div>
      <div id="technologies"><Technologies /></div>
      <div id="portfolio"><Portfolio /></div>
      <Testimonials />
      <div id="contact"><Contact /></div>
    </main>
  )
}
