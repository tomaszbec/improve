export function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="section__container">
        <div className="hero__grid">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              Zaufany partner technologiczny od 2016
            </div>

            <h1 id="hero-title" className="hero__title">
              Budujemy Przyszłość{' '}
              <span className="hero__title-gradient">Napędzaną przez AI</span>
            </h1>

            <p className="hero__subtitle">
              Projektujemy i wdrażamy zaawansowane systemy agentowe, 
              inteligentną automatyzację i oprogramowanie AI-first, 
              które redefiniuje efektywność Twojego biznesu.
            </p>

            <div className="hero__actions">
              <a href="#kontakt" className="btn btn--primary">
                Porozmawiajmy →
              </a>
              <a href="#portfolio" className="btn btn--outline">
                Zobacz projekty
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__visual-card">
              <div className="hero__visual-header">
                <div className="hero__visual-dot" />
                <div className="hero__visual-dot" />
                <div className="hero__visual-dot" />
                <span>ai_agent_v1.log</span>
              </div>
              <div className="hero__visual-body">
                <div className="hero__code-line"><span>&gt;</span> Initializing neural core...</div>
                <div className="hero__code-line"><span>&gt;</span> Connecting to vector database...</div>
                <div className="hero__code-line"><span>&gt;</span> Analyzing business patterns...</div>
                <div className="hero__code-line hero__code-line--success"><span>&gt;</span> Efficiency optimized: +42%</div>
                <div className="hero__code-line"><span>&gt;</span> Awaiting next objective...</div>
              </div>
            </div>
            
            <div className="hero__floating-stats">
              <div className="hero__mini-stat">
                <div className="hero__stat-icon">📈</div>
                <div>
                  <div className="hero__stat-val">80+</div>
                  <div className="hero__stat-nam">Klientów</div>
                </div>
              </div>
              <div className="hero__mini-stat">
                <div className="hero__stat-icon">🌍</div>
                <div>
                  <div className="hero__stat-val">75</div>
                  <div className="hero__stat-nam">Krajów</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
