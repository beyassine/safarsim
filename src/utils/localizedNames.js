import i18n from "@/i18n"

export function getCurrentLocale() {
  return String(i18n.global.locale || "fr").split("-")[0]
}

export function getLocalizedName(item, locale = getCurrentLocale()) {
  const lang = String(locale || "fr").split("-")[0]

  return item?.names?.[lang] || item?.names?.fr || item?.name || ""
}

export function getLocalizedSearchValues(item) {
  return [
    item?.name,
    item?.names?.fr,
    item?.names?.en,
    item?.names?.ar,
    item?.region,
    item?.iso,
  ].filter(Boolean)
}
