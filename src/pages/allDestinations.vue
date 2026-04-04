<template>
  <v-container class="destinations-page">
    <div class="text-center mb-8">
      <h1 class="section-title">Toutes Destinations</h1>
    </div>

    <div class="search-sticky-wrapper">
      <DestinationSearch :destinations="destinations" :popular-destinations="popularDestinations"
        placeholder="Où voyages-tu ?" @select="goToDestination" class="mb-8" />
    </div>

    <div>
      <h2 class="page-subtitle text-center">Plans régionaux</h2>
      <v-row>
        <v-col v-for="region in regions" :key="region.slug" :cols="$vuetify.display.smAndUp ? '4' : '12'">
          <DestinationCardRegion :country="region" />
        </v-col>
      </v-row>
    </div>


    <div>
      <h2 class="page-subtitle text-center">Choisissez par pays</h2>
      <v-row>
        <v-col v-for="country in destinations" :key="country.slug" :cols="$vuetify.display.smAndUp ? '4' : '12'">
          <DestinationCard :country="country" />
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import DestinationSearch from "@/components/DestinationSearchBar.vue";
import DestinationCard from '@/components/DestinationCard.vue'
import DestinationCardRegion from '@/components/DestinationCardRegion.vue'

import regions from "@/data/regions.json";
import destinations from "@/data/destinations.json";
import popularDestinations from "@/data/popularDestinations.json";
import router from '@/router';

const search = ref('')
const selectedFilter = ref('Toutes les destinations')

const filters = [
  'Populaire',
  'Forfaits régionaux',
  'Pays',
  'Villes',
  'Toutes les destinations',
]
const filteredDestinations = computed(() => {
  let result = destinations.value

  if (selectedFilter.value === 'Populaire') {
    result = result.filter(item => item.popular)
  } else if (selectedFilter.value !== 'Toutes les destinations') {
    result = result.filter(item => item.category === selectedFilter.value)
  }

  if (search.value.trim()) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  return result
})

function goToDestination(destination) {
  router.push({ name: 'destinationDetails', params: { slug: destination.slug } })
}
</script>

<style scoped>
.destinations-page {
  margin-top: 50px;
  max-width: 1280px;
}

.page-subtitle {
  font-size: 2rem;
  line-height: 1;
  font-weight: 300;
  color: black;
  margin-bottom: 40px;
  margin-top: 60px;
  text-decoration: underline;
  text-decoration-color: black;
  text-decoration-thickness: 2px;
}
.search-sticky-wrapper {
  position: sticky;
  top: 56px; /* adjust based on your navbar height */
  z-index: 20;
  background: #fffbf8; /* same as page bg */
  padding: 8px 0;
}

@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }
}
</style>