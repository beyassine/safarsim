import { createI18n } from "vue-i18n"
import fr from "./fr.json"
import en from "./en.json"
import ar from "./ar.json"

const ARABIC_COUNTRIES = new Set([
  "AE", "BH", "DJ", "DZ", "EG", "IQ", "JO", "KM", "KW", "LB", "LY",
  "MA", "MR", "OM", "PS", "QA", "SA", "SD", "SO", "SY", "TN", "YE"
])

function getBrowserLocales() {
  if (typeof navigator === "undefined") return []
  return [...(navigator.languages || []), navigator.language].filter(Boolean)
}

function getLocaleCountry(locale) {
  try {
    return new Intl.Locale(locale).region || ""
  } catch (error) {
    return String(locale).match(/[-_]([A-Za-z]{2})(?:[-_]|$)/)?.[1]?.toUpperCase() || ""
  }
}

export function getDefaultLanguage() {
  const locales = getBrowserLocales()
  const isArabicMarket = locales.some((locale) => {
    const language = String(locale).split(/[-_]/)[0].toLowerCase()
    return language === "ar" || ARABIC_COUNTRIES.has(getLocaleCountry(locale))
  })

  if (isArabicMarket) return "ar"
  if (locales.some((locale) => String(locale).toLowerCase().startsWith("fr"))) return "fr"
  return "en"
}

const i18n = createI18n({
  legacy: true,
  locale: localStorage.getItem("lang") || getDefaultLanguage(),
  fallbackLocale: "en",
  messages: {
    fr,
    en,
    ar
  }
})

export function applyLanguage(lang) {
  const isRtl = lang === "ar"

  i18n.global.locale = lang
  localStorage.setItem("lang", lang)
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr")
  document.documentElement.setAttribute("lang", lang)

  if (document.body) {
    document.body.setAttribute("dir", isRtl ? "rtl" : "ltr")
  }

  window.dispatchEvent(new CustomEvent("language-changed", { detail: lang }))
}

export default i18n
