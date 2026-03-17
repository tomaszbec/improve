export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <p className="footer__copy">
          &copy; {year} ImproveIT Solutions Sp. z o.o. Warszawa, Polska. Wszelkie prawa zastrzeżone.
        </p>
        <nav className="footer__links" aria-label="Linki w stopce">
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
            Kontakt
          </a>
        </nav>
      </div>
    </footer>
  )
}
