<template>
  <div class="europe-page" dir="ltr">
    <section class="europe-hero">
      <div class="europe-glow europe-glow-one"></div>
      <div class="europe-glow europe-glow-two"></div>
      <v-container class="europe-hero-inner">
        <div class="europe-breadcrumb">
          <router-link :to="localePrefix + '/esim'">eSIMs</router-link>
          <v-icon size="16">mdi-chevron-right</v-icon>
          <strong>Spain</strong>
        </div>
        <div class="europe-hero-grid">
          <div class="europe-hero-copy">
            <h1><span>Stay connected throughout</span><em>Spain</em></h1>
            <p>Travel across Spain with one prepaid eSIM. Stay connected in Madrid, Barcelona, Seville and beyond without changing your physical SIM.</p>
            <div class="europe-actions">
              <v-btn color="#d91c58" rounded="pill" size="x-large" elevation="0" class="europe-primary" @click="scrollEuropePlans">
                See Spain plans<v-icon end>mdi-arrow-down</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="europe-visual">
            <div class="europe-map-card">
              <img :src="spainHeroImage" alt="Spain landmarks with eSIM connectivity">
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <section class="europe-proof-strip">
      <v-container class="europe-proof-grid">
        <div class="proof-highlight"><v-icon>mdi-tag-outline</v-icon><b>Plans from <strong>{{ startingPrice }}</strong></b></div>
      </v-container>
    </section>

    <section id="europe-plans" class="europe-plans-section">
      <v-container>
        <div class="europe-section-heading">
          <span>Flexible prepaid data</span>
          <h2>Choose your Spain eSIM plan</h2>
          <p>Choose the data allowance and validity period that match your stay in Spain.</p>
        </div>
        <div class="europe-plan-grid">
          <button v-for="plan in sortedPlans" :key="plan.key" type="button" class="europe-plan-card" :class="{ active: selectedPlanKey === plan.key }" @click="handleAddToCart(plan)">
            <span v-if="plan.data === '10GB'" class="popular-label">Most popular</span>
            <span class="plan-radio" aria-hidden="true"></span>
            <div class="plan-data"><b>{{ plan.dataLabel }}</b><span>mobile data</span></div>
            <div class="plan-duration"><v-icon size="19">mdi-calendar-blank-outline</v-icon>{{ plan.days }} days</div>
            <div class="plan-price">{{ formatPriceFromMad(plan.price, 'en') }}</div>
          </button>
        </div>
        <v-btn v-if="selectedPlanKey" color="#d91c58" rounded="pill" size="x-large" elevation="0" class="europe-purchase-cta" @click="scrollToCheckout">
          Continue to secure payment<v-icon end>mdi-arrow-down</v-icon>
        </v-btn>
      </v-container>
    </section>

    <section v-if="checkoutOpen" id="europe-checkout" class="europe-checkout-section">
      <v-container>
        <div class="europe-section-heading europe-checkout-heading">
          <span>Final step</span>
          <h2>Complete your order</h2>
          <p>Review your Spain plan, then enter your delivery and secure payment details.</p>
        </div>
        <div class="europe-embedded-checkout">
          <Cart :show-step-numbers="true" />
        </div>
      </v-container>
    </section>

    <section class="europe-explainer-section">
      <v-container class="europe-explainer-container">
        <div class="europe-explainer-copy">
          <span>Spain eSIM explained</span>
          <h2>What is a Spain eSIM?</h2>
          <p>A Spain eSIM is a digital SIM that provides mobile data in Spain without inserting or collecting a physical SIM card.</p>
        </div>
        <div class="europe-facts-grid">
          <div class="europe-fact"><v-icon>mdi-wifi</v-icon><span><b>Mobile data</b><small>Internet access without traditional calls or SMS.</small></span></div>
          <div class="europe-fact"><v-icon>mdi-access-point</v-icon><span><b>Personal hotspot</b><small>Most plans support hotspot use, depending on your device and the local network.</small></span></div>
          <div class="europe-fact"><v-icon>mdi-timer-outline</v-icon><span><b>Validity starts on connection</b><small>The plan starts when the eSIM first connects to a supported network in Spain.</small></span></div>
          <div class="europe-fact"><v-icon>mdi-map-marker-radius</v-icon><span><b>Coverage within Spain</b><small>Use the same eSIM while travelling between covered locations in Spain.</small></span></div>
        </div>
      </v-container>
    </section>

    <section class="europe-network-section">
      <v-container class="europe-network-container">
        <div class="europe-section-heading compact">
          <span>Local network partners</span>
          <h2>Mobile networks and coverage in Spain</h2>
          <p>Your Spain eSIM connects to supported partner operators, with 4G/LTE and 5G where locally available.</p>
        </div>
        <div class="network-disclosure" role="group" aria-label="Partner networks in Spain">
        <div class="network-table-wrap">
          <table class="network-table">
            <thead><tr><th>Country</th><th>Partner network(s)</th></tr></thead>
            <tbody>
              <tr><th>🇪🇸 Spain</th><td><span class="network-operators">Orange (Spain)<br>Telefónica Móviles (Movistar)<br>Vodafone Spain</span><span class="technology-badge">4G / 5G</span></td></tr>
            </tbody>
          </table>
        </div>
        </div>
        <div class="network-notes network-notes-after-table">
          <span><v-icon size="20">mdi-access-point-network</v-icon>Your device selects an available partner network automatically.</span>
          <span><v-icon size="20">mdi-earth-arrow-right</v-icon>Keep data roaming enabled on the eSIM while travelling within Spain.</span>
        </div>
        <p class="network-disclaimer">Network availability, speed and 5G access depend on local coverage, network conditions and device compatibility.</p>
      </v-container>
    </section>

    <section class="europe-use-cases-section">
      <v-container class="europe-use-cases-container">
        <div class="europe-section-heading compact">
          <span>One plan for every stop</span>
          <h2>Who should choose a Spain eSIM?</h2>
          <p>A Spain eSIM is useful for holidays, city breaks, business travel and longer stays within Spain.</p>
        </div>
        <div class="europe-use-cases-grid">
          <div class="europe-use-case-card"><v-icon>mdi-city-variant-outline</v-icon><div><b>Madrid or Barcelona city break</b><p>Use maps, messaging and booking apps throughout your stay.</p></div></div>
          <div class="europe-use-case-card"><v-icon>mdi-beach</v-icon><div><b>Mediterranean coast</b><p>Stay connected while visiting Barcelona, Valencia or nearby destinations.</p></div></div>
          <div class="europe-use-case-card"><v-icon>mdi-image-filter-hdr</v-icon><div><b>Andalusia and southern Spain</b><p>Keep mobile data available for transport and reservations.</p></div></div>
          <div class="europe-use-case-card"><v-icon>mdi-map-marker-path</v-icon><div><b>Multi-city trips</b><p>Use one eSIM while travelling between Spanish cities.</p></div></div>
          <div class="europe-use-case-card"><v-icon>mdi-briefcase-outline</v-icon><div><b>Business travel</b><p>Maintain a data connection for meetings and work apps.</p></div></div>
        </div>
      </v-container>
    </section>

    <section class="europe-comparison-section">
      <v-container class="europe-comparison-container">
        <div class="europe-section-heading compact">
          <span>Choose the right coverage</span>
          <h2>Spain eSIM or international roaming?</h2>
          <p>Compare a prepaid Spain eSIM with using your operator’s international roaming.</p>
        </div>
        <div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead>
              <tr><th></th><th>Spain eSIM</th><th>International roaming</th></tr>
            </thead>
            <tbody>
              <tr><th>Travel in one country</th><td>Possible</td><td>Often more suitable</td></tr>
              <tr><th>Several countries</th><td>Ideal</td><td>Several eSIMs required</td></tr>
              <tr><th>Changing countries</th><td>Same eSIM</td><td>May require another eSIM</td></tr>
              <tr><th>Simplicity</th><td>Very high</td><td>High</td></tr>
            </tbody>
          </table>
        </div>
        <div class="comparison-recommendation">
          <v-icon>mdi-lightbulb-on-outline</v-icon>
          <p>Choose a Spain eSIM when you want prepaid mobile data and a known allowance before departure. Check your home operator’s roaming terms before comparing costs.</p>
        </div>
        <div class="comparison-links">
          <router-link :to="`${localePrefix}/esim/turkiye`"><span class="comparison-link-label">See Turkey eSIMs <span class="comparison-link-flag">🇹🇷</span></span><v-icon size="17">mdi-arrow-right</v-icon></router-link>
          <router-link :to="`${localePrefix}/esim/france`"><span class="comparison-link-label">See France eSIMs <span class="comparison-link-flag">🇫🇷</span></span><v-icon size="17">mdi-arrow-right</v-icon></router-link>
          <router-link :to="`${localePrefix}/esim/portugal`"><span class="comparison-link-label">See Portugal eSIMs <span class="comparison-link-flag">🇵🇹</span></span><v-icon size="17">mdi-arrow-right</v-icon></router-link>
        </div>
      </v-container>
    </section>

    <section class="europe-installation-section">
      <v-container class="europe-installation-container">
        <div class="europe-section-heading compact">
          <span>Ready in a few minutes</span>
          <h2>How to install your Spain eSIM</h2>
          <p>Purchase and prepare your eSIM before departure, then activate it at the appropriate time.</p>
        </div>
        <ol class="europe-installation-steps">
          <li><i>1</i><span>Choose your Spain plan.</span></li>
          <li><i>2</i><span>Complete your payment.</span></li>
          <li><i>3</i><span>Receive your QR code.</span></li>
          <li><i>4</i><span>Add the eSIM in your phone settings.</span></li>
          <li><i>5</i><span>Enable mobile data at the appropriate time.</span></li>
        </ol>
        <div class="europe-guide-links">
          <router-link :to="`${localePrefix}/guides/install-esim-iphone`"><v-icon>mdi-apple</v-icon><span>eSIM installation guide for iPhone</span><v-icon size="19">mdi-arrow-right</v-icon></router-link>
          <router-link :to="`${localePrefix}/guides/install-esim-android`"><v-icon>mdi-cellphone-cog</v-icon><span>eSIM installation guide for Samsung</span><v-icon size="19">mdi-arrow-right</v-icon></router-link>
          <router-link :to="`${localePrefix}/guides/compatibility`"><v-icon>mdi-cellphone-check</v-icon><span>Check your phone compatibility</span><v-icon size="19">mdi-arrow-right</v-icon></router-link>
        </div>
      </v-container>
    </section>

    <section class="europe-activation-section">
      <v-container class="europe-activation-container">
        <div class="europe-section-heading compact"><span>Install now, connect on arrival</span><h2>When should you install and activate your Spain eSIM?</h2><p>You can install the eSIM before departure. All SafarSIM bundles use autostart, so the plan begins automatically when the eSIM first connects to a supported network with data roaming enabled.</p></div>
        <div class="activation-guidance">
          <div><v-icon>mdi-download-circle-outline</v-icon><span><b>Install before you travel</b><p>Use stable Wi-Fi to scan the QR code and add the eSIM to your phone.</p></span></div>
          <div><v-icon>mdi-timer-play-outline</v-icon><span><b>Validity starts on connection</b><p>The duration does not start simply because the profile is installed. It starts upon connection to a supported network with data roaming enabled.</p></span></div>
          <div><v-icon>mdi-airplane-landing</v-icon><span><b>Activate at your destination</b><p>After arriving in Spain, enable SafarSIM, select it for mobile data and turn on data roaming.</p></span></div>
        </div>
      </v-container>
    </section>

    <section class="europe-whatsapp-section">
      <v-container class="europe-whatsapp-container">
        <div class="whatsapp-title-row">
          <div class="whatsapp-icon"><v-icon>mdi-whatsapp</v-icon></div>
          <h2>Does WhatsApp work with a Spain eSIM?</h2>
        </div>
        <p>Yes. A data-only eSIM generally does not change the number used by your WhatsApp account. You can continue using WhatsApp with your usual number while SafarSIM provides the mobile data connection.</p>
      </v-container>
    </section>

    <section class="europe-why-safarsim-section">
      <v-container class="europe-why-safarsim-container">
        <div class="europe-section-heading compact">
          <span>A fully digital service</span>
          <h2>Why choose SafarSim for your Spain eSIM?</h2>
          <p>SafarSim provides a straightforward digital way to purchase and use mobile data in Spain.</p>
        </div>
        <div class="safarsim-facts-grid">
          <div class="safarsim-fact-card"><v-icon>mdi-cart-outline</v-icon><div><b>Online purchase</b><p>Choose and purchase your Spain data plan online.</p></div></div>
          <div class="safarsim-fact-card"><v-icon>mdi-qrcode-scan</v-icon><div><b>Digital QR code</b><p>Your installation QR code is delivered electronically.</p></div></div>
          <div class="safarsim-fact-card"><v-icon>mdi-signal</v-icon><div><b>Several data plans</b><p>Select the data allowance and validity suited to your trip.</p></div></div>
          <div class="safarsim-fact-card"><v-icon>mdi-headset</v-icon><div><b>Customer support</b><p>Assistance is available if you need help with your eSIM.</p></div></div>
          <div class="safarsim-fact-card"><v-icon>mdi-earth</v-icon><div><b>Coverage in Spain</b><p>Use the same eSIM throughout covered areas in Spain.</p></div></div>
          <div class="safarsim-fact-card"><v-icon>mdi-sim-off-outline</v-icon><div><b>No physical SIM collection</b><p>There is no card to collect from a shop or airport.</p></div></div>
        </div>
      </v-container>
    </section>

    <section class="europe-faq-section">
      <v-container class="europe-faq-container">
        <div class="europe-section-heading compact">
          <span>Frequently asked questions</span>
          <h2>Spain eSIM FAQ</h2>
          <p>Practical answers to help you prepare and use your Spain eSIM correctly.</p>
        </div>
        <div class="europe-faq-list">
          <details><summary><span>Does the eSIM work throughout Spain?</span><v-icon>mdi-plus</v-icon></summary><p>It connects to supported partner networks wherever compatible coverage is available in Spain.</p></details>
          <details><summary><span>Can I install it before travelling?</span><v-icon>mdi-plus</v-icon></summary><p>Yes. Install it before departure using stable Wi-Fi.</p></details>
          <details><summary><span>When does validity begin?</span><v-icon>mdi-plus</v-icon></summary><p>Validity starts when the eSIM first connects to a supported network with data roaming enabled.</p></details>
          <details><summary><span>Can I keep using WhatsApp with my usual number?</span><v-icon>mdi-plus</v-icon></summary><p>Yes. SafarSim supplies mobile data without changing the number registered to WhatsApp.</p></details>
          <details><summary><span>Is hotspot use supported?</span><v-icon>mdi-plus</v-icon></summary><p>Most plans allow hotspot use, depending on your device and the local network.</p></details>
          <details><summary><span>Is 5G available?</span><v-icon>mdi-plus</v-icon></summary><p>5G is available where supported by the partner network and your device; otherwise the eSIM uses 4G/LTE.</p></details>
          <details><summary><span>Can I keep my current SIM?</span><v-icon>mdi-plus</v-icon></summary><p>Yes, on a dual-SIM phone. Keep your usual SIM active and select SafarSim for mobile data.</p></details>
          <details><summary><span>Will it work when I travel around Spain?</span><v-icon>mdi-plus</v-icon></summary><p>The same eSIM remains installed and selects an available supported network automatically.</p></details>
          <details><summary><span>Can I top up the Spain eSIM?</span><v-icon>mdi-plus</v-icon></summary><p>Top-up availability depends on the selected plan. If unavailable, purchase a new plan.</p></details>
          <details><summary><span>Which phones are compatible?</span><v-icon>mdi-plus</v-icon></summary><p>Many recent Apple, Samsung, Google and other devices support eSIM. Check your exact model before purchase.</p></details>
        </div>
      </v-container>
    </section>

    <section class="europe-related-section">
      <v-container class="europe-related-container">
        <div class="europe-section-heading compact">
          <span>Explore by country</span>
          <h2>Other popular eSIM destinations</h2>
        </div>
        <div class="europe-related-grid">
          <router-link to="/esim/turkiye" class="europe-related-card"><img :src="getFlagImage('TR')" alt="Turkey"><strong>eSIM Turkey</strong><v-icon>mdi-arrow-right</v-icon></router-link>
          <router-link to="/esim/france" class="europe-related-card"><img :src="getFlagImage('FR')" alt="France"><strong>eSIM France</strong><v-icon>mdi-arrow-right</v-icon></router-link>
          <router-link to="/esim/italie" class="europe-related-card"><img :src="getFlagImage('IT')" alt="Italy"><strong>eSIM Italy</strong><v-icon>mdi-arrow-right</v-icon></router-link>
          <router-link to="/esim/portugal" class="europe-related-card"><img :src="getFlagImage('PT')" alt="Portugal"><strong>eSIM Portugal</strong><v-icon>mdi-arrow-right</v-icon></router-link>
          <router-link to="/esim/royaume-uni" class="europe-related-card"><img :src="getFlagImage('GB')" alt="United Kingdom"><strong>eSIM United Kingdom</strong><v-icon>mdi-arrow-right</v-icon></router-link>
          <router-link to="/esim/allemagne" class="europe-related-card"><img :src="getFlagImage('DE')" alt="Germany"><strong>eSIM Germany</strong><v-icon>mdi-arrow-right</v-icon></router-link>
          <router-link to="/esim/pays-bas" class="europe-related-card"><img :src="getFlagImage('NL')" alt="Netherlands"><strong>eSIM Netherlands</strong><v-icon>mdi-arrow-right</v-icon></router-link>
          <router-link to="/esim/suisse" class="europe-related-card"><img :src="getFlagImage('CH')" alt="Switzerland"><strong>eSIM Switzerland</strong><v-icon>mdi-arrow-right</v-icon></router-link>
        </div>
      </v-container>
    </section>

    <div class="europe-last-updated">
      <v-container><v-icon size="17">mdi-calendar-check-outline</v-icon><span>Information updated on 2 September 2026.</span></v-container>
    </div>

    <v-snackbar v-model="snackbar" location="top" color="green" timeout="2000">{{ snackbarText }}</v-snackbar>
  </div>
</template>

<script>
import { destinations, regions } from '@/services/catalog'
import { addToCart } from '@/utils/cart'
import { getLocalizedName } from '@/utils/localizedNames'
import { formatPriceFromMad, priceFromMad, getPreferredCurrency } from '@/utils/currency'
import { posthog } from '@/services/posthog'
import Cart from '@/pages/Cart.vue'
import spainHeroImage from '@/assets/images/hero_spain.png'

export default {
  name: 'SpainEnglishPage',

  components: { Cart },

  data() {
    return {
      region: null,
      addedPlanKey: null,
      selectedPlanKey: null,
      snackbar: false,
      snackbarText: '',
      checkoutOpen: false,
      spainHeroImage,
      countryNameOverrides: {
        AE: 'Émirats arabes unis',
        AG: 'Antigua-et-Barbuda',
        AI: 'Anguilla',
        AL: 'Albanie',
        AM: 'Arménie',
        AN: 'Antilles néerlandaises',
        AR: 'Argentine',
        AT: 'Autriche',
        AU: 'Australie',
        BA: 'Bosnie-Herzégovine',
        BB: 'Barbade',
        BE: 'Belgique',
        BG: 'Bulgarie',
        BH: 'Bahreïn',
        BM: 'Bermudes',
        BQ: 'Pays-Bas caribéens',
        BS: 'Bahamas',
        CA: 'Canada',
        CH: 'Suisse',
        CL: 'Chili',
        CO: 'Colombie',
        CR: 'Costa Rica',
        CW: 'Curaçao',
        CY: 'Chypre',
        CYP: 'Chypre',
        CZ: 'Tchéquie',
        DE: 'Allemagne',
        DK: 'Danemark',
        DM: 'Dominique',
        EC: 'Équateur',
        EE: 'Estonie',
        EG: 'Égypte',
        ES: 'Espagne',
        FI: 'Finlande',
        FR: 'France',
        GB: 'Royaume-Uni',
        GE: 'Géorgie',
        GF: 'Guyane française',
        GR: 'Grèce',
        GT: 'Guatemala',
        GY: 'Guyana',
        HK: 'Hong Kong',
        HN: 'Honduras',
        HR: 'Croatie',
        HT: 'Haïti',
        HU: 'Hongrie',
        IC: 'Îles Canaries',
        ID: 'Indonésie',
        IE: 'Irlande',
        IS: 'Islande',
        IT: 'Italie',
        JM: 'Jamaïque',
        JO: 'Jordanie',
        KE: 'Kenya',
        KG: 'Kirghizistan',
        KN: 'Saint-Christophe-et-Niévès',
        KR: 'Corée du Sud',
        KW: 'Koweït',
        KY: 'Îles Caïmans',
        KZ: 'Kazakhstan',
        LC: 'Sainte-Lucie',
        LI: 'Liechtenstein',
        LK: 'Sri Lanka',
        LT: 'Lituanie',
        LU: 'Luxembourg',
        LV: 'Lettonie',
        MA: 'Maroc',
        MD: 'Moldavie',
        ME: 'Monténégro',
        MG: 'Madagascar',
        MK: 'Macédoine du Nord',
        MO: 'Macao',
        MQ: 'Martinique',
        MS: 'Montserrat',
        MT: 'Malte',
        MU: 'Maurice',
        MX: 'Mexique',
        MY: 'Malaisie',
        NG: 'Nigeria',
        NI: 'Nicaragua',
        NL: 'Pays-Bas',
        NO: 'Norvège',
        NZ: 'Nouvelle-Zélande',
        PA: 'Panama',
        PE: 'Pérou',
        PK: 'Pakistan',
        PL: 'Pologne',
        PT: 'Portugal',
        QA: 'Qatar',
        RE: 'La Réunion',
        RO: 'Roumanie',
        RS: 'Serbie',
        RU: 'Russie',
        SA: 'Arabie saoudite',
        SE: 'Suède',
        SG: 'Singapour',
        SI: 'Slovénie',
        SK: 'Slovaquie',
        SR: 'Suriname',
        SV: 'Salvador',
        TC: 'Îles Turques-et-Caïques',
        TH: 'Thaïlande',
        TN: 'Tunisie',
        TR: 'Turquie',
        TT: 'Trinité-et-Tobago',
        TW: 'Taïwan',
        TZ: 'Tanzanie',
        UA: 'Ukraine',
        UG: 'Ouganda',
        US: 'États-Unis',
        UY: 'Uruguay',
        UZ: 'Ouzbékistan',
        VA: 'Vatican',
        VC: 'Saint-Vincent-et-les-Grenadines',
        VG: 'Îles Vierges britanniques',
        VN: 'Vietnam',
        XK: 'Kosovo',
        ZA: 'Afrique du Sud',
        ZM: 'Zambie',
      },
    }
  },

  computed: {
    parsedPlans() {
      if (!this.region?.plans) return []

      return Object.entries(this.region.plans).flatMap(([key, planConfig]) => {
        const hasPlanConfig = planConfig && typeof planConfig === 'object'
        const price = hasPlanConfig ? planConfig.price : planConfig
        const esimGoBundleName = hasPlanConfig ? planConfig.esimGoBundleName : null

        if (price === null || price === undefined) return []

        const match = key.match(/^(\d+GB)_(\d+)days$/)

        if (!match) {
          return [{
            key,
            data: '',
            days: 0,
            dataLabel: key,
            price,
            esimGoBundleName,
          }]
        }

        const data = match[1]
        const days = Number(match[2])

        return [{
          key,
          data,
          days,
          dataLabel: data.replace('GB', ' GB'),
          price,
          esimGoBundleName,
        }]
      })
    },

    groupedPlans() {
      const groups = {}

      this.parsedPlans.forEach((plan) => {
        if (!groups[plan.days]) groups[plan.days] = []
        groups[plan.days].push(plan)
      })

      return Object.keys(groups)
        .sort((a, b) => Number(a) - Number(b))
        .map((days) => ({
          days,
          items: groups[days].sort((a, b) => {
            const aValue = parseInt(a.data)
            const bValue = parseInt(b.data)
            return aValue - bValue
          }),
        }))
    },

    sortedPlans() {
      return [...this.parsedPlans].sort((a, b) => {
        const dataDifference = parseInt(a.data) - parseInt(b.data)
        return dataDifference || a.days - b.days
      })
    },

    coveredCountries() {
      if (!this.region?.coverageIsoCodes) return []

      const locale = 'en'

      return this.region.coverageIsoCodes.map((iso) => ({
        iso,
        name: this.getCountryName(iso, locale),
      }))
    },

    localizedRegionName() {
      return getLocalizedName(this.region, 'en')
    },

    localePrefix() {
      return ''
    },

    startingPrice() {
      const cheapest = this.parsedPlans.reduce((lowest, plan) => Math.min(lowest, plan.price), Infinity)
      return Number.isFinite(cheapest) ? formatPriceFromMad(cheapest, 'en') : ''
    },

    featuredCountries() {
      const preferred = ['FR', 'ES', 'IT', 'DE']
      return preferred.map((iso) => this.coveredCountries.find((country) => country.iso === iso)).filter(Boolean)
    },

    relatedDestinations() {
      return [
        { iso: 'ES', slug: 'espagne' },
        { iso: 'FR', slug: 'france' },
        { iso: 'IT', slug: 'italie' },
        { iso: 'PT', slug: 'portugal' },
        { iso: 'GB', slug: 'royaume-uni' },
        { iso: 'DE', slug: 'allemagne' },
        { iso: 'NL', slug: 'pays-bas' },
        { iso: 'CH', slug: 'suisse' },
      ].map((country) => ({ ...country, name: this.getCountryName(country.iso, 'en') }))
    },

  },

  methods: {
    getRegionImage(region) {
      if (region?.slug === 'europe') {
        return require('@/assets/images/flags/regions/europe.png')
      }

      return require('@/assets/images/flags/regions/regions.png')
    },

    scrollEuropePlans() {
      document.getElementById('europe-plans')?.scrollIntoView({ behavior: 'smooth' })
    },

    scrollToCheckout() {
      document.getElementById('europe-checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },

    countrySlug(iso) {
      return destinations.find((destination) => destination.iso === iso)?.slug || String(iso).toLowerCase()
    },

    loadRegion() {
      this.region = destinations.find((item) => item.slug === 'espagne') || null
    },

    handleAddToCart(plan) {
      this.selectedPlanKey = plan.key
      addToCart({
        id: `${this.region.slug}-${plan.key}`,
        destinationName: this.localizedRegionName,
        names: this.region.names,
        destinationSlug: this.region.slug,
        flag: this.region.flag,
        image: this.region.image,
        iso: this.region.iso,
        type: 'destination',
        planKey: plan.key,
        data: plan.data,
        dataLabel: plan.dataLabel,
        days: plan.days,
        price: priceFromMad(plan.price),
        currency: getPreferredCurrency(),
        esimGoBundleName: plan.esimGoBundleName,
        quantity: 1,
      })

      posthog.capture('plan_added_to_cart', {
        destination_slug: this.region.slug,
        destination_type: 'destination',
        plan_key: plan.key,
        data_amount: plan.data,
        validity_days: plan.days,
        currency: getPreferredCurrency(),
        unit_price: priceFromMad(plan.price),
      })

      this.addedPlanKey = plan.key
      this.snackbarText = 'Added to cart'
      this.snackbar = true

      if (this.region.slug === 'espagne') {
        this.checkoutOpen = true
        this.$nextTick(() => {
          document.getElementById('europe-checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }

      setTimeout(() => {
        this.addedPlanKey = null
      }, 1500)
    },

    getCountryName(iso, locale = 'fr') {
      const lang = String(locale || 'fr').split('-')[0]

      if (lang === 'fr' && this.countryNameOverrides[iso]) {
        return this.countryNameOverrides[iso]
      }

      try {
        const displayNames = new Intl.DisplayNames([lang], { type: 'region' })
        return displayNames.of(iso) || iso
      } catch (e) {
        return iso
      }
    },

    getFlagImage(iso) {
      try {
        return require(`@/assets/images/flags/${iso.toLowerCase()}.svg`)
      } catch (e) {
        return require('@/assets/images/flags/default.png')
      }
    },

    formatPriceFromMad,

    updateStructuredData() {
      const locale = 'en'
      const path = `${this.localePrefix}/esim/spain`
      const url = `https://safarsim.net${path}`
      const currency = getPreferredCurrency()
      const schema = [
        {
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'eSIMs', item: `https://safarsim.net${this.localePrefix}/esim` },
            { '@type': 'ListItem', position: 2, name: this.localizedRegionName, item: url },
          ],
        },
        {
          '@context': 'https://schema.org', '@type': 'Product', name: document.querySelector('#europe-plans h2')?.textContent.trim(),
          description: document.querySelector('.europe-explainer-copy p')?.textContent.trim(), url, brand: { '@type': 'Brand', name: 'SafarSim' },
          category: 'Travel eSIM',
          offers: this.sortedPlans.map((plan) => ({
            '@type': 'Offer', name: `${plan.dataLabel} · ${plan.days} days`,
            price: String(priceFromMad(plan.price)), priceCurrency: currency,
            availability: 'https://schema.org/InStock', url: `${url}#europe-plans`,
          })),
        },
        {
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: [...document.querySelectorAll('.europe-faq-list details')].map((item) => ({ '@type': 'Question', name: item.querySelector('summary span')?.textContent.trim(), acceptedAnswer: { '@type': 'Answer', text: item.querySelector('p')?.textContent.trim() } })),
        },
      ]
      let node = document.getElementById('europe-structured-data')
      if (!node) {
        node = document.createElement('script')
        node.id = 'europe-structured-data'
        node.type = 'application/ld+json'
        document.head.appendChild(node)
      }
      node.textContent = JSON.stringify(schema)
      document.documentElement.lang = locale
      document.title = document.querySelector('#europe-plans h2')?.textContent.trim() || 'SafarSim Spain eSIM'
    },
  },

  mounted() {
    this.updateStructuredData()
  },

  beforeUnmount() {
    document.getElementById('europe-structured-data')?.remove()
  },

  watch: {
    '$route.params.slug': {
      immediate: true,
      handler() {
        this.loadRegion()
      },
    },
  },
}
</script>

<style scoped>
.destination-page {
  padding-top: 150px;
  max-width: 1000px;
}

.breadcrumb-row {
  display: flex;
  align-items: center;
}

.breadcrumb-row-ar {
  direction: rtl;
  justify-content: flex-start;
}

.country-card,
.package-card {
  background: #f7f4f1;
}

.section-line {
  height: 2px;
  background: #111;
  border-radius: 999px;
}

.countries-scroll {
  max-height: 430px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2px 8px;
  scrollbar-color: #9e9e9e transparent;
  scrollbar-width: thin;
}

.countries-scroll::-webkit-scrollbar {
  width: 7px;
}

.countries-scroll::-webkit-scrollbar-thumb {
  background: #9e9e9e;
  border-radius: 999px;
}

.countries-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.package-item,
.country-item {
  background: white;
  transition: 0.2s ease;
}

.package-item:hover,
.country-item:hover {
  transform: translateY(-1px);
}

.flag-wrapper {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.region-image-wrapper {
  width: 72px;
  height: 48px;
}

.europe-region-image-wrapper {
  width: 110px;
  height: 76px;
}

.flag-img {
  width: 100%;
  height: 100%;
}

.europe-page { --eu-ink:#173d37;--eu-pink:#d91c58;--eu-green:#16835f;--eu-cream:#fff8f3;color:var(--eu-ink);background:#fff;overflow:hidden; }
.europe-hero { position:relative;padding:36px 0 0;background:linear-gradient(135deg,#fff7f2 0%,#fff 50%,#fff0f5 100%);overflow:hidden; }
.europe-glow{position:absolute;border-radius:50%;filter:blur(5px);pointer-events:none}.europe-glow-one{width:380px;height:380px;background:rgba(248,202,217,.32);right:-120px;top:-100px}.europe-glow-two{width:260px;height:260px;background:rgba(179,225,207,.25);left:-90px;bottom:-100px}
.europe-hero-inner{position:relative;z-index:1;max-width:1200px}.europe-breadcrumb{display:flex;align-items:center;gap:7px;font-size:13px;margin-bottom:38px;color:#687b77}.europe-breadcrumb a{color:#687b77;text-decoration:none}.europe-hero-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(390px,.92fr);gap:70px;align-items:center}.europe-kicker,.section-eyebrow{display:inline-flex;align-items:center;gap:7px;color:var(--eu-pink);font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}.europe-hero-copy h1{max-width:none;font-size:clamp(38px,4.6vw,60px);line-height:1.08;letter-spacing:-.035em;margin:16px 0 22px;font-weight:950}.europe-hero-copy h1 span{display:block;white-space:nowrap}.europe-hero-copy h1 em{display:block;color:var(--eu-pink);font-style:normal}.europe-hero-copy>p{max-width:650px;color:#657773;font-size:18px;line-height:1.75}.europe-actions{display:flex;align-items:center;gap:24px;margin-top:32px}.europe-primary{color:#fff!important;font-weight:900!important;letter-spacing:0!important;padding-inline:28px!important}
.europe-visual{padding:30px 18px}.europe-map-card{position:relative;min-height:390px;border-radius:44px;background:#fff;box-shadow:0 28px 70px rgba(90,30,60,.14);display:grid;place-items:center;padding:45px}.europe-map-card:before{content:"";position:absolute;inset:18px;border:1px solid #f1dce4;border-radius:32px}.europe-map-card>img{position:relative;width:85%;max-height:250px;object-fit:contain}.coverage-pill,.network-pill,.price-pill{position:absolute;background:rgba(255,255,255,.96);box-shadow:0 13px 30px rgba(55,35,47,.14);border:1px solid #f4e5eb;border-radius:17px;padding:12px 15px;display:flex;align-items:center;gap:7px;backdrop-filter:blur(8px)}.coverage-pill{left:-24px;top:45px}.coverage-pill b{font-size:25px;color:var(--eu-pink)}.coverage-pill span,.network-pill span,.price-pill span{font-size:11px;color:#72827e}.network-pill{right:-20px;bottom:58px}.network-pill .v-icon{color:var(--eu-green)}.network-pill{display:grid;grid-template-columns:auto auto}.network-pill .v-icon{grid-row:1/3}.price-pill{left:28px;bottom:-18px;flex-direction:column;align-items:flex-start;gap:0}.price-pill b{font-size:19px;color:var(--eu-pink)}
.price-pill{background:linear-gradient(135deg,#d91c58,#f13d73);border:2px solid #fff;padding:15px 20px;gap:2px;box-shadow:0 18px 38px rgba(217,28,88,.36)}.price-pill span{font-size:12px;color:rgba(255,255,255,.84);font-weight:750}.price-pill b{font-size:24px;color:#fff;font-weight:950}
.europe-map-card>img{width:100%;max-height:310px}
.europe-visual{padding:0}.europe-map-card{min-height:0;padding:0;margin-bottom:-34px;background:transparent;border-radius:0;box-shadow:none}.europe-map-card:before{display:none}.europe-map-card>img{display:block;width:100%;max-height:none;object-fit:contain;filter:drop-shadow(0 22px 28px rgba(91,30,60,.12))}
.europe-proof-strip{background:#fff0f5}.europe-proof-grid{max-width:720px;display:grid;grid-template-columns:repeat(2,1fr);padding-top:12px;padding-bottom:27px}.europe-proof-grid>div{display:grid;grid-template-columns:auto 1fr;column-gap:11px;padding:0 24px}.europe-proof-grid>div+div{border-inline-start:1px solid #e8cfd8}.europe-proof-grid .v-icon{grid-row:1/3;color:var(--eu-pink);margin-top:3px}.europe-proof-grid b{font-size:14px}.europe-proof-grid span{font-size:11px;color:#786570;margin-top:2px}.europe-proof-grid .proof-highlight{display:flex;align-items:center;white-space:nowrap}.europe-proof-grid .proof-highlight b{font-size:18px;color:var(--eu-ink);font-weight:950}.europe-proof-grid .proof-highlight .v-icon{font-size:27px;margin:0}
.europe-proof-grid .proof-highlight strong{color:var(--eu-pink);font-size:21px;font-weight:950}
.europe-plans-section{padding:90px 0 100px;scroll-margin-top:75px}.europe-section-heading{text-align:center;max-width:720px;margin:0 auto 44px}.europe-section-heading>span{color:var(--eu-pink);font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}.europe-section-heading h2,.benefits-copy h2{font-size:clamp(31px,4vw,46px);line-height:1.18;letter-spacing:-.035em;margin:9px 0 13px;font-weight:950}.europe-section-heading p,.benefits-copy>p{font-size:16px;color:#6b7b77;line-height:1.7}.europe-section-heading.compact{margin-bottom:38px}.europe-plan-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1060px;margin:auto}.europe-plan-card{position:relative;border:1px solid #eadde2;background:#fffcfa;border-radius:24px;padding:25px;transition:.2s}.europe-plan-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(80,36,57,.09);border-color:#e692ad}.europe-plan-card.featured{border:2px solid var(--eu-pink);background:#fff8fa}.popular-label{position:absolute;top:0;right:22px;transform:translateY(-50%);background:var(--eu-pink);color:#fff;font-size:11px;font-weight:900;padding:6px 12px;border-radius:99px}.europe-page[dir="rtl"] .popular-label{right:auto;left:22px}.plan-data{display:flex;align-items:baseline;gap:8px}.plan-data b{font-size:30px}.plan-data span{font-size:12px;color:#7c8b87}.plan-duration{display:flex;align-items:center;gap:7px;margin:14px 0;color:#657773;font-size:14px}.plan-price{font-size:25px;font-weight:950;color:var(--eu-pink);margin:22px 0}.plan-cta{color:#fff!important;font-weight:900!important;letter-spacing:0!important}
.europe-plan-grid{grid-template-columns:1fr;gap:16px;max-width:760px}.europe-plan-card{width:100%;min-height:155px;display:grid;grid-template-columns:38px minmax(0,1fr) auto;grid-template-rows:1fr 1fr;align-items:center;text-align:start;color:var(--eu-ink);font:inherit;padding:27px 25px;background:#fff;border:2px solid #eadfe3;border-radius:22px;cursor:pointer}.europe-plan-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(80,36,57,.07);border-color:#e6a0b7}.europe-plan-card.active{border-color:var(--eu-green);background:#fffcfa;box-shadow:0 4px 0 var(--eu-green)}.plan-radio{grid-column:1;grid-row:1/3;width:28px;height:28px;border:3px solid #cfbec7;border-radius:50%;transition:.18s}.europe-plan-card.active .plan-radio{border:8px solid var(--eu-green)}.europe-plan-card .plan-data{grid-column:2;grid-row:1;align-self:end}.europe-plan-card .plan-data b{font-size:31px;line-height:1}.europe-plan-card .plan-data span{font-size:17px;color:#856d79}.europe-plan-card .plan-duration{grid-column:2;grid-row:2;align-self:start;margin:17px 0 0;color:#806975;font-size:16px}.europe-plan-card .plan-price{grid-column:3;grid-row:1/3;margin:0;font-size:30px;white-space:nowrap}.europe-plan-card .popular-label{top:0;right:20px;font-size:12px;padding:7px 14px}.europe-page[dir="rtl"] .europe-plan-card{text-align:right}.europe-page[dir="rtl"] .europe-plan-card .popular-label{right:auto;left:20px}
.europe-explainer-section{padding:90px 0;background:#fff8f3}.europe-explainer-container{max-width:1080px;display:grid;grid-template-columns:.88fr 1.12fr;gap:70px;align-items:start}.europe-explainer-copy>span{color:var(--eu-pink);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}.europe-explainer-copy h2{font-size:clamp(31px,4vw,44px);line-height:1.18;letter-spacing:-.035em;margin:10px 0 18px;font-weight:950}.europe-explainer-copy p{color:#667773;font-size:16px;line-height:1.8}.europe-facts-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.europe-fact{display:flex;gap:13px;min-height:145px;padding:21px;background:#fff;border:1px solid #eedfe4;border-radius:18px}.europe-fact>.v-icon{width:42px;height:42px;flex:0 0 42px;padding:9px;color:var(--eu-pink);background:#ffe8ef;border-radius:12px}.europe-fact>span{display:flex;flex-direction:column;gap:6px}.europe-fact b{font-size:14px}.europe-fact small{color:#6d7c78;font-size:12px;line-height:1.6}.europe-page[dir="rtl"] .europe-explainer-copy,.europe-page[dir="rtl"] .europe-fact{text-align:right}
.europe-network-section{padding:90px 0;background:#fff}.europe-network-container{max-width:1100px}.network-notes{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 auto 25px}.network-notes span{display:flex;align-items:center;gap:9px;padding:14px 16px;border-radius:14px;background:#f1faf6;color:#355f56;font-size:13px;font-weight:700}.network-notes .v-icon{color:var(--eu-green);flex:0 0 auto}.network-table-wrap{overflow:hidden;border:1px solid #eadfe3;border-radius:20px;background:#fff;box-shadow:0 14px 34px rgba(68,42,55,.06)}.network-table{width:100%;border-collapse:collapse;table-layout:fixed;text-align:start}.network-table th:first-child{width:34%}.network-table th{padding:17px 20px;background:#fff0f5;color:#674c59;font-size:12px;text-transform:uppercase;letter-spacing:.05em;text-align:start}.network-table td{padding:16px 20px;border-top:1px solid #eee6e2;color:#667773;font-size:13px;line-height:1.55;vertical-align:top}.network-table td:nth-child(2){overflow-wrap:anywhere}.network-operators{display:block}.network-table td:first-child{color:var(--eu-ink);white-space:nowrap}.network-country-link{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}.network-country-link:hover b{color:var(--eu-pink);text-decoration:underline}.network-table img{width:30px;height:22px;object-fit:cover;border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.15)}.technology-badge{display:inline-flex;margin-top:9px;padding:6px 10px;border-radius:99px;background:#e9f7f1;color:var(--eu-green);font-weight:900;white-space:nowrap}.network-disclaimer{margin:15px 5px 0;color:#7b8986;font-size:11px;line-height:1.6}.europe-page[dir="rtl"] .network-table,.europe-page[dir="rtl"] .network-table th{text-align:right}
.europe-use-cases-section{padding:90px 0;background:#fff8f3}.europe-use-cases-container{max-width:1100px}.europe-use-cases-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:15px;max-width:960px;margin:auto}.europe-use-case-card{display:flex;align-items:flex-start;gap:15px;padding:23px;background:#fff;border:1px solid #eedfe4;border-radius:19px}.europe-use-case-card:last-child{grid-column:1/-1}.europe-use-case-card>.v-icon{width:44px;height:44px;flex:0 0 44px;padding:10px;border-radius:13px;background:#ffe7ef;color:var(--eu-pink)}.europe-use-case-card b{font-size:16px}.europe-use-case-card p{margin:6px 0 0;color:#687975;font-size:13px;line-height:1.6}.europe-page[dir="rtl"] .europe-use-case-card{text-align:right}
.europe-comparison-section{padding:90px 0;background:#fff}.europe-comparison-container{max-width:1000px}.comparison-table-wrap{overflow:hidden;border:1px solid #eadfe3;border-radius:20px;box-shadow:0 14px 34px rgba(68,42,55,.06)}.comparison-table{width:100%;border-collapse:collapse;table-layout:fixed}.comparison-table th,.comparison-table td{padding:17px 20px;text-align:start;border-top:1px solid #eee5e9;font-size:14px;line-height:1.5}.comparison-table thead th{border-top:0;background:#fff0f5;color:var(--eu-ink);font-weight:900}.comparison-table tbody th{color:var(--eu-ink);font-weight:800}.comparison-table tbody td:nth-child(2){color:var(--eu-green);font-weight:800}.comparison-recommendation{display:flex;align-items:flex-start;gap:13px;margin:25px 0 18px;padding:20px;border-radius:17px;background:#f1faf6;color:#405e58}.comparison-recommendation .v-icon{color:var(--eu-green);flex:0 0 auto}.comparison-recommendation p{margin:0;font-size:14px;line-height:1.75}.comparison-links{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px}.comparison-links a{display:inline-flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 14px;border:1px solid #efcbd7;border-radius:99px;color:var(--eu-pink);font-size:16px;font-weight:850;text-decoration:none}.comparison-link-label{display:inline-flex;align-items:center;gap:7px}.comparison-link-flag{font-size:20px;line-height:1}.comparison-links a:hover{background:#fff0f5}.europe-page[dir="rtl"] .comparison-table th,.europe-page[dir="rtl"] .comparison-table td{text-align:right}.europe-page[dir="rtl"] .comparison-links .v-icon{transform:rotate(180deg)}
.europe-installation-section{padding:90px 0;background:#fff8f3}.europe-installation-container{max-width:1000px}.europe-installation-steps{max-width:820px;margin:0 auto 30px;padding:0;list-style:none;display:grid;gap:11px}.europe-installation-steps li{display:flex;align-items:center;gap:14px;padding:15px 18px;border:1px solid #eadfe3;border-radius:16px;background:#fff;color:var(--eu-ink);font-size:15px;font-weight:750}.europe-installation-steps i{width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;border-radius:50%;background:var(--eu-pink);color:#fff;font-size:13px;font-weight:900;font-style:normal}.europe-guide-links{max-width:820px;margin:auto;display:grid;gap:10px}.europe-guide-links a{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;padding:16px 18px;border:1px solid #efcbd7;border-radius:16px;background:#fff;color:var(--eu-pink);font-size:15px;font-weight:850;text-decoration:none;transition:.18s}.europe-guide-links a:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(94,34,60,.08)}.europe-guide-links a>.v-icon:first-child{color:var(--eu-green)}.europe-page[dir="rtl"] .europe-guide-links a>.v-icon:last-child{transform:rotate(180deg)}
.europe-checkout-section{padding:70px 0 55px;background:#fff8fa;scroll-margin-top:70px}.europe-checkout-heading{margin-bottom:24px}.europe-embedded-checkout{max-width:1240px;margin:auto}.europe-embedded-checkout :deep(.cart-page){max-width:none!important;min-height:0!important;padding-top:12px!important;padding-bottom:8px!important}.europe-embedded-checkout :deep(.summary-card),.europe-embedded-checkout :deep(.contact-card),.europe-embedded-checkout :deep(.checkout-card),.europe-embedded-checkout :deep(.embedded-payment-card){background:#fff!important;border:1px solid #f0dce4!important;border-radius:20px!important;box-shadow:0 12px 30px rgba(92,28,62,.06)!important}.europe-embedded-checkout :deep(.v-btn.bg-green-darken-1){background:#d91c58!important;color:#fff!important}.europe-embedded-checkout :deep(.cart-step-number){background:var(--eu-pink)!important;color:#fff!important}.europe-embedded-checkout :deep(.v-field--focused .v-field__outline),.europe-embedded-checkout :deep(.v-field--focused .v-icon){color:var(--eu-pink)!important}.europe-page[dir="rtl"] .europe-embedded-checkout{text-align:right}.europe-page[dir="rtl"] .europe-embedded-checkout :deep(.policy-acceptance .v-selection-control),.europe-page[dir="rtl"] .europe-embedded-checkout :deep(.compatibility-confirmation .v-selection-control){direction:rtl!important;text-align:right}.europe-page[dir="rtl"] .europe-embedded-checkout :deep(.payment-security){direction:rtl;justify-content:flex-start;text-align:right}
.europe-benefits-section{background:var(--eu-cream);padding:95px 0}.europe-benefits-grid{max-width:1150px;display:grid;grid-template-columns:1.05fr .95fr;gap:80px;align-items:center}.benefit-list{display:flex;flex-direction:column;gap:23px;margin-top:33px}.benefit-list>div{display:flex;gap:15px}.benefit-list i{width:45px;height:45px;flex:0 0 45px;border-radius:14px;background:#ffe7ef;color:var(--eu-pink);display:grid;place-items:center;font-style:normal}.benefit-list span{display:flex;flex-direction:column;gap:3px}.benefit-list b{font-size:16px}.benefit-list small{color:#6d7d79;font-size:13px;line-height:1.55}.europe-travel-card{background:var(--eu-ink);color:#fff;border-radius:34px;padding:38px;box-shadow:20px 24px 0 #f5c9d7}.europe-travel-card>span{color:#f3a5bd;text-transform:uppercase;font-size:11px;font-weight:900;letter-spacing:.08em}.europe-travel-card h3{font-size:31px;line-height:1.2;margin:9px 0 30px}.trip-route{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;position:relative}.trip-route:before{content:"";position:absolute;top:20px;left:10%;right:10%;border-top:2px dashed rgba(255,255,255,.25)}.trip-route>div{position:relative;z-index:1;text-align:center}.trip-route img{display:block;width:42px;height:31px;object-fit:cover;border-radius:6px;margin:0 auto 8px;box-shadow:0 4px 10px rgba(0,0,0,.2)}.trip-route span{font-size:11px}.europe-travel-card>p{display:flex;align-items:center;justify-content:center;gap:7px;background:rgba(255,255,255,.08);border-radius:12px;padding:12px;margin:28px 0 0;font-size:13px}
.europe-countries-section{padding:95px 0;background:#fff}.europe-country-grid{max-width:1060px;margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:11px}.europe-country-item{display:flex;align-items:center;gap:10px;min-height:59px;border:1px solid #eee5e1;border-radius:14px;padding:11px 13px;background:#fffdfa;font-size:13px}.europe-country-item img{width:31px;height:23px;object-fit:cover;border-radius:4px;box-shadow:0 2px 5px #bbb}.europe-country-item span{flex:1}.europe-country-item .v-icon{color:var(--eu-green)}
.europe-how-section{padding:90px 0 105px;background:#fff0f5}.europe-steps{max-width:960px;margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.europe-steps>div{position:relative;text-align:center;background:#fff;border-radius:24px;padding:34px 24px;box-shadow:0 12px 28px rgba(100,47,69,.06)}.europe-steps i{position:absolute;top:14px;left:16px;width:25px;height:25px;border-radius:50%;background:#f8d6e1;color:var(--eu-pink);display:grid;place-items:center;font-size:11px;font-weight:900;font-style:normal}.europe-page[dir="rtl"] .europe-steps i{left:auto;right:16px}.europe-steps .v-icon{display:flex;margin:0 auto 17px;color:var(--eu-green);font-size:36px}.europe-steps b{font-size:17px}.europe-steps p{font-size:13px;color:#6f7e7a;line-height:1.6;margin-top:8px}
.europe-page[dir="rtl"] .europe-hero-copy,.europe-page[dir="rtl"] .benefits-copy{text-align:right}.europe-page[dir="rtl"] .europe-actions{justify-content:flex-start}
.europe-page[dir="rtl"] .europe-hero-copy h1{max-width:none;font-size:clamp(34px,4vw,50px);line-height:1.28;letter-spacing:0}.europe-page[dir="rtl"] .europe-hero-copy h1 span{display:block;white-space:nowrap}.europe-page[dir="rtl"] .europe-hero-copy h1 em{margin-top:2px;line-height:1.15}

@media (max-width: 900px) {
  .europe-hero-grid,.europe-benefits-grid,.europe-explainer-container{grid-template-columns:1fr;gap:50px}.europe-hero-copy{text-align:center}.europe-hero-copy>p{margin-inline:auto}.europe-actions,.europe-mini-proof{justify-content:center}.europe-visual{max-width:590px;width:100%;margin:auto}.europe-proof-grid{grid-template-columns:repeat(2,1fr);row-gap:24px}.europe-proof-grid>div:nth-child(3){border-inline-start:0}.europe-plan-grid{grid-template-columns:1fr}.europe-country-grid{grid-template-columns:repeat(3,1fr)}.europe-page[dir="rtl"] .europe-hero-copy{text-align:center}.europe-page[dir="rtl"] .europe-actions,.europe-page[dir="rtl"] .europe-mini-proof{justify-content:center}
}

@media (max-width: 599px) {
  .europe-hero{padding:24px 0 0}.europe-breadcrumb{margin-bottom:25px}.europe-hero-copy h1{font-size:42px}.europe-hero-copy>p{font-size:16px}.europe-actions{flex-direction:column;gap:17px}.europe-mini-proof{gap:10px;flex-direction:column;align-items:center}.europe-visual{padding:20px 8px}.europe-map-card{min-height:300px;padding:30px;border-radius:30px}.coverage-pill{left:-3px;top:20px}.network-pill{right:-3px;bottom:37px}.price-pill{left:14px}.europe-proof-grid{grid-template-columns:1fr;padding-block:24px;gap:0}.europe-proof-grid>div{padding:15px 22px}.europe-proof-grid>div+div{border-inline-start:0;border-top:1px solid #e8cfd8}.europe-plans-section,.europe-benefits-section,.europe-countries-section,.europe-how-section{padding:68px 0}.europe-checkout-section{padding:55px 0 35px}.europe-embedded-checkout :deep(.cart-page){padding-inline:0!important}.europe-plan-grid,.europe-steps{grid-template-columns:1fr}.europe-plan-card{padding:22px}.europe-benefits-grid{gap:42px}.europe-travel-card{padding:27px 20px;box-shadow:10px 13px 0 #f5c9d7}.europe-country-grid{grid-template-columns:repeat(2,1fr);gap:8px}.europe-country-item{padding:9px;font-size:12px}.europe-country-item img{width:27px;height:20px}.europe-country-item .v-icon{display:none}.europe-section-heading h2,.benefits-copy h2{font-size:31px}
  .europe-page[dir="rtl"] .europe-hero-copy h1{font-size:clamp(27px,8.5vw,34px);line-height:1.35;max-width:100%}
  .europe-page[dir="ltr"] .europe-hero-copy h1{font-size:clamp(25px,7.7vw,34px);line-height:1.18}
  .europe-visual{padding:0}.europe-map-card{min-height:0;padding:0;border-radius:0;background:transparent;box-shadow:none}.europe-map-card>img{max-height:none}
  .europe-proof-grid{padding-top:8px}
  .europe-plan-card{min-height:132px;grid-template-columns:31px minmax(0,1fr) auto;padding:20px 15px}.plan-radio{width:23px;height:23px;border-width:3px}.europe-plan-card.active .plan-radio{border-width:7px}.europe-plan-card .plan-data b{font-size:24px}.europe-plan-card .plan-data span{font-size:13px}.europe-plan-card .plan-duration{font-size:13px;margin-top:13px}.europe-plan-card .plan-price{font-size:21px}.europe-plan-card .popular-label{right:12px;font-size:10px;padding:5px 9px}.europe-page[dir="rtl"] .europe-plan-card .popular-label{right:auto;left:12px}
  .europe-explainer-section{padding:65px 0}.europe-explainer-container{gap:32px}.europe-facts-grid{grid-template-columns:1fr}.europe-fact{min-height:0;padding:17px}.europe-explainer-copy h2{font-size:31px}
  .europe-network-section{padding:65px 0}.network-notes{grid-template-columns:1fr}.network-table th,.network-table td{padding:12px 10px}.network-table th:first-child{width:38%}.network-table td:first-child{white-space:normal}.network-country-link{align-items:flex-start;gap:7px}.network-table img{width:25px;height:18px;flex:0 0 auto}.network-table td{font-size:12px}.technology-badge{font-size:11px;padding:4px 8px}
  .europe-use-cases-section{padding:65px 0}.europe-use-cases-grid{grid-template-columns:1fr}.europe-use-case-card:last-child{grid-column:auto}.europe-use-case-card{padding:18px}
  .europe-comparison-section{padding:65px 0}.comparison-table th,.comparison-table td{padding:12px 8px;font-size:11px;overflow-wrap:anywhere}.comparison-recommendation{padding:16px}.comparison-links{flex-direction:column;align-items:stretch}.comparison-links a{justify-content:space-between}
  .europe-installation-section{padding:65px 0}.europe-installation-steps li{padding:13px 12px;font-size:13px}.europe-guide-links a{padding:14px 12px;font-size:13px}
  .countries-scroll {
    max-height: 380px;
    padding-inline: 4px;
  }

  .country-item {
    padding: 10px 8px !important;
  }

  .country-item .flag-wrapper {
    width: 38px;
    height: 28px;
    margin-right: 8px !important;
  }

  .country-item .font-weight-medium {
    font-size: 0.875rem;
    line-height: 1.15;
  }
}

.europe-activation-section{padding:90px 0;background:#fff}.europe-activation-container{max-width:1000px}.activation-guidance{max-width:900px;margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.activation-guidance>div{display:flex;align-items:flex-start;gap:12px;padding:22px;border:1px solid #eadfe3;border-radius:19px;background:#fffcfa}.activation-guidance .v-icon{width:42px;height:42px;flex:0 0 42px;padding:9px;border-radius:12px;background:#ffe8ef;color:var(--eu-pink)}.activation-guidance b{font-size:15px}.activation-guidance p{margin:7px 0 0;color:#687975;font-size:13px;line-height:1.65}.activation-warning{max-width:900px;margin:16px auto 0;display:flex;align-items:flex-start;gap:13px;padding:18px 20px;border-radius:16px;background:#f1faf6;color:#405e58}.activation-warning .v-icon{color:var(--eu-green);flex:0 0 auto}.activation-warning p{margin:0;font-size:13px;line-height:1.7}.europe-page[dir="rtl"] .activation-guidance>div,.europe-page[dir="rtl"] .activation-warning{text-align:right}
@media(max-width:700px){.europe-activation-section{padding:65px 0}.activation-guidance{grid-template-columns:1fr}.activation-guidance>div{padding:18px}.activation-warning{padding:16px}}
.network-notes-after-table{margin-top:18px;margin-bottom:8px}
.europe-whatsapp-section{padding:48px 0 62px;background:#f1faf6}.europe-whatsapp-container{max-width:900px}.whatsapp-title-row{display:grid;grid-template-columns:68px 1fr;gap:24px;align-items:center}.whatsapp-icon{width:68px;height:68px;display:grid;place-items:center;border-radius:22px;background:#16835f;color:#fff;box-shadow:0 12px 25px rgba(22,131,95,.2)}.whatsapp-icon .v-icon{font-size:38px}.europe-whatsapp-container h2{margin:0;font-size:clamp(29px,4vw,42px);line-height:1.2;letter-spacing:-.03em}.europe-whatsapp-container>p{margin:16px 0 0 92px;color:#57706a;font-size:16px;line-height:1.8}.europe-page[dir="rtl"] .europe-whatsapp-container{text-align:right}.europe-page[dir="rtl"] .europe-whatsapp-container>p{margin-right:92px;margin-left:0}@media(max-width:600px){.europe-whatsapp-section{padding:36px 0 48px}.whatsapp-title-row{grid-template-columns:58px 1fr;gap:16px;align-items:center}.whatsapp-icon{width:58px;height:58px}.europe-whatsapp-container h2{font-size:29px}.europe-whatsapp-container>p,.europe-page[dir="rtl"] .europe-whatsapp-container>p{margin:18px 0 0}}
.europe-why-safarsim-section{padding:90px 0;background:#fff8fa}.europe-why-safarsim-container{max-width:1050px}.safarsim-facts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.safarsim-fact-card{display:flex;align-items:flex-start;gap:14px;padding:22px;background:#fff;border:1px solid #f0dce3;border-radius:19px;box-shadow:0 10px 26px rgba(96,45,65,.05)}.safarsim-fact-card>.v-icon{width:43px;height:43px;flex:0 0 43px;padding:9px;border-radius:13px;background:#ffe7ef;color:var(--eu-pink)}.safarsim-fact-card b{display:block;color:var(--eu-ink);font-size:15px}.safarsim-fact-card p{margin:7px 0 0;color:#687975;font-size:13px;line-height:1.6}.europe-page[dir="rtl"] .safarsim-fact-card{text-align:right}@media(max-width:800px){.safarsim-facts-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.europe-why-safarsim-section{padding:65px 0}.safarsim-facts-grid{grid-template-columns:1fr}.safarsim-fact-card{padding:18px}}
.europe-faq-section{padding:90px 0;background:#fff}.europe-faq-container{max-width:950px}.europe-faq-list{display:grid;gap:11px}.europe-faq-list details{border:1px solid #ecdde3;border-radius:17px;background:#fffafc;overflow:hidden}.europe-faq-list summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px 22px;color:var(--eu-ink);font-size:16px;font-weight:800;cursor:pointer;list-style:none}.europe-faq-list summary::-webkit-details-marker{display:none}.europe-faq-list summary .v-icon{color:var(--eu-pink);transition:transform .2s}.europe-faq-list details[open] summary .v-icon{transform:rotate(45deg)}.europe-faq-list details>p{margin:0;padding:0 22px 21px;color:#61746f;font-size:14px;line-height:1.75}.europe-page[dir="rtl"] .europe-faq-list{text-align:right}@media(max-width:600px){.europe-faq-section{padding:65px 0}.europe-faq-list summary{padding:17px 16px;font-size:14px}.europe-faq-list details>p{padding:0 16px 18px;font-size:13px}}
.europe-related-section{padding:90px 0;background:#fff3f7}.europe-related-container{max-width:1050px}.europe-related-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.europe-related-card{display:grid;grid-template-columns:42px 1fr 24px;align-items:center;gap:12px;min-height:88px;padding:18px;background:#fff;border:1px solid #efd9e1;border-radius:18px;color:var(--eu-ink);text-decoration:none;box-shadow:0 9px 24px rgba(96,45,65,.05);transition:transform .2s,border-color .2s}.europe-related-card:hover{transform:translateY(-3px);border-color:var(--eu-pink)}.europe-related-card img{width:42px;height:31px;object-fit:cover;border-radius:6px;box-shadow:0 3px 8px rgba(0,0,0,.14)}.europe-related-card strong{font-size:14px;line-height:1.35}.europe-related-card .v-icon{color:var(--eu-pink)}.europe-page[dir="rtl"] .europe-related-card{text-align:right}.europe-page[dir="rtl"] .europe-related-card .v-icon{transform:rotate(180deg)}@media(max-width:900px){.europe-related-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.europe-related-section{padding:65px 0}.europe-related-grid{grid-template-columns:1fr}.europe-related-card{min-height:76px;padding:14px}}
.europe-last-updated{padding:16px 0;background:var(--eu-cream);border-top:1px solid #eee3dc;color:#7a6b72;font-size:12px}.europe-last-updated .container{display:flex;align-items:center;justify-content:center;gap:7px}.europe-last-updated .v-icon{color:var(--eu-green)}
.europe-section-heading{width:100%;box-sizing:border-box;padding-inline:18px}.europe-section-heading h2,.europe-explainer-copy h2{max-width:100%;overflow-wrap:anywhere}
.covered-countries-compact{max-width:1060px;margin:28px auto 0;border:1px solid #eadfe3;border-radius:18px;background:var(--eu-cream);overflow:hidden}.covered-countries-compact summary{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:16px 18px;cursor:pointer;list-style:none;color:var(--eu-ink)}.covered-countries-compact summary::-webkit-details-marker{display:none}.covered-countries-compact summary>.v-icon:first-child{color:var(--eu-pink)}.covered-toggle{color:var(--eu-pink);transition:transform .2s}.covered-countries-compact[open] .covered-toggle{transform:rotate(180deg)}.covered-country-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 18px}.covered-country-chips a{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:99px;background:#fff;border:1px solid #eadfe3;color:var(--eu-ink);font-size:12px;text-decoration:none}.covered-country-chips img{width:22px;height:16px;object-fit:cover;border-radius:3px}.europe-purchase-cta{display:flex!important;margin:24px auto 0;color:#fff!important;font-weight:900!important;letter-spacing:0!important}
.network-disclosure>summary{display:none}.network-disclosure>.network-table-wrap{display:block}.network-disclosure[open]>summary .v-icon{transform:rotate(180deg)}
@media(max-width:599px){.europe-section-heading{padding-inline:24px}.europe-explainer-copy{padding-inline:20px}.covered-countries-compact{margin-inline:4px}.covered-country-chips{max-height:230px;overflow:auto}.europe-purchase-cta{width:calc(100% - 24px)}.network-disclosure>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border:1px solid #eadfe3;border-radius:16px;background:#fff0f5;color:var(--eu-ink);font-weight:850;cursor:pointer;list-style:none}.network-disclosure>summary::-webkit-details-marker{display:none}.network-disclosure>summary .v-icon{color:var(--eu-pink);transition:transform .2s}.network-disclosure:not([open])>.network-table-wrap{display:none}.network-disclosure[open]>summary{border-radius:16px 16px 0 0}.network-disclosure[open]>.network-table-wrap{border-radius:0 0 16px 16px}}
.spain-country-line{display:flex;align-items:center;justify-content:center;gap:12px;padding:16px 18px}.spain-country-line img{width:34px;height:24px;object-fit:cover;border-radius:5px;box-shadow:0 2px 6px rgba(0,0,0,.14)}.spain-country-line strong{color:var(--eu-pink)}
.europe-proof-grid{grid-template-columns:1fr;max-width:520px;padding-top:0;padding-bottom:12px}.europe-proof-grid>div{justify-content:center;padding-top:6px}.europe-proof-grid>div+div{border:0}@media(max-width:599px){.europe-proof-grid{padding-block:0 10px}.europe-proof-grid>div{padding:6px 18px}.europe-map-card{margin-bottom:-40px}}
.network-disclosure>.network-table-wrap{display:block!important}
</style>
