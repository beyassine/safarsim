<template>
  <div class="one-page" :class="{ 'locale-fr': locale === 'fr' }" :dir="pageDirection">
    <div class="page-language-bar">
      <v-container class="language-bar-inner">
        <span class="language-prompt"><v-icon size="18">mdi-web</v-icon>{{ c.language }}</span>
        <div class="language-options" role="group" :aria-label="c.language">
          <button v-for="language in languages" :key="language.code" type="button"
            :class="{ active: locale === language.code }" :aria-pressed="locale === language.code"
            @click.stop.prevent="changeLanguage(language.code)">
            <span>{{ language.flag }}</span>{{ language.label }}
          </button>
        </div>
      </v-container>
    </div>
    <section class="hero-section">
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>
      <v-container fluid class="hero-container">
        <div class="hero-copy">
          <h1><span class="hero-title-line">{{ c.heroTitle }}</span><span class="hero-accent-line">{{ c.heroAccent }}</span></h1>
          <p class="hero-lead">{{ c.heroLead }}</p>
          <div class="hero-actions">
            <v-btn class="primary-cta" size="x-large" rounded="pill" elevation="0" @click="scrollToPlans">
              {{ c.choosePlan }}
              <v-icon end>{{ arrowIcon }}</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="hero-visual" :aria-label="c.connected">
          <img
            src="@/assets/images/hero_safar.png"
            class="hero-artwork"
            alt="Safar Sim travel connectivity"
          >
        </div>
      </v-container>
    </section>

    <section class="proof-strip">
      <v-container class="proof-grid">
        <div><b>190+</b><span>{{ c.worldDestinations }}</span></div>
        <div><b>4G / 5G</b><span>{{ c.reliable }}</span></div>
        <div><b>{{ c.minutes }}</b><span>{{ c.purchaseToActivation }}</span></div>
        <div><b>24/7</b><span>{{ c.travelSupport }}</span></div>
      </v-container>
    </section>

    <section id="plans" class="plans-section">
      <v-container>
        <div class="section-heading">
          <span>{{ planKicker }}</span>
          <h2>{{ c.planInTwo }}</h2>
          <p>{{ c.planIntro }}</p>
        </div>

        <div class="purchase-card" :class="{ 'purchase-card--single': !selectedDestination }">
          <div id="destination-selection" class="destination-panel">
            <div class="step-label"><i>1</i><span>{{ c.where }}</span><small>{{ catalog.length }} {{ c.destinations }}</small></div>
            <div class="search-wrap">
              <v-icon>mdi-magnify</v-icon>
              <input v-model.trim="search" type="search" :placeholder="c.searchCountry" :aria-label="c.searchDestination">
            </div>
            <div class="destination-list">
              <div v-for="group in destinationGroups" :key="group.key" class="destination-group" :class="`destination-group--${group.key}`">
                <div class="destination-group-title">
                  <v-icon size="18">{{ group.icon }}</v-icon>
                  <strong>{{ group.title }}</strong>
                </div>
                <button v-for="destination in group.items" :key="destination.slug"
                  type="button" class="destination-option" :class="{ active: selectedDestination?.slug === destination.slug, 'region-option': destination.type === 'region' }"
                  @click="selectDestination(destination)">
                  <img :src="flagUrl(destination)" :alt="destinationName(destination)">
                  <span>{{ destinationName(destination) }}</span>
                  <small v-if="destination.type === 'region' && locale === 'ar'" class="country-english-name" dir="ltr">{{ destination.names?.en || destination.name }}</small>
                  <small v-if="destination.type === 'region'">{{ destination.coverageIsoCodes?.length || 0 }} {{ cc.countryCount }}</small>
                  <small v-else-if="locale === 'ar'" class="country-english-name" dir="ltr">{{ destination.names?.en || destination.name }}</small>
                  <v-icon v-if="selectedDestination?.slug === destination.slug" size="20">mdi-check-circle</v-icon>
                </button>
              </div>
              <p v-if="filteredDestinations.length === 0" class="no-results">{{ c.noDestination }}</p>
            </div>
          </div>

          <div v-if="selectedDestination" id="package-selection" class="package-panel">
            <div class="step-label"><i>2</i><span>{{ c.selectPackage }}</span></div>
            <div class="selected-country">
              <div><img :src="flagUrl(selectedDestination)" alt=""><span>{{ c.packagesFor }} {{ destinationName(selectedDestination) }}</span></div>
              <small>{{ c.networkAvailability }}</small>
            </div>
            <div v-if="selectedRegionCountries.length" class="region-country-flags">
              <span class="region-country-flags-title">{{ cc.includedCountries }}</span>
              <div class="region-country-flags-list">
                <img
                  v-for="country in selectedRegionCountries"
                  :key="country.iso"
                  :src="flagUrl(country)"
                  :alt="destinationName(country)"
                  :title="destinationName(country)"
                >
              </div>
            </div>
            <div class="package-grid">
              <button v-for="plan in availablePlans" :key="plan.key" type="button" class="plan-option"
                :class="{ active: selectedPlan?.key === plan.key }" @click="selectPlanAndCheckout(plan)">
                <span class="radio-dot"></span>
                <div class="plan-data"><b>{{ plan.data }}</b><small>{{ c.internet }}</small></div>
                <div class="plan-validity"><v-icon size="18">mdi-calendar-blank-outline</v-icon><span>{{ c.validFor }} {{ plan.days }} {{ dayLabel(plan.days) }}</span></div>
                <strong>{{ formatPrice(plan.price) }} <small>{{ preferredCurrency }}</small></strong>
                <em v-if="plan.badge">{{ plan.badge }}</em>
              </button>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <section v-if="checkoutOpen" id="checkout" class="checkout-section">
      <v-container>
        <div class="section-heading checkout-heading">
          <span>{{ c.lastStep }}</span>
          <h2>{{ c.completeOrder }}</h2>
          <p>{{ c.checkoutIntro }}</p>
        </div>
        <div class="embedded-checkout">
          <Cart :show-step-numbers="true" />
        </div>
      </v-container>
    </section>

    <section class="compact-steps-section">
      <v-container fluid class="compact-steps-container">
        <div class="section-heading compact-steps-heading">
          <span>{{ c.simple }}</span>
          <h2>{{ c.threeSteps }}</h2>
          <p>{{ stepsSubtitle }}</p>
        </div>
        <div class="compact-steps">
          <div class="compact-step">
            <i>01</i>
            <v-icon>mdi-earth</v-icon>
            <div><strong>{{ c.step1Title }}</strong><p>{{ c.step1Text }}</p></div>
          </div>
          <div class="compact-step">
            <i>02</i>
            <v-icon>mdi-qrcode-scan</v-icon>
            <div><strong>{{ c.step2Title }}</strong><p>{{ c.step2Text }}</p></div>
          </div>
          <div class="compact-step">
            <i>03</i>
            <v-icon>mdi-cellphone-wireless</v-icon>
            <div><strong>{{ c.step3Title }}</strong><p>{{ c.step3Text }}</p></div>
          </div>
        </div>
      </v-container>
    </section>

    <section class="popular-packs-section">
      <v-container>
        <div class="section-heading popular-heading">
          <span>{{ pc.kicker }}</span>
          <h2>{{ pc.title }}</h2>
          <p>{{ pc.text }}</p>
        </div>
        <div class="popular-packs-grid">
          <article v-for="pack in popularPacks" :key="pack.destination.slug"
            class="popular-pack-card" @click="choosePopularPack(pack)">
            <span class="discount-badge">-{{ pack.discount }}%</span>
            <div class="popular-pack-top">
              <img :src="flagUrl(pack.destination)" :alt="destinationName(pack.destination)">
              <span>{{ destinationName(pack.destination) }}</span>
            </div>
            <div class="popular-pack-body">
              <div class="popular-pack-details">
                <div>
                  <div class="popular-pack-data"><strong>{{ pack.data }}</strong><span>{{ c.internet }}</span></div>
                  <div class="popular-pack-validity"><v-icon size="19">mdi-calendar-blank-outline</v-icon><span>{{ c.validFor }} {{ pack.days }} {{ dayLabel(pack.days) }}</span></div>
                </div>
              </div>
              <div class="popular-pack-price">
                <b>{{ formatPrice(pack.price) }}</b>
                <small>{{ preferredCurrency }}</small>
              </div>
            </div>
            <v-btn class="popular-buy-button" rounded="lg" elevation="0" block @click.stop="buyPopularPack(pack)">
              <v-icon start size="19">mdi-cart-outline</v-icon>{{ pc.buy }}
            </v-btn>
          </article>
        </div>
      </v-container>
    </section>

    <section class="benefits-section">
      <v-container class="benefits-layout">
        <div class="benefit-copy">
          <h2>{{ c.benefitTitle }}</h2>
          <p>{{ c.benefitLead }}</p>
          <div class="benefit-apps-visual">
            <img
              src="@/assets/images/apps-icons.png"
              alt="WhatsApp, Instagram, Facebook, TikTok, Spotify, Uber, Gmail and Google Maps"
            >
          </div>
        </div>
        <div class="benefit-grid">
          <div><v-icon>mdi-cash-remove</v-icon><h3>{{ c.saveRoaming }}</h3><p>{{ c.saveRoamingText }}</p></div>
          <div><v-icon>mdi-sim-outline</v-icon><h3>{{ c.keepNumber }}</h3><p>{{ c.keepNumberText }}</p></div>
          <div><v-icon>mdi-timer-outline</v-icon><h3>{{ c.fastActivation }}</h3><p>{{ c.fastActivationText }}</p></div>
          <div><v-icon>mdi-face-agent</v-icon><h3>{{ c.help }}</h3><p>{{ c.helpText }}</p></div>
        </div>
      </v-container>
    </section>

    <section class="faq-section">
      <v-container class="faq-container">
        <div class="section-heading"><span>{{ c.faqLabel }}</span><h2>{{ c.faqTitle }}</h2></div>
        <v-expansion-panels variant="accordion" class="faq-panels">
          <v-expansion-panel v-for="faq in faqs" :key="faq.question" elevation="0">
            <v-expansion-panel-title>{{ faq.question }}</v-expansion-panel-title>
            <v-expansion-panel-text>{{ faq.answer }}</v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </section>

    <v-snackbar v-model="snackbar" color="#35182a" location="top" timeout="2500" rounded="pill">
      <div class="snackbar-content"><v-icon>mdi-check-circle</v-icon><span>{{ c.added }}</span><v-btn variant="text" size="small" @click="scrollToCheckout">{{ c.checkout }}</v-btn></div>
    </v-snackbar>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { destinations, regions } from '@/services/catalog'
