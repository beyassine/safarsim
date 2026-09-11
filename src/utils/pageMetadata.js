// Restore previous head values when leaving a dedicated landing page.
export function applyPageMetadata({ title, description, path, image }) {
  const previousTitle = document.title
  const restore = []
  const site = 'https://safarsim.net'
  const unprefixedPath = path.replace(/^\/(fr|ar)(?=\/)/, '')
  function setTag(tag, selector, attributes) {
    let node = document.head.querySelector(selector)
    const previous = node ? [...node.attributes].map(({ name, value }) => [name, value]) : null
    if (!node) {
      node = document.createElement(tag)
      document.head.appendChild(node)
    }
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value))
    restore.push(() => {
      if (!previous) return node.remove()
      for (const { name } of [...node.attributes]) node.removeAttribute(name)
      previous.forEach(([key, value]) => node.setAttribute(key, value))
    })
  }
  document.title = title
  setTag('meta', 'meta[name="description"]', { name: 'description', content: description })
  setTag('link', 'link[rel="canonical"]', { rel: 'canonical', href: `${site}${path}` })
  for (const lang of ['en', 'fr', 'ar', 'x-default']) {
    setTag('link', `link[rel="alternate"][hreflang="${lang}"]`, {
      rel: 'alternate', hreflang: lang,
      href: `${site}${lang === 'fr' || lang === 'ar' ? `/${lang}` : ''}${unprefixedPath}`,
    })
  }
  for (const [property, content] of Object.entries({ 'og:title': title, 'og:description': description, 'og:url': `${site}${path}`, 'og:type': 'website', 'og:image': new URL(image, site).href })) {
    setTag('meta', `meta[property="${property}"]`, { property, content })
  }
  return () => {
    restore.reverse().forEach((undo) => undo())
    document.title = previousTitle
  }
}
