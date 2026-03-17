import { useScrollReveal } from '../hooks/useScrollReveal'

const SERVICES = [
  {
    icon: '🤖',
    title: 'Systemy Agentowe (AI Agents)',
    text: 'Budujemy autonomiczne agenty AI zdolne do planowania, rozumowania i wykonywania złożonych zadań biznesowych.',
    tags: ['LangChain', 'AutoGPT', 'Agentic Workflows', 'Custom LLMs'],
  },
  {
    icon: '🧠',
    title: 'Integracja LLM & RAG',
    text: 'Wdrażamy zaawansowane wyszukiwanie semantyczne (RAG) i optymalizujemy modele językowe pod Twoje dane.',
    tags: ['OpenAI', 'Anthropic', 'Vector DBs', 'Semantic Search'],
  },
  {
    icon: '⚡',
    title: 'Automatyzacja AI-First',
    text: 'Transformujemy procesy biznesowe zastępując manualną pracę inteligentnymi przepływami pracy sterowanymi przez AI.',
    tags: ['Process Mining', 'Workflow AI', 'Custom Pipelines'],
  },
  {
    icon: '🌐',
    title: 'Inteligentne Aplikacje Web',
    text: 'Tworzymy nowoczesne platformy SaaS z wbudowanymi funkcjami AI i predykcyjną analityką danych.',
    tags: ['React', 'Next.js', 'Node.js', 'PySide'],
  },
  {
    icon: '📱',
    title: 'Mobile AI',
    text: 'Aplikacje mobilne wykorzystujące modele on-device i integracje AI dla bezproblemowego UX.',
    tags: ['React Native', 'CoreML', 'TensorFlow Lite'],
  },
  {
    icon: '☁️',
    title: 'AI Infrastructure & MLOps',
    text: 'Skalowalne środowiska chmurowe zoptymalizowane pod kątem trenowania i serwowania modeli AI.',
    tags: ['AWS SageMaker', 'Kubernetes', 'Triton', 'vLLM'],
  },
]

export function Services() {
  const ref = useScrollReveal()

  return (
    <section className="section" id="uslugi" aria-labelledby="services-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">Usługi</span>
          <h2 id="services-title" className="section__title">
            Kompleksowe rozwiązania technologiczne
          </h2>
          <p className="section__description">
            Od strategii po wdrożenie — dostarczamy pełen zakres usług
            inżynierii oprogramowania.
          </p>
        </div>

        <div className="bento-grid">
          {SERVICES.map((service, i) => (
            <article 
              key={i} 
              className={`bento-item ${i === 0 ? 'bento-item--col-2 bento-item--row-2' : ''} ${i === 1 ? 'bento-item--col-2' : ''}`}
            >
              <div className="service-card__icon">{service.icon}</div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__text">{service.text}</p>
              <div className="service-card__tags">
                {service.tags.map((tag) => (
                  <span key={tag} className="service-card__tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
