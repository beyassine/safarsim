import i18n from "@/i18n"

export function getCurrentLocale() {
  return String(i18n.global.locale || "en").split("-")[0]
}

export function getLocalizedName(item, locale = getCurrentLocale()) {
  const lang = String(locale || "en").split("-")[0]

  if (lang === "nl" && !item?.names?.nl) {
    const iso = item?.iso
    if (/^[A-Za-z]{2}$/.test(iso || "")) {
      return new Intl.DisplayNames(["nl"], { type: "region" }).of(iso.toUpperCase())
    }
    const regions = { afrique: "Afrika", ameriques: "Amerika", asie: "Azië", caraibes: "Caribisch gebied", "amerique-centrale-et-mexique": "Midden-Amerika en Mexico", "moyen-orient-et-afrique-du-nord": "Midden-Oosten en Noord-Afrika", "amerique-du-nord": "Noord-Amerika", europe: "Europa", asia: "Azië", africa: "Afrika", "north-america": "Noord-Amerika", "south-america": "Zuid-Amerika", "latin-america": "Latijns-Amerika", "middle-east": "Midden-Oosten", caribbean: "Caribisch gebied", oceania: "Oceanië", global: "Wereldwijd" }
    if (regions[item?.slug]) return regions[item.slug]
  }
  return item?.names?.[lang] || item?.names?.fr || item?.name || ""
}

export function getLocalizedSearchValues(item) {
  return [
    item?.name,
    item?.names?.fr,
    item?.names?.en,
    item?.names?.ar,
    getLocalizedName(item, "nl"),
    item?.region,
    item?.iso,
  ].filter(Boolean)
}
