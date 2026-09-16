import { reactive, readonly } from 'vue'
import { setMetaMarketingConsent } from './metaPixel'

export const CONSENT_STORAGE_KEY = 'safarsim:consent:v1'
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000
const state = reactive({ choice: null, visible: false })
export const consentState = readonly(state)
let started = false

function readChoice() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY))
    if (saved?.version !== 1 || typeof saved.marketing !== 'boolean' ||
        !Number.isFinite(saved.savedAt) || saved.savedAt > Date.now() ||
        Date.now() - saved.savedAt >= MAX_AGE_MS) return null
    return saved.marketing
  } catch {
    return null
  }
}

function applyChoice(choice) {
  state.choice = choice
  const permission = choice === true ? 'granted' : 'denied'
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // Preserve the existing analytics_storage default (denied).
      window.gtag('consent', 'update', {
        ad_storage: permission,
        ad_user_data: permission,
        ad_personalization: permission,
      })
    }
  } catch {
    // A blocked Google tag must not prevent Meta consent or the UI updating.
  }
  setMetaMarketingConsent(choice === true)
}

// Called synchronously at startup, before catalog loading and router navigation.
export function initConsent() {
  if (started || typeof window === 'undefined') return
  started = true
  const choice = readChoice()
  applyChoice(choice)
  state.visible = choice === null
  window.addEventListener('storage', event => {
    if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return
    const updated = readChoice()
    applyChoice(updated)
    state.visible = updated === null
  })
}

export function chooseConsent(marketing) {
  if (typeof marketing !== 'boolean') return
  // Apply even if first-party storage is unavailable; then the choice lasts
  // only for this page session and the banner will return on the next visit.
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      version: 1, marketing, savedAt: Date.now(),
    }))
  } catch { /* Private browsing/storage restrictions must not break the UI. */ }
  applyChoice(marketing)
  state.visible = false
}

export function openConsentSettings() {
  state.visible = true
}

export function closeConsentSettings() {
  // First-time visitors must choose; opening settings never changes consent.
  if (state.choice !== null) state.visible = false
}
