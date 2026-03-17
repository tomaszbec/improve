import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

const POSTS_DATA: Record<string, any> = {
  'przyszlosc-agentow-ai-w-biznesie': {
    title: 'Przyszłość Agentów AI w Biznesie: Od Automatyzacji do Autonomii',
    content: 'Agentic systems are not just automation. They are autonomous entities capable of reasoning and planning to solve complex business challenges with minimal human intervention.',
    date: '2024-03-15',
    category: 'AI Strategy',
    image: '/images/ai-dev.png'
  },
  'optymalizacja-llm-z-wykorzystaniem-rag': {
    title: 'Optymalizacja LLM z wykorzystaniem RAG: Przewodnik dla Inżynierów',
    content: 'Retrieval-Augmented Generation (RAG) is the missing link between standard LLMs and organizational data knowledge base, enabling factual and context-aware responses.',
    date: '2024-03-10',
    category: 'Technical',
    image: '/images/ai-saas.png'
  }
}

export function BlogPost() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const post = POSTS_DATA[slug || '']
  const ref = useScrollReveal()

  if (!post) {
    return (
      <div className="section" style={{ paddingTop: '15rem', textAlign: 'center' }}>
        <h2>{t('blog.no_post')}</h2>
        <Link to="/blog" className="btn btn--primary" style={{ marginTop: '2rem' }}>{t('blog.back')}</Link>
      </div>
    )
  }

  return (
    <article className="section" style={{ paddingTop: '12rem' }}>
      <div className="section__container" ref={ref}>
        <Link to="/blog" className="hero__stat-nam" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {t('blog.back')}
        </Link>
        <div className="section__header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <span className="section__label">{post.category}</span>
          <h1 className="section__title" style={{ maxWidth: '800px' }}>{post.title}</h1>
          <div className="hero__stat-nam">{post.date}</div>
        </div>

        <div className="portfolio-card__image" style={{ height: '500px', borderRadius: 'var(--radius-lg)', marginBottom: '4rem' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div className="about__content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="section__description" style={{ textAlign: 'left', fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-text)' }}>
            {post.content}
          </p>
          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>{t('blog.cta_title')}</h4>
            <p className="hero__stat-nam">{t('blog.cta_desc')}</p>
            <a href="/#kontakt" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>{t('blog.cta_btn')}</a>
          </div>
        </div>
      </div>
    </article>
  )
}
