import { createRouter, createWebHistory } from "vue-router"

import Destination from "../pages/Destination.vue"
import allDestinations from "../pages/allDestinations.vue"
import Region from "../pages/Region.vue"
import Cart from "../pages/Cart.vue"
import Home from "@/pages/Home.vue"
import i18n, { applyLanguage, getDefaultLanguage, getPreferredLanguage } from "@/i18n"

export const SUPPORTED_LOCALES = ["fr", "en", "ar"]
const PREFIXED_LOCALES = SUPPORTED_LOCALES.filter((locale) => locale !== "en")
const LOCALE_PATTERN = PREFIXED_LOCALES.join("|")

// Destination, region, home and cart URLs intentionally keep shared slugs.
// The remaining public pages use a canonical slug for each language.
export const LOCALIZED_ROUTE_PATHS = {
  PaymentSuccess: {
    fr: "/paiement-reussi",
    en: "/payment-success",
    ar: "/نجاح-الدفع",
  },
  compatibility: {
    fr: "/compatibilite",
    en: "/compatibility",
    ar: "/التوافق",
  },
  help: { fr: "/aide", en: "/help", ar: "/المساعدة" },
  pricing: { fr: "/tarifs", en: "/pricing", ar: "/الأسعار" },
  privacyPolicy: {
    fr: "/politique-de-confidentialite",
    en: "/privacy-policy",
    ar: "/سياسة-الخصوصية",
  },
  refundPolicy: {
    fr: "/politique-de-remboursement",
    en: "/refund-policy",
    ar: "/سياسة-الاسترداد",
  },
  termsOfService: {
    fr: "/conditions-utilisation",
    en: "/terms-of-service",
    ar: "/شروط-الخدمة",
  },
  digitalDeliveryPolicy: {
    fr: "/politique-de-livraison-numerique",
    en: "/digital-delivery-policy",
    ar: "/سياسة-التسليم-الرقمي",
  },
  contact: { fr: "/contact", en: "/contact", ar: "/اتصل-بنا" },
  about: { fr: "/a-propos", en: "/about", ar: "/من-نحن" },
}

const LOCALIZED_COMPONENTS = {
  PaymentSuccess: {
    fr: () => import("@/pages/fr/PaymentSuccess.vue"),
    en: () => import("@/pages/en/PaymentSuccess.vue"),
    ar: () => import("@/pages/ar/PaymentSuccess.vue"),
  },
  compatibility: {
    fr: () => import("@/pages/fr/Compatibility.vue"),
    en: () => import("@/pages/en/Compatibility.vue"),
    ar: () => import("@/pages/ar/Compatibility.vue"),
  },
  help: {
    fr: () => import("@/pages/fr/Help.vue"),
    en: () => import("@/pages/en/Help.vue"),
    ar: () => import("@/pages/ar/Help.vue"),
  },
  pricing: {
    fr: () => import("@/pages/fr/Pricing.vue"),
    en: () => import("@/pages/en/Pricing.vue"),
    ar: () => import("@/pages/ar/Pricing.vue"),
  },
  privacyPolicy: {
    fr: () => import("@/pages/fr/PrivacyPolicy.vue"),
    en: () => import("@/pages/en/PrivacyPolicy.vue"),
    ar: () => import("@/pages/ar/PrivacyPolicy.vue"),
  },
  refundPolicy: {
    fr: () => import("@/pages/fr/RefundPolicy.vue"),
    en: () => import("@/pages/en/RefundPolicy.vue"),
    ar: () => import("@/pages/ar/RefundPolicy.vue"),
  },
  termsOfService: {
    fr: () => import("@/pages/fr/TermsOfService.vue"),
    en: () => import("@/pages/en/TermsOfService.vue"),
    ar: () => import("@/pages/ar/TermsOfService.vue"),
  },
  digitalDeliveryPolicy: {
    fr: () => import("@/pages/fr/DigitalDeliveryPolicy.vue"),
    en: () => import("@/pages/en/DigitalDeliveryPolicy.vue"),
    ar: () => import("@/pages/ar/DigitalDeliveryPolicy.vue"),
  },
  contact: {
    fr: () => import("@/pages/fr/Contact.vue"),
    en: () => import("@/pages/en/Contact.vue"),
    ar: () => import("@/pages/ar/Contact.vue"),
  },
  about: {
    fr: () => import("@/pages/fr/About.vue"),
    en: () => import("@/pages/en/About.vue"),
    ar: () => import("@/pages/ar/About.vue"),
  },
}

