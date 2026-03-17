import { useScrollReveal } from '../hooks/useScrollReveal'

export function Contact() {
  const ref = useScrollReveal()

  return (
    <section className="section" id="kontakt" aria-labelledby="contact-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">Kontakt</span>
          <h2 id="contact-title" className="section__title">
            Porozmawiajmy o Twoim projekcie
          </h2>
          <p className="section__description">
            Opisz swoje potrzeby — odpowiemy w ciągu 24 godzin z propozycją
            współpracy dopasowaną do Twojego budżetu i celów.
          </p>
        </div>

        <div className="contact__grid">
          <div className="contact__info">
            <h3>ImproveIT Solutions Sp. z o.o.</h3>
            <p>
              Jesteśmy gotowi pomóc Ci zbudować produkt cyfrowy, rozszerzyć
              zespół inżynierów lub zoptymalizować istniejące rozwiązania.
            </p>

            <address className="contact__details">
              <div className="contact__detail">
                <div className="contact__detail-icon">📍</div>
                <span>ul. Adama Branickiego 21/U3, 02-972 Warszawa</span>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">✉️</div>
                <a href="mailto:hello@improveit.pl">hello@improveit.pl</a>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">🔗</div>
                <a href="https://www.linkedin.com/company/improveit-solutions" target="_blank" rel="noopener noreferrer">
                  LinkedIn — ImproveIT Solutions
                </a>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">⭐</div>
                <a href="https://clutch.co/profile/improveit-solutions" target="_blank" rel="noopener noreferrer">
                  Clutch.co — 5.0 / 26 opinii
                </a>
              </div>
            </address>
          </div>

          <form
            className="contact__form"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Formularz kontaktowy"
          >
            <div className="contact__row">
              <input
                type="text"
                className="contact__input"
                placeholder="Imię i nazwisko"
                aria-label="Imię i nazwisko"
                required
              />
              <input
                type="email"
                className="contact__input"
                placeholder="Email"
                aria-label="Adres email"
                required
              />
            </div>
            <input
              type="text"
              className="contact__input"
              placeholder="Firma"
              aria-label="Nazwa firmy"
            />
            <select
              className="contact__input"
              aria-label="Temat zapytania"
              defaultValue=""
            >
              <option value="" disabled>Wybierz temat...</option>
              <option value="web">Aplikacja Web / SaaS</option>
              <option value="mobile">Aplikacja Mobile</option>
              <option value="ai">Rozwiązania AI / ML</option>
              <option value="team">Dedykowany zespół</option>
              <option value="consulting">Consulting IT</option>
              <option value="other">Inne</option>
            </select>
            <textarea
              className="contact__textarea"
              placeholder="Opisz swój projekt lub potrzeby..."
              aria-label="Opis projektu"
              rows={5}
            />
            <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
              Wyślij zapytanie →
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
