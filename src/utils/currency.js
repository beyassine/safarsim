export const USD_CURRENCY = 'USD'
export const MAD_CURRENCY = 'MAD'
export const EUR_CURRENCY = 'EUR'

// European visitors use EUR, including European countries outside the eurozone.
const EUROPE_COUNTRIES = new Set('AD AL AT AX BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM UA VA XK'.split(' '))

// Product prices use the fixed conversion stored in the catalogue: USD = MAD / 10.
export const MAD_TO_USD_RATE = 0.1

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

  // Moroccan devices commonly use a fr-FR locale, so prefer their timezone.
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timeZone === 'Africa/Casablanca') return 'MA'
    if (timeZone.startsWith('Europe/')) return 'EU'
  } catch (error) {
    // Fall through to browser locale detection.
  }

  const locales = [...(navigator.languages || []), navigator.language].filter(Boolean)
  const country = locales.map(getLocaleCountry).find(Boolean)
  if (country) return country
  return ''
}

export function getPreferredCurrency() {
  const country = getVisitorCountry()
  if (country === 'MA') return MAD_CURRENCY
  if (country === 'EU' || EUROPE_COUNTRIES.has(country)) return EUR_CURRENCY
  return USD_CURRENCY
}

// EUR and USD deliberately share the same numeric catalogue price.
export function convertPrice(amount, sourceCurrency, targetCurrency) {
  if (sourceCurrency === targetCurrency) return Number(amount)
  if (sourceCurrency === MAD_CURRENCY) return madToUsd(amount)
  if (targetCurrency === MAD_CURRENCY) return Number((Number(amount) / MAD_TO_USD_RATE).toFixed(2))
  return Number(amount)
}

export function priceFromMad(amount) {
  return getPreferredCurrency() === MAD_CURRENCY ? Number(amount) : madToUsd(amount)
}

export function formatMoney(amount, currency = getPreferredCurrency(), locale = 'en') {
  const numberLocale = locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-MA' : 'en-US'
  const formatter = new Intl.NumberFormat(numberLocale, {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  })

  return formatter.formatToParts(Number(amount))
    .map((part) => part.type === 'currency' && currency === MAD_CURRENCY ? 'DH' : part.value)
    .join('')
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
