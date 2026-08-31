<template>
  <div class="legal-page">
    <v-container class="py-12">
      <h1 class="title text-center mb-6">Privacy Policy</h1>

      <v-card class="card" elevation="0" >
        <section v-for="section in $tm('privacy.sections')" :key="section.title" class="mt-5">
          <h2>{{ section.title }}</h2>
          <p class="mt-2">
            {{ section.text }}
          </p>
        </section>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped >

.card {
    background: #fffbf8;
}


</style>