import { addToCart, getCart } from '@/utils/cart'
import i18n from '@/i18n'
import { localePath } from '@/router'
import Cart from '@/pages/Cart.vue'
import { priceFromMad, getPreferredCurrency } from '@/utils/currency'
import { posthog } from '@/services/posthog'

const locale = ref(i18n.global.locale)
const preferredCurrency = getPreferredCurrency()
const router = useRouter()
const route = useRoute()
const search = ref('')
const checkoutOpen = ref(false)
const snackbar = ref(false)
const catalog = computed(() => [...regions, ...destinations])
const selectedDestination = ref(null)
const selectedPlan = ref(null)
const languages = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

const pageCopy = {
  ar: {
    language:'اختر اللغة',eyebrow:'رفيقك الذكي في كل رحلة',heroTitle:'إنترنت السفر',heroAccent:'أسهل من أي وقت.',heroLead:'فعّل شريحة SafarSIM الإلكترونية خلال دقائق، وابقَ متصلاً فور وصولك إلى وجهتك بدون تجوال مكلف أو تبديل شريحتك.',choosePlan:'اختر باقتك الآن',checkPhone:'تحقق من توافق هاتفك',instant:'تفعيل فوري',noFees:'بدون رسوم خفية',support:'شبكات 4G / 5G',connected:'أنت متصل!',internetReady:'الإنترنت جاهز للاستخدام',remaining:'المتبقي',moreThan:'أكثر من',destination:'وجهة',destinations:'وجهة',fastNetwork:'شبكة سريعة',worldDestinations:'وجهة حول العالم',reliable:'اتصال سريع وموثوق',minutes:'دقائق',purchaseToActivation:'من الشراء إلى التفعيل',travelSupport:'دعم قبل وأثناء السفر',choosePayConnect:'باقتك في خطوات بسيطة',planInTwo:'باقتك المناسبة في خطوتين',planIntro:'اختر وجهتك ثم الباقة التي تناسب مدة سفرك واستهلاكك.',where:'إلى أين ستسافر؟',searchCountry:'ابحث عن دولة...',searchDestination:'ابحث عن وجهة',noDestination:'لا توجد وجهة بهذا الاسم.',selectPackage:'اختر باقة الإنترنت',packagesFor:'باقات',networkAvailability:'تعمل على شبكات 4G و5G المتاحة',internet:'إنترنت',validFor:'صالحة لمدة',mad:'MAD',total:'المبلغ الإجمالي',addToCart:'أضف إلى السلة',secureNote:'دفع آمن ومشفّر • ستتوصل بالشريحة الإلكترونية بعد إتمام الطلب',popular:'الأكثر طلباً',lastStep:'الخطوة الأخيرة',completeOrder:'أكمل طلبك',checkoutIntro:'راجع باقتك، ثم أدخل معلومات الاستلام والدفع.',simple:'بكل بساطة',threeSteps:'اتصل بالإنترنت في 3 خطوات',step1Title:'اختر وجهتك وباقتك',step1Text:'حدد بلد السفر وحجم الإنترنت المناسب لرحلتك.',step2Title:'امسح رمز QR',step2Text:'ستتوصل بكود التفعيل مع تعليمات بسيطة وواضحة.',step3Title:'سافر وأنت متصل',step3Text:'فعّل الشريحة عند الوصول واستمتع بالإنترنت فوراً.',why:'لماذا SafarSIM؟',benefitTitle:'رحلتك تستحق اتصالاً بلا مفاجآت',benefitLead:'ابقَ متصلاً بتطبيقاتك المفضلة طوال رحلتك.',phoneSupports:'هل هاتفي يدعم eSIM؟',saveRoaming:'وفّر رسوم التجوال',saveRoamingText:'أسعار واضحة قبل أن تسافر.',keepNumber:'احتفظ برقمك',keepNumberText:'لا حاجة لإزالة شريحتك الأساسية من الهاتف.',fastActivation:'تفعيل سريع',fastActivationText:'لا متاجر، لا انتظار، ولا أوراق مطلوبة.',help:'دعم يرافقك',helpText:'فريقنا جاهز لمساعدتك باللغة العربية.',faqLabel:'أسئلة شائعة',faqTitle:'كل ما تحتاج معرفته',ready:'جاهز للسفر؟',takeInternet:'خذ الإنترنت معك أينما ذهبت.',finalText:'اختر وجهتك الآن واستمتع باتصال سريع من لحظة وصولك.',buyNow:'اشترِ شريحتك الآن',added:'تمت إضافة الباقة إلى الطلب',checkout:'إتمام الطلب',day:'يوم',days:'أيام',title:'SafarSIM | شريحة إنترنت للسفر'
  },
  fr: {
    language:'Choisir la langue',eyebrow:'Votre compagnon connecté à chaque voyage',heroTitle:'Internet en voyage,',heroAccent:'plus simple que jamais.',heroLead:'Activez votre eSIM SafarSIM en quelques minutes et restez connecté dès votre arrivée, sans frais d’itinérance ni changement de carte SIM.',choosePlan:'Choisir ma destination',checkPhone:'Vérifier la compatibilité',instant:'Activation instantanée',noFees:'Aucun frais caché',support:'Réseaux 4G / 5G',connected:'Vous êtes connecté !',internetReady:'Internet est prêt à l’emploi',remaining:'Données restantes',moreThan:'Plus de',destination:'destinations',destinations:'destinations',fastNetwork:'Réseau rapide',worldDestinations:'destinations dans le monde',reliable:'Connexion rapide et fiable',minutes:'Quelques minutes',purchaseToActivation:'de l’achat à l’activation',travelSupport:'Assistance avant et pendant le voyage',choosePayConnect:'Choisissez. Payez. Connectez-vous.',planInTwo:'Votre forfait idéal en deux étapes',planIntro:'Choisissez votre destination, puis le forfait adapté à votre séjour et à vos besoins.',where:'Où partez-vous ?',searchCountry:'Rechercher un pays...',searchDestination:'Rechercher une destination',noDestination:'Aucune destination ne correspond à votre recherche.',selectPackage:'Choisissez votre forfait Internet',packagesFor:'Forfaits pour',networkAvailability:'Fonctionne sur les réseaux 4G et 5G disponibles',internet:'Internet',validFor:'Valable',mad:'MAD',total:'Montant total',addToCart:'Ajouter au panier',secureNote:'Paiement sécurisé et chiffré • Vous recevrez votre eSIM après la commande',popular:'Le plus populaire',lastStep:'Dernière étape',completeOrder:'Finalisez votre commande',checkoutIntro:'Vérifiez votre forfait, puis renseignez la livraison et le paiement.',simple:'C’est très simple',threeSteps:'Connectez-vous en 3 étapes',step1Title:'Choisissez destination et forfait',step1Text:'Sélectionnez le pays et le volume de données adapté à votre voyage.',step2Title:'Scannez le QR code',step2Text:'Recevez votre code d’activation avec des instructions simples.',step3Title:'Voyagez connecté',step3Text:'Activez l’eSIM à votre arrivée et profitez immédiatement d’Internet.',why:'Pourquoi SafarSIM ?',benefitTitle:'Votre voyage mérite une connexion sans surprise',benefitLead:'Restez connecté à vos applications préférées pendant tout votre voyage.',phoneSupports:'Mon téléphone accepte-t-il l’eSIM ?',saveRoaming:'Économisez sur l’itinérance',saveRoamingText:'Des prix clairs en dirhams marocains avant votre départ.',keepNumber:'Gardez votre numéro',keepNumberText:'Inutile de retirer votre carte SIM principale.',fastActivation:'Activation rapide',fastActivationText:'Aucune boutique, attente ou formalité.',help:'Assistance avec vous',helpText:'Notre équipe est prête à vous aider dans votre langue.',faqLabel:'Questions fréquentes',faqTitle:'Tout ce qu’il faut savoir',ready:'Prêt à partir ?',takeInternet:'Emportez Internet partout avec vous.',finalText:'Choisissez votre destination et profitez d’une connexion rapide dès votre arrivée.',buyNow:'Acheter mon eSIM',added:'Le forfait a été ajouté à la commande',checkout:'Finaliser',day:'jour',days:'jours',title:'SafarSIM | eSIM Internet pour voyager'
  },
  en: {
    language:'Choose language',eyebrow:'Your smart companion for every trip',heroTitle:'Travel internet,',heroAccent:'simpler than ever.',heroLead:'Activate your SafarSIM eSIM in minutes and stay connected as soon as you arrive, without costly roaming or swapping your SIM.',choosePlan:'Choose your destination',checkPhone:'Check phone compatibility',instant:'Instant activation',noFees:'No hidden fees',support:'4G / 5G networks',connected:'You’re connected!',internetReady:'Internet is ready to use',remaining:'Data remaining',moreThan:'More than',destination:'destinations',destinations:'destinations',fastNetwork:'Fast network',worldDestinations:'destinations worldwide',reliable:'Fast, reliable connection',minutes:'Minutes',purchaseToActivation:'from purchase to activation',travelSupport:'Support before and during travel',choosePayConnect:'Choose. Pay. Connect.',planInTwo:'Your ideal plan in two steps',planIntro:'Choose your destination, then select the plan that fits your trip and data needs.',where:'Where are you going?',searchCountry:'Search for a country...',searchDestination:'Search destinations',noDestination:'No destination matches your search.',selectPackage:'Choose an internet plan',packagesFor:'Plans for',networkAvailability:'Works on available 4G and 5G networks',internet:'Internet',validFor:'Valid for',mad:'MAD',total:'Total amount',addToCart:'Add to cart',secureNote:'Secure encrypted payment • You’ll receive your eSIM after checkout',popular:'Most popular',lastStep:'Final step',completeOrder:'Complete your order',checkoutIntro:'Review your plan, then enter delivery and payment details.',simple:'It’s that simple',threeSteps:'Get online in 3 steps',step1Title:'Choose destination and plan',step1Text:'Select your country and the right amount of data for your trip.',step2Title:'Scan the QR code',step2Text:'Receive your activation code with clear, simple instructions.',step3Title:'Travel connected',step3Text:'Activate the eSIM when you arrive and get online immediately.',why:'Why SafarSIM?',benefitTitle:'Your trip deserves a connection with no surprises',benefitLead:'Stay connected to your favorite apps throughout your trip.',phoneSupports:'Does my phone support eSIM?',saveRoaming:'Save on roaming',saveRoamingText:'Clear prices in Moroccan dirhams before you travel.',keepNumber:'Keep your number',keepNumberText:'No need to remove your primary SIM.',fastActivation:'Fast activation',fastActivationText:'No stores, waiting, or paperwork.',help:'Support that travels with you',helpText:'Our team is ready to help in your language.',faqLabel:'Frequently asked questions',faqTitle:'Everything you need to know',ready:'Ready to travel?',takeInternet:'Take the internet wherever you go.',finalText:'Choose your destination and enjoy a fast connection from the moment you arrive.',buyNow:'Buy your eSIM',added:'The plan was added to your order',checkout:'Checkout',day:'day',days:'days',title:'SafarSIM | Travel Internet eSIM'
  }
}

