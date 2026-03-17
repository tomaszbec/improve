import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <p className="footer__copy">
          &copy; {year} ImproveIT Solutions. Warszawa, Polska. {t('footer.rights')}
        </p>
        <nav className="footer__links" aria-label="Social media links">
          <a
            href="https://www.linkedin.com/company/improveit-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            LinkedIn
          </a>
          <a
            href="https://clutch.co/profile/improveit-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Clutch
          </a>
          <a href="#kontakt" className="footer__link">
            {t('nav.contact')}
          </a>
        </nav>
      </div>
    </footer>
  )
}
