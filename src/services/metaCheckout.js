import { trackInitiateCheckout } from './metaPixel'
import { getCart } from '../utils/cart'
import { convertPrice, getPreferredCurrency, MAD_CURRENCY } from '../utils/currency'

// Component-scoped: renders, scrolling, form edits and payment retries do not
// create another checkout entry. A new page visit gets a new owner.
const sentByOwner = new WeakMap()

export function checkoutParameters(items) {
  if (!Array.isArray(items) || !items.length) return null
  const currency = getPreferredCurrency()
  const contents = []
  for (const item of items) {
    if (!item || typeof item.destinationSlug !== 'string' || !item.destinationSlug ||
        typeof item.planKey !== 'string' || !item.planKey) return null
    const sourceCurrency = item.currency || MAD_CURRENCY
    if (!['MAD', 'EUR', 'USD'].includes(sourceCurrency)) return null
    const storedPrice = item.price && typeof item.price === 'object' ? item.price.price : item.price
    const price = convertPrice(Number(storedPrice), sourceCurrency, currency)
    const quantity = Number(item.quantity ?? 1)
    if (!Number.isFinite(price) || price <= 0 || !Number.isSafeInteger(quantity) || quantity < 1) return null
    contents.push({
      id: `${item.destinationSlug}-${item.planKey}`,
      quantity,
      item_price: Math.round(price * 100) / 100,
    })
  }
  return {
    content_type: 'product',
    content_ids: contents.map(item => item.id),
    contents,
    num_items: contents.reduce((sum, item) => sum + item.quantity, 0),
    value: contents.reduce((sum, item) => sum + Math.round(item.item_price * 100) * item.quantity, 0) / 100,
    currency,
  }
}

export function trackCheckoutEntry(owner, items) {
  try {
    const parameters = checkoutParameters(items)
    if (!parameters) return false
    const key = JSON.stringify(parameters)
    const sent = sentByOwner.get(owner) || new Set()
    if (sent.has(key)) return false
    if (!trackInitiateCheckout(parameters)) return false
    sent.add(key)
    sentByOwner.set(owner, sent)
    return true
  } catch {
    // Analytics must never interrupt opening checkout.
    return false
  }
}

export function trackDirectCheckoutEntry(owner, destinationSlug, planKey) {
  try {
    // The same-page forms currently use cart storage internally. Report the
    // selected plan (one unit), not unrelated plans left in that storage.
    const item = getCart().find(item => item.destinationSlug === destinationSlug && item.planKey === planKey)
    if (!item) return false
    return trackCheckoutEntry(owner, [{ ...item, quantity: 1 }])
  } catch {
    return false
  }
}
