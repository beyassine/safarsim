<template>
  <a v-if="button" class="compatibility-link" href="#phone-compatibility" @click.prevent="go('phone-compatibility')">
    <v-icon size="20" aria-hidden="true">mdi-cellphone-check</v-icon>{{ copy.title }}
  </a>
  <section v-else id="phone-compatibility" class="phone-compatibility" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" aria-labelledby="phone-compatibility-title" tabindex="-1">
    <v-locale-provider :rtl="$i18n.locale === 'ar'">
    <v-container>
      <header class="compatibility-heading">
        <span>{{ copy.kicker }}</span>
        <h2 id="phone-compatibility-title">{{ copy.title }}</h2>
        <p>{{ copy.intro }}</p>
      </header>
      <div class="compatibility-panel">
        <div class="compatibility-card-heading">
          <v-icon size="28" color="#16835f" aria-hidden="true">mdi-cellphone-check</v-icon>
          <h3>{{ copy.searchTitle }}</h3>
        </div>
        <v-text-field v-model="search" :label="copy.label" placeholder="iPhone 15, Samsung Galaxy S24…" variant="outlined" rounded="lg" prepend-inner-icon="mdi-magnify" clearable hide-details @update:model-value="selected = ''" />
        <div v-if="query && !selected" class="phone-options">
          <button v-for="phone in matches" :key="phone" type="button" @click="select(phone)"><bdi>{{ phone }}</bdi></button>
          <p v-if="!matches.length" role="status">{{ copy.missing }}</p>
        </div>
        <div v-if="selected" class="compatibility-success" role="status">
          <strong><v-icon size="20" aria-hidden="true">mdi-check-circle</v-icon> <bdi>{{ selected }}</bdi> — {{ copy.success }}</strong>
          <p>{{ copy.note }}</p>
          <a :href="`#${plansId}`" class="buy-internet" @click.prevent="go(plansId)">{{ copy.buy }} <v-icon size="20" aria-hidden="true">mdi-arrow-up</v-icon></a>
        </div>
      </div>
    </v-container>
    </v-locale-provider>
  </section>
</template>

<script>
import { iosCompatibility, androidCompatibility } from '@/data/deviceCompatibility'
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const phones = [...new Set([...iosCompatibility, ...androidCompatibility].flatMap(group => group.models.map(model => `${group.brand} — ${model}`)))].sort()
const words = {
  en: { kicker: 'Before you buy', searchTitle: 'Find your phone', title: 'Is my phone compatible with eSIM?', intro: 'Enter your phone model and select it from the list to check compatibility.', label: 'Phone brand or model', missing: 'We could not confirm this model. Check your phone settings for “Add eSIM” or contact us before buying.', success: 'Listed as eSIM compatible', note: 'Ready for your trip? Choose the internet plan that suits you!', buy: 'Buy internet' },
  fr: { kicker: 'Avant votre achat', searchTitle: 'Trouvez votre téléphone', title: 'Mon téléphone est-il compatible avec l’eSIM ?', intro: 'Saisissez le modèle de votre téléphone et sélectionnez-le dans la liste pour vérifier sa compatibilité.', label: 'Marque ou modèle du téléphone', missing: 'Nous ne pouvons pas confirmer ce modèle. Vérifiez la présence de « Ajouter une eSIM » dans les réglages ou contactez-nous avant d’acheter.', success: 'Répertorié comme compatible eSIM', note: 'Prêt pour votre voyage ? Choisissez le forfait internet qui vous convient !', buy: 'Acheter un forfait internet' },
  nl: { kicker: 'Voordat je koopt', searchTitle: 'Zoek je telefoon', title: 'Is mijn telefoon geschikt voor eSIM?', intro: 'Voer je telefoonmodel in en selecteer het in de lijst om de compatibiliteit te controleren.', label: 'Merk of model van je telefoon', missing: 'We kunnen dit model niet bevestigen. Controleer of je instellingen “eSIM toevoegen” bevatten of neem contact met ons op voordat je koopt.', success: 'Vermeld als geschikt voor eSIM', note: 'Klaar voor je reis? Kies de internetbundel die bij je past!', buy: 'Internet kopen' },
  ar: { kicker: 'قبل الشراء', searchTitle: 'ابحث عن هاتفك', title: 'هل هاتفي متوافق مع eSIM؟', intro: 'أدخل طراز هاتفك واختره من القائمة للتحقق من التوافق.', label: 'العلامة التجارية أو طراز الهاتف', missing: 'لم نتمكن من تأكيد توافق هذا الطراز. تحقق من وجود «إضافة eSIM» في إعدادات هاتفك أو تواصل معنا قبل الشراء.', success: 'مدرج ضمن الأجهزة المتوافقة مع eSIM', note: 'جاهز لرحلتك؟ اختر باقة الإنترنت المناسبة لك!', buy: 'شراء الإنترنت' },
}
export default {
  props: { button: Boolean, plansId: { type: String, default: 'europe-plans' } },
  data: () => ({ search: '', selected: '' }),
  computed: {
    copy() { return words[this.$i18n.locale] || words.en },
    query() { return normalize(this.search) },
    matches() { return phones.filter(phone => this.query.split(' ').every(word => normalize(phone).includes(word))) },
  },
  methods: {
    select(phone) { this.search = phone; this.selected = phone },
    go(id) {
      const target = document.getElementById(id)
      if (!target) return
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    },
  },
  watch: { '$route.path'() { this.search = ''; this.selected = '' } },
}
</script>

<style scoped>
.compatibility-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid #7cbea1;border-radius:24px;padding:10px 16px;min-height:44px;background:#e1f4eb;color:#176347;box-shadow:0 3px 10px rgba(22,131,95,.08);transition:background .18s,box-shadow .18s,transform .18s;text-decoration:none;font-weight:700;font-size:15px;line-height:1.5;text-align:center;max-width:100%;margin-top:8px}.compatibility-link:hover{background:#cdebdc;box-shadow:0 5px 14px rgba(22,131,95,.12);transform:translateY(-1px)}.compatibility-link:active{transform:translateY(0);box-shadow:0 2px 6px rgba(22,131,95,.18)}@media(prefers-reduced-motion:reduce){.compatibility-link{transition:none;transform:none}}.phone-compatibility{padding:50px 0;background:#fff8fa;scroll-margin-top:90px;color:#173d37}.compatibility-panel{max-width:740px;margin:auto;padding:30px;border:1px solid #eadfe3;border-radius:24px;background:#fff}.compatibility-heading{text-align:center;max-width:720px;margin:0 auto 36px}.compatibility-heading>span{color:#d91c58;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}.compatibility-heading h2{font-size:clamp(31px,4vw,46px);line-height:1.18;letter-spacing:-.035em;margin:9px 0 13px;font-weight:950}.compatibility-heading p{font-size:16px;color:#6b7b77;line-height:1.7;margin:0}.compatibility-card-heading{display:flex;align-items:center;gap:10px;margin-bottom:20px;text-align:start}.compatibility-card-heading .v-icon{flex:0 0 auto}.compatibility-card-heading h3{font-size:22px;font-weight:800;line-height:1.5;margin:0}.compatibility-panel p{color:#536762;line-height:1.7;margin:12px 0 20px}.phone-options{max-height:280px;overflow:auto;border:1px solid #eadfe3;border-radius:12px;margin-top:12px}.phone-options button{display:block;width:100%;padding:14px;text-align:start;border-bottom:1px solid #eee;background:#fff;color:#173d37}.phone-options button:hover,.phone-options button:focus-visible{background:#fff0f5}.phone-options p{padding:0 16px}.compatibility-success{margin-top:20px;padding:20px;border-radius:16px;background:#edf9f1}.compatibility-success strong{color:#116c4d}.buy-internet{display:inline-flex;align-items:center;gap:10px;border-radius:28px;padding:13px 24px;background:#d91c58;color:#fff;text-decoration:none;font-weight:800}.compatibility-link:focus-visible,.buy-internet:focus-visible{outline:3px solid #16835f;outline-offset:4px}@media(max-width:600px){.compatibility-panel{padding:22px 16px}.compatibility-link{width:auto}.buy-internet{justify-content:center;width:100%}}

.phone-compatibility[dir="rtl"] .compatibility-panel{direction:rtl;text-align:right}
.phone-compatibility[dir="rtl"] .compatibility-card-heading{direction:rtl;justify-content:flex-start;text-align:right}
.phone-compatibility[dir="rtl"] :deep(.v-field){direction:rtl}
.phone-compatibility[dir="rtl"] :deep(.v-field__input){text-align:right}
.phone-compatibility[dir="rtl"] :deep(.v-field-label){transform-origin:right center}
.phone-compatibility[dir="rtl"] .phone-options button{direction:rtl;text-align:right}
.phone-compatibility[dir="rtl"] .buy-internet{direction:rtl}
</style>
