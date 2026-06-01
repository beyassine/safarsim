<template>
  <v-app class="app">

    <Navbar />
    <main class="main-content bidi-text">
      <router-view />
    </main>

    <Footer />

  </v-app>
</template>

<script>
import Navbar from "./components/layout/Navbar.vue"
import Footer from "./components/layout/Footer.vue"

export default {
    name: "App",

    setup() {
      
    },

    components: {
        Navbar: Navbar,
        Footer: Footer,
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
      document.title = "eSIM SAFAR SIM – Internet Mobile pour les Voyageurs"
     },
};

</script>

<style lang="scss">
@use "./scss/global.scss";
</style>
