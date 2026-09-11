import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { articleReadingTime, fetchPublishedArticles, isArticleAvailableInLanguage, localizeArticle, publishingAssetUrl, type PublishedArticle } from '../lib/publishingApi'
import { usePageSeo, siteUrl } from '../lib/seo'
import { AlertTriangle, Clock3, Database, RefreshCw, Search, X } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function Blog() {
  const { t, i18n } = useTranslation()
  const ref = useScrollReveal()
  const [publishedPosts, setPublishedPosts] = useState<PublishedArticle[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [retryCount, setRetryCount] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const localizedPosts = useMemo(() => publishedPosts.filter((post) => isArticleAvailableInLanguage(post, i18n.language)).map((post) => localizeArticle(post, i18n.language)), [i18n.language, publishedPosts])

  useEffect(() => {
    const controller = new AbortController()
    fetchPublishedArticles(controller.signal)
      .then((posts) => { setPublishedPosts(posts); setStatus('ready') })
      .catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => controller.abort()
  }, [retryCount])

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    localizedPosts.forEach((post) => counts.set(post.category, (counts.get(post.category) || 0) + 1))
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b, i18n.language))
  }, [i18n.language, localizedPosts])

  const visiblePosts = useMemo(() => {
    const phrase = query.trim().toLocaleLowerCase(i18n.language)
    return localizedPosts.filter((post) => {
      const searchable = [post.title, post.excerpt, post.category, ...(post.tags || [])].join(' ').toLocaleLowerCase(i18n.language)
      return (category === 'all' || post.category === category) && (!phrase || searchable.includes(phrase))
    })
  }, [category, i18n.language, localizedPosts, query])

  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${siteUrl}/blog#blog`,
        name: t('blog.seo_title'),
        description: t('blog.description'),
        url: `${siteUrl}/blog`,
        inLanguage: i18n.language === 'pl' ? 'pl-PL' : 'en-US',
        publisher: { '@type': 'Organization', name: 'improveIT.pl', url: siteUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('blog.home'), item: siteUrl },
          { '@type': 'ListItem', position: 2, name: t('blog.label'), item: `${siteUrl}/blog` },
        ],
      },
      {
        '@type': 'ItemList',
        numberOfItems: localizedPosts.length,
        itemListElement: localizedPosts.map((post, index) => ({ '@type': 'ListItem', position: index + 1, url: `${siteUrl}/blog/${post.slug}`, name: post.title })),
      },
    ],
  }), [i18n.language, localizedPosts, t])

  usePageSeo({ title: t('blog.seo_title'), description: t('blog.description'), path: '/blog', schema })

  const clearFilters = () => { setQuery(''); setCategory('all') }
  const hasFilters = Boolean(query.trim() || category !== 'all')

  return (
    <section className="section blog-page" style={{ paddingTop: '12rem' }}>
      <div className="section__container" ref={ref}>
        <Breadcrumbs label={t('blog.breadcrumbs')} items={[{ label: t('blog.home'), to: '/' }, { label: t('blog.label') }]} />
        <div className="section__header">
          <span className="section__label">{t('blog.label')}</span>
          <h1 className="section__title">{t('blog.title_start')}<span className="hero__title-gradient">{t('blog.gradient')}</span></h1>
          <p className="section__description">{t('blog.description')}</p>
        </div>

        {status === 'ready' && publishedPosts.length > 0 && (
          <div className="blog-discovery" aria-label={t('blog.filters')}>
            <label className="blog-search">
              <Search aria-hidden="true" />
              <span className="sr-only">{t('blog.search_label')}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('blog.search_placeholder')} type="search" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label={t('blog.clear_search')}><X /></button>}
            </label>
            <div className="blog-categories" aria-label={t('blog.categories')}>
              <button className={category === 'all' ? 'is-active' : ''} type="button" onClick={() => setCategory('all')}>{t('blog.all_categories')} <span>{publishedPosts.length}</span></button>
              {categories.map(([name, count]) => <button className={category === name ? 'is-active' : ''} type="button" key={name} onClick={() => setCategory(name)}>{name} <span>{count}</span></button>)}
            </div>
            <div className="blog-results" aria-live="polite"><span>{t('blog.results', { count: visiblePosts.length })}</span>{hasFilters && <button type="button" onClick={clearFilters}><X /> {t('blog.clear_filters')}</button>}</div>
          </div>
        )}

        {status === 'loading' && <div className="blog-state" aria-live="polite"><RefreshCw className="blog-state__icon blog-state__icon--loading"/><h3>{t('blog.loading_title')}</h3><p>{t('blog.loading_description')}</p></div>}
        {status === 'error' && <div className="blog-state blog-state--error" role="alert"><AlertTriangle className="blog-state__icon"/><h3>{t('blog.error_title')}</h3><p>{t('blog.error_description')}</p><button className="btn btn--outline" type="button" onClick={() => { setStatus('loading'); setRetryCount((count) => count + 1) }}><RefreshCw/> {t('blog.retry')}</button></div>}
        {status === 'ready' && publishedPosts.length === 0 && <div className="blog-state"><Database className="blog-state__icon"/><h3>{t('blog.empty_title')}</h3><p>{t('blog.empty_description')}</p></div>}
        {status === 'ready' && publishedPosts.length > 0 && visiblePosts.length === 0 && <div className="blog-state"><Search className="blog-state__icon"/><h3>{t('blog.no_results_title')}</h3><p>{t('blog.no_results_description')}</p><button className="btn btn--outline" type="button" onClick={clearFilters}><X/> {t('blog.clear_filters')}</button></div>}
        {status === 'ready' && visiblePosts.length > 0 && <div className="portfolio__modern-grid blog-grid">
          {visiblePosts.map((post, i) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className={`portfolio-card ${i === 0 ? 'portfolio-card--featured' : ''}`}>
              <div className="portfolio-card__image"><img src={publishingAssetUrl(post.thumbnail || post.image)} alt="" loading="lazy" /><div className="portfolio-card__overlay"><span className="portfolio-card__tag-pill">{post.category}</span></div></div>
              <div className="portfolio-card__body">
                <div className="blog-card__meta"><time dateTime={post.published_at}>{post.published_at?.slice(0, 10)}</time><span><Clock3 /> {t('blog.reading_time', { count: articleReadingTime(post.content, post.excerpt) })}</span></div>
                <h2 className="portfolio-card__title">{post.title}</h2>
                <p className="portfolio-card__text">{post.excerpt}</p>
                <div className="service-card__tags"><span className="service-card__tag">{t('blog.read_more')}</span></div>
              </div>
            </Link>
          ))}
        </div>}
      </div>
    </section>
  )
}
