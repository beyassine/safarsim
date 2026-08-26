import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import i18n , {applyLanguage } from "./i18n"
import { loadCatalog } from "./services/catalog"
import { initPostHog, posthog } from "./services/posthog"

import "vuetify/styles"
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'; // This line is crucial
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

const resizeObserverLoopError = "ResizeObserver loop completed with undelivered notifications."

window.addEventListener("error", (event) => {
  if (event.message === resizeObserverLoopError) {
    event.stopImmediatePropagation()
  }
})

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  components,
  directives,
  rtl: {
    ar: true
  }
})


// Apply the detected language without treating it as an explicit user choice.
applyLanguage(i18n.global.locale, false)

async function bootstrap() {
  await loadCatalog()
  const posthogInitialized = initPostHog()
  const app = createApp(App)

  if (posthogInitialized) {
    app.config.errorHandler = (error) => {
      posthog.captureException(error)
    }
  }

  app
    .use(i18n)
    .use(router)
    .use(vuetify)
    .mount("#app")
}

bootstrap()
