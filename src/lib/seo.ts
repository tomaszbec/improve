import { useEffect } from 'react'

const SITE_URL = 'https://improveit.pl'

type SeoOptions = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  schema?: Record<string, unknown>
}

function localePath(path: string, language: 'pl' | 'en') {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return language === 'en' ? `/en${normalized}` : normalized || '/'
}

export function localizedSiteUrl(path: string) {
  const language = /^\/en(?:\/|$)/.test(window.location.pathname) ? 'en' : 'pl'
  return `${SITE_URL}${localePath(path, language)}`
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export function usePageSeo({ title, description, path, image = '/images/ai-dev.png', type = 'website', schema }: SeoOptions) {
  useEffect(() => {
    const language = /^\/en(?:\/|$)/.test(window.location.pathname) ? 'en' : 'pl'
    const canonical = `${SITE_URL}${localePath(path, language)}`
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`
    document.documentElement.lang = language
    document.title = `${title} | improveIT.pl`
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove())
    const alternatePaths = [
      { language: 'pl', href: `${SITE_URL}${localePath(path, 'pl')}` },
      { language: 'en', href: `${SITE_URL}${localePath(path, 'en')}` },
      { language: 'x-default', href: `${SITE_URL}${localePath(path, 'pl')}` },
    ]
    alternatePaths.forEach(({ language: alternateLanguage, href }) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = alternateLanguage
      link.href = href
      link.dataset.pageAlternate = 'true'
      document.head.appendChild(link)
    })
    upsertMeta('meta[name="description"]', 'name', 'description', description)
    upsertMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage)
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', language === 'en' ? 'en_US' : 'pl_PL')
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage)

    const element = document.createElement('script')
    element.type = 'application/ld+json'
    element.dataset.pageSchema = 'true'
    const localizedSchema = schema && !('@graph' in schema) ? { ...schema, url: canonical, inLanguage: language === 'en' ? 'en-US' : 'pl-PL' } : schema
    element.text = JSON.stringify(localizedSchema || {})
    document.head.querySelector('script[data-page-schema="true"]')?.remove()
    if (schema) document.head.appendChild(element)
    return () => {
      element.remove()
      document.querySelectorAll('link[data-page-alternate="true"]').forEach((link) => link.remove())
    }
  }, [description, image, path, schema, title, type])
}

export const siteUrl = SITE_URL
