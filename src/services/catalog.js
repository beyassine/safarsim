import { reactive } from 'vue'
import fallbackDestinations from '@/data/destinations.json'
import fallbackRegions from '@/data/regions.json'

export const destinations = reactive([...fallbackDestinations])
export const regions = reactive([...fallbackRegions])

let loadPromise = null

export function loadCatalog() {
  if (loadPromise) return loadPromise

  const apiUrl = String(
    process.env.VUE_APP_STRIPE_API_URL || 'https://safar-stripe.vercel.app'
  ).replace(/\/$/, '')

  loadPromise = fetch(`${apiUrl}/api/catalog`)
    .then(async (response) => {
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to load catalog')
      if (!Array.isArray(result.destinations) || !Array.isArray(result.regions)) {
        throw new Error('Catalog response is invalid')
      }

      destinations.splice(0, destinations.length, ...result.destinations)
      regions.splice(0, regions.length, ...result.regions)
      return { destinations, regions, source: 'api' }
    })
    .catch((error) => {
      console.warn('Using bundled catalog fallback:', error)
      return { destinations, regions, source: 'fallback' }
    })

  return loadPromise
}
