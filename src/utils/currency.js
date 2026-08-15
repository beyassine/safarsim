export const USD_CURRENCY = 'USD'
export const MAD_CURRENCY = 'MAD'

const configuredRate = Number(process.env.VUE_APP_MAD_TO_USD_RATE)
export const MAD_TO_USD_RATE = Number.isFinite(configuredRate) && configuredRate > 0
  ? configuredRate
  : 0.108

export function madToUsd(amount) {
  return Number((Number(amount) * MAD_TO_USD_RATE).toFixed(2))
}

function getLocaleCountry(locale) {
  try {
    return new Intl.Locale(locale).region || ''
  } catch (error) {
    return String(locale).match(/[-_]([A-Za-z]{2})(?:[-_]|$)/)?.[1]?.toUpperCase() || ''
  }
}

export function getVisitorCountry() {
  const configuredCountry = String(process.env.VUE_APP_DEFAULT_COUNTRY || '').toUpperCase()
  if (configuredCountry) return configuredCountry
  if (typeof navigator === 'undefined') return ''

  const locales = [...(navigator.languages || []), navigator.language].filter(Boolean)
  const country = locales.map(getLocaleCountry).find(Boolean)
  if (country) return country

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Africa/Casablanca' ? 'MA' : ''
  } catch (error) {
    return ''
  }
}

export function getPreferredCurrency() {
  return getVisitorCountry() === 'MA' ? MAD_CURRENCY : USD_CURRENCY
}

export function priceFromMad(amount) {
  return getPreferredCurrency() === MAD_CURRENCY ? Number(amount) : madToUsd(amount)
}

export function formatMoney(amount, currency = getPreferredCurrency(), locale = 'en') {
  const numberLocale = locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-MA' : 'en-US'
  return new Intl.NumberFormat(numberLocale, {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(Number(amount))
}

export function formatPriceFromMad(amount, locale = 'en') {
  return formatMoney(priceFromMad(amount), getPreferredCurrency(), locale)
}

export function formatUsd(amount, locale = 'en') {
  const numberLocale = locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US'
  return new Intl.NumberFormat(numberLocale, {
    style: 'currency',
    currency: USD_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}
