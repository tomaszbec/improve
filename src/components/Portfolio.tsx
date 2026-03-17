import { useScrollReveal } from '../hooks/useScrollReveal'

const PROJECTS = [
  {
    image: '/images/ai-dev.png',
    category: 'AI / Development',
    title: 'Autonomiczny Inżynier AI',
    text: 'Agent AI integrujący się z repozytoriami kodu, zdolny do samodzielnego naprawiania bugów, pisania testów i refaktoryzacji złożonych modułów.',
    tech: ['Python', 'LLM Agents', 'Vector Search', 'Node.js'],
  },
  {
    image: '/images/ai-travel.png',
    category: 'SaaS / AI Agents',
    title: 'Aura AI Travel Agent',
    text: 'Konwersacyjny agent podróży planujący kompletne trasu, rezerwujący hotele i reagujący w czasie rzeczywistym na zmiany lotów.',
    tech: ['React', 'LangChain', 'OpenAI', 'AWS'],
  },
  {
    image: '/images/ai-saas.png',
    category: 'FinTech / AI',
    title: 'Predykcyjna Analityka Finansowa',
    text: 'Platforma SaaS przewidująca trendy rynkowe i optymalizująca portfele inwestycyjne za pomocą zaawansowanych sieci neuronowych.',
    tech: ['Next.js', 'TensorFlow', 'PostgreSQL', 'Azure'],
  },
  {
    image: '/images/ai-medical.png',
    category: 'HealthTech / AI',
    title: 'Diagnostyka Obrazowa AI',
    text: 'System wspomagający radiologów w wykrywaniu wczesnych zmian chorobowych na obrazach TK i MRI z dokładnością powyżej 98%.',
    tech: ['Computer Vision', 'PyTorch', 'FastAPI', 'GCP'],
  },
]

export function Portfolio() {
  const ref = useScrollReveal()

  return (
    <section className="section" id="portfolio" aria-labelledby="portfolio-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">Portfolio</span>
          <h2 id="portfolio-title" className="section__title">
            Innowacje AI w praktyce
          </h2>
          <p className="section__description">
            Od systemów agentowych po zaawansowaną analitykę — zobacz jak 
            wdrażamy rozwiązania AI, które przynoszą realną wartość.
          </p>
        </div>

        <div className="portfolio__modern-grid">
          {PROJECTS.map((project, i) => (
            <article 
              key={i} 
              className={`portfolio-card ${i === 0 || i === 3 ? 'portfolio-card--featured' : ''}`}
            >
              <div className="portfolio-card__image">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="portfolio-card__overlay">
                  <span className="portfolio-card__tag-pill">{project.category}</span>
                </div>
              </div>
              <div className="portfolio-card__body">
                <h3 className="portfolio-card__title">{project.title}</h3>
                <p className="portfolio-card__text">{project.text}</p>
                <div className="portfolio-card__tech">
                   {project.tech.map((t) => (
                    <span key={t} className="service-card__tag">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
