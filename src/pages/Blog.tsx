import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

export function Blog() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  const POSTS = [
    {
      slug: 'przyszlosc-agentow-ai-w-biznesie',
      title: t('blog.post1.title', 'Przyszłość Agentów AI w Biznesie'),
      excerpt: t('blog.post1.excerpt', 'Jak systemy agentowe redefiniują sposób, w jaki firmy podchodzą do złożonych problemów.'),
      date: '2024-03-15',
      category: 'AI Strategy',
      image: '/images/ai-dev.png'
    },
    {
      slug: 'optymalizacja-llm-z-wykorzystaniem-rag',
      title: t('blog.post2.title', 'Optymalizacja LLM z wykorzystaniem RAG'),
      excerpt: t('blog.post2.excerpt', 'Dlaczego Retrieval-Augmented Generation jest kluczem do budowania wiarygodnych rozwiązań.'),
      date: '2024-03-10',
      category: 'Technical',
      image: '/images/ai-saas.png'
    }
  ]

  return (
    <section className="section" style={{ paddingTop: '12rem' }}>
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">{t('blog.label')}</span>
          <h2 className="section__title">
            {t('blog.title_start', 'Wiedza i ')}
            <span className="hero__title-gradient">{t('blog.gradient', 'Innowacje AI')}</span>
          </h2>
          <p className="section__description">
            {t('blog.description')}
          </p>
        </div>

        <div className="portfolio__modern-grid">
          {POSTS.map((post, i) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className={`portfolio-card ${i === 0 ? 'portfolio-card--featured' : ''}`}>
              <div className="portfolio-card__image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <div className="portfolio-card__overlay">
                  <span className="portfolio-card__tag-pill">{post.category}</span>
                </div>
              </div>
              <div className="portfolio-card__body">
                <div className="hero__stat-nam">{post.date}</div>
                <h3 className="portfolio-card__title" style={{ marginTop: '0.5rem' }}>{post.title}</h3>
                <p className="portfolio-card__text">{post.excerpt}</p>
                <div className="service-card__tags" style={{ marginTop: '1.5rem' }}>
                  <span className="service-card__tag">{t('blog.read_more')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
