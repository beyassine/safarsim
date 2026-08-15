export const USD_CURRENCY = 'USD'

const configuredRate = Number(process.env.VUE_APP_MAD_TO_USD_RATE)
export const MAD_TO_USD_RATE = Number.isFinite(configuredRate) && configuredRate > 0
  ? configuredRate
  : 0.108

export function madToUsd(amount) {
  return Number((Number(amount) * MAD_TO_USD_RATE).toFixed(2))
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
