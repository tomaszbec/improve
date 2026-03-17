import { useScrollReveal } from '../hooks/useScrollReveal'

export function About() {
  const ref = useScrollReveal()

  return (
    <section className="section" id="o-nas" aria-labelledby="about-title">
      <div className="section__container" ref={ref}>
        <div className="about__new-grid">
          <div className="about__content">
            <span className="section__label">O nas</span>
            <h2 id="about-title" className="section__title">
              Partner, który <span className="hero__title-gradient">napędza wzrost</span>
            </h2>
            <p className="section__description" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>
              Specjalizujemy się w budowie rozwiązań web, mobile, SaaS i AI
              dla czołowych firm technologicznych z Europy i USA. Od 2016 roku
              dostarczamy inżynierię oprogramowania na najwyższym poziomie.
            </p>
            
            <div className="about__features-modern">
              <div className="about__modern-item">
                <span className="about__modern-num">01</span>
                <div>
                  <h4>Senior Expertise</h4>
                  <p>80% inżynierów z 4+ latami komercyjnego doświadczenia.</p>
                </div>
              </div>
              <div className="about__modern-item">
                <span className="about__modern-num">02</span>
                <div>
                  <h4>Rapid Deployment</h4>
                  <p>Start projektu w ciągu 2 tygodni od zapytania.</p>
                </div>
              </div>
              <div className="about__modern-item">
                <span className="about__modern-num">03</span>
                <div>
                  <h4>Scale Ready</h4>
                  <p>Elastyczne zespoły gotowe na szybkie skalowanie produktu.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about__bento-visual">
            <div className="about__bento-top">
              <div className="about__bento-card">
                <div className="about__bento-val">10+</div>
                <div className="about__bento-lab">Lat na rynku</div>
              </div>
              <div className="about__bento-card about__bento-card--accent">
                <div className="about__bento-val">75</div>
                <div className="about__bento-lab">Krajów</div>
              </div>
            </div>
            <div className="about__bento-bottom">
              <div className="about__bento-card about__bento-card--wide">
                <div className="about__bento-val">80+</div>
                <div className="about__bento-lab">Zadowolonych Klientów</div>
                <div className="about__bento-glow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
