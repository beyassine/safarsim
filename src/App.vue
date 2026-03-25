<template>
  <v-app class="app">

    <Navbar />
    <main class="main-content">
      <router-view />
    </main>

    <Footer />

  </v-app>
</template>

<script setup>
import Navbar from "./components/layout/Navbar.vue"
import Footer from "./components/layout/Footer.vue"
</script>

<style lang="scss">
@import "./scss/variables.scss";

.app {
  font-family: $body-font-family;
  background-color: #fffbf8 !important;
}
.section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 550;
    line-height: 1.2;
    color: #1f2937;
    margin-bottom: 10px;
}
.main-content {
  padding-top: 40px;
}

@media (max-width: 600px) {
  .main-content {
    padding-top: 40px;
  }
}

</style>