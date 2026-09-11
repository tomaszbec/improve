import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const dist = join(root, 'dist')
const origin = 'https://improveit.pl'
const updated = new Date().toISOString().slice(0, 10)
const [shell, pl, en, seoPl, seoEn] = await Promise.all([
  readFile(join(dist, 'index.html'), 'utf8'),
  readFile(join(root, 'src/locales/pl.json'), 'utf8').then(JSON.parse),
  readFile(join(root, 'src/locales/en.json'), 'utf8').then(JSON.parse),
  readFile(join(root, 'public/content/seo-pages.pl.json'), 'utf8').then(JSON.parse),
  readFile(join(root, 'public/content/seo-pages.json'), 'utf8').then(JSON.parse),
])

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const clean = (value) => value === '/' ? '/' : `/${value.replace(/^\/+|\/+$/g, '')}`
const localizedPath = (route, locale) => locale === 'en' ? `/en${clean(route) === '/' ? '' : clean(route)}` : clean(route)
const href = (route, locale) => localizedPath(route, locale)
const list = (values = []) => values.length ? `<ul>${values.map((value) => `<li>${esc(value)}</li>`).join('')}</ul>` : ''
const faqHtml = (faqs = []) => faqs.length ? `<section><h2>FAQ</h2>${faqs.map((faq) => `<details><summary>${esc(faq.question)}</summary><p>${esc(faq.answer)}</p></details>`).join('')}</section>` : ''
const faqSchema = (faqs = []) => faqs.length ? { '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) } : null

const labels = {
  pl: { nav: 'Główna nawigacja', services: 'Usługi', about: 'O nas', portfolio: 'Portfolio', blog: 'Blog', contact: 'Kontakt', technologies: 'Technologie', capabilities: 'Zakres', stack: 'Technologie i narzędzia', challenge: 'Wyzwanie', solution: 'Rozwiązanie', features: 'Najważniejsze funkcje', brief: 'W skrócie', ai: 'Transformacja AI dla firm', updated: 'Ostatnia aktualizacja' },
  en: { nav: 'Main navigation', services: 'Services', about: 'About', portfolio: 'Portfolio', blog: 'Blog', contact: 'Contact', technologies: 'Technologies', capabilities: 'Scope', stack: 'Technology and tools', challenge: 'Challenge', solution: 'Solution', features: 'Key features', brief: 'In brief', ai: 'AI transformation for companies', updated: 'Last updated' },
}

const generated = new Map()

function schemaFor({ route, locale, title, description, faqs = [], type = 'WebPage' }) {
  const actual = `${origin}${localizedPath(route, locale)}`
  const graph = [{ '@type': type, '@id': `${actual}#webpage`, name: title, description, url: actual, inLanguage: locale === 'pl' ? 'pl-PL' : 'en-US', isPartOf: { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'improveIT.pl', url: origin } }]
  const faq = faqSchema(faqs)
  if (faq) graph.push(faq)
  return { '@context': 'https://schema.org', '@graph': graph }
}

function documentFor({ route, locale, title, description, body, image = '/images/ai-dev.png', faqs = [], type }) {
  const actualPath = localizedPath(route, locale)
  const canonical = `${origin}${actualPath}`
  const alternatePl = `${origin}${localizedPath(route, 'pl')}`
  const alternateEn = `${origin}${localizedPath(route, 'en')}`
  const l = labels[locale]
  const nav = `<nav class="ssr-nav" aria-label="${l.nav}"><a href="${href('/', locale)}">improve<span>IT</span>.pl</a><div><a href="${href('/services', locale)}">${l.services}</a><a href="${href('/', locale)}#about">${l.about}</a><a href="${href('/', locale)}#portfolio">${l.portfolio}</a><a href="${href('/blog', locale)}">${l.blog}</a><a href="${href('/contact', locale)}">${l.contact}</a></div></nav>`
  const footer = `<footer class="ssr-footer"><strong>improveIT.pl</strong><p>${locale === 'pl' ? 'Software development, wdrożenia AI, audyty, optymalizacja i support.' : 'Software development, AI delivery, audits, optimization, and support.'}</p><a href="mailto:contact@improveit.pl">contact@improveit.pl</a></footer>`
  const jsonLd = JSON.stringify(schemaFor({ route, locale, title, description, faqs, type })).replace(/</g, '\\u003c')
  return shell
    .replace(/<html lang="[^"]*">/, `<html lang="${locale}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)} | improveIT.pl</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/>/g, '')
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:locale" content="[^"]*"\s*\/>/, `<meta property="og:locale" content="${locale === 'pl' ? 'pl_PL' : 'en_US'}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${origin}${image}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(description)}" />`)
    .replace('</head>', `<link rel="alternate" hreflang="pl" href="${alternatePl}" /><link rel="alternate" hreflang="en" href="${alternateEn}" /><link rel="alternate" hreflang="x-default" href="${alternatePl}" /><script type="application/ld+json" data-prerender-schema="true">${jsonLd}</script></head>`)
    .replace('<div id="root"></div>', `<div id="root">${nav}<main class="ssr-content">${body}</main>${footer}</div>`)
}

