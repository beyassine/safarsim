import { createI18n } from "vue-i18n"
import fr from "./fr.json"
import en from "./en.json"
import ar from "./ar.json"

const i18n = createI18n({
  legacy: true,
  locale: localStorage.getItem("lang") || "en",
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
}

export default i18n
