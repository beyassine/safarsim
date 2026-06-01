<template>
  <div class="refund-page">
    <v-container class="py-12">
      
      <div class="text-center mb-10">
        <div class="eyebrow"><bdi dir="ltr">SAFAR SIM</bdi></div>
        <h1 class="page-title">{{ $t("refund.title") }}</h1>
      </div>

      <v-card class="card">
        <section v-for="section in $tm('refund.sections')" :key="section.title">
          <h2>{{ section.title }}</h2>
          <p v-if="section.text">
            {{ section.text }}
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
.refund-page {
  background: linear-gradient(180deg, #f7f3ff 0%, #fffaf7 220px, #ffffff 100%);
  min-height: 100vh;
}

.eyebrow {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
  font-weight: 800;
  color: #241437;
  margin-bottom: 12px;
}

.page-subtitle {
  max-width: 760px;
  margin: 0 auto;
  color: #6b7280;
  font-size: 1rem;
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