async function emit(route, locale, title, description, body, options = {}) {
  const actual = localizedPath(route, locale)
  const target = actual === '/' ? join(dist, 'index.html') : join(dist, actual.slice(1), 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, documentFor({ route, locale, title, description, body, image: options.image, faqs: options.faqs, type: options.type }), 'utf8')
  generated.set(actual, { path: actual, priority: options.priority || '0.7' })
}

const services = {
  'custom-software-development': 'software', 'ai-transformation': 'aiTransformation', 'software-modernization': 'modernization',
  'application-support': 'support', 'systems-integration': 'integrations', 'technology-audit': 'audit', 'devops-cloud': 'devops',
  'ai-agents': 'agents', 'llm-semantic-search': 'llm', 'process-automation': 'automation', 'web-applications': 'web', 'mobile-apps': 'mobile', 'ai-infrastructure': 'infra',
}
const projects = { 'internet-analysis': 'internetAnalysis', 'seo-agent': 'seoAgent', 'kids-radar': 'kidsRadar', 'maluch-czyta': 'maluchCzyta', athropy: 'athropy', 'autonomous-ai-engineer': 'engineer', 'ai-travel-agent': 'travel', 'predictive-finance-analytics': 'finance', 'ai-medical-imaging': 'medical' }
const technologies = { 'go-development':'go','python-development':'python','node-development':'node','php-development':'php','react-development':'react','vue-development':'vue','angular-development':'angular','next-js-development':'next','typescript-development':'typescript','dotnet-development':'dotnet','java-development':'java','flutter-development':'flutter','react-native-development':'reactnative','swift-development':'swift','kotlin-development':'kotlin','postgresql-development':'postgres','mongodb-development':'mongo','redis-development':'redis','docker-development':'docker','kubernetes-development':'k8s','aws-development':'aws','azure-development':'azure','graphql-development':'graphql','tensorflow-development':'tensorflow','figma-development':'figma' }
const staticPosts = [
  { slug:'przyszlosc-agentow-ai-w-biznesie', key:'post1', date:'2024-03-15', pl:'Systemy agentowe potrafią planować i wykonywać wieloetapowe zadania biznesowe.', en:'Agentic systems can plan and execute multi-step business tasks.' },
  { slug:'optymalizacja-llm-z-wykorzystaniem-rag', key:'post2', date:'2024-03-10', pl:'RAG łączy modele językowe z wiedzą organizacji i wskazuje źródła odpowiedzi.', en:'RAG connects language models with organizational knowledge and answer sources.' },
]

