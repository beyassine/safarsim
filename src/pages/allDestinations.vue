<template>
  <v-container class="destinations-page py-10">
    <div class="text-center mb-8">
      <h1 class="page-title">Toutes Destinations</h1>
    </div>
    
    <DestinationSearch :destinations="destinations" :popular-destinations="popularDestinations"
      placeholder="Où voyages-tu ?" @select="selectDestination" @search="handleSearch" class="mb-8" />

    <v-row>
      <v-col v-for="country in destinations" :key="country.slug" :cols="$vuetify.display.smAndUp ? '4' : '12'">
        <DestinationCard :country="country" />
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import DestinationSearch from "@/components/DestinationSearchBar.vue";
import DestinationCard from '@/components/DestinationCard.vue'

import destinations from "@/data/destinations";
import popularDestinations from "@/data/popularDestinations";

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

function handleSearch() {
  // Tu peux brancher ici un appel API si besoin
  console.log('Recherche:', search.value)
}
</script>

<style scoped>
.destinations-page {
  margin-top: 50px;
  max-width: 1280px;
}

.page-title {
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 400;
  color: #1f2328;
}

@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }
}
</style>