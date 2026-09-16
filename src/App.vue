<template>
  <v-app class="app">

    <Navbar />
    <v-main class="main-content bidi-text">
      <router-view />
    </v-main>

    <Footer />
    <ConsentBanner />

  </v-app>
</template>

<script>
import Navbar from "./components/layout/Navbar.vue"
import Footer from "./components/layout/Footer.vue"
import ConsentBanner from "./components/layout/ConsentBanner.vue"

export default {
    name: "App",

    setup() {
      
    },

    components: {
        Navbar: Navbar,
        Footer: Footer,
        ConsentBanner,
    },

    data() {
        return {
          
        };
    },
    computed: {
    },
    methods: {
    },
    mounted() {
      document.title = "SafarSIM – Travel Internet eSIM"
     },
};

</script>

<style lang="scss">
@use "./scss/global.scss";
</style>