async function generateLocale(copy, seo, locale) {
  const l = labels[locale]
  const serviceCards = Object.entries(services).map(([slug, key]) => { const item = copy.services.items[key]; return `<article class="seo-card"><h2><a href="${href(`/services/${slug}`, locale)}">${esc(item.title)}</a></h2><p>${esc(item.description)}</p></article>` }).join('')
  const homeDescription = copy.home_seo.description
  await emit('/', locale, copy.home_seo.title, homeDescription, `<header class="ssr-hero"><p class="seo-eyebrow">improveIT.pl</p><h1>${esc(copy.hero.title_start)} <span>${esc(copy.hero.title_gradient)}</span></h1><p>${esc(homeDescription)}</p><a class="btn btn--primary" href="${href('/contact', locale)}">${esc(copy.hero.cta_talk)}</a></header><section><h2>${esc(copy.services.title)}</h2><p>${esc(copy.services.description)}</p><div class="seo-card-grid">${serviceCards}</div></section>`, { priority: '1.0' })
  await emit('/services', locale, copy.services.title, copy.services.description, `<header><h1>${esc(copy.services.title)}</h1><p>${esc(copy.services.description)}</p></header><div class="seo-card-grid">${serviceCards}</div>`, { priority: '0.9' })
  await emit('/contact', locale, copy.contact.title, copy.contact.description, `<header><h1>${esc(copy.contact.title)}</h1><p>${esc(copy.contact.description)}</p></header><section><h2>${l.contact}</h2><p><a href="mailto:contact@improveit.pl">contact@improveit.pl</a></p><p><a href="tel:+48886555201">+48 886 555 201</a></p></section>`, { priority: '0.8' })
  const roles = Object.values(copy.carriers.roles).map((role) => `<article class="seo-card"><h2>${esc(role.title)}</h2><p>${esc(role.description)}</p></article>`).join('')
  await emit('/carriers', locale, copy.carriers.seo_title, copy.carriers.seo_description, `<header><p class="seo-eyebrow">${esc(copy.carriers.eyebrow)}</p><h1>${esc(copy.carriers.title_start)} <span>${esc(copy.carriers.title_accent)}</span></h1><p>${esc(copy.carriers.intro)}</p></header><section><h2>${esc(copy.carriers.roles_title)}</h2><div class="seo-card-grid">${roles}</div></section>`, { image: '/images/carriers-hero.png' })

  for (const [slug, key] of Object.entries(services)) {
    if (slug === 'ai-transformation') continue
    const item = copy.services.items[key]
    const title = item.seo_title || item.title
    const description = item.seo_description || item.full_text || item.description
    await emit(`/services/${slug}`, locale, title, description, `<header><p class="seo-eyebrow">${l.services}</p><h1>${esc(item.title)}</h1><p>${esc(item.full_text || item.description)}</p></header><section><h2>${l.capabilities}</h2>${list(item.features)}</section><section><h2>${l.stack}</h2>${list(item.tech)}</section>${faqHtml(copy.service_page.faqs)}`, { priority: '0.8', faqs: copy.service_page.faqs, type: 'Service' })
  }

  const family = {
    ecommerce: { slug: 'ecommerce', source: copy.ai_transformation }, customerService: { slug: 'customer-service', source: copy.ai_service_pages.customerService },
    sales: { slug: 'sales', source: copy.ai_service_pages.sales }, operations: { slug: 'operations', source: copy.ai_service_pages.operations },
    knowledge: { slug: 'knowledge', source: copy.ai_service_pages.knowledge }, softwareDevelopment: { slug: 'software-development', source: copy.ai_service_pages.softwareDevelopment }, aiGuard: { slug: 'ai-guard', source: copy.ai_service_pages.aiGuard },
  }
  const aiCards = Object.entries(family).map(([key, item]) => { const summary = copy.ai_services.items[key]; return `<article class="seo-card"><h2><a href="${href(`/services/ai-transformation/${item.slug}`, locale)}">${esc(summary.title)}</a></h2><p>${esc(summary.description)}</p>${list(summary.bullets)}</article>` }).join('')
  await emit('/services/ai-transformation', locale, copy.ai_services.seo.title, copy.ai_services.seo.description, `<header><p class="seo-eyebrow">${esc(copy.ai_services.hero.badge)}</p><h1>${esc(copy.ai_services.hero.title_start)} ${esc(copy.ai_services.hero.title_accent)}</h1><p>${esc(copy.ai_services.hero.description)}</p></header><section><h2>${esc(copy.ai_services.catalog.title)}</h2><div class="seo-card-grid">${aiCards}</div></section><section><h2>${esc(copy.ai_services.model.title)}</h2>${list(copy.ai_services.model.steps)}<p>${esc(copy.ai_services.model.note)}</p></section>${faqHtml(copy.ai_services.faqs)}`, { priority: '0.9', faqs: copy.ai_services.faqs, type: 'Service' })
  const ecommerce = copy.ai_transformation
  await emit('/services/ai-transformation/ecommerce', locale, ecommerce.seo.title, ecommerce.seo.description, `<header><p class="seo-eyebrow">${esc(ecommerce.hero.badge)}</p><h1>E-commerce → AI</h1><p>${esc(ecommerce.hero.title)}</p><p>${esc(ecommerce.hero.description)}</p>${list(ecommerce.hero.points)}</header><section><h2>${esc(ecommerce.opportunities.title)}</h2>${ecommerce.opportunities.items.map((item) => `<article><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></article>`).join('')}</section><section><h2>${esc(ecommerce.process.title)}</h2>${ecommerce.process.steps.map((step) => `<article><h3>${esc(step.title)}</h3><p>${esc(step.text)}</p></article>`).join('')}</section>${faqHtml(copy.ai_services.faqs)}`, { priority: '0.8', faqs: copy.ai_services.faqs, type: 'Service' })
  for (const [key, item] of Object.entries(family)) {
    if (key === 'ecommerce') continue
    const page = item.source
    await emit(`/services/ai-transformation/${item.slug}`, locale, page.title, page.seoDescription, `<header><p class="seo-eyebrow">${l.ai}</p><h1>${esc(page.headline)}</h1><p>${esc(page.description)}</p>${list(page.bullets)}</header><section><h2>${esc(page.capabilitiesTitle)}</h2>${page.capabilities.map((capability) => `<article><h3>${esc(capability.title)}</h3><p>${esc(capability.text)}</p></article>`).join('')}</section><section><h2>${esc(page.outcomeTitle)}</h2><p>${esc(page.outcomeText)}</p></section>${faqHtml(copy.ai_services.faqs)}`, { priority: '0.8', faqs: copy.ai_services.faqs, type: 'Service' })
  }

  for (const [slug, key] of Object.entries(projects)) {
    const item = copy.portfolio.items[key]
    if (!item) continue
    await emit(`/portfolio/${slug}`, locale, item.title, item.full_text || item.description, `<header><p class="seo-eyebrow">${l.portfolio}</p><h1>${esc(item.title)}</h1><p>${esc(item.full_text || item.description)}</p></header><section><h2>${l.challenge}</h2><p>${esc(item.challenge)}</p><h2>${l.solution}</h2><p>${esc(item.solution)}</p></section><section><h2>${l.features}</h2>${list(item.features)}</section>`, { priority: '0.7' })
  }
  for (const [slug, key] of Object.entries(technologies)) {
    const item = copy.tech?.items?.[key]
    if (!item) continue
    const title = item.seo_title || item.title
    const description = item.seo_description || item.full_text || item.description
    await emit(`/technologies/${slug}`, locale, title, description, `<header><p class="seo-eyebrow">${l.technologies}</p><h1>${esc(item.title)}</h1><p>${esc(item.full_text || item.description)}</p></header><section><h2>${l.capabilities}</h2>${list(item.features)}</section><section><h2>${l.stack}</h2>${list(item.tech)}</section>${faqHtml(copy.technology_page.faqs)}<p>${l.updated}: 2026-09-11</p>`, { priority: '0.7', faqs: copy.technology_page.faqs, type: 'Service' })
  }

  const posts = staticPosts.map((post) => `<article class="seo-card"><time>${post.date}</time><h2><a href="${href(`/blog/${post.slug}`, locale)}">${esc(copy.blog[post.key].title)}</a></h2><p>${esc(copy.blog[post.key].excerpt)}</p></article>`).join('')
  await emit('/blog', locale, `${copy.blog.title_start}${copy.blog.gradient}`, copy.blog.description, `<header><h1>${esc(copy.blog.title_start)}${esc(copy.blog.gradient)}</h1><p>${esc(copy.blog.description)}</p></header><div class="seo-card-grid">${posts}</div>`, { priority: '0.8' })
  for (const post of staticPosts) {
    const title = copy.blog[post.key].full_title || copy.blog[post.key].title
    await emit(`/blog/${post.slug}`, locale, title, copy.blog[post.key].excerpt, `<article><a href="${href('/blog', locale)}">← ${l.blog}</a><h1>${esc(title)}</h1><time>${post.date}</time><p>${esc(post[locale])}</p></article>`, { priority: '0.6' })
  }
  for (const page of seo.pages) {
    const sections = page.sections.map((section) => `<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p>${list(section.bullets)}</section>`).join('')
    await emit(page.path, locale, page.title, page.description, `<header><p class="seo-eyebrow">${esc(page.cluster)}</p><h1>${esc(page.title)}</h1><p>${esc(page.subtitle)}</p><p>${esc(page.description)}</p></header><section class="seo-answer"><strong>${l.brief}</strong><p>${esc(page.directAnswer)}</p></section>${sections}${faqHtml(page.faqs)}`, { image: page.image, priority: page.kind === 'hub' ? '0.9' : '0.8', faqs: page.faqs })
  }
}

await generateLocale(pl, seoPl, 'pl')
await generateLocale(en, seoEn, 'en')

const routes = [...generated.values()]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${origin}${route.path}</loc><lastmod>${updated}</lastmod><priority>${route.priority}</priority></url>`).join('\n')}\n</urlset>\n`
await writeFile(join(dist, 'sitemap.xml'), sitemap)
console.log(`Prerendered ${routes.length} unique routes and generated sitemap.xml`)