const pageRoutes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/one",
    name: "onePage",
    redirect: (to) => ({ name: "Home", params: { lang: to.params.lang } }),
  },
  {
    path: "/esim",
    name: "allDestinations",
    component: allDestinations
  },
  {
    path: "/esim/:slug",
    name: "destinationDetails",
    component: Destination
  },
  {
    path: "/regions/:slug",
    name: "regionDetails",
    component: Region
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart
  },
  {
    path: "/payment-success",
    name: "PaymentSuccess",
    component: LOCALIZED_COMPONENTS.PaymentSuccess.en,
  },
  {
    path: "/compatibility",
    name: "compatibility",
    component: LOCALIZED_COMPONENTS.compatibility.en,
  },
  {
    path: "/help",
    name: "help",
    component: LOCALIZED_COMPONENTS.help.en,
  },
  {
    path: "/pricing",
    name: "pricing",
    component: LOCALIZED_COMPONENTS.pricing.en,
  },
  {
    path: "/privacy-policy",
    name: "privacyPolicy",
    component: LOCALIZED_COMPONENTS.privacyPolicy.en,
  },
  {
    path: "/refund-policy",
    name: "refundPolicy",
    component: LOCALIZED_COMPONENTS.refundPolicy.en,
  },
  {
    path: "/terms-of-service",
    name: "termsOfService",
    component: LOCALIZED_COMPONENTS.termsOfService.en,
  },
  {
    path: "/digital-delivery-policy",
    name: "digitalDeliveryPolicy",
    component: LOCALIZED_COMPONENTS.digitalDeliveryPolicy.en,
  },
  {
    path: "/contact",
    name: "contact",
    component: LOCALIZED_COMPONENTS.contact.en,
  },
  {
    path: "/about",
    name: "about",
    component: LOCALIZED_COMPONENTS.about.en,
  },
]

const routes = pageRoutes.flatMap((route) => {
  const localizedPaths = LOCALIZED_ROUTE_PATHS[route.name]

  if (localizedPaths) {
    return SUPPORTED_LOCALES.map((lang) => ({
      ...route,
      name: `${route.name}-${lang}`,
      path: lang === "en"
        ? localizedPaths.en
        : `/${lang}${localizedPaths[lang]}`,
      component: LOCALIZED_COMPONENTS[route.name][lang],
      meta: { ...route.meta, locale: lang, routeKey: route.name },
    }))
  }

  return [{
    ...route,
    path: route.path === "/"
      ? `/:lang(${LOCALE_PATTERN})?`
      : `/:lang(${LOCALE_PATTERN})?${route.path}`,
  }]
})

routes.push(
  {
    path: `/:lang(${LOCALE_PATTERN})?/destinations`,
    redirect: (to) => `${to.params.lang ? `/${to.params.lang}` : ""}/esim`,
  },
  {
    path: `/:lang(${LOCALE_PATTERN})?/destinations/:slug`,
    redirect: (to) => `${to.params.lang ? `/${to.params.lang}` : ""}/esim/${to.params.slug}`,
  },
)

export function localePath(route, lang) {
  const fullPath = route.fullPath || route.path || "/"
  const suffixIndex = fullPath.search(/[?#]/)
  const path = suffixIndex === -1 ? fullPath : fullPath.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? "" : fullPath.slice(suffixIndex)
  const unprefixedPath = path.replace(/^\/(fr|en|ar)(?=\/|$)/, "") || "/"
  const routeKey = route.meta?.routeKey || Object.entries(LOCALIZED_ROUTE_PATHS)
    .find(([, paths]) => Object.values(paths).includes(unprefixedPath))?.[0] ||
    pageRoutes.find((candidate) => candidate.path === unprefixedPath)?.name
  const canonicalPath = LOCALIZED_ROUTE_PATHS[routeKey]?.[lang] || unprefixedPath
  const localePrefix = lang === "en" ? "" : `/${lang}`
  const localizedPath = `${localePrefix}${canonicalPath === "/" ? "/" : canonicalPath}${suffix}`

  return localizedPath
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 72,
        behavior: "smooth",
      }
    }

    return { top: 0 }
  }
})

router.beforeEach((to, from) => {
  const firstSegment = to.path.split("/")[1]
  const fromFirstSegment = from.path.split("/")[1]
  const fromLanguage = from.params.lang ||
    (SUPPORTED_LOCALES.includes(fromFirstSegment) ? fromFirstSegment : "en")
  const requestedLanguage = typeof sessionStorage === "undefined"
    ? ""
    : sessionStorage.getItem("safarsim-language-navigation") || ""

  if (requestedLanguage && typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem("safarsim-language-navigation")
  }

  // Shared components may still use canonical, unprefixed paths. When the
  // visitor is browsing French or Arabic, keep that locale for every internal
  // navigation unless this navigation came from the language selector itself.
  if (!requestedLanguage && from.name && fromLanguage !== "en" &&
      !SUPPORTED_LOCALES.includes(firstSegment)) {
    return localePath(to, fromLanguage)
  }

  if (to.path === "/" && !to.params.lang) {
    const preferredLanguage = requestedLanguage || getPreferredLanguage() || getDefaultLanguage()
    if (preferredLanguage !== "en") return localePath(to, preferredLanguage)
  }
  const lang = to.params.lang || (SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : "en")

  const canonicalPath = localePath(to, lang)
  if (canonicalPath !== to.fullPath) return canonicalPath

  if (i18n.global.locale !== lang) applyLanguage(lang)
})

export default router