const c = computed(() => pageCopy[locale.value] || pageCopy.en)
const pageDirection = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const arrowIcon = computed(() => locale.value === 'ar' ? 'mdi-arrow-left' : 'mdi-arrow-right')
const popularCopy = {
  ar: { kicker: 'الأكثر طلباً', title: 'باقات سفر يحبها عملاؤنا', text: 'اختر واحدة من أشهر باقاتنا وابدأ رحلتك متصلاً.', from: 'ابتداءً من', buy: 'اشترِ الآن' },
  fr: { kicker: 'Les plus demandés', title: 'Nos forfaits de voyage populaires', text: 'Choisissez l’un de nos forfaits préférés et partez connecté.', from: 'À partir de', buy: 'Acheter' },
  en: { kicker: 'Most popular', title: 'Popular travel packages', text: 'Choose one of our most-loved plans and travel connected.', from: 'From', buy: 'Buy now' },
}
const pc = computed(() => popularCopy[locale.value] || popularCopy.en)
const stepsSubtitle = computed(() => ({
  ar: 'من اختيار باقتك إلى الاتصال بالإنترنت، كل شيء يتم بسرعة وسهولة.',
  fr: 'Du choix de votre forfait à la connexion, tout se fait rapidement et simplement.',
  en: 'From choosing your plan to getting online, everything is quick and simple.',
}[locale.value] || 'From choosing your plan to getting online, everything is quick and simple.'))
const planKicker = computed(() => ({
  ar: 'باقتك في خطوات بسيطة',
  fr: 'Votre forfait en quelques étapes simples',
  en: 'Your plan in a few simple steps',
}[locale.value] || 'Your plan in a few simple steps'))
const catalogCopy = {
  ar: { popular: 'الوجهات الأكثر طلباً', results: 'النتائج', regions: 'الباقات الإقليمية', countries: 'الدول', countryCount: 'دولة', includedCountries: 'الدول المشمولة' },
  fr: { popular: 'Destinations populaires', results: 'Résultats', regions: 'Forfaits régionaux', countries: 'Pays', countryCount: 'pays', includedCountries: 'Pays inclus' },
  en: { popular: 'Popular destinations', results: 'Results', regions: 'Regional plans', countries: 'Countries', countryCount: 'countries', includedCountries: 'Included countries' },
}
const cc = computed(() => catalogCopy[locale.value] || catalogCopy.en)

const featuredPackageKeys = {
  europe: '10GB_30days',
  espagne: '10GB_30days',
  turquie: '10GB_30days',
  'etats-unis': '10GB_30days',
  france: '10GB_30days',
  'emirats-arabes-unis': '10GB_30days',
}

const popularPacks = computed(() => Object.entries(featuredPackageKeys)
  .map(([slug, planKey]) => ({ destination: catalog.value.find(item => item.slug === slug), planKey }))
  .filter(item => item.destination)
  .map(({ destination, planKey }) => {
    const preferredKey = destination.plans?.[planKey]?.price != null
      ? planKey
      : destination.plans?.['10GB_30days']?.price != null
        ? '10GB_30days'
        : Object.keys(destination.plans || {}).find(key => Number(key.match(/^(\d+)GB_/)?.[1] || 0) >= 10)
    const config = destination.plans?.[preferredKey]
    const match = preferredKey?.match(/^(\d+GB)_(\d+)days$/)
    if (!config || !match) return null
    return {
      destination,
      key: preferredKey,
      data: match[1].replace('GB', ' GB'),
      days: Number(match[2]),
      price: Number(typeof config === 'object' ? config.price : config),
      esimGoBundleName: typeof config === 'object' ? config.esimGoBundleName : null,
      discount: 15,
    }
  })
  .filter(pack => pack && Number.isFinite(pack.price)))

const normalize = value => String(value || '').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const filteredDestinations = computed(() => {
  const query = normalize(search.value)
  if (!query) {
    return catalog.value
      .filter(item => popularDestinationSlugs.has(item.slug))
      .sort((a, b) => Object.keys(featuredPackageKeys).indexOf(a.slug) - Object.keys(featuredPackageKeys).indexOf(b.slug))
  }

  const matchesQuery = item => {
    const names = [item.name, item.names?.ar, item.names?.fr, item.names?.en, item.iso]
    return names.some(name => normalize(name).includes(query))
  }
  const matchingCountries = destinations.filter(matchesQuery)
  const matchingCountryCodes = new Set(matchingCountries.map(country => country.iso))
  const coveringRegions = regions.filter(region =>
    region.coverageIsoCodes?.some(code => matchingCountryCodes.has(code))
  )
  const matchingRegions = regions.filter(matchesQuery)

  return [...new Map(
    [...coveringRegions, ...matchingRegions, ...matchingCountries]
      .map(item => [item.slug, item])
  ).values()]
})

const popularDestinationSlugs = new Set(Object.keys(featuredPackageKeys))

const destinationGroups = computed(() => filteredDestinations.value.length ? [{
  key: 'popular',
  title: search.value ? cc.value.results : cc.value.popular,
  icon: search.value ? 'mdi-magnify' : 'mdi-fire',
  items: filteredDestinations.value,
}] : [])

