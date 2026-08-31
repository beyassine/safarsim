<template>
  <div class="legal-page">
    <v-container class="py-12">
      <div class="text-center mb-8">
        <h1 class="title">الشروط العامة للبيع والاستخدام</h1>
        <p class="subtitle">
          آخر تحديث: أغسطس 2026
        </p>
      </div>

      <v-card class="card">
        <section v-for="section in $tm('terms.sections')" :key="section.title">
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">
            {{ paragraph }}
          </p>
          <ul v-if="section.items">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </section>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.legal-page {
  background: linear-gradient(180deg, #f7f3ff 0%, #fffaf7 220px, #ffffff 100%);
  min-height: 100vh;
}

.title {
  font-size: 32px;
  font-weight: 800;
  color: #241437;
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

section {
  margin-bottom: 24px;
}

h2 {
  color: #6f42c1;
  font-weight: 800;
  margin-bottom: 10px;
}
</style>
