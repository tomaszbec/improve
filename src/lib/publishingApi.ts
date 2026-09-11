export type PublishedArticle = {
  id: string
  slug: string
  title: string
  image: string
  thumbnail?: string
  content: string
  excerpt: string
  tags: string[]
  category: string
  title_pl?: string
  content_pl?: string
  excerpt_pl?: string
  tags_pl?: string[]
  category_pl?: string
  template?: 'auto' | 'image-left' | 'image-right' | 'image-top'
  translations?: Record<string, Partial<Pick<PublishedArticle, 'title' | 'content' | 'excerpt' | 'tags' | 'category'>>>
  published_at: string
  updated_at: string
  author_name?: string
  author_slug?: string
  author_role?: string
  author_specialty?: string
  author_bio?: string
  author_methodology?: string
  author_avatar?: string
  author_linkedin_url?: string
  author_github_url?: string
  author_trust_message?: string
  source_language?: string
  translation_status?: string
}

export function isArticleAvailableInLanguage(article: PublishedArticle, language: string) {
  const code = language.split('-')[0]
  if (code === 'pl') return article.source_language === 'pl' || Boolean(article.title_pl || article.translations?.pl?.title)
  if (code === 'en') return article.source_language !== 'pl' || article.translation_status === 'translated' || Boolean(article.translations?.en?.title)
  return Boolean(article.translations?.[code]?.title && article.translations?.[code]?.content)
}

export type ArticleTemplate = 'image-left' | 'image-right' | 'image-top'

export function resolveArticleTemplate(template: PublishedArticle['template'], slug: string): ArticleTemplate {
  if (template && template !== 'auto') return template
  const layouts: ArticleTemplate[] = ['image-left', 'image-right', 'image-top']
  const hash = [...slug].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 0)
  return layouts[hash % layouts.length]
}

export function localizeArticle(article: PublishedArticle, language: string): PublishedArticle {
  const normalizedLanguage = language.toLowerCase().split(/[-_]/)[0]

  const translation = article.translations?.[normalizedLanguage]
    || article.translations?.[language]
    || Object.entries(article.translations || {}).find(([key]) => key.toLowerCase().split(/[-_]/)[0] === normalizedLanguage)?.[1]
  if (translation) {
    return { ...article, ...translation, tags: translation.tags?.length ? translation.tags : article.tags }
  }
  return normalizedLanguage === 'pl' ? {
    ...article,
    title: article.title_pl || article.title,
    content: article.content_pl || article.content,
    excerpt: article.excerpt_pl || article.excerpt,
    tags: article.tags_pl?.length ? article.tags_pl : article.tags,
    category: article.category_pl || article.category,
  } : article
}

export function articleReadingTime(content: string, excerpt = '') {
  const text = new DOMParser().parseFromString(content || excerpt, 'text/html').body.textContent || ''
  const characters = text.replace(/\s+/g, ' ').trim().length
  return Math.max(1, Math.ceil(characters / 1000))
}

const configuredApi = import.meta.env.VITE_PUBLISHING_API_URL?.replace(/\/$/, '')

export const publishingApiUrl = configuredApi || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : '/api'
)

export function publishingAssetUrl(path: string) {
  if (!path || /^(https?:)?\/\//.test(path)) return path
  if (path.startsWith('/images/') || path.startsWith('/assets/')) return path
  return `${publishingApiUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export async function fetchPublishedArticles(signal?: AbortSignal): Promise<PublishedArticle[]> {
  const response = await fetch(`${publishingApiUrl}/v1/articles`, { signal })
  if (!response.ok) throw new Error('Publishing API unavailable')
  const data = await response.json()
  return Array.isArray(data.posts) ? data.posts : []
}

export async function fetchPublishedArticle(slug: string, signal?: AbortSignal): Promise<PublishedArticle> {
  const response = await fetch(`${publishingApiUrl}/v1/articles/${encodeURIComponent(slug)}`, { signal })
  if (!response.ok) throw new Error('Article not found')
  return response.json()
}

export function safeArticleHtml(content: string) {
  const document = new DOMParser().parseFromString(content, 'text/html')
  document.querySelectorAll('script, style, iframe, object, embed, form').forEach((element) => element.remove())
  document.querySelectorAll('*').forEach((element) => {
    for (const attribute of [...element.attributes]) {
      if (attribute.name.startsWith('on') || (/^(href|src)$/i.test(attribute.name) && /^javascript:/i.test(attribute.value.trim()))) {
        element.removeAttribute(attribute.name)
      }
    }
  })
  return document.body.innerHTML
}
