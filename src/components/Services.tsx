import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Services() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  const SERVICES = [
    {
      icon: '🤖',
      title: t('services.items.agents.title'),
      text: t('services.items.agents.description'),
      tags: ['LangChain', 'AutoGPT', 'Agentic Workflows', 'Custom LLMs'],
      geminiIcon: '/v2/agent_node.png',
      link: '/services/ai-agents'
    },
    {
      icon: '🧠',
      title: t('services.items.llm.title'),
      text: t('services.items.llm.description'),
      tags: ['OpenAI', 'Anthropic', 'Vector DBs', 'Semantic Search'],
      geminiIcon: '/v2/semantic_brain.png',
      link: '/services/llm-semantic-search'
    },
    {
      icon: '⚡',
      title: t('services.items.automation.title'),
      text: t('services.items.automation.description'),
      tags: ['Process Mining', 'Workflow AI', 'Custom Pipelines'],
      link: '/services/process-automation'
    },
    {
      icon: '🌐',
      title: t('services.items.web.title'),
      text: t('services.items.web.description'),
      tags: ['React', 'Next.js', 'Node.js', 'PySide'],
      link: '/services/web-applications'
    },
    {
      icon: '📱',
      title: t('services.items.mobile.title'),
      text: t('services.items.mobile.description'),
      tags: ['React Native', 'CoreML', 'TensorFlow Lite'],
      link: '/services/mobile-apps'
    },
    {
      icon: '🛡️',
      title: t('services.items.security.title'),
      text: t('services.items.security.description'),
      tags: ['Pentesting', 'AI Security', 'OWASP Top 10', 'Compliance'],
      link: '/security-audit',
      highlight: true,
      geminiIcon: '/v2/security_shield.png'
    },
    {
      icon: '☁️',
      title: t('services.items.infra.title'),
      text: t('services.items.infra.description'),
      tags: ['AWS SageMaker', 'Kubernetes', 'Triton', 'vLLM'],
      link: '/services/ai-infrastructure'
    },
  ]

  return (
    <section className="section" id="uslugi" aria-labelledby="services-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">{t('services.label')}</span>
          <h2 id="services-title" className="section__title">
            {t('services.title')}
          </h2>
          <p className="section__description">
            {t('services.description')}
          </p>
        </div>

        <div className="bento-grid">
          {SERVICES.map((service, i) => {
            const Content = (
              <>
                {service.geminiIcon && (
                  <div className="service-card__gemini-icon" style={{ backgroundImage: `url(${service.geminiIcon})` }} />
                )}
                <div className="service-card__icon">{service.icon}</div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__text">{service.text}</p>
                <div className="service-card__tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="service-card__tag">{tag}</span>
                  ))}
                </div>
                {service.link && <div className="service-card__more">{t('blog.read_more')}</div>}
              </>
            )

            const className = `bento-item ${i === 0 ? 'bento-item--col-2 bento-item--row-2' : ''} ${i === 1 ? 'bento-item--col-2' : ''} ${service.highlight ? 'bento-item--highlight' : ''}`

            return service.link ? (
              <Link key={i} to={service.link} className={className} style={{ cursor: 'pointer' }}>
                {Content}
              </Link>
            ) : (
              <article key={i} className={className}>
                {Content}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
