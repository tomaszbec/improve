import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV_LINKS = [
    { href: '/services', label: t('nav.services'), width: '110px' },
    { href: '/about', label: t('nav.about'), width: '110px' },
    { href: '/technologies', label: t('nav.tech'), width: '140px' },
    { href: '/portfolio', label: t('nav.portfolio'), width: '120px' },
    { href: '/blog', label: t('nav.blog'), width: '80px' },
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
      <nav className="navbar" aria-label="Main Navigation">
        <Link 
          to="/" 
          className="navbar__logo" 
          aria-label="improveIT.pl"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          improve<span>IT</span>.pl
        </Link>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link 
                  to={link.href} 
                  className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`} 
                  style={{ width: link.width }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={toggleLanguage} 
            className="navbar__link" 
            style={{ marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: '800' }}
          >
            {i18n.language.toUpperCase().split('-')[0]}
          </button>
          <Link to="/contact" className="navbar__cta">{t('nav.contact')}</Link>
          <button
            className="navbar__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
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
          <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>
        ))}
        <Link to="/contact" className="btn btn--primary" onClick={() => setMobileOpen(false)}>
          {t('nav.contact')}
        </Link>
      </div>
    </header>
  )
}
