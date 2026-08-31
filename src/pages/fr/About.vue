<template>
  <div class="product-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="eyebrow"><bdi dir="ltr">SAFAR SIM</bdi></div>
        <h1 class="page-title">Qu’est-ce que SafarSim ?</h1>
        <p class="page-subtitle">
          SafarSim vend des eSIM de voyage permettant d’accéder à internet mobile dans de nombreuses destinations, sans carte SIM physique.
        </p>
      </div>

      <v-row class="mb-10" justify="center">
        <v-col cols="12" md="4">
          <v-card class="feature-card" elevation="0">
            <div class="icon">📶</div>
            <h3>Internet mobile</h3>
            <p>
              Accédez à internet dans votre destination avec un forfait de données valable pendant une durée définie.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="feature-card" elevation="0">
            <div class="icon">⚡</div>
            <h3>Livraison rapide</h3>
            <p>
              Après paiement, l’eSIM est envoyée par email avec les instructions d’installation.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="feature-card" elevation="0">
            <div class="icon">🌍</div>
            <h3>Pour les voyageurs</h3>
            <p>
              Une solution simple pour éviter les frais d’itinérance et rester connecté à l’étranger.
            </p>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="content-card" elevation="0">
        <section class="section">
          <h2>Ce que nous vendons</h2>
          <p>
            SafarSim propose des forfaits eSIM de voyage avec un volume de données mobile, une durée de validité et une couverture selon la destination choisie.
          </p>
        </section>

        <section class="section">
          <h2>Ce qui est inclus</h2>
          <ul class="styled-list">
            <li v-for="item in $tm('about.included.items')" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section class="section">
          <h2>Comment ça fonctionne</h2>
          <ol class="styled-list ordered">
            <li v-for="item in $tm('about.howItWorks.items')" :key="item">{{ item }}</li>
          </ol>
        </section>

        <section class="section">
          <h2>Important</h2>
          <p>
            L’acheteur doit vérifier que son appareil est compatible eSIM avant achat. La qualité du service peut varier selon les réseaux locaux et la couverture disponible.
          </p>
        </section>

        <div class="text-center mt-8">
          <v-btn
            color="deep-purple-accent-4"
            rounded="xl"
            size="large"
            class="cta-btn"
            to="/pricing"
          >
            Voir les tarifs
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
// Page statique
</script>

<style scoped>
.product-page {
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
}

.feature-card {
  height: 100%;
  padding: 28px 22px;
  border-radius: 22px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 45px rgba(84, 51, 142, 0.08);
  text-align: center;
}

.icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.feature-card h3 {
  color: #241437;
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.75;
  margin: 0;
}

.content-card {
  max-width: 920px;
  margin: 0 auto;
  border-radius: 24px;
  padding: 32px 24px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 20px 60px rgba(84, 51, 142, 0.08);
}

.section + .section {
  margin-top: 28px;
}

.section h2 {
  color: #6f42c1;
  font-weight: 800;
  margin-bottom: 10px;
}

.section p {
  color: #374151;
  line-height: 1.85;
  margin: 0;
}

.styled-list {
  margin: 0;
  padding-left: 20px;
  color: #374151;
  line-height: 1.9;
}

.ordered {
  padding-left: 22px;
}

:global(html[dir="rtl"] .styled-list) {
  direction: rtl;
  text-align: right;
  padding-right: 20px;
  padding-left: 0;
}

:global(html[dir="rtl"] .ordered) {
  padding-right: 22px;
}

.cta-btn {
  text-transform: none;
  font-weight: 700;
  padding-inline: 28px;
}

@media (min-width: 960px) {
  .content-card {
    padding: 42px 40px;
  }
}
</style>
