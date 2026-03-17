import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Portfolio() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  const PROJECTS = [
    {
      image: '/images/ai-dev.png',
      category: t('portfolio.categories.ai_dev'),
      title: t('portfolio.items.engineer.title'),
      text: t('portfolio.items.engineer.description'),
      tech: ['Python', 'LLM Agents', 'Vector Search', 'Node.js'],
    },
    {
      image: '/images/ai-travel.png',
      category: t('portfolio.categories.saas_agents'),
      title: t('portfolio.items.travel.title'),
      text: t('portfolio.items.travel.description'),
      tech: ['React', 'LangChain', 'OpenAI', 'AWS'],
    },
    {
      image: '/images/ai-saas.png',
      category: t('portfolio.categories.fintech_ai'),
      title: t('portfolio.items.finance.title'),
      text: t('portfolio.items.finance.description'),
      tech: ['Next.js', 'TensorFlow', 'PostgreSQL', 'Azure'],
    },
    {
      image: '/images/ai-medical.png',
      category: t('portfolio.categories.healthtech_ai'),
      title: t('portfolio.items.medical.title'),
      text: t('portfolio.items.medical.description'),
      tech: ['Computer Vision', 'PyTorch', 'FastAPI', 'GCP'],
    },
  ]

  return (
    <section className="section" id="portfolio" aria-labelledby="portfolio-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">{t('portfolio.label')}</span>
          <h2 id="portfolio-title" className="section__title">
            {t('portfolio.title')}
          </h2>
          <p className="section__description">
            {t('portfolio.description')}
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
