import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function NotFound() {
  const ref = useScrollReveal()

  return (
    <main className="not-found-page">
      <section className="hero" style={{ paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="section__container" ref={ref}>
          <div className="hero__badge">
            <span className="hero__badge-dot" style={{ background: '#ef4444' }} />
            404 — Not Found
          </div>
          
          <h1 className="hero__title">
            Lost in the <span className="hero__title-gradient">Latent Space?</span>
          </h1>
          
          <p className="hero__subtitle" style={{ maxWidth: '700px', margin: '1.5rem 0 3rem' }}>
            The page you're looking for was either compressed, hallucinated, or never existed in our model. Let's get you back to reality.
          </p>

          <div className="hero__actions">
            <Link to="/" className="btn btn--primary">
              Back to Home
            </Link>
            <Link to="/contact" className="btn btn--outline">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="section__container">
          <h2 className="section__title" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
            Perhaps you were looking for:
          </h2>
          <div className="bento-grid">
            <Link to="/services" className="bento-item bento-item--col-2">
              <div className="service-card__icon">🤖</div>
              <h3 className="service-card__title">Our AI Services</h3>
              <p className="service-card__text">Explore our agentic systems and LLM solutions.</p>
            </Link>
            <Link to="/blog" className="bento-item bento-item--col-2">
              <div className="service-card__icon">💡</div>
              <h3 className="service-card__title">AI Insights</h3>
              <p className="service-card__text">Read about the latest trends in autonomous software.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
