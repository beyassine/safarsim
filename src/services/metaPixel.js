const PIXEL_ID = '1114292477590208'
const SCRIPT_URL = 'https://connect.facebook.net/en_US/fbevents.js'

// The shared consent service supplies the visitor's decision; default denied.
let marketingConsent = false
let initialized = false
let loadFailed = false
let currentPath = null
let sentCurrentPage = false
const installedRouters = new WeakSet()

export function initMetaPixel() {
  try {
    if (!marketingConsent || loadFailed || typeof window === 'undefined' ||
        typeof document === 'undefined') return false
    if (initialized) return typeof window.fbq === 'function'

    // Standard Meta browser queue: events can be queued while the async library loads.
    if (!window.fbq) {
      const fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments)
        else fbq.queue.push(arguments)
      }
      window.fbq = fbq
      if (!window._fbq) window._fbq = fbq
      fbq.push = fbq
      fbq.loaded = true
      fbq.version = '2.0'
      fbq.queue = []
    }
    if (typeof window.fbq !== 'function') return false
    // Router hooks exclusively own PageViews; disable automatic history tracking
    // and automatically inferred events (commerce will be wired separately).
    window.fbq.disablePushState = true
    window.fbq('consent', 'grant')
    window.fbq('set', 'autoConfig', false, PIXEL_ID)
    window.fbq('init', PIXEL_ID)
    initialized = true
    if (!document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      const script = document.createElement('script')
      script.async = true
      script.src = SCRIPT_URL
      script.onerror = () => { loadFailed = true }
      document.head.appendChild(script)
    }
    return true
  } catch {
    loadFailed = true
    return false
  }
}

function track(event, parameters = {}) {
  try {
    if (!initMetaPixel()) return false
    window.fbq('trackSingle', PIXEL_ID, event, parameters)
    return true
  } catch {
    return false
  }
}

export function trackPageView() {
  if (!currentPath || sentCurrentPage) return false
  if (!track('PageView')) return false
  sentCurrentPage = true
  return true
}

export function setMetaMarketingConsent(granted) {
  marketingConsent = granted === true
  try {
    if (initialized && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('consent', marketingConsent ? 'grant' : 'revoke')
    }
    if (!marketingConsent || !initMetaPixel()) return false
    return trackPageView()
  } catch {
    return false
  }
}

// Register before app.use(router), so the first resolved navigation is included.
export function installMetaPixelTracking(router) {
  if (installedRouters.has(router)) return
  installedRouters.add(router)
  router.afterEach((to, from, failure) => {
    if (failure) return
    // Query and hash changes do not represent new pages. Locale and product
    // path changes do; returning to an earlier path is a fresh page visit.
    if (to.path !== currentPath) {
      currentPath = to.path
      sentCurrentPage = false
    }
    trackPageView()
  })
}

// Interfaces only. Callers must supply appropriate event data and, for Purchase,
// an actually paid server-verified transaction. No commerce callers exist yet.
export const trackViewContent = parameters => track('ViewContent', parameters)
export const trackAddToCart = parameters => track('AddToCart', parameters)
export const trackInitiateCheckout = parameters => track('InitiateCheckout', parameters)
export const trackPurchase = parameters => track('Purchase', parameters)
