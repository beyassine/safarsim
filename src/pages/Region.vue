<template>
  <v-container class="py-10 destination-page" v-if="region">
    <!-- Breadcrumb -->
    <div class="mb-6 text-body-2">
      <router-link to="/destinations" class="text-decoration-none">
        <span class="text-medium-emphasis">Destinations</span>
      </router-link>
      <span class="mx-2">></span>
      <strong>{{ region.name }}</strong>
    </div>

    <!-- Region card -->
    <v-card rounded="xl" elevation="0" class="pa-6 mb-8 country-card">
      <div class="d-flex align-center mb-4">
        <div class="flag-wrapper region-image-wrapper">
          <v-img :src="region.image" cover class="flag-img rounded-lg" />
        </div>
        <div class="ml-3">
          <h2 class="text-h5 font-weight-bold">{{ region.name }}</h2>
          <div class="text-body-2 text-medium-emphasis">
            {{ coveredCountries.length }} pays couverts
          </div>
        </div>
      </div>

      <v-divider class="mb-5" />

      <div class="d-flex align-center mb-6 text-body-1">
        <v-icon size="20" class="mr-2">mdi-earth</v-icon>
        <strong class="mr-2">Couverture régionale</strong>
        <v-chip class="mr-2" size="x-small" variant="outlined">4G</v-chip>
        <v-chip size="x-small" variant="outlined">5G</v-chip>
      </div>

      <div class="d-flex align-start mb-4">
        <v-icon size="20" class="mr-3 mt-1">mdi-check</v-icon>
        <div>
          Cette eSIM fonctionne dans les pays inclus dans cette région.
        </div>
      </div>

      <router-link to="/compatibility">
        <v-btn
          color="green"
          rounded="pill"
          class="text-none font-weight-bold mt-2"
          prepend-icon="mdi-cellphone-check"
        >
          Vérifier la compatibilité
        </v-btn>
      </router-link>
    </v-card>

    <!-- Covered countries -->
    <v-card rounded="xl" elevation="0" class="pa-4 pa-md-6 mb-8 package-card">
      <h3 class="text-h5 text-center mb-5">Pays inclus dans cette région</h3>
      <div class="section-line mb-6"></div>

      <v-row>
        <v-col
          v-for="country in coveredCountries"
          :key="country.iso"
          cols="12"
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
    </v-card>

    <!-- Packages -->
    <v-card rounded="xl" elevation="0" class="pa-4 pa-md-6 mb-8 package-card">
      <h3 class="text-h5 text-center mb-5">Choisissez votre forfait</h3>
      <div class="section-line mb-6"></div>

      <div v-for="group in groupedPlans" :key="group.days" class="mb-8">
        <div class="text-h6 font-weight-bold mb-4">{{ group.days }} jours</div>

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
                <div class="text-h5">{{ plan.price }} DH</div>
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
    <h2>Région introuvable</h2>
  </v-container>
</template>

<script>
import regions from '@/data/regions.json'
import { addToCart } from '@/utils/cart'

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

      return Object.entries(this.region.plans).map(([key, price]) => {
        const match = key.match(/^(\d+GB)_(\d+)days$/)

        if (!match) {
          return {
            key,
            data: '',
            days: 0,
            dataLabel: key,
            price,
          }
        }

        const data = match[1]
        const days = Number(match[2])

        return {
          key,
          data,
          days,
          dataLabel: data.replace('GB', ' GB'),
          price,
        }
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

      return this.region.coverageIsoCodes.map((iso) => ({
        iso,
        name: this.getCountryName(iso),
      }))
    },
  },

  methods: {
    loadRegion() {
      const slug = this.$route.params.slug
      this.region = regions.find((item) => item.slug === slug) || null
    },

    handleAddToCart(plan) {
      addToCart({
        id: `${this.region.slug}-${plan.key}`,
        destinationName: this.region.name,
        destinationSlug: this.region.slug,
        flag: this.region.flag,
        image: this.region.image,
        iso: this.region.iso,
        type: 'region',
        planKey: plan.key,
        data: plan.data,
        dataLabel: plan.dataLabel,
        days: plan.days,
        price: plan.price,
        quantity: 1,
      })

      this.addedPlanKey = plan.key
      this.snackbarText = 'Forfait ajouté au panier avec succès'
      this.snackbar = true

      setTimeout(() => {
        this.addedPlanKey = null
      }, 1500)
    },

    getCountryName(iso) {
      if (this.countryNameOverrides[iso]) {
        return this.countryNameOverrides[iso]
      }

      try {
        const displayNames = new Intl.DisplayNames(['fr'], { type: 'region' })
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

.country-card,
.package-card {
  background: #f7f4f1;
}

.section-line {
  height: 2px;
  background: #111;
  border-radius: 999px;
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

.flag-img {
  width: 100%;
  height: 100%;
}
</style>