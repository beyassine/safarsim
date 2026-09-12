<template>
  <div class="help-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="help-badge mb-4">Helpcentrum</div>
        <h1 class="help-title mb-3">Veelgestelde vragen</h1>
        <p class="help-subtitle mx-auto"> Vind snel antwoorden op de meest gestelde vragen over je SAFAR eSIM. </p>
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
        <h2 class="cta-title mb-3">Geen antwoord gevonden?</h2>
        <p class="cta-text mb-6"> Ons team helpt je vóór, tijdens en na je aankoop. </p>

        <v-btn
          color="primary"
          size="large"
          rounded="xl"
          to="/nl/contact"
          class="px-8 text-none"
        > Neem contact op </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
const leftFaq = [
  {
    "question": "Wat is een eSIM?",
    "answer": "Een eSIM is een digitale simkaart waarmee je toegang krijgt tot internet zonder fysieke simkaart."
  },
  {
    "question": "Moet ik dataroaming inschakelen?",
    "answer": "Ja, roaming moet ingeschakeld zijn om je eSIM in het buitenland te gebruiken."
  },
  {
    "question": "Welke verbindingssnelheid kan ik verwachten?",
    "answer": "De snelheid hangt af van het lokale netwerk, meestal 4G of 5G afhankelijk van de bestemming."
  },
  {
    "question": "Kan ik mijn WhatsApp behouden?",
    "answer": "Ja, je WhatsApp-nummer blijft hetzelfde met een eSIM."
  },
  {
    "question": "Wanneer ontvang ik mijn eSIM?",
    "answer": "Je eSIM wordt na aankoop direct per e-mail verstuurd."
  },
  {
    "question": "Welke telefoons zijn compatibel?",
    "answer": "De meeste recente smartphones ondersteunen eSIM, waaronder iPhone, Samsung en andere merken."
  },
  {
    "question": "Kan ik bellen of sms’en?",
    "answer": "Onze eSIMs zijn voornamelijk bedoeld voor mobiele data."
  }
]

const rightFaq = [
  {
    "question": "Waarom kiezen voor een SAFAR eSIM?",
    "answer": "We bieden een betrouwbare verbinding op meer dan 160 bestemmingen met snelle activering."
  },
  {
    "question": "Kan ik een simkaart en eSIM tegelijk gebruiken?",
    "answer": "Ja, op de meeste telefoons kun je beide tegelijk gebruiken."
  },
  {
    "question": "Hoe verwijder ik een eSIM?",
    "answer": "Je kunt deze rechtstreeks verwijderen via de instellingen van je telefoon."
  },
  {
    "question": "Hoe vaak kan ik mijn eSIM gebruiken?",
    "answer": "Elke eSIM is geldig voor eenmalig gebruik, afhankelijk van de gekozen bundel."
  },
  {
    "question": "Hoe controleer ik mijn verbruik?",
    "answer": "Je kunt je verbruik bijhouden in de instellingen van je toestel."
  },
  {
    "question": "Wanneer moet ik mijn eSIM instellen?",
    "answer": "We raden aan om deze voor vertrek te installeren."
  },
  {
    "question": "Hoe installeer ik mijn eSIM?",
    "answer": "Scan de QR-code uit de e-mail en volg de eenvoudige instructies."
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
