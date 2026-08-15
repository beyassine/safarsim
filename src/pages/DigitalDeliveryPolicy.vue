<template>
  <div class="legal-page">
    <v-container class="py-12">
      <div class="text-center mb-8">
        <h1 class="title">{{ $t("digitalDelivery.title") }}</h1>
        <p class="subtitle">{{ $t("digitalDelivery.updated") }}</p>
      </div>

      <v-card class="card" elevation="1">
        <section v-for="section in $tm('digitalDelivery.sections')" :key="section.title">
          <h2>{{ section.title }}</h2>
          <p>{{ section.text }}</p>
        </section>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f7f3ff 0%, #fffaf7 220px, #fff 100%);
}

.title {
  color: #241437;
  font-size: 32px;
  font-weight: 800;
}

.subtitle {
  color: #6b7280;
}

.card {
  max-width: 900px;
  margin: auto;
  padding: 30px;
  border-radius: 20px;
}

section:not(:last-child) {
  margin-bottom: 24px;
}

h2 {
  margin-bottom: 10px;
  color: #6f42c1;
  font-weight: 800;
}

p {
  line-height: 1.75;
}
</style>
