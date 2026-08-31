const fs = require("fs")
const path = require("path")

const projectRoot = path.resolve(__dirname, "..")
const publicDirectory = path.join(projectRoot, "public")
const siteUrl = String(process.env.SITE_URL || process.env.VUE_APP_SITE_URL || "https://safarsim.net")
  .trim()
  .replace(/\/$/, "")

const locales = ["en", "fr", "ar"]
const destinations = require(path.join(projectRoot, "src/data/destinations.json"))
const regions = require(path.join(projectRoot, "src/data/regions.json"))

const localizedPublicPages = {
  compatibility: { en: "/compatibility", fr: "/compatibilite", ar: "/التوافق" },
  help: { en: "/help", fr: "/aide", ar: "/المساعدة" },
  pricing: { en: "/pricing", fr: "/tarifs", ar: "/الأسعار" },
  privacyPolicy: {
    en: "/privacy-policy",
    fr: "/politique-de-confidentialite",
    ar: "/سياسة-الخصوصية",
  },
  refundPolicy: {
    en: "/refund-policy",
    fr: "/politique-de-remboursement",
    ar: "/سياسة-الاسترداد",
  },
  termsOfService: {
    en: "/terms-of-service",
    fr: "/conditions-utilisation",
    ar: "/شروط-الخدمة",
  },
  digitalDeliveryPolicy: {
    en: "/digital-delivery-policy",
    fr: "/politique-de-livraison-numerique",
    ar: "/سياسة-التسليم-الرقمي",
  },
  contact: { en: "/contact", fr: "/contact", ar: "/اتصل-بنا" },
  about: { en: "/about", fr: "/a-propos", ar: "/من-نحن" },
}

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

function add(pathname, record) {
  if (!pathname || /(^|\/)(cart|checkout|admin|account|auth)(\/|$)/i.test(pathname)) return
  if (/payment-success|paiement-reussi|نجاح-الدفع/i.test(pathname)) return

  const url = new URL(encodeURI(pathname), `${siteUrl}/`).toString()
  entries.set(url, { url, lastmod: actualLastmod(record) })
}

for (const locale of locales) {
  add(localizedPath(locale, "/"))
  add(localizedPath(locale, "/destinations"))

  for (const destination of destinations) {
    add(localizedPath(locale, `/destinations/${destination.slug}`), destination)
  }

  for (const region of regions) {
    add(localizedPath(locale, `/regions/${region.slug}`), region)
  }
}

for (const paths of Object.values(localizedPublicPages)) {
  for (const locale of locales) add(localizedPath(locale, paths[locale]))
}

// Guides are included automatically when the project adds src/data/guides.json.
// A guide may define `slug`, localized `slugs`, or fully localized `paths`.
const guidesFile = path.join(projectRoot, "src/data/guides.json")
if (fs.existsSync(guidesFile)) {
  const guides = JSON.parse(fs.readFileSync(guidesFile, "utf8"))
  for (const guide of guides) {
    for (const locale of locales) {
      const pathname = guide.paths?.[locale] || `/guides/${guide.slugs?.[locale] || guide.slug}`
      add(localizedPath(locale, pathname), guide)
    }
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
  .map(({ url, lastmod }) => [
    "  <url>",
    `    <loc>${escapeXml(url)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
    "  </url>",
  ].filter(Boolean).join("\n"))
  .join("\n")

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

fs.mkdirSync(publicDirectory, { recursive: true })
fs.writeFileSync(path.join(publicDirectory, "sitemap.xml"), sitemap)
console.log(`Generated sitemap.xml with ${entries.size} public URLs for ${siteUrl}`)
