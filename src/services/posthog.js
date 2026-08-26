import posthog from "posthog-js"

const posthogKey = process.env.VUE_APP_POSTHOG_KEY
const posthogHost = process.env.VUE_APP_POSTHOG_HOST

export function initPostHog() {
  const missingVariable = !posthogKey
    ? "VUE_APP_POSTHOG_KEY"
    : !posthogHost
      ? "VUE_APP_POSTHOG_HOST"
      : null

  if (missingVariable) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      )
    }

    return
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: "history_change",
    capture_pageleave: true,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    person_profiles: "identified_only",
  })

  return true
}

export { posthog }
