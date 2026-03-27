<template>
  <v-container class="py-10 destination-page" v-if="destination">
    <!-- Breadcrumb -->
    <div class="mb-6 text-body-2">
      <router-link to="/destinations" class="text-decoration-none">
        <span class="text-medium-emphasis">Destinations</span>
      </router-link>
      <span class="mx-2">></span>
      <strong>{{ destination.name }}</strong>
    </div>

    <!-- Country card -->
    <v-card rounded="xl" elevation="0" class="pa-6 mb-8 country-card">
      <div class="d-flex align-center mb-4">
        <div class="flag-wrapper">
          <v-img :src="getImage(destination)" contain class="flag-img" @error="fallback" />
        </div>
        <h2 class="text-h5 font-weight-bold ml-3">{{ destination.name }}</h2>
        <div class="text-body-1 ml-2 ">{{ destination.iso }}</div>
      </div>

      <v-divider class="mb-5" />

      <div class="d-flex align-center mb-6 text-body-1">
        <v-icon size="20" class="mr-2">mdi-signal-cellular-outline</v-icon>
        <strong class="mr-2">Réseau disponible</strong>
        <v-chip class="mr-2" size="x-small" variant="outlined">4G</v-chip>
        <v-chip size="x-small" variant="outlined">5G</v-chip>
      </div>
      <div class="d-flex align-start">
        <v-icon size="20" class="mr-3 mt-1">mdi-check</v-icon>
        <div>Le forfait démarre dès la connexion à un réseau pris en charge</div>
      </div>
      <router-link to="/compatibility">
        <v-btn color="green" rounded="pill" class="text-none font-weight-bold mt-2 mb-6"
          prepend-icon="mdi-cellphone-check">
          Vérifier la compatibilité
        </v-btn>
      </router-link>
    </v-card>

    <!-- Packages -->
    <v-card rounded="xl" elevation="0" class="pa-4 pa-md-6 mb-8 package-card">

      <h3 class="text-h5 text-center mb-5">Choisissez votre forfait</h3>
      <div class="section-line mb-6"></div>

      <div v-for="group in groupedPlans" :key="group.days" class="mb-8">
        <div class="text-h6 font-weight-bold mb-4">{{ group.days }} jours</div>

        <v-card v-for="plan in group.items" :key="plan.key" rounded="xl" elevation="1"
          class="mb-5 px-4 py-4 package-item">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 ">{{ plan.dataLabel }}</div>
            </div>

            <div class="d-flex align-center">
              <div class="text-right mr-4">
                <div class="text-h5 ">{{ plan.price }} DH</div>
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
    <h2>Pays introuvable</h2>
  </v-container>
</template>

<script>
import destinations from '@/data/destinations.json'
import { addToCart } from '@/utils/cart'

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

      return Object.entries(this.destination.plans).map(([key, price]) => {
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
  },

  methods: {
    loadDestination() {
      const slug = this.$route.params.slug
      this.destination = destinations.find((item) => item.slug === slug) || null
    },
    addToCart(plan) {
      addToCart({
        id: `${this.destination.slug}-${plan.key}`,
        destinationName: this.destination.name,
        destinationSlug: this.destination.slug,
        flag: this.destination.flag,
        image: this.destination.image,
        iso: this.destination.iso,
        planKey: plan.key,
        data: plan.data,
        dataLabel: plan.dataLabel,
        days: plan.days,
        price: plan.price,
        quantity: 1,
      })
    },
    handleAddToCart(plan) {
      addToCart({
        id: `${this.destination.slug}-${plan.key}`,
        destinationName: this.destination.name,
        destinationSlug: this.destination.slug,
        flag: this.destination.flag,
        image: this.destination.image,
        iso: this.destination.iso,
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
    getImage(item) {
      if (item.type === "region") {
        return item.image;
      }

      try {
        return require(`@/assets/images/flags/${item.iso.toLowerCase()}.svg`);
      } catch (e) {
        return item.image;
      }
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