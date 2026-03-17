import { useScrollReveal } from '../hooks/useScrollReveal'

const TESTIMONIALS = [
  {
    quote: 'Współpracuję z ImproveIT od ponad 3 lat. Zespół jest wysoce zmotywowany, zaangażowany i profesjonalny. Gorąco polecam!',
    name: 'Clement P.',
    role: 'Director, Aplikacja mobilna (Francja)',
    initials: 'CP',
  },
  {
    quote: 'Zespół jest bardzo zwinny i punktualny. Nasi interesariusze są pod szczególnym wrażeniem jakości dostarczanych rozwiązań.',
    name: 'Alok A.',
    role: 'CEO, Platforma SaaS (Szwecja)',
    initials: 'AA',
  },
  {
    quote: 'Współpraca z ImproveIT to czysta przyjemność. Stas dostarczył rozwiązanie na poziomie, jakiego oczekiwaliśmy, a dodatkowo pomagał ulepszać naszą aplikację.',
    name: 'Aleksander G.',
    role: 'CTO, E-commerce (Niemcy)',
    initials: 'AG',
  },
]

export function Testimonials() {
  const ref = useScrollReveal()

  return (
    <section className="section" id="opinie" aria-labelledby="testimonials-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">Opinie</span>
          <h2 id="testimonials-title" className="section__title">
            Co mówią nasi klienci
          </h2>
          <p className="section__description">
            Zaufanie naszych klientów jest naszym największym osiągnięciem.
          </p>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <article key={i} className="testimonial-card">
              <div className="testimonial-card__stars">★★★★★</div>
              <blockquote className="testimonial-card__quote">
                „{t.quote}"
              </blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
