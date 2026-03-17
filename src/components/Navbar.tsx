import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV_LINKS = [
    { href: '/#uslugi', label: t('nav.services'), width: '110px' },
    { href: '/#o-nas', label: t('nav.about'), width: '110px' },
    { href: '/#technologie', label: t('nav.tech'), width: '140px' },
    { href: '/#portfolio', label: t('nav.portfolio'), width: '120px' },
    { href: '/blog', label: t('nav.blog'), width: '80px', isRouter: true },
  ]

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pl' ? 'en' : 'pl')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar-wrapper ${scrolled ? 'navbar-wrapper--scrolled' : ''}`}>
      <nav className="navbar" aria-label="Nawigacja główna">
        <Link 
          to="/" 
          className="navbar__logo" 
          aria-label="ImproveIT Solutions"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Improve<span>IT</span>
        </Link>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {link.isRouter ? (
                <Link to={link.href} className="navbar__link" style={{ width: link.width }}>{link.label}</Link>
              ) : (
                <a href={link.href} className="navbar__link" style={{ width: link.width }}>{link.label}</a>
              )}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={toggleLanguage} 
            className="navbar__link" 
            style={{ marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: '800' }}
          >
            {i18n.language.toUpperCase().split('-')[0]}
          </button>
          <a href="/#kontakt" className="navbar__cta">{t('nav.contact')}</a>
          <button
            className="navbar__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Otwórz menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}>
        {NAV_LINKS.map((link) => (
          link.isRouter ? (
            <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>
          ) : (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}</a>
          )
        ))}
        <a href="/#kontakt" className="btn btn--primary" onClick={() => setMobileOpen(false)}>
          {t('nav.contact')}
        </a>
      </div>
    </header>
  )
}
