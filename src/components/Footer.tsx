import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <p className="footer__copy">
          &copy; {year} improveIT.pl. {t('footer.rights')}
        </p>
        <nav className="footer__links" aria-label="Social media links">
          <Link to="/contact" className="footer__link">
            {t('nav.contact')}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
