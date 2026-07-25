<template>
  <v-container class="py-10 destination-page" v-if="destination">
    <!-- Breadcrumb -->
    <div v-if="$i18n.locale === 'ar'" class="breadcrumb-row breadcrumb-row-ar mb-6 text-body-2">
      <router-link to="/destinations" class="text-decoration-none">
        <span class="text-medium-emphasis">{{ $t("common.destinations") }}</span>
      </router-link>
      <span class="mx-2">&lt;</span>
      <strong>{{ localizedDestinationName }}</strong>
    </div>
    <div v-else class="breadcrumb-row mb-6 text-body-2">
      <router-link to="/destinations" class="text-decoration-none">
        <span class="text-medium-emphasis">{{ $t("common.destinations") }}</span>
      </router-link>
      <span class="mx-2">></span>
      <strong>{{ localizedDestinationName }}</strong>
    </div>

    <!-- Country card -->
    <v-card rounded="xl" elevation="0" class="pa-6 mb-8 country-card">
      <div v-if="$i18n.locale === 'ar'" class="destination-header destination-header-ar d-flex justify-end align-center mb-4">
        <div class="text-body-1 mr-2">{{ destination.iso }}</div>
        <h2 class="text-h5 font-weight-bold mr-3">{{ localizedDestinationName }}</h2>
        <div class="flag-wrapper">
          <v-img :src="getImage(destination)" contain class="flag-img" @error="fallback" />
        </div>
      </div>
      <div v-else class="destination-header d-flex align-center mb-4">
        <div class="flag-wrapper">
          <v-img :src="getImage(destination)" contain class="flag-img" @error="fallback" />
        </div>
        <h2 class="text-h5 font-weight-bold ml-3">{{ localizedDestinationName }}</h2>
        <div class="text-body-1 ml-2 ">{{ destination.iso }}</div>
      </div>

      <v-divider class="mb-5" />

      <div v-if="$i18n.locale === 'ar'" class="destination-info-row d-flex align-center justify-end mb-6 text-body-1">
        <v-chip class="ml-2" size="x-small" variant="outlined">5G</v-chip>
        <v-chip class="ml-2" size="x-small" variant="outlined">4G</v-chip>
        <strong class="ml-2">{{ $t("destinationsPage.availableNetwork") }}</strong>
        <v-icon size="20">mdi-signal-cellular-outline</v-icon>
      </div>
      <div v-else class="destination-info-row d-flex align-center mb-6 text-body-1">
        <v-icon size="20" class="mr-2">mdi-signal-cellular-outline</v-icon>
        <strong class="mr-2">{{ $t("destinationsPage.availableNetwork") }}</strong>
        <v-chip class="mr-2" size="x-small" variant="outlined">4G</v-chip>
        <v-chip size="x-small" variant="outlined">5G</v-chip>
      </div>
      <div v-if="$i18n.locale === 'ar'" class="d-flex align-start justify-end">
        <div>{{ $t("destinationsPage.planStarts") }}</div>
        <v-icon size="20" class="ml-3 mt-1">mdi-check</v-icon>
      </div>
      <div v-else class="d-flex align-start">
        <v-icon size="20" class="mr-3 mt-1">mdi-check</v-icon>
        <div>{{ $t("destinationsPage.planStarts") }}</div>
      </div>
    </v-card>

    <!-- Packages -->
    <v-card rounded="xl" elevation="0" class="pa-4 pa-md-6 mb-8 package-card">

      <h3 class="text-h5 text-center mb-5">{{ $t("destinationsPage.choosePlan") }}</h3>
      <div class="section-line mb-6"></div>

      <div v-for="group in groupedPlans" :key="group.days" class="mb-8">
        <div class="text-h6 font-weight-bold mb-4">{{ formatDaysLabel(group.days) }}</div>

        <v-card v-for="plan in group.items" :key="plan.key" rounded="xl" elevation="1"
          class="mb-5 px-4 py-4 package-item">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 ">{{ plan.dataLabel }}</div>
            </div>

            <div class="d-flex align-center">
              <div class="text-right mr-4">
                <div class="text-h5 ">{{ formatUsdPrice(plan.price) }} DH</div>
              </div>
              <v-btn icon :color="addedPlanKey === plan.key ? 'green' : 'pink-darken-1'" variant="flat"
                @click="handleAddToCart(plan)">
                <v-icon>
                  {{ addedPlanKey === plan.key ? 'mdi-check' : 'mdi-plus' }}
                </v-icon>
              </v-btn>

              <v-snackbar v-model="snackbar" location="top" color="green" timeout="2000">
                {{ snackbarText }}
              </v-snackbar>
            </div>
          </div>
        </v-card>
      </div>
    </v-card>
  </v-container>

  <v-container v-else class="py-10">
    <h2>{{ $t("destinationsPage.countryNotFound") }}</h2>
  </v-container>
