<template>
  <div class="help-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="help-badge mb-4">Help center</div>
        <h1 class="help-title mb-3">Frequently asked questions</h1>
        <p class="help-subtitle mx-auto">
          Quickly find answers to the most common questions about your SAFAR eSIM.
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
        <h2 class="cta-title mb-3">Did not find your answer?</h2>
        <p class="cta-text mb-6">
          Our team is here to help you before, during and after your purchase.
        </p>

        <v-btn
          color="primary"
          size="large"
          rounded="xl"
          to="/contact"
          class="px-8 text-none"
        >
          Contact us
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
const leftFaq = [
  {
    "question": "What is an eSIM?",
    "answer": "An eSIM is a digital SIM card that lets you access internet without a physical SIM."
  },
  {
    "question": "Do I need to enable data roaming?",
    "answer": "Yes, roaming must be enabled for your eSIM to work abroad."
  },
  {
    "question": "What connection speed can I get?",
    "answer": "Speed depends on the local network, usually 4G or 5G depending on the destination."
  },
  {
    "question": "Can I keep my WhatsApp?",
    "answer": "Yes, your WhatsApp number stays the same with an eSIM."
  },
  {
    "question": "When will I receive my eSIM?",
    "answer": "Your eSIM is sent instantly by email after purchase."
  },
  {
    "question": "Which phones are compatible?",
    "answer": "Most recent smartphones support eSIM, including iPhone, Samsung and others."
  },
  {
    "question": "Can I call or send SMS?",
    "answer": "Our eSIMs are mainly data-only."
  }
]

const rightFaq = [
  {
    "question": "Why choose eSIM SAFAR?",
    "answer": "We offer reliable connection in more than 160 destinations with fast activation."
  },
  {
    "question": "Can I use SIM and eSIM together?",
    "answer": "Yes, most phones allow both to be used at the same time."
  },
  {
    "question": "How do I delete an eSIM?",
    "answer": "You can delete it directly from your phone settings."
  },
  {
    "question": "How many times can I use my eSIM?",
    "answer": "Each eSIM is valid for one use only, depending on the selected plan."
  },
  {
    "question": "How do I check my usage?",
    "answer": "You can track your usage in your device settings."
  },
  {
    "question": "When should I set up my eSIM?",
    "answer": "We recommend installing it before departure."
  },
  {
    "question": "How do I install my eSIM?",
    "answer": "Scan the QR code received by email and follow the simple instructions."
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
