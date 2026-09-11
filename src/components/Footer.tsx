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
        <nav className="footer__links" aria-label={t('footer.services_label')}>
          <Link to="/services/custom-software-development" className="footer__link">
            {t('services.items.software.title')}
          </Link>
          <Link to="/services/ai-transformation" className="footer__link">
            {t('services.items.aiTransformation.title')}
          </Link>
          <Link to="/services/application-support" className="footer__link">
            {t('services.items.support.title')}
          </Link>
          <Link to="/carriers" className="footer__link">
            {t('nav.carriers')}
          </Link>
          <Link to="/contact" className="footer__link">
            {t('nav.contact')}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