</template>

<script>
import destinations from '@/data/destinations.json'
import { addToCart } from '@/utils/cart'
import { getLocalizedName } from '@/utils/localizedNames'

export default {
  name: 'DestinationDetailsPage',

  data() {
    return {
      destination: null,
      addedPlanKey: null,
      snackbar: false,
      snackbarText: '',
    }
  },

  computed: {
    parsedPlans() {
      if (!this.destination?.plans) return []

      return Object.entries(this.destination.plans).flatMap(([key, planConfig]) => {
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

    localizedDestinationName() {
      return getLocalizedName(this.destination, this.$i18n.locale)
    },
  },

  methods: {
    loadDestination() {
      const slug = this.$route.params.slug
      this.destination = destinations.find((item) => item.slug === slug) || null
    },
    addToCart(plan) {
      addToCart({
        id: `${this.destination.slug}-${plan.key}`,
        destinationName: this.localizedDestinationName,
        names: this.destination.names,
        destinationSlug: this.destination.slug,
        flag: this.destination.flag,
        image: this.destination.image,
        iso: this.destination.iso,
        planKey: plan.key,
        data: plan.data,
        dataLabel: plan.dataLabel,
        days: plan.days,
        price: plan.price,
        currency: 'DH',
        esimGoBundleName: plan.esimGoBundleName,
        quantity: 1,
      })
    },
    handleAddToCart(plan) {
      addToCart({
        id: `${this.destination.slug}-${plan.key}`,
        destinationName: this.localizedDestinationName,
        names: this.destination.names,
        destinationSlug: this.destination.slug,
        flag: this.destination.flag,
        image: this.destination.image,
        iso: this.destination.iso,
        planKey: plan.key,
        data: plan.data,
        dataLabel: plan.dataLabel,
        days: plan.days,
        price: plan.price,
        currency: 'DH',
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
    getImage(item) {
      if (item.type === "region") {
        return item.image;
      }

      try {
        return require(`@/assets/images/flags/${item.iso.toLowerCase()}.svg`);
      } catch (e) {
        return item.image;
      }
    },
    fallback(event) {
      event.target.src = require('@/assets/images/flags/default.png')
    },
    formatDaysLabel(days) {
      return this.$i18n.locale === 'ar'
        ? `${this.$t("destinationsPage.days")} ${days}`
        : `${days} ${this.$t("destinationsPage.days")}`
    },
    formatUsdPrice(price) {
      return Number(price).toFixed(2)
    }
  },

  watch: {
    '$route.params.slug': {
      immediate: true,
      handler() {
        this.loadDestination()
      },
    },
  },
}
</script>

<style scoped>
.destination-page {
  padding-top: 150px;
  max-width: 900px;
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

.package-item {
  background: white;
  transition: 0.2s ease;
}

.package-item:hover {
  transform: translateY(-1px);
}

.flag-emoji {
  font-size: 2rem;
  line-height: 0.4;
}

.flag-wrapper {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
}

.flag-img {
  width: 100%;
  height: 100%;
}
</style>