const availablePlans = computed(() => {
  if (!selectedDestination.value?.plans) return []
  const plans = Object.entries(selectedDestination.value.plans)
    .map(([key, config]) => {
      const match = key.match(/^(\d+GB)_(\d+)days$/)
      const price = typeof config === 'object' ? config.price : config
      if (!match || price === null || price === undefined) return null
      return {
        key,
        data: match[1].replace('GB', ' GB'),
        dataValue: Number(match[1].replace('GB', '')),
        days: Number(match[2]),
        price: Number(price),
        esimGoBundleName: typeof config === 'object' ? config.esimGoBundleName : null,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.price - b.price)
  const mostPopularPlan = plans.find(plan => plan.dataValue === 10)
  if (mostPopularPlan) mostPopularPlan.badge = c.value.popular
  return plans
})

const selectedRegionCountries = computed(() => {
  if (selectedDestination.value?.type !== 'region') return []
  const covered = new Set(selectedDestination.value.coverageIsoCodes || [])
  return destinations.filter(destination => covered.has(destination.iso))
})

const faqCopy = {
  ar: [
    ['ما هي الشريحة الإلكترونية eSIM؟','هي شريحة رقمية مدمجة في هاتفك، تتيح لك إضافة باقة إنترنت بدون تركيب شريحة بلاستيكية. يتم تثبيتها بسهولة عبر مسح رمز QR.'],
    ['متى يجب أن أفعّل باقتي؟','يمكنك تثبيت الشريحة قبل السفر، ثم تفعيل بياناتها عند وصولك. تبدأ صلاحية أغلب الباقات عند أول اتصال بالشبكة المحلية.'],
    ['هل يمكنني الاحتفاظ برقمي وواتساب؟','نعم. تبقى شريحتك الأساسية ورقمك وواتساب كما هي، بينما تستخدم SafarSIM لبيانات الإنترنت.'],
    ['كيف أعرف إذا كان هاتفي متوافقاً؟','استخدم أداة التوافق واختر نوع جهازك وموديله. يجب أيضاً ألا يكون الهاتف مقفلاً على شركة اتصالات واحدة.'],
    ['هل يمكنني مشاركة الإنترنت؟','تدعم أغلب باقاتنا نقطة الاتصال الشخصية، حسب الجهاز والشبكة المتوفرة في الوجهة.']
  ],
  fr: [
    ['Qu’est-ce qu’une eSIM ?','Une eSIM est une carte SIM numérique intégrée au téléphone. Elle s’installe simplement en scannant un QR code.'],
    ['Quand dois-je activer mon forfait ?','Installez l’eSIM avant le départ, puis activez les données à l’arrivée. La plupart des forfaits démarrent à la première connexion locale.'],
    ['Puis-je garder mon numéro et WhatsApp ?','Oui. Votre SIM principale, votre numéro et WhatsApp restent inchangés. SafarSIM fournit uniquement les données mobiles.'],
    ['Comment vérifier la compatibilité de mon téléphone ?','Utilisez notre outil de compatibilité et sélectionnez la marque et le modèle. Le téléphone doit aussi être désimlocké.'],
    ['Puis-je partager la connexion ?','La plupart de nos forfaits autorisent le partage de connexion, selon l’appareil et le réseau local.']
  ],
  en: [
    ['What is an eSIM?','An eSIM is a digital SIM built into your phone. It installs easily by scanning a QR code.'],
    ['When should I activate my plan?','Install the eSIM before travelling, then enable its data when you arrive. Most plans begin on the first local network connection.'],
    ['Can I keep my number and WhatsApp?','Yes. Your primary SIM, phone number and WhatsApp remain unchanged. SafarSIM is used for mobile data.'],
    ['How do I check phone compatibility?','Use our compatibility checker and select your device brand and model. Your phone must also be carrier-unlocked.'],
    ['Can I share my connection?','Most plans support personal hotspot use, depending on the device and local network.']
  ]
}
const faqs = computed(() => (faqCopy[locale.value] || faqCopy.fr).map(([question, answer]) => ({ question, answer })))

async function selectDestination(destination, shouldScroll = true) {
  selectedDestination.value = destination
  selectedPlan.value = null
  if (shouldScroll) {
    await nextTick()
    document.getElementById('package-selection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function choosePopularPack(pack) {
  await selectDestination(pack.destination, false)
  await nextTick()
  selectedPlan.value = availablePlans.value.find(plan => plan.key === pack.key) || availablePlans.value[0] || null
  scrollToPlans()
}

function buyPopularPack(pack) {
  const destination = pack.destination
  addToCart({
    id: `${destination.slug}-${pack.key}`,
    destinationName: destinationName(destination),
    names: destination.names,
    destinationSlug: destination.slug,
    flag: destination.flag || '🌍',
    image: destination.type === 'region' ? flagUrl(destination) : destination.image,
    iso: destination.iso,
    planKey: pack.key,
    data: pack.data.replace(' ', ''),
    dataLabel: pack.data,
    days: pack.days,
    price: priceFromMad(pack.price),
    currency: getPreferredCurrency(),
    esimGoBundleName: pack.esimGoBundleName,
    quantity: 1,
  })
  posthog.capture('plan_added_to_cart', {
    destination_slug: destination.slug,
    destination_type: destination.type || 'country',
    plan_key: pack.key,
    data_amount: pack.data,
    validity_days: pack.days,
    currency: getPreferredCurrency(),
    unit_price: priceFromMad(pack.price),
    add_source: 'featured_plan',
  })
  router.push('/cart')
}

function changeLanguage(language) {
  router.push(localePath(route, language))
}

function syncLanguage(event) {
  locale.value = event.detail || i18n.global.locale
}

function flagUrl(destination) {
  try {
    if (destination.type === 'region') {
      return destination.slug === 'europe'
        ? require('@/assets/images/flags/regions/europe.png')
        : require('@/assets/images/flags/regions/regions.png')
    }
    const flagIso = destination.iso === 'IC' ? 'ES' : destination.iso
    return require(`@/assets/images/flags/${flagIso.toLowerCase()}.svg`)
  } catch (error) {
    return require('@/assets/images/flags/regions/regions.png')
  }
}

function destinationName(destination) {
  if (destination?.slug === 'europe') return locale.value === 'ar' ? 'أوروبا' : 'Europe'
  return destination?.names?.[locale.value] || destination?.name || ''
}

function dayLabel(days) {
  if (locale.value === 'ar') return days >= 3 && days <= 10 ? c.value.days : c.value.day
  return days === 1 ? c.value.day : c.value.days
}

function formatPrice(price) {
  const numberLocale = locale.value === 'ar' ? 'ar-MA' : locale.value === 'en' ? 'en-US' : 'fr-MA'
  return new Intl.NumberFormat(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(priceFromMad(price))
}

async function selectPlanAndCheckout(plan) {
  selectedPlan.value = plan
  await nextTick()
  await buySelectedPlan()
}

async function buySelectedPlan() {
  const destination = selectedDestination.value
  const plan = selectedPlan.value
  if (!destination || !plan) return
  addToCart({
    id: `${destination.slug}-${plan.key}`,
    destinationName: destinationName(destination),
    names: destination.names,
    destinationSlug: destination.slug,
    flag: destination.flag || '🌍',
    image: destination.type === 'region' ? flagUrl(destination) : destination.image,
    iso: destination.iso,
    planKey: plan.key,
    data: `${plan.dataValue}GB`,
    dataLabel: plan.data,
    days: plan.days,
    price: priceFromMad(plan.price),
    currency: getPreferredCurrency(),
    esimGoBundleName: plan.esimGoBundleName,
    quantity: 1,
  })
  posthog.capture('plan_added_to_cart', {
    destination_slug: destination.slug,
    destination_type: destination.type || 'country',
    plan_key: plan.key,
    data_amount: plan.data,
    validity_days: plan.days,
    currency: getPreferredCurrency(),
    unit_price: priceFromMad(plan.price),
    add_source: 'plan_selector',
  })
  checkoutOpen.value = true
  snackbar.value = true
  await nextTick()
  scrollToCheckout()
}

function scrollToPlans() {
  const plans = document.getElementById('plans')
  if (!plans) return

  const headerOffset = window.innerWidth <= 600 ? 96 : 80
  const top = plans.getBoundingClientRect().top + window.scrollY - headerOffset
  window.scrollTo({ top, behavior: 'smooth' })
}

function scrollToCheckout() {
  document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  window.addEventListener('language-changed', syncLanguage)
  checkoutOpen.value = getCart().length > 0
})

onBeforeUnmount(() => {
  window.removeEventListener('language-changed', syncLanguage)
})

watch(locale, () => {
  document.title = c.value.title
}, { immediate: true })
</script>

<style scoped>
.one-page { --ink:#2f1b2a; --green:#d91c58; --mint:#fde7f0; --coral:#e72a64; --cream:#fffbf8; display:block;width:100%;max-width:100%;min-width:0;margin:0;background:#fff;color:var(--ink);overflow:hidden;font-family:inherit; }
.one-page * { box-sizing:border-box; }
.one-page > *,
.one-page :deep(.v-container) { width:100%;min-width:0; }
.page-language-bar{position:relative;z-index:3;background:#fffbf8;color:#2f1b2a;padding:12px 0 5px}.language-bar-inner{min-height:42px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;white-space:nowrap}.language-prompt{display:flex;align-items:center;gap:7px;color:#765f6d;font-size:13px;font-weight:700}.language-options{display:flex;gap:8px;direction:rtl;flex-wrap:nowrap}.language-options button{position:relative;z-index:4;min-width:92px;border:1px solid #e4ddd8;background:#fffbf8;color:#6d5362;border-radius:99px;padding:7px 12px;display:flex;align-items:center;justify-content:center;gap:6px;font:inherit;font-size:13px;cursor:pointer;transition:.18s;white-space:nowrap}.language-options button:hover{border-color:#ef7891;color:#d91c58}.language-options button.active{background:#fff;color:#d91c58;border-color:#e72a64;font-weight:800}
.one-page[dir="rtl"] .language-prompt{direction:ltr;flex-direction:row-reverse}.one-page[dir="ltr"] .language-prompt{direction:ltr;flex-direction:row}
.hero-section { position:relative; min-height:690px; display:flex; align-items:center; background:#fffbf8; isolation:isolate; overflow:clip; }
.hero-container { display:grid; grid-template-columns:1.05fr .95fr; align-items:center; gap:70px; padding-top:32px; padding-bottom:75px; position:relative; z-index:2; }
.hero-glow { display:none; }
.hero-glow-one { width:460px;height:460px;background:rgba(192,232,217,.55);left:-170px;top:-170px; }
.hero-glow-two { width:280px;height:280px;background:rgba(249,198,170,.2);right:38%;bottom:-100px; }
.eyebrow,.section-kicker { display:inline-flex;align-items:center;gap:8px;color:var(--green);background:#fde7f0;border:1px solid #f4bfd2;border-radius:99px;padding:8px 14px;font-size:14px;font-weight:700; }
.hero-copy h1 { font-size:clamp(42px,5vw,72px);line-height:1.15;letter-spacing:-2px;margin:22px 0;color:var(--ink);font-weight:900; }
.hero-title-line{display:block;text-align:center;color:var(--ink)}
.hero-copy h1 .hero-accent-line { display:inline-block;color:var(--coral);position:relative; }
.hero-copy h1 .hero-accent-line:after { content:'';position:absolute;right:0;left:5%;bottom:-7px;height:9px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='9'%3E%3Cpath d='M2 7 C70 1 180 1 298 5' fill='none' stroke='%23efb39e' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E") center/100% 100% no-repeat; }
.hero-lead { font-size:19px;line-height:1.9;color:#705b68;max-width:620px;margin:0 0 28px; }
.hero-actions { width:100%;display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap; }
.one-page[dir="rtl"] .hero-copy h1{line-height:1.46;letter-spacing:0;margin-bottom:52px}
.one-page[dir="rtl"] .hero-copy h1 .hero-accent-line{padding-bottom:.22em}
.one-page[dir="rtl"] .hero-copy h1 .hero-accent-line:after{bottom:-18px}
.primary-cta,.buy-button { background:var(--coral)!important;color:#fff!important;font-weight:800!important;letter-spacing:0!important;padding-inline:28px!important;box-shadow:0 10px 25px rgba(217,28,88,.24)!important; }
.hero-visual { height:520px;position:relative;display:flex;align-items:center;justify-content:center;direction:ltr; }
.hero-artwork { display:block;width:100%;height:100%;object-fit:cover;object-position:center;border-radius:0;box-shadow:none; }
.orbit { position:absolute;border:1px dashed rgba(217,28,88,.22);border-radius:50%; }.orbit-one{width:440px;height:440px}.orbit-two{width:350px;height:350px}
.phone-shell { width:245px;height:480px;border-radius:38px;background:#3a1b30;padding:9px;box-shadow:0 35px 60px rgba(70,24,52,.24);transform:rotate(-5deg);position:relative;z-index:2; }
.phone-top { position:absolute;z-index:3;top:16px;left:50%;transform:translateX(-50%);width:75px;height:20px;background:#3a1b30;border-radius:15px; }
.phone-screen { height:100%;border-radius:31px;background:linear-gradient(160deg,#fffafd,#fff0f5);padding:19px 16px;display:flex;flex-direction:column;align-items:center;color:var(--ink); }
.signal-row { width:100%;display:flex;justify-content:space-between;font-size:10px;margin-bottom:38px; }
.screen-logo { width:120px;height:46px;object-fit:contain;margin-bottom:30px; }
.connected-icon { width:86px;height:86px;display:grid;place-items:center;border-radius:50%;background:#f8cad9;color:var(--green);margin-bottom:15px;box-shadow:0 0 0 12px rgba(248,202,217,.4); }
.phone-screen strong { font-size:22px;margin-bottom:4px; }.phone-screen small { color:#6f807c; }
.one-page[dir="rtl"] .phone-screen>strong{direction:rtl;unicode-bidi:isolate}.one-page[dir="ltr"] .phone-screen>strong{direction:ltr;unicode-bidi:isolate}
.usage-card { background:#fff;border-radius:18px;padding:14px;width:100%;margin-top:35px;box-shadow:0 8px 25px rgba(21,62,55,.08); }.usage-card span,.usage-card b{display:block}.usage-card b{font-size:20px;margin:3px 0 8px}.usage-card div{height:6px;background:#e5eee9;border-radius:8px;overflow:hidden}.usage-card i{display:block;width:76%;height:100%;background:var(--coral)}
.floating-card { position:absolute;z-index:3;background:rgba(255,255,255,.94);box-shadow:0 15px 35px rgba(92,28,62,.13);border-radius:16px;padding:12px 15px;display:flex;align-items:center;gap:10px;font-size:25px;line-height:1.2;backdrop-filter:blur(8px); }.floating-card span{font-size:12px;color:#765f6d}.floating-card b{font-size:14px;color:var(--ink)}.flag-card{top:85px;right:5px}.speed-card{bottom:75px;left:0}.speed-card>.v-icon{color:#d91c58;background:#fde7f0;border-radius:50%;padding:18px}.activation-card{bottom:15px;right:5px}.activation-card>.v-icon{color:#16835f;background:#e3f5ee;border-radius:50%;padding:18px}
.proof-strip { background:#fff1f5;color:var(--ink); }.proof-grid { display:grid;grid-template-columns:repeat(4,1fr);padding-top:26px;padding-bottom:26px; }.proof-grid div{text-align:center;display:flex;flex-direction:column;gap:3px}.proof-grid div+div{border-inline-start:1px solid #ead7df}.proof-grid b{font-size:21px;color:#d91c58}.proof-grid span{font-size:13px;color:#6f5966}
.popular-packs-section{padding:82px 0 88px;background:#fff}.popular-heading{margin-bottom:32px}.popular-packs-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:980px;margin:auto}.popular-pack-card{position:relative;min-height:230px;background:#fffbf8;border:2px solid #eadde3;border-radius:22px;padding:20px;text-align:start;color:var(--ink);font:inherit;cursor:pointer;transition:.2s;overflow:hidden}.popular-pack-card:hover{border-color:#e72a64;transform:translateY(-3px);box-shadow:0 14px 28px rgba(92,28,62,.09)}.discount-badge{position:absolute;left:0;right:auto;top:0;background:#d91c58;color:#fff;border-radius:0 0 14px 0;padding:7px 13px;font-size:12px;font-weight:900;direction:ltr}.one-page[dir="ltr"] .discount-badge{left:auto;right:0;border-radius:0 0 0 14px}.popular-pack-top{display:flex;align-items:center;gap:10px;font-weight:900;font-size:17px;padding-inline-end:54px}.popular-pack-top img{width:34px;height:24px;object-fit:cover;border-radius:4px;box-shadow:0 2px 5px rgba(0,0,0,.16)}.popular-pack-top span{flex:1}.popular-pack-body{display:flex;flex-direction:column;align-items:stretch;gap:16px;margin-top:20px}.popular-pack-details{display:flex;align-items:center}.popular-pack-data{display:flex;align-items:baseline;gap:7px}.popular-pack-data strong{font-size:29px;line-height:1}.popular-pack-data span{font-size:13px;color:#806c77}.popular-pack-validity{display:flex;align-items:center;gap:7px;margin-top:14px;color:#806c77;font-size:14px}.popular-pack-price{display:flex;align-items:baseline;gap:5px;color:#d91c58;white-space:nowrap;width:100%}.one-page[dir="rtl"] .popular-pack-price{direction:rtl;justify-content:flex-start;text-align:right}.one-page[dir="ltr"] .popular-pack-price{direction:ltr;justify-content:flex-start;text-align:left}.popular-pack-price b{font-size:35px;line-height:1}.popular-pack-price small{font-size:14px;font-weight:800}.popular-buy-button{margin-top:22px;background:#d91c58!important;color:#fff!important;font-weight:900!important;letter-spacing:0!important}.one-page[dir="rtl"] .popular-pack-card,.one-page[dir="rtl"] .popular-pack-top,.one-page[dir="rtl"] .popular-pack-body,.one-page[dir="rtl"] .popular-pack-details,.one-page[dir="rtl"] .popular-pack-data,.one-page[dir="rtl"] .popular-pack-validity{direction:rtl}.one-page[dir="ltr"] .popular-pack-card,.one-page[dir="ltr"] .popular-pack-top,.one-page[dir="ltr"] .popular-pack-body,.one-page[dir="ltr"] .popular-pack-details,.one-page[dir="ltr"] .popular-pack-data,.one-page[dir="ltr"] .popular-pack-validity{direction:ltr}
.plans-section { padding:95px 0 36px;background:#fff;scroll-margin-top:80px; }.section-heading{text-align:center;max-width:680px;margin:0 auto 45px}.section-heading>span{font-size:14px;color:var(--coral);font-weight:800}.section-heading h2{font-size:clamp(30px,4vw,45px);line-height:1.3;margin:8px 0 10px;font-weight:900}.section-heading p{color:#697975;font-size:17px}
.purchase-card { max-width:1240px;margin:auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,480px);grid-template-areas:"package destination";gap:clamp(40px,5vw,72px);align-items:start;background:transparent; }.purchase-card--single{grid-template-columns:minmax(0,680px);grid-template-areas:"destination";justify-content:right}
.destination-panel,.package-panel{min-width:0;border:0;border-block-start:1px solid #e9e1dd;border-radius:0;box-shadow:none}.destination-panel { grid-area:destination;padding:24px 0 8px;background:transparent;scroll-margin-top:78px }.package-panel{grid-area:package;padding:24px clamp(16px,2vw,28px) 28px;background:#fffbf8;scroll-margin-top:78px}.step-label{display:flex;align-items:center;gap:15px;font-size:25px;font-weight:900;margin-bottom:30px}.step-label i{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:var(--green);color:#fff;font-style:normal;font-size:18px}.step-label small{margin-inline-start:auto;color:#806572;font-size:13px;font-weight:700;background:#fffbf8;padding:7px 11px;border-radius:99px}
.one-page[dir="rtl"] .step-label{direction:ltr;justify-content:flex-end}.one-page[dir="rtl"] .step-label i{order:3}.one-page[dir="rtl"] .step-label>span{order:2;direction:rtl;text-align:right}.one-page[dir="rtl"] .step-label small{order:1;margin:0;margin-right:auto;direction:rtl}.one-page[dir="ltr"] .step-label{direction:ltr;justify-content:flex-start}.one-page[dir="ltr"] .step-label i{order:1}.one-page[dir="ltr"] .step-label>span{order:2}.one-page[dir="ltr"] .step-label small{order:3;margin-left:auto}
.search-wrap { height:64px;background:#fffbf8;border:1px solid #e5dcd7;border-radius:14px;padding:0 19px;display:flex;align-items:center;gap:12px;margin-bottom:20px;color:#83928e;font-size:17px}.search-wrap .v-icon{font-size:26px!important}.search-wrap input{border:0;outline:0;background:transparent;width:100%;font:inherit;color:var(--ink)}
.destination-list{display:flex;flex-direction:column;gap:7px;max-height:470px;overflow:auto;padding-inline-end:4px}.destination-option{min-height:50px;border:1px solid transparent;background:transparent;border-radius:12px;padding:12px 14px;display:flex;gap:12px;align-items:center;text-align:start;color:var(--ink);cursor:pointer;font:inherit;font-size:15px}.destination-option>span{flex:1;text-align:start}.destination-option:hover{background:#fff}.destination-option.active{background:#fff;border-color:#e990ae;box-shadow:0 5px 14px rgba(92,28,62,.07);font-weight:800}.destination-option img,.selected-country img{width:32px;height:23px;flex:0 0 32px;object-fit:cover;border-radius:4px;box-shadow:0 1px 3px #aaa}.destination-option .v-icon{color:var(--green);margin-inline-start:auto}.one-page[dir="rtl"] .destination-option,.one-page[dir="rtl"] .selected-country>div{direction:rtl}.one-page[dir="ltr"] .destination-option,.one-page[dir="ltr"] .selected-country>div{direction:ltr}.no-results{text-align:center;color:#806d78;margin:30px 0}
.destination-group+.destination-group{margin-top:14px}.destination-group-title{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:7px;margin-bottom:6px;padding:7px 8px;border-radius:9px;background:#fffbf8;color:#765f6d;font-size:12px}.destination-group-title strong{font-size:13px;color:var(--ink)}.destination-group-title>span{margin-inline-start:auto;min-width:25px;text-align:center;background:#fff;border:1px solid #e8ddd7;border-radius:99px;padding:2px 6px;font-weight:800}.destination-group--popular .destination-group-title{background:#fff0f5;color:#d91c58}.destination-group--regions .destination-group-title{background:#fffbf8;color:#765f6d}.destination-option.region-option{margin-bottom:4px;background:#fff;border-color:#f1d5df}.destination-option.region-option:hover,.destination-option.region-option.active{border-color:#d91c58}.destination-option>small{color:#9a7886;font-size:10px;white-space:nowrap}.one-page[dir="rtl"] .destination-group-title{direction:rtl}.one-page[dir="ltr"] .destination-group-title{direction:ltr}
.destination-group{display:flex;flex-direction:column;width:100%;padding:8px;border:1px solid #eee3df;border-radius:14px;align-self:start;background:rgba(255,255,255,.45)}.destination-group .destination-option{width:100%;max-width:none}.one-page[dir="rtl"] .destination-group .destination-option{margin-left:auto;margin-right:0}.one-page[dir="ltr"] .destination-group .destination-option{margin-left:0;margin-right:auto}
.destination-group--countries .destination-option{margin-bottom:4px;background:#fff;border-color:#e8dfda}.destination-group--countries .destination-option:hover{border-color:#e7a0b7;box-shadow:0 5px 14px rgba(92,28,62,.06)}.destination-group--countries .destination-option.active{border-color:#d91c58}
.country-english-name{color:#aa98a1!important;font-size:11px!important;font-weight:500;direction:ltr;white-space:nowrap}
.selected-country { display:flex;justify-content:space-between;align-items:center;padding:15px 17px;border:1px solid #eadfda;border-radius:12px;background:#fffbf8;margin-bottom:18px;gap:12px}.selected-country>div{display:flex;gap:10px;align-items:center;font-weight:800}.selected-country small{color:#806572}
.region-country-flags{margin:-2px 0 18px;padding:13px 15px;border:1px solid #f0e2e8;border-radius:12px;background:#fffafd}.region-country-flags-title{display:block;margin-bottom:10px;color:#765f6d;font-size:12px;font-weight:800}.region-country-flags-list{display:flex;flex-wrap:wrap;gap:7px}.region-country-flags-list img{width:30px;height:21px;object-fit:cover;border-radius:4px;border:1px solid rgba(47,27,42,.1);box-shadow:0 2px 5px rgba(47,27,42,.12)}
.one-page[dir="rtl"] .region-country-flags{text-align:right;direction:rtl}.one-page[dir="ltr"] .region-country-flags{text-align:left;direction:ltr}
.one-page[dir="rtl"] .selected-country{direction:rtl;text-align:right}.one-page[dir="rtl"] .selected-country>div{order:1;flex-direction:row;justify-content:flex-start}.one-page[dir="rtl"] .selected-country small{order:2;text-align:left}.one-page[dir="ltr"] .selected-country{direction:ltr;text-align:left}
.package-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.plan-option{min-height:118px;position:relative;background:#fff;border:1.5px solid #eadde3;border-radius:14px;padding:15px;display:grid;grid-template-columns:24px 1fr auto;grid-template-rows:auto auto;align-items:center;text-align:start;cursor:pointer;color:var(--ink);font:inherit;transition:.2s}.one-page[dir="rtl"] .plan-option{direction:rtl}.one-page[dir="ltr"] .plan-option{direction:ltr}.plan-option:hover{border-color:#e990ae;transform:translateY(-1px)}.plan-option.active{border-color:var(--green);background:#fffbf8;box-shadow:0 4px 0 var(--green)}.radio-dot{width:18px;height:18px;border:2px solid #c9b7c0;border-radius:50%;grid-row:1/3}.active .radio-dot{border:5px solid var(--green)}.plan-data{display:flex;gap:7px;align-items:baseline}.plan-data b{font-size:21px}.plan-data small{color:#806d78}.plan-validity{display:flex;align-items:center;gap:5px;color:#796470;font-size:13px}.plan-option>strong{font-size:20px;color:var(--green);grid-row:1/3;grid-column:3}.plan-option>strong small{font-size:11px}.plan-option em{position:absolute;inset-inline-end:12px;top:-9px;background:var(--coral);color:#fff;border-radius:99px;padding:3px 8px;font-size:10px;font-style:normal;font-weight:800}
.checkout-row{display:flex;align-items:center;justify-content:space-between;margin-top:25px;padding-top:22px;border-top:1px solid #e6ecea;gap:20px}.total-block{display:flex;flex-direction:column}.total-block small{color:#788682}.total-block strong{font-size:27px;color:var(--ink)}.total-block strong span{font-size:13px}.buy-button{min-width:210px}.secure-note{text-align:center;color:#71817c;font-size:12px;margin-top:17px;display:flex;justify-content:center;gap:5px;align-items:center}
.total-block{width:100%;max-width:none;flex:1;flex-direction:row;align-items:center;justify-content:space-between;gap:16px}.total-block small{text-align:start}.total-block strong{text-align:end;white-space:nowrap}.one-page[dir="rtl"] .total-block{direction:ltr}.one-page[dir="rtl"] .total-block small{direction:rtl}.one-page[dir="rtl"] .total-block strong{direction:ltr}.one-page[dir="ltr"] .total-block{direction:rtl}.one-page[dir="ltr"] .total-block small,.one-page[dir="ltr"] .total-block strong{direction:ltr}
.checkout-section{padding:34px 0 42px;background:#fff;scroll-margin-top:65px}.checkout-heading{margin-bottom:34px}.embedded-checkout{max-width:1240px;margin:auto}.embedded-checkout :deep(.cart-page){max-width:none!important;min-height:0!important;padding-top:12px!important;padding-bottom:8px!important}.embedded-checkout :deep(.summary-card),.embedded-checkout :deep(.contact-card),.embedded-checkout :deep(.checkout-card),.embedded-checkout :deep(.embedded-payment-card){background:transparent!important;border:0!important;border-block-start:1px solid #e5dcd7!important;border-radius:0!important;box-shadow:none!important}.embedded-checkout :deep(.summary-card),.embedded-checkout :deep(.contact-card){padding:28px 20px 12px!important}.embedded-checkout :deep(.embedded-payment-card){padding-top:28px!important}.embedded-checkout :deep(.summary-column){padding-inline-end:clamp(24px,4vw,56px)!important}.embedded-checkout :deep(.contact-column){padding-inline-start:clamp(24px,4vw,56px)!important;border-inline-start:1px solid #e5dcd7}.embedded-checkout :deep(.v-btn.bg-green-darken-1){background:#d91c58!important;color:#fff!important}.embedded-checkout :deep(.subsection-title){font-family:inherit!important;color:var(--ink)}
.embedded-checkout :deep(.v-field--focused .v-field__outline),.embedded-checkout :deep(.v-field--focused .v-icon){color:#1976d2!important}
.embedded-checkout :deep(.v-radio .v-label){padding:0!important;margin:0!important}.embedded-checkout :deep(.v-radio .v-selection-control__wrapper){margin:0!important}
.one-page[dir="rtl"] .embedded-checkout :deep(.v-radio){width:100%;direction:ltr!important;flex-direction:row!important}.one-page[dir="rtl"] .embedded-checkout :deep(.v-radio .v-selection-control__wrapper){display:flex!important;visibility:visible!important;opacity:1!important;flex:0 0 auto;order:1}.one-page[dir="rtl"] .embedded-checkout :deep(.v-radio .v-label){width:100%;max-width:none;flex:1;order:0;direction:rtl;text-align:right;justify-content:flex-start}.one-page[dir="rtl"] .embedded-checkout :deep(.v-radio .v-label>div){width:100%;direction:rtl;text-align:right}
.one-page[dir="rtl"] .embedded-checkout :deep(.payment-card .d-flex.justify-space-between){direction:ltr!important;flex-direction:row-reverse!important}.one-page[dir="ltr"] .embedded-checkout :deep(.payment-card .d-flex.justify-space-between){direction:ltr;flex-direction:row}
.one-page[dir="rtl"] .embedded-checkout :deep(.summary-card>.d-flex.justify-space-between.mb-4){direction:ltr!important;flex-direction:row-reverse!important}.one-page[dir="ltr"] .embedded-checkout :deep(.summary-card>.d-flex.justify-space-between.mb-4){direction:ltr;flex-direction:row}
.one-page[dir="rtl"] .embedded-checkout :deep(.policy-acceptance .v-selection-control){direction:rtl!important;text-align:right}.one-page[dir="rtl"] .embedded-checkout :deep(.policy-acceptance .v-label){justify-content:flex-start;text-align:right}.one-page[dir="rtl"] .embedded-checkout :deep(.payment-security){direction:rtl;justify-content:flex-start;text-align:right}
.one-page[dir="rtl"] .embedded-checkout :deep(.compatibility-confirmation .v-selection-control){direction:rtl!important;text-align:right}.one-page[dir="rtl"] .embedded-checkout :deep(.compatibility-confirmation .v-label){justify-content:flex-start;text-align:right}
.one-page[dir="rtl"] .embedded-checkout :deep(.compatibility-heading),.one-page[dir="rtl"] .embedded-checkout :deep(.compatibility-details){direction:rtl;text-align:right}.one-page[dir="rtl"] .embedded-checkout :deep(.compatibility-heading){flex-direction:row;justify-content:flex-start}
.embedded-checkout :deep(.cart-step-title){display:flex;align-items:center;gap:15px;margin-bottom:28px!important;font-size:25px;font-weight:900}.embedded-checkout :deep(.cart-step-title .subsection-title){font-size:25px;line-height:1.4;font-weight:900}.embedded-checkout :deep(.cart-step-number){width:44px;height:44px;flex:0 0 44px;border-radius:50%;background:var(--green);color:#fff;font-size:18px;font-weight:900}.one-page[dir="rtl"] .embedded-checkout :deep(.cart-step-title){direction:ltr;justify-content:flex-end}.one-page[dir="rtl"] .embedded-checkout :deep(.cart-step-number){order:2}.one-page[dir="rtl"] .embedded-checkout :deep(.cart-step-title .subsection-title){order:1;direction:rtl;text-align:right}.one-page[dir="ltr"] .embedded-checkout :deep(.cart-step-number){order:1}.one-page[dir="ltr"] .embedded-checkout :deep(.cart-step-title .subsection-title){order:2}
.how-section{padding:95px 0;background:var(--ink);color:#fff}.section-heading.light h2{color:#fff}.steps-grid{display:grid;grid-template-columns:1fr 50px 1fr 50px 1fr;align-items:center;gap:15px}.how-card{position:relative;text-align:center;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:33px 24px;min-height:255px}.how-card>i{position:absolute;right:18px;top:14px;color:#f09ab7;font-style:normal;font-weight:900}.how-icon{width:72px;height:72px;margin:0 auto 18px;display:grid;place-items:center;border-radius:19px;background:#5b2443;color:#f5afc7}.how-icon .v-icon{font-size:36px}.how-card h3{font-size:20px;margin-bottom:10px}.how-card p{color:#dfccd6;line-height:1.8;font-size:14px}.step-arrow{text-align:center;color:#e482a4}
.benefits-section{padding:48px 0 72px;background:#fff}.benefits-layout{display:grid;grid-template-columns:.8fr 1.2fr;gap:80px;align-items:center}.benefit-copy{text-align:center}.benefit-copy h2{font-size:40px;line-height:1.4;margin:0 0 14px}.benefit-copy p{color:#715d69;line-height:1.9;font-size:17px;margin-inline:auto}.benefit-copy a{display:inline-flex;align-items:center;gap:6px;color:var(--green);font-weight:800;margin-top:16px}.benefit-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.benefit-grid>div{background:#fff;border:1px solid #f0dce4;border-radius:18px;padding:25px}.benefit-grid .v-icon{color:var(--coral);background:#fde7f0;border-radius:12px;padding:22px;font-size:25px}.benefit-grid h3{margin:17px 0 8px}.benefit-grid p{color:#796671;line-height:1.7;font-size:14px}
.benefit-apps-visual{position:relative;width:100%;aspect-ratio:2.35 / 1;overflow:hidden}.benefit-apps-visual img{position:absolute;inset:0;width:100%;height:auto;transform:translateY(-18%)}
.faq-section{padding:95px 0;background:#fffbf8}.faq-container{max-width:850px}.faq-panels{border-top:1px solid #dfe6e3}.faq-panels :deep(.v-expansion-panel){border-bottom:1px solid #dfe6e3;background:transparent}.faq-panels :deep(.v-expansion-panel-title){font-size:17px;font-weight:800;padding:23px 5px}.faq-panels :deep(.v-expansion-panel-text__wrapper){color:#63736e;line-height:1.9;padding:0 5px 22px}
.final-cta{background:var(--coral);color:#fff;padding:60px 0}.final-cta .v-container{display:flex;justify-content:space-between;align-items:center;gap:30px}.final-cta span{font-weight:800;opacity:.8}.final-cta h2{font-size:34px;margin:6px 0}.final-cta p{opacity:.85}.final-cta .v-btn{background:#fff;color:var(--ink);font-weight:900;letter-spacing:0;padding-inline:28px}.snackbar-content{display:flex;align-items:center;gap:10px}.snackbar-content .v-btn{color:#a9e0ce;margin-right:auto}
@media(max-width:960px){.hero-container{grid-template-columns:1fr;text-align:center;padding-top:75px}.hero-lead{margin-inline:auto}.hero-actions{justify-content:center}.hero-visual{height:470px}.purchase-card{grid-template-columns:1fr;grid-template-areas:"destination" "package";gap:54px}.purchase-card--single{grid-template-areas:"destination"}.destination-list{display:grid;grid-template-columns:1fr;max-height:460px}.embedded-checkout :deep(.summary-column),.embedded-checkout :deep(.contact-column){padding-inline:12px!important}.embedded-checkout :deep(.contact-column){border-inline-start:0}.embedded-checkout :deep(.summary-column){margin-top:34px}.benefits-layout{grid-template-columns:1fr;gap:45px}.steps-grid{grid-template-columns:1fr}.step-arrow{transform:rotate(-90deg)}.proof-grid{grid-template-columns:1fr 1fr;gap:20px}.proof-grid div{border:0}.final-cta .v-container{flex-direction:column;text-align:center}}
@media(max-width:960px){.popular-packs-grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.one-page :deep(.v-container){padding-left:12px!important;padding-right:12px!important}.page-language-bar{padding:10px 0 3px}.language-bar-inner{flex-direction:column;justify-content:center;gap:7px;padding-inline:8px!important}.language-prompt{display:flex;font-size:12px;gap:5px}.language-prompt .v-icon{font-size:17px!important}.language-options{width:auto;max-width:100%;justify-content:center;gap:5px;min-width:0}.language-options button{min-width:0;padding:6px 8px;font-size:11px;gap:4px}.hero-section{min-height:auto}.hero-container{padding-top:24px;padding-bottom:50px}.hero-copy h1{font-size:40px;letter-spacing:-1px}.hero-lead{font-size:16px}.hero-actions{flex-direction:column}.hero-visual{height:470px;margin-top:12px}.proof-grid b{font-size:18px}.plans-section,.how-section,.benefits-section,.faq-section{padding:70px 0}.section-heading{margin-bottom:30px}.destination-panel{padding:20px 0 4px}.package-panel{padding:20px 12px 20px}.step-label{font-size:21px;margin-bottom:24px}.step-label i{width:38px;height:38px;font-size:16px}.destination-list{grid-template-columns:1fr;max-height:460px}.package-grid{grid-template-columns:1fr}.selected-country{align-items:flex-start;flex-direction:column}.one-page[dir="rtl"] .selected-country>div,.one-page[dir="rtl"] .selected-country small{width:100%;text-align:right}.one-page[dir="rtl"] .selected-country>div{justify-content:flex-start}.one-page[dir="ltr"] .selected-country>div,.one-page[dir="ltr"] .selected-country small{width:100%;text-align:left}.checkout-row{align-items:stretch;flex-direction:column}.buy-button{width:100%}.benefit-copy h2{font-size:31px}.benefit-grid{grid-template-columns:1fr}.final-cta h2{font-size:28px}.final-cta .v-btn{width:100%}}
@media(max-width:600px){.plans-section{padding-bottom:28px}.checkout-section{padding-top:24px}}
@media(max-width:600px){.plans-section{scroll-margin-top:96px}}
@media(max-width:600px){.benefits-section{padding-top:30px}.benefit-copy h2{font-size:30px;line-height:1.35}.benefit-copy p{font-size:16px;line-height:1.7}}
@media(max-width:600px){.plans-section>.v-container>.section-heading h2{font-size:26px;line-height:1.35;letter-spacing:-.3px}.one-page[dir="rtl"] .plans-section>.v-container>.section-heading h2{line-height:1.5}}
@media(max-width:600px){.embedded-checkout :deep(.cart-page){padding:8px 0!important}.embedded-checkout :deep(.summary-card),.embedded-checkout :deep(.contact-card),.embedded-checkout :deep(.checkout-card){padding:20px 16px 16px!important}.embedded-checkout :deep(.cart-step-title .subsection-title),.embedded-checkout :deep(.checkout-card-title){font-size:21px!important}.embedded-checkout :deep(.cart-step-number){width:38px;height:38px;flex-basis:38px;font-size:16px}.embedded-checkout :deep(.cart-line .text-h6),.embedded-checkout :deep(.summary-card>.d-flex.justify-space-between .text-h6){font-size:16px!important;line-height:1.45}.embedded-checkout :deep(.flag-emoji){font-size:1.6rem}.embedded-checkout :deep(.policy-acceptance .v-selection-control),.embedded-checkout :deep(.compatibility-confirmation .v-selection-control){align-items:flex-start}.embedded-checkout :deep(.policy-acceptance .v-selection-control__wrapper),.embedded-checkout :deep(.compatibility-confirmation .v-selection-control__wrapper){margin-top:1px}.embedded-checkout :deep(.policy-acceptance .v-label),.embedded-checkout :deep(.compatibility-confirmation .v-label){min-width:0;white-space:normal;overflow-wrap:anywhere;font-size:13px;line-height:1.65}.embedded-checkout :deep(.compatibility-link){font-size:12px}.embedded-checkout :deep(.payment-security){font-size:12px;line-height:1.6}.embedded-checkout :deep(.buy-button){font-size:16px!important}}
@media(max-width:600px){.popular-packs-section{padding:62px 0}.popular-packs-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.popular-pack-card{min-width:0;min-height:255px;padding:14px;border-radius:17px}.discount-badge{font-size:10px;padding:5px 8px}.popular-pack-top{gap:7px;font-size:13px;padding-inline-end:35px}.popular-pack-top img{width:27px;height:20px;flex:0 0 27px}.popular-pack-body{height:128px;margin-top:15px;align-items:stretch;flex-direction:column;gap:12px}.popular-pack-data{gap:4px}.popular-pack-data strong{font-size:22px}.popular-pack-data span{font-size:11px}.popular-pack-validity{gap:4px;margin-top:10px;font-size:11px}.popular-pack-validity .v-icon{font-size:16px!important}.popular-pack-price{gap:3px}.popular-pack-price b{font-size:26px}.popular-pack-price small{font-size:11px}.popular-buy-button{margin-top:12px;font-size:11px!important;padding-inline:5px!important}}
.popular-pack-price{margin-top:auto}.popular-buy-button{margin-top:7px}
@media(max-width:600px){.popular-pack-body{gap:9px}.popular-buy-button{margin-top:4px}}
.popular-pack-card{min-height:0}.popular-pack-body{height:auto;flex-direction:row;align-items:center;justify-content:space-between;gap:12px;margin-bottom:0}.popular-pack-price{width:auto;margin-top:0;flex:0 0 auto}.popular-buy-button{margin-top:9px}
@media(max-width:600px){.popular-pack-card{min-height:0}.popular-pack-body{height:auto;flex-direction:row;align-items:center;gap:7px;margin-top:14px}.popular-pack-price{width:auto;margin-top:0}.popular-pack-price b{font-size:23px}.popular-buy-button{margin-top:7px}}
.popular-pack-body{flex-direction:column;align-items:stretch;justify-content:flex-start;gap:14px;margin-top:24px;margin-bottom:18px}.popular-pack-price{width:100%;margin:0}.popular-buy-button{margin-top:0}
@media(max-width:600px){.popular-pack-body{height:auto;flex-direction:column;align-items:stretch;gap:11px;margin-top:18px;margin-bottom:14px}.popular-pack-price{width:100%;margin:0}.popular-pack-price b{font-size:25px}.popular-buy-button{margin-top:0}}
.popular-packs-section{padding-bottom:32px}.plans-section{padding-top:42px}
@media(max-width:600px){.popular-packs-section{padding-bottom:24px}.plans-section{padding-top:34px}}
.compact-steps-section{background:#fffbf8;padding:8px 0 24px}.compact-steps-container{padding-inline:clamp(16px,4vw,64px)}.compact-steps-heading{margin-bottom:27px}.compact-steps-heading h2{font-size:clamp(27px,3.5vw,38px)}.compact-steps{width:100%;display:grid;grid-template-columns:1fr;gap:10px}.compact-step{min-height:86px;display:flex;align-items:center;gap:16px;padding:13px 20px;background:#fff;border:1px solid #e1e3e6;border-radius:17px;box-shadow:0 7px 16px rgba(48,28,39,.07);color:var(--ink)}.compact-step i{width:37px;flex:0 0 37px;color:#d91c58;font-size:21px;font-weight:900;font-style:normal;text-align:center}.compact-step>.v-icon{width:42px;flex:0 0 42px;color:#2f1b2a;font-size:36px}.compact-step>div{flex:1}.compact-step strong{display:block;font-size:15px;line-height:1.4}.compact-step p{margin:4px 0 0;color:#786873;font-size:12px;line-height:1.55;font-weight:400}.one-page[dir="rtl"] .compact-step{direction:rtl}.one-page[dir="rtl"] .compact-step>div{text-align:right}.one-page[dir="ltr"] .compact-step{direction:ltr}.one-page[dir="ltr"] .compact-step>div{text-align:left}
@media(max-width:600px){.compact-steps-section{padding:4px 0 16px}.compact-steps-heading{margin-bottom:20px}.compact-steps-heading h2{font-size:26px}.compact-steps-heading p{font-size:14px}.compact-steps{gap:8px}.compact-step{min-height:73px;gap:9px;padding:10px 11px;border-radius:14px}.compact-step i{width:27px;flex-basis:27px;font-size:16px}.compact-step>.v-icon{width:31px;flex-basis:31px;font-size:28px}.compact-step strong{font-size:12px}.compact-step p{margin-top:2px;font-size:10px;line-height:1.4}}

/* Desktop layout: keep content readable and restore the intended multi-column rhythm. */
@media(min-width:961px){
  .one-page :deep(.v-container){max-width:1240px;padding-inline:32px}
  .language-bar-inner{max-width:1240px;min-height:38px;flex-direction:row;justify-content:flex-end;gap:14px;padding-block:4px}
  .one-page[dir="rtl"] .language-bar-inner{direction:rtl;justify-content:flex-start}
  .one-page[dir="ltr"] .language-bar-inner{direction:ltr;justify-content:flex-end}
  .page-language-bar{padding:6px 0}
  .hero-section{min-height:640px}
  .hero-container{max-width:1320px!important;grid-template-columns:minmax(0,1.08fr) minmax(420px,.92fr);gap:48px;padding:38px 48px 70px!important;margin-inline:auto}
  .hero-copy{max-width:680px}
  .hero-copy h1{font-size:clamp(48px,4.7vw,68px)}
  .hero-visual{min-width:0;height:500px}
  .popular-packs-grid{max-width:1180px;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
  .popular-pack-card{display:flex;min-height:285px;flex-direction:column;padding:18px}
  .popular-pack-top{font-size:15px}
  .popular-pack-body{flex:1;margin-top:22px;margin-bottom:16px}
  .popular-pack-data strong{font-size:27px}
  .popular-pack-price b{font-size:31px}
  .compact-steps-section{padding:48px 0 64px}
  .compact-steps-container{max-width:1240px!important;padding-inline:32px!important}
  .compact-steps{grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
  .compact-step{min-height:132px;align-items:flex-start;padding:22px 20px}
  .compact-step p{font-size:13px}
  .plans-section{padding-top:78px}
  .destination-option{min-height:56px;padding:14px 16px;font-size:16px}
  .destination-option img,.selected-country img{width:36px;height:26px;flex-basis:36px}
  .package-grid{gap:15px}
  .plan-option{min-height:132px;padding:18px}
  .plan-data b{font-size:24px}
  .plan-option>strong{font-size:23px}
  .embedded-checkout :deep(.cart-step-title){margin-bottom:28px!important}
  .embedded-checkout :deep(.cart-step-title .subsection-title){font-size:25px}
  .embedded-checkout :deep(.cart-step-number){width:44px;height:44px;flex-basis:44px;font-size:18px}
  .embedded-checkout :deep(.v-field){font-size:16px}
  .one-page[dir="rtl"] .benefits-layout{direction:ltr;grid-template-columns:1.2fr .8fr}
  .one-page[dir="rtl"] .benefit-grid{direction:rtl;grid-column:1;grid-row:1}
  .one-page[dir="rtl"] .benefit-copy{direction:rtl;grid-column:2;grid-row:1}
}

@media(min-width:961px) and (max-width:1120px){
  .hero-container{grid-template-columns:minmax(0,1fr) 400px;gap:24px;padding-inline:32px!important}
  .hero-copy h1{font-size:46px}
  .floating-card{padding:10px 12px}
  .popular-packs-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:900px}
  .popular-pack-card{min-height:250px}
  .purchase-card:not(.purchase-card--single){grid-template-columns:minmax(0,1fr) 390px}
  .package-grid{grid-template-columns:1fr}
}

/* French hero copy is longer, so keep both lines within the text column. */
.one-page.locale-fr .hero-copy h1{font-size:clamp(38px,4vw,54px)}
.one-page.locale-fr .hero-copy h1 .hero-accent-line{display:block;max-width:100%;text-align:center}
@media(max-width:600px){
  .one-page.locale-fr .hero-copy h1{font-size:28px;line-height:1.25;letter-spacing:-.8px}
  .one-page.locale-fr .hero-copy h1 .hero-accent-line{white-space:nowrap;margin-top:6px}
  .proof-grid div+div{border-inline-start:0}
}
@media(max-width:360px){
  .one-page.locale-fr .hero-copy h1{font-size:25px}
}

/* Keep the supplied hero artwork at its original 3:2 landscape ratio. */
.hero-section { align-items:flex-end; }
.hero-container { padding-bottom:0!important; }
.hero-visual { width:100%;height:auto!important;aspect-ratio:3 / 2;align-items:flex-end;overflow:hidden; }
.hero-artwork { width:118%;max-width:none;height:auto;aspect-ratio:3 / 2;object-fit:contain;transform:translateY(3%); }

@media(max-width:960px){
  .hero-container{padding-bottom:0!important}
  .hero-visual{margin-top:0;margin-bottom:0}
  .hero-artwork{width:120%}
}

@media(min-width:961px){
  .hero-section{align-items:center}
}
</style>
