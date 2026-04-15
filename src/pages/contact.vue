<template>
  <div class="legal-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-8">
        <div class="eyebrow">SAFAR SIM</div>
        <h1 class="page-title">Contactez-nous</h1>
        <p class="page-subtitle">
          Notre équipe est disponible pour vous aider avant, pendant et après votre achat.
        </p>
      </div>

      <v-row justify="center">
        <v-col cols="12" md="8" lg="7">
          <v-card class="content-card" elevation="0">
            <div class="contact-block">
              <h2>Support client</h2>
              <p>
                Pour toute question sur votre commande, votre eSIM ou votre installation,
                vous pouvez nous contacter directement :
              </p>

              <div class="info-box">
                <div class="info-item">
                  <span class="label">Email</span>
                  <a href="mailto:contact@safarsim.net" class="value">contact@safarsim.net</a>
                </div>

                <div class="info-item">
                  <span class="label">Téléphone / WhatsApp</span>
                  <a href="tel:+212613147245" class="value">+212 613 147 245</a>
                </div>

                <div class="info-item">
                  <span class="label">Site web</span>
                  <a href="https://www.safarsim.net" class="value">www.safarsim.net</a>
                </div>
              </div>
            </div>

            <div class="contact-block">
              <h2>Horaires de réponse</h2>
              <p>
                Nous faisons de notre mieux pour répondre dans les plus brefs délais,
                généralement sous 24 heures ouvrées.
              </p>
            </div>

            <div class="contact-block">
              <h2>Assistance</h2>
              <p>
                Avant de demander un remboursement, nous vous invitons à nous contacter
                afin que nous puissions vérifier et résoudre rapidement le problème.
              </p>
            </div>

            <div class="text-center mt-8">
              <v-btn
                color="deep-purple-accent-4"
                rounded="xl"
                size="large"
                class="cta-btn"
                href="mailto:contact@safarsim.net"
              >
                Nous écrire
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// Page statique
</script>

<style scoped>
.legal-page {
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
  max-width: 720px;
  margin: 0 auto;
  color: #6b7280;
}

.content-card {
  border-radius: 24px;
  padding: 32px 24px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 20px 60px rgba(84, 51, 142, 0.08);
}

.contact-block + .contact-block {
  margin-top: 28px;
}

.contact-block h2 {
  color: #6f42c1;
  font-weight: 800;
  margin-bottom: 10px;
}

.contact-block p {
  color: #374151;
  line-height: 1.85;
  margin: 0;
}

.info-box {
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  background: #faf7ff;
  border: 1px solid #eee7fb;
}

.info-item + .info-item {
  margin-top: 16px;
}

.label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 4px;
}

.value {
  color: #241437;
  font-weight: 700;
  text-decoration: none;
}

.value:hover {
  color: #6f42c1;
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