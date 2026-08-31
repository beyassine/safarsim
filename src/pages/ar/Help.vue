<template>
  <div class="help-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="help-badge mb-4">مركز المساعدة</div>
        <h1 class="help-title mb-3">الأسئلة الشائعة</h1>
        <p class="help-subtitle mx-auto">
          اعثر بسرعة على إجابات لأكثر الأسئلة شيوعاً حول eSIM SAFAR الخاصة بك.
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
        <h2 class="cta-title mb-3">لم تجد إجابتك؟</h2>
        <p class="cta-text mb-6">
          فريقنا هنا لمساعدتك قبل الشراء وأثناءه وبعده.
        </p>

        <v-btn
          color="primary"
          size="large"
          rounded="xl"
          to="/contact"
          class="px-8 text-none"
        >
          اتصل بنا
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
const leftFaq = [
  {
    "question": "ما هي شريحة ⁨eSIM⁩؟",
    "answer": "⁨eSIM⁩ هي شريحة ⁨SIM⁩ رقمية تتيح لك الوصول إلى الإنترنت بدون شريحة فعلية."
  },
  {
    "question": "هل يجب تفعيل تجوال البيانات؟",
    "answer": "نعم، يجب تفعيل تجوال البيانات لكي تعمل شريحة ⁨eSIM⁩ في الخارج."
  },
  {
    "question": "ما سرعة الاتصال التي يمكنني الحصول عليها؟",
    "answer": "تعتمد السرعة على الشبكة المحلية، وغالباً ما تكون ⁨4G⁩ أو ⁨5G⁩ حسب الوجهة."
  },
  {
    "question": "هل يمكنني الاحتفاظ برقم ⁨WhatsApp⁩؟",
    "answer": "نعم، يبقى رقم ⁨WhatsApp⁩ الخاص بك كما هو عند استخدام ⁨eSIM⁩."
  },
  {
    "question": "متى سأستلم شريحة ⁨eSIM⁩؟",
    "answer": "يتم إرسال شريحة ⁨eSIM⁩ فوراً بعد الشراء عبر البريد الإلكتروني."
  },
  {
    "question": "ما الهواتف المتوافقة؟",
    "answer": "معظم الهواتف الذكية الحديثة تدعم ⁨eSIM⁩ مثل ⁨iPhone⁩ و⁨Samsung⁩ وغيرها."
  },
  {
    "question": "هل يمكنني إجراء المكالمات أو إرسال الرسائل النصية؟",
    "answer": "شرائح ⁨eSIM⁩ لدينا مخصصة أساساً للبيانات فقط."
  }
]

const rightFaq = [
  {
    "question": "لماذا أختار ⁨eSIM SAFAR⁩؟",
    "answer": "نوفر اتصالاً موثوقاً في أكثر من 160 وجهة مع تفعيل سريع."
  },
  {
    "question": "هل يمكنني استخدام ⁨SIM⁩ و⁨eSIM⁩ معاً؟",
    "answer": "نعم، تسمح معظم الهواتف باستخدام الشريحتين في الوقت نفسه."
  },
  {
    "question": "كيف أحذف شريحة ⁨eSIM⁩؟",
    "answer": "يمكنك حذفها مباشرة من إعدادات هاتفك."
  },
  {
    "question": "كم مرة يمكنني استخدام شريحة ⁨eSIM⁩؟",
    "answer": "كل شريحة ⁨eSIM⁩ صالحة لاستخدام واحد فقط حسب الباقة المختارة."
  },
  {
    "question": "كيف أتحقق من استهلاك البيانات؟",
    "answer": "يمكنك متابعة استهلاكك من إعدادات جهازك."
  },
  {
    "question": "متى أجهّز شريحة ⁨eSIM⁩؟",
    "answer": "ننصح بتثبيتها قبل السفر."
  },
  {
    "question": "كيف أثبّت شريحة ⁨eSIM⁩؟",
    "answer": "امسح رمز ⁨QR⁩ الذي وصلك عبر البريد الإلكتروني واتبع التعليمات البسيطة."
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
