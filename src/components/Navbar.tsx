import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '#uslugi', label: 'Usługi' },
  { href: '#o-nas', label: 'O nas' },
  { href: '#technologie', label: 'Technologie' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#opinie', label: 'Opinie' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar-wrapper ${scrolled ? 'navbar-wrapper--scrolled' : ''}`}>
      <nav className="navbar" aria-label="Nawigacja główna">
        <a href="#" className="navbar__logo" aria-label="ImproveIT Solutions - strona główna">
          Improve<span>IT</span>
        </a>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="navbar__link">{link.label}</a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="#kontakt" className="navbar__cta">Kontakt</a>
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
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a href="#kontakt" className="btn btn--primary" onClick={() => setMobileOpen(false)}>
          Kontakt
        </a>
      </div>
    </header>
  )
}
