<template>
  <div class="help-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="help-badge mb-4">Centre d’aide</div>
        <h1 class="help-title mb-3">Questions fréquentes</h1>
        <p class="help-subtitle mx-auto">
          Trouvez rapidement les réponses aux questions les plus courantes sur
          votre eSIM SAFAR.
        </p>
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <v-expansion-panels variant="accordion" class="faq-panels">
            <v-expansion-panel
              v-for="(item, index) in leftFaq"
              :key="`left-${index}`"
              class="faq-item mb-4"
              rounded="xl"
              elevation="0"
            >
              <v-expansion-panel-title class="faq-question">
                {{ item.question }}
              </v-expansion-panel-title>

              <v-expansion-panel-text class="faq-answer">
                {{ item.answer }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col cols="12" md="6">
          <v-expansion-panels variant="accordion" class="faq-panels">
            <v-expansion-panel
              v-for="(item, index) in rightFaq"
              :key="`right-${index}`"
              class="faq-item mb-4"
              rounded="xl"
              elevation="0"
            >
              <v-expansion-panel-title class="faq-question">
                {{ item.question }}
              </v-expansion-panel-title>

              <v-expansion-panel-text class="faq-answer">
                {{ item.answer }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <div class="help-cta text-center mt-12">
        <h2 class="cta-title mb-3">Vous n’avez pas trouvé votre réponse ?</h2>
        <p class="cta-text mb-6">
          Notre équipe est là pour vous aider avant, pendant et après votre achat.
        </p>

        <v-btn
          color="primary"
          size="large"
          rounded="xl"
          to="/contact"
          class="px-8 text-none"
        >
          Nous contacter
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
const leftFaq = [
  {
    question: "Qu’est-ce qu’une eSIM ?",
    answer:
      "Une eSIM est une carte SIM digitale qui vous permet d’accéder à internet sans carte physique."
  },
  {
    question: "Dois-je activer l’itinérance des données ?",
    answer:
      "Oui, l’itinérance doit être activée pour que votre eSIM fonctionne à l’étranger."
  },
  {
    question: "Quelle vitesse de connexion puis-je avoir ?",
    answer:
      "La vitesse dépend du réseau local, généralement 4G ou 5G selon la destination."
  },
  {
    question: "Puis-je garder mon WhatsApp ?",
    answer: "Oui, votre numéro WhatsApp reste inchangé avec une eSIM."
  },
  {
    question: "Quand vais-je recevoir mon eSIM ?",
    answer:
      "Votre eSIM est envoyée instantanément après l’achat par email."
  },
  {
    question: "Quels téléphones sont compatibles?",
    answer:
      "La plupart des smartphones récents sont compatibles eSIM (iPhone, Samsung, etc.)."
  },
  {
    question: "Puis-je appeler ou envoyer des SMS?",
    answer: "Nos eSIM sont principalement data-only."
  }
]

const rightFaq = [
  {
    question: "Pourquoi choisir eSIM SAFAR ?",
    answer:
      "Nous offrons une connexion fiable dans plus de 160 destinations avec activation rapide."
  },
  {
    question: "Puis-je utiliser SIM et eSIM ensemble ?",
    answer:
      "Oui, la plupart des téléphones permettent d’utiliser les deux simultanément."
  },
  {
    question: "Comment supprimer une eSIM ?",
    answer:
      "Vous pouvez la supprimer directement depuis les paramètres de votre téléphone."
  },
  {
    question: "Combien de fois puis-je utiliser mon eSIM ?",
    answer:
      "Chaque eSIM est valable pour un seul usage, selon le forfait choisi."
  },
  {
    question: "Comment vérifier ma consommation ?",
    answer:
      "Vous pouvez suivre votre consommation dans les paramètres de votre appareil."
  },
  {
    question: "Quand configurer mon eSIM ?",
    answer: "Nous recommandons de l’installer avant votre départ."
  },
  {
    question: "Comment installer mon eSIM ?",
    answer:
      "Scannez le QR code reçu par email et suivez les instructions simples."
  }
]
</script>

<style scoped>
.help-page {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  min-height: 100vh;
}

.help-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  font-size: 0.95rem;
}

.help-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.help-subtitle {
  max-width: 680px;
  font-size: 1.05rem;
  line-height: 1.8;
  color: #64748b;
}

.faq-panels {
  background: transparent !important;
}

.faq-item {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.faq-question {
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
  min-height: 72px;
}

.faq-answer {
  color: #475569;
  line-height: 1.8;
  font-size: 0.98rem;
}

.help-cta {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 32px 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.cta-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: #0f172a;
}

.cta-text {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .help-page {
    padding-top: 8px;
  }

  .faq-question {
    font-size: 0.98rem;
    min-height: 64px;
  }

  .help-cta {
    padding: 28px 16px;
  }
}
</style>