import { createI18n } from "vue-i18n"
import fr from "./fr.json"
import ar from "./ar.json"

const i18n = createI18n({
  legacy: true,
  locale: "fr",
  fallbackLocale: "fr",
  messages: {
    fr,
    ar
  }
})

export function applyLanguage(lang) {
  i18n.global.locale = lang
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr")
  document.documentElement.setAttribute("lang", lang)
}

export default i18n