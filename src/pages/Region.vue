<template>
  <v-container class="py-10 destination-page" v-if="region">
    <!-- Breadcrumb -->
    <div v-if="$i18n.locale === 'ar'" class="breadcrumb-row breadcrumb-row-ar mb-6 text-body-2">
      <router-link to="/destinations" class="text-decoration-none">
        <span class="text-medium-emphasis">{{ $t("common.destinations") }}</span>
      </router-link>
      <span class="mx-2">&lt;</span>
      <strong>{{ localizedRegionName }}</strong>
    </div>
    <div v-else class="breadcrumb-row mb-6 text-body-2">
      <router-link to="/destinations" class="text-decoration-none">
        <span class="text-medium-emphasis">{{ $t("common.destinations") }}</span>
      </router-link>
      <span class="mx-2">></span>
      <strong>{{ localizedRegionName }}</strong>
    </div>

    <!-- Region card -->
    <v-card rounded="xl" elevation="0" class="pa-6 mb-8 country-card">
      <div class="d-flex align-center mb-4">
        <div
          class="flag-wrapper region-image-wrapper"
          :class="{ 'europe-region-image-wrapper': region.slug === 'europe' }"
        >
          <v-img :src="getRegionImage(region)" cover class="flag-img rounded-lg" />
        </div>
        <div class="ml-3">
          <h2 class="text-h5 font-weight-bold">{{ localizedRegionName }}</h2>
          <div class="text-body-2 text-medium-emphasis">
            {{ coveredCountries.length }} {{ $t("destinationsPage.coveredCountries") }}
          </div>
        </div>
      </div>

      <v-divider class="mb-5" />

      <div class="d-flex align-center mb-6 text-body-1">
        <v-icon size="20" class="mr-2">mdi-earth</v-icon>
        <strong class="mr-2">{{ $t("destinationsPage.regionalCoverage") }}</strong>
        <v-chip class="mr-2" size="x-small" variant="outlined">4G</v-chip>
        <v-chip size="x-small" variant="outlined">5G</v-chip>
      </div>

      <div class="d-flex align-start mb-4">
        <v-icon size="20" class="mr-3 mt-1">mdi-check</v-icon>
        <div>
          {{ $t("destinationsPage.regionWorks") }}
        </div>
      </div>

      <router-link to="/compatibility">
        <v-btn
          color="green"
          rounded="pill"
          class="text-none font-weight-bold mt-2"
          prepend-icon="mdi-cellphone-check"
        >
          {{ $t("destinationsPage.checkCompatibility") }}
        </v-btn>
      </router-link>
    </v-card>

    <!-- Covered countries -->
    <v-card rounded="xl" elevation="0" class="pa-4 pa-md-6 mb-8 package-card">
      <h3 class="text-h5 text-center mb-5">{{ $t("destinationsPage.countriesIncluded") }}</h3>
      <div class="section-line mb-6"></div>

      <div class="countries-scroll">
        <v-row>
          <v-col
            v-for="country in coveredCountries"
            :key="country.iso"
            cols="6"
            sm="6"
            md="4"
          >
            <v-card rounded="xl" elevation="1" class="country-item px-4 py-3 h-100">
              <div class="d-flex align-center">
                <div class="flag-wrapper mr-3">
                  <v-img
                    :src="getFlagImage(country.iso)"
                    contain
                    class="flag-img"
                  />
                </div>

                <div>
                  <div class="font-weight-medium">{{ country.name }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ country.iso }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- Packages -->
    <v-card rounded="xl" elevation="0" class="pa-4 pa-md-6 mb-8 package-card">
      <h3 class="text-h5 text-center mb-5">{{ $t("destinationsPage.choosePlan") }}</h3>
      <div class="section-line mb-6"></div>

      <div v-for="group in groupedPlans" :key="group.days" class="mb-8">
        <div class="text-h6 font-weight-bold mb-4">{{ group.days }} {{ $t("destinationsPage.days") }}</div>

        <v-card
          v-for="plan in group.items"
          :key="plan.key"
          rounded="xl"
          elevation="1"
          class="mb-5 px-4 py-4 package-item"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6">{{ plan.dataLabel }}</div>
            </div>

            <div class="d-flex align-center">
              <div class="text-right mr-4">
                <div class="text-h5">{{ formatPriceFromMad(plan.price, $i18n.locale) }}</div>
              </div>

              <v-btn
                icon
                :color="addedPlanKey === plan.key ? 'green' : 'pink-darken-1'"
                variant="flat"
                @click="handleAddToCart(plan)"
              >
                <v-icon>
                  {{ addedPlanKey === plan.key ? 'mdi-check' : 'mdi-plus' }}
                </v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>

      <v-snackbar v-model="snackbar" location="top" color="green" timeout="2000">
        {{ snackbarText }}
      </v-snackbar>
    </v-card>
  </v-container>

  <v-container v-else class="py-10">
    <h2>{{ $t("destinationsPage.regionNotFound") }}</h2>
  </v-container>
</template>

<script>
import regions from '@/data/regions.json'
import { addToCart } from '@/utils/cart'
import { getLocalizedName } from '@/utils/localizedNames'
import { formatPriceFromMad, priceFromMad, getPreferredCurrency } from '@/utils/currency'

export default {
  name: 'RegionDetailsPage',

  data() {
    return {
      region: null,
      addedPlanKey: null,
      snackbar: false,
      snackbarText: '',
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

    coveredCountries() {
      if (!this.region?.coverageIsoCodes) return []

      const locale = this.$i18n.locale

      return this.region.coverageIsoCodes.map((iso) => ({
        iso,
        name: this.getCountryName(iso, locale),
      }))
    },

    localizedRegionName() {
      return getLocalizedName(this.region, this.$i18n.locale)
    },
  },

  methods: {
    getRegionImage(region) {
      if (region?.slug === 'europe') {
        return require('@/assets/images/flags/regions/europe.png')
      }

      return require('@/assets/images/flags/regions/regions.png')
    },

    loadRegion() {
      const slug = this.$route.params.slug
      this.region = regions.find((item) => item.slug === slug) || null
    },

    handleAddToCart(plan) {
      addToCart({
        id: `${this.region.slug}-${plan.key}`,
        destinationName: this.localizedRegionName,
        names: this.region.names,
        destinationSlug: this.region.slug,
        flag: this.region.flag,
        image: this.region.image,
        iso: this.region.iso,
        type: 'region',
        planKey: plan.key,
        data: plan.data,
        dataLabel: plan.dataLabel,
        days: plan.days,
        price: priceFromMad(plan.price),
        currency: getPreferredCurrency(),
        esimGoBundleName: plan.esimGoBundleName,
        quantity: 1,
      })

      this.addedPlanKey = plan.key
      this.snackbarText = this.$t('destinationsPage.addedToCart')
      this.snackbar = true

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

@media (max-width: 599px) {
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
</style>
