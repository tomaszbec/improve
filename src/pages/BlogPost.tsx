import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { articleReadingTime, fetchPublishedArticle, isArticleAvailableInLanguage, localizeArticle, publishingAssetUrl, resolveArticleTemplate, safeArticleHtml, type PublishedArticle } from '../lib/publishingApi'
import { siteUrl, usePageSeo } from '../lib/seo'
import { Clock3 } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'

export function BlogPost() {
  const { t, i18n } = useTranslation()
  const { slug } = useParams()
  const [publishedPost, setPublishedPost] = useState<PublishedArticle | null>(null)
  const [loadedSlug, setLoadedSlug] = useState<string | undefined>()
  const ref = useScrollReveal()
  const localizedPost = useMemo(() => publishedPost && isArticleAvailableInLanguage(publishedPost, i18n.language) ? localizeArticle(publishedPost, i18n.language) : null, [i18n.language, publishedPost])

  useEffect(() => {
    if (!slug) return
    const controller = new AbortController()
    fetchPublishedArticle(slug, controller.signal)
      .then(setPublishedPost)
      .catch(() => setPublishedPost(null))
      .finally(() => { if (!controller.signal.aborted) setLoadedSlug(slug) })
    return () => controller.abort()
  }, [slug])

  const schema = useMemo(() => {
    if (!localizedPost) return undefined
    const canonical = `${siteUrl}/blog/${localizedPost.slug}`
    const rawImage = localizedPost.image || localizedPost.thumbnail || '/images/ai-dev.png'
    const schemaImage = rawImage.startsWith('http') ? rawImage : `${siteUrl}/api${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${canonical}#article`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          headline: localizedPost.title,
          description: localizedPost.excerpt,
          image: schemaImage,
          datePublished: localizedPost.published_at,
          dateModified: localizedPost.updated_at || localizedPost.published_at,
          articleSection: localizedPost.category,
          keywords: localizedPost.tags || [],
          wordCount: (new DOMParser().parseFromString(localizedPost.content, 'text/html').body.textContent || '').trim().split(/\s+/).filter(Boolean).length,
          author: localizedPost.author_name ? {
            '@type': 'Person',
            name: localizedPost.author_name,
            jobTitle: localizedPost.author_role || undefined,
            description: localizedPost.author_bio || localizedPost.author_specialty || undefined,
            image: localizedPost.author_avatar || undefined,
            sameAs: [localizedPost.author_linkedin_url, localizedPost.author_github_url].filter(Boolean),
          } : { '@type': 'Organization', name: 'improveIT.pl' },
          publisher: { '@type': 'Organization', name: 'improveIT.pl', url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } },
          inLanguage: i18n.language === 'pl' ? 'pl-PL' : 'en-US',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('blog.home'), item: siteUrl },
            { '@type': 'ListItem', position: 2, name: t('blog.label'), item: `${siteUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: localizedPost.title, item: canonical },
          ],
        },
      ],
    }
  }, [i18n.language, localizedPost, t])

  usePageSeo({
    title: localizedPost?.title || t('blog.seo_title'),
    description: localizedPost?.excerpt || t('blog.description'),
    path: `/blog/${slug || ''}`,
    image: publishedPost ? publishingAssetUrl(publishedPost.image || publishedPost.thumbnail || '/images/ai-dev.png') : '/images/ai-dev.png',
    type: 'article',
    schema,
  })

  if (loadedSlug !== slug) {
    return <div className="section" style={{ paddingTop: '15rem', textAlign: 'center' }}>{t('common.loading', 'Loading…')}</div>
  }

  if (!publishedPost || !localizedPost) {
    return (
      <div className="section" style={{ paddingTop: '15rem', textAlign: 'center' }}>
        <h2>{t('blog.no_post')}</h2>
        <Link to="/blog" className="btn btn--primary" style={{ marginTop: '2rem' }}>{t('blog.back')}</Link>
      </div>
    )
  }

  const displayPost = localizedPost || publishedPost
  const title = displayPost.title
  const category = displayPost.category
  const date = publishedPost.published_at?.slice(0, 10)
  const image = publishingAssetUrl(publishedPost.image)
  const readingTime = articleReadingTime(displayPost.content, displayPost.excerpt)
  const template = resolveArticleTemplate(displayPost.template, displayPost.slug)

  return (
    <article className="section" style={{ paddingTop: '12rem' }}>
      <div className="section__container" ref={ref}>
        <Breadcrumbs label={t('blog.breadcrumbs')} items={[{ label: t('blog.home'), to: '/' }, { label: t('blog.label'), to: '/blog' }, { label: title }]} />
        <div className="section__header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <span className="section__label">{category}</span>
          <h1 className="section__title" style={{ maxWidth: '800px' }}>{title}</h1>
          <div className="blog-post__meta">
            <time dateTime={publishedPost.published_at}>{date}</time>
            <span><Clock3 /> {t('blog.reading_time', { count: readingTime })}</span>
            {publishedPost.author_name && <span>{t('blog.author')}: {publishedPost.author_name}</span>}
          </div>
        </div>

        <div className={`article-layout article-layout--${template}`}>
          <figure className="article-layout__image">
            <img src={image} alt={title} />
          </figure>
          <div
            className="published-article-content"
            dangerouslySetInnerHTML={{ __html: safeArticleHtml(displayPost.content) }}
          />
          {publishedPost.author_name && (
            <aside className="article-author-card" aria-label={t('blog.author')}>
              {publishedPost.author_avatar && (
                <img className="article-author-card__avatar" src={publishingAssetUrl(publishedPost.author_avatar)} alt="" />
              )}
              <div className="article-author-card__content">
                <span className="article-author-card__eyebrow">{t('blog.author')}</span>
                <h3>{publishedPost.author_name}</h3>
                {publishedPost.author_role && <p className="article-author-card__role">{publishedPost.author_role}</p>}
                {publishedPost.author_specialty && <p className="article-author-card__specialty">{publishedPost.author_specialty}</p>}
                {publishedPost.author_bio && <p>{publishedPost.author_bio}</p>}
                {publishedPost.author_methodology && <p className="article-author-card__methodology">{publishedPost.author_methodology}</p>}
                {publishedPost.author_trust_message && <p className="article-author-card__trust">{publishedPost.author_trust_message}</p>}
                {(publishedPost.author_linkedin_url || publishedPost.author_github_url) && (
                  <div className="article-author-card__links">
                    {publishedPost.author_linkedin_url && <a href={publishedPost.author_linkedin_url} rel="author noopener noreferrer" target="_blank">LinkedIn</a>}
                    {publishedPost.author_github_url && <a href={publishedPost.author_github_url} rel="author noopener noreferrer" target="_blank">GitHub</a>}
                  </div>
                )}
              </div>
            </aside>
          )}
          <div className="article-layout__cta" style={{ marginTop: '4rem', padding: '2rem', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>{t('blog.cta_title')}</h4>
            <p className="hero__stat-nam">{t('blog.cta_desc')}</p>
            <Link to="/contact" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>{t('blog.cta_btn')}</Link>
          </div>
        </div>
      </div>
    </article>
  )
}
