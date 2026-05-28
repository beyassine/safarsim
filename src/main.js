import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import i18n , {applyLanguage } from "./i18n"

import "vuetify/styles"
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'; // This line is crucial
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

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


applyLanguage(i18n.global.locale)

createApp(App)
  .use(i18n)
  .use(router)
  .use(vuetify)
  .mount("#app")