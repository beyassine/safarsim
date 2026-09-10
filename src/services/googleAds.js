const PURCHASE_LABEL = (process.env.VUE_APP_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL || '').trim()
const PURCHASE_DESTINATION = `AW-18442061093/${PURCHASE_LABEL}`

// Call only with the successful /api/checkout/verify response, never URL/cart data.
export function trackVerifiedPurchase(result) {
  if (typeof window === 'undefined' || result?.paid !== true) return false
  // Labels belong to a specific conversion action; never reuse another account's label.
  if (!/^[A-Za-z0-9_-]+$/.test(PURCHASE_LABEL)) return false
  const purchase = result.purchase
  if (!purchase || typeof purchase.livemode !== 'boolean') return false
  const { transactionId, amountTotal, livemode } = purchase
  const currency = String(purchase.currency || '').toUpperCase()
  const prefix = livemode ? 'cs_live_' : 'cs_test_'
  if (typeof transactionId !== 'string' || !transactionId.startsWith(prefix)) return false
  // Checkout currently accepts these three two-decimal currencies only.
  if (!['EUR', 'USD', 'MAD'].includes(currency)) return false
  if (!Number.isSafeInteger(amountTotal) || amountTotal <= 0) return false
  if (livemode && typeof window.gtag !== 'function') return false

  const payload = {
    send_to: PURCHASE_DESTINATION,
    value: amountTotal / 100,
    currency,
    transaction_id: transactionId,
  }
  const key = `safarsim:google-ads:${livemode ? 'purchase' : 'test-preview'}:${transactionId}`
  try {
    // Persist before dispatch. If storage is blocked, skip rather than risk
    // sending again on refresh. The stable transaction ID also deduplicates at Google.
    if (window.localStorage.getItem(key)) return false
    window.localStorage.setItem(key, '1')
    if (livemode) {
      window.gtag('event', 'conversion', payload)
    } else {
      // Stripe test payments never reach the live Google Ads conversion action.
      console.info('[Google Ads test preview — not sent]', payload)
    }
    return true
  } catch {
    // Tracking/storage failures must not interrupt payment UI or fulfillment.
    return false
  }
}
