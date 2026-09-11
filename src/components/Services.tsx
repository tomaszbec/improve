import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  Bot,
  BrainCircuit,
  Code2,
  CloudCog,
  Gauge,
  Globe2,
  LifeBuoy,
  MonitorSmartphone,
  PlugZap,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'

export function Services() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  const SERVICES = [
    {
      icon: Code2,
      title: t('services.items.software.title'),
      text: t('services.items.software.description'),
      tags: ['Web', 'Mobile', 'Backend', 'Cloud'],
      link: '/services/custom-software-development',
      highlight: true,
    },
    {
      icon: Sparkles,
      title: t('services.items.aiTransformation.title'),
      text: t('services.items.aiTransformation.description'),
      tags: ['AI Audit', 'Business AI', 'Implementation', 'Support'],
      link: '/services/ai-transformation',
      highlight: true,
    },
    {
      icon: RefreshCw,
      title: t('services.items.modernization.title'),
      text: t('services.items.modernization.description'),
      tags: ['Refactoring', 'Legacy', 'Performance', 'Migration'],
      link: '/services/software-modernization',
    },
    {
      icon: LifeBuoy,
      title: t('services.items.support.title'),
      text: t('services.items.support.description'),
      tags: ['Maintenance', 'Monitoring', 'Bug Fixing', 'Development'],
      link: '/services/application-support',
    },
    {
      icon: PlugZap,
      title: t('services.items.integrations.title'),
      text: t('services.items.integrations.description'),
      tags: ['API', 'CRM', 'ERP', 'E-commerce'],
      link: '/services/systems-integration',
    },
    {
      icon: SearchCheck,
      title: t('services.items.audit.title'),
      text: t('services.items.audit.description'),
      tags: ['Code Audit', 'Architecture', 'Performance', 'Roadmap'],
      link: '/services/technology-audit',
    },
    {
      icon: CloudCog,
      title: t('services.items.devops.title'),
      text: t('services.items.devops.description'),
      tags: ['DevOps', 'Kubernetes', 'AWS', 'Azure'],
      link: '/services/devops-cloud',
    },
    {
      icon: Bot,
      title: t('services.items.agents.title'),
      text: t('services.items.agents.description'),
      tags: ['LangChain', 'AutoGPT', 'Agentic Workflows', 'Custom LLMs'],
      geminiIcon: '/v2/agent_node.png',
      link: '/services/ai-agents'
    },
    {
      icon: BrainCircuit,
      title: t('services.items.llm.title'),
      text: t('services.items.llm.description'),
      tags: ['OpenAI', 'Anthropic', 'Vector DBs', 'Semantic Search'],
      geminiIcon: '/v2/semantic_brain.png',
      link: '/services/llm-semantic-search'
    },
    {
      icon: Zap,
      title: t('services.items.automation.title'),
      text: t('services.items.automation.description'),
      tags: ['Process Mining', 'Workflow AI', 'Custom Pipelines'],
      link: '/services/process-automation'
    },
    {
      icon: Globe2,
      title: t('services.items.web.title'),
      text: t('services.items.web.description'),
      tags: ['React', 'Next.js', 'Node.js', 'PySide'],
      link: '/services/web-applications'
    },
    {
      icon: MonitorSmartphone,
      title: t('services.items.mobile.title'),
      text: t('services.items.mobile.description'),
      tags: ['React Native', 'CoreML', 'TensorFlow Lite'],
      link: '/services/mobile-apps'
    },
    {
      icon: ShieldCheck,
      title: t('services.items.security.title'),
      text: t('services.items.security.description'),
      tags: ['Pentesting', 'AI Security', 'OWASP Top 10', 'Compliance'],
      link: '/security-audit',
      highlight: true,
      geminiIcon: '/v2/security_shield.png'
    },
    {
      icon: CloudCog,
      title: t('services.items.infra.title'),
      text: t('services.items.infra.description'),
      tags: ['AWS SageMaker', 'Kubernetes', 'Triton', 'vLLM'],
      link: '/services/ai-infrastructure'
    },
    {
      icon: Gauge,
      title: t('services.items.aiOptimization.title'),
      text: t('services.items.aiOptimization.description'),
      tags: ['AI FinOps', 'ROI', 'Usage Monitoring', 'Benchmarks'],
      link: '/ai-optimization'
    },
    {
      icon: Code2,
      title: t('services.items.claudeCode.title'),
      text: t('services.items.claudeCode.description'),
      tags: ['Claude Code', 'OpenTelemetry', 'Prometheus', 'Grafana'],
      link: '/claude-code/usage-monitoring'
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

        <div className="bento-grid services-bento-grid">
          {SERVICES.map((service, i) => {
            const Icon = service.icon
            const Content = (
              <>
                {service.geminiIcon && (
                  <div className="service-card__gemini-icon" style={{ backgroundImage: `url(${service.geminiIcon})` }} />
                )}
                <div className="service-card__icon" aria-hidden="true"><Icon /></div>
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

            const className = `bento-item ${i === 0 ? 'bento-item--col-2 bento-item--row-2' : ''} ${service.highlight ? 'bento-item--highlight' : ''}`

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
