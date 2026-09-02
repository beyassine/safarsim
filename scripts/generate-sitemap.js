const fs = require("fs")
const path = require("path")
const { execFileSync } = require("child_process")

const projectRoot = path.resolve(__dirname, "..")
const publicDirectory = path.join(projectRoot, "public")
const siteUrl = String(process.env.SITE_URL || process.env.VUE_APP_SITE_URL || "https://safarsim.net")
  .trim()
  .replace(/\/$/, "")

const locales = ["en", "fr", "ar"]
const destinations = require(path.join(projectRoot, "src/data/destinations.json"))
const regions = require(path.join(projectRoot, "src/data/regions.json"))

function sourceLastmod(relativePath) {
  try {
    const value = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      { cwd: projectRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim()
    if (value) return new Date(value).toISOString()
  } catch (error) {
    // A source-controlled lastmod is required so deployments never fabricate dates.
  }

  throw new Error(`Cannot determine a stable sitemap lastmod for ${relativePath}`)
}

const sourceDates = {
  home: sourceLastmod("src/pages/Home.vue"),
  destinations: sourceLastmod("src/data/destinations.json"),
  regions: sourceLastmod("src/data/regions.json"),
  router: sourceLastmod("src/router/index.js"),
}

function destinationUrlSlug(destination) {
  if (destination?.iso === "TR" || destination?.slug === "turquie") {
    return "turkiye"
  }
  if (destination?.iso === "ES" || destination?.slug === "espagne") {
    return "spain"
  }
  if (destination?.slug === "republique-democratique-du-congo") {
    return "democratic-republic-of-the-congo"
  }
  return String(destination?.names?.en || destination?.name || destination?.slug || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const destinationSlugs = destinations.map(destinationUrlSlug)
if (destinationSlugs.some((slug) => !slug) || new Set(destinationSlugs).size !== destinationSlugs.length) {
  throw new Error("Destination English URL slugs must be present and unique")
}

const publicPagePaths = [
  "/guides/compatibility",
  "/help",
  "/pricing",
  "/privacy-policy",
  "/refund-policy",
  "/terms-of-service",
  "/digital-delivery-policy",
  "/contact",
  "/about",
  "/guides/install-esim-iphone",
  "/guides/install-esim-android",
]

const entries = new Map()
const localePrefix = (locale) => locale === "en" ? "" : `/${locale}`
const localizedPath = (locale, pathname) => `${localePrefix(locale)}${pathname === "/" ? "/" : pathname}`

function actualLastmod(record) {
  const value = record?.lastmod || record?.updatedAt || record?.updated_at || record?.modifiedAt || record?.modified_at
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid sitemap lastmod value: ${value}`)
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(String(value))
    ? String(value)
    : date.toISOString()
}

function add(pathname, record, fallbackLastmod = sourceDates.router) {
  if (!pathname || /(^|\/)(cart|checkout|admin|account|auth)(\/|$)/i.test(pathname)) return
  if (/payment-success|paiement-reussi|نجاح-الدفع/i.test(pathname)) return

  const url = new URL(encodeURI(pathname), `${siteUrl}/`).toString()
  entries.set(url, { url, lastmod: actualLastmod(record) || fallbackLastmod })
  return url
}

function addLocalized(paths, record, fallbackLastmod = sourceDates.router) {
  const alternates = Object.fromEntries(locales.map((locale) => [
    locale,
    new URL(encodeURI(localizedPath(locale, paths[locale])), `${siteUrl}/`).toString(),
  ]))

  for (const locale of locales) {
    const url = add(localizedPath(locale, paths[locale]), record, fallbackLastmod)
    if (url) entries.get(url).alternates = alternates
  }
}

addLocalized(Object.fromEntries(locales.map((locale) => [locale, "/"])), null, sourceDates.home)
addLocalized(Object.fromEntries(locales.map((locale) => [locale, "/esim"])), null, sourceDates.destinations)

for (const destination of destinations) {
  const pathname = `/esim/${destinationUrlSlug(destination)}`
  addLocalized(Object.fromEntries(locales.map((locale) => [locale, pathname])), destination, sourceDates.destinations)
}

for (const region of regions) {
  const pathname = `/esim/${region.slug}`
  addLocalized(Object.fromEntries(locales.map((locale) => [locale, pathname])), region, sourceDates.regions)
}

for (const pathname of publicPagePaths) {
  addLocalized(Object.fromEntries(locales.map((locale) => [locale, pathname])))
}

// Guides are included automatically when the project adds src/data/guides.json.
// A guide may define `slug`, localized `slugs`, or fully localized `paths`.
const guidesFile = path.join(projectRoot, "src/data/guides.json")
if (fs.existsSync(guidesFile)) {
  const guides = JSON.parse(fs.readFileSync(guidesFile, "utf8"))
  const guidesLastmod = sourceLastmod("src/data/guides.json")
  for (const guide of guides) {
    const paths = Object.fromEntries(locales.map((locale) => [
      locale,
      guide.paths?.[locale] || `/guides/${guide.slugs?.[locale] || guide.slug}`,
    ]))
    addLocalized(paths, guide, guidesLastmod)
  }
}

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;")

const urls = [...entries.values()]
  .sort((a, b) => a.url.localeCompare(b.url))
  .map(({ url, lastmod, alternates }) => [
    "  <url>",
    `    <loc>${escapeXml(url)}</loc>`,
    ...locales.map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(alternates[locale])}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(alternates.en)}" />`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
    "  </url>",
  ].filter(Boolean).join("\n"))
  .join("\n")

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

fs.mkdirSync(publicDirectory, { recursive: true })
fs.writeFileSync(path.join(publicDirectory, "sitemap.xml"), sitemap)
console.log(`Generated sitemap.xml with ${entries.size} public URLs for ${siteUrl}`)
