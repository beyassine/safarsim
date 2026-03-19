import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

import "vuetify/styles"
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'; // This line is crucial
import 'vuetify/styles/core.css'; // This line is crucial
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
  directives
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount("#app")