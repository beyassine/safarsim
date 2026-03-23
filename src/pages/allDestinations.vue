<template>
  <v-container class="destinations-page py-10">
    <div class="text-center mb-8">
      <h1 class="page-title">Toutes Destinations Holafly</h1>
    </div>

    <DestinationSearchBar v-model="search" @search="handleSearch" class="mb-8" />

    <DestinationFilters v-model="selectedFilter" :filters="filters" class="mb-8" />

    <v-row>
      <v-col v-for="destination in filteredDestinations" :key="destination.id" cols="12" md="6" lg="4">
        <DestinationCard :destination="destination" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import DestinationSearchBar from '@/components/destination_page/DestinationSearchBar.vue'
import DestinationFilters from '@/components/destination_page/DestinationFilters.vue'
import DestinationCard from '@/components/destination_page/DestinationsCard.vue'

const search = ref('')
const selectedFilter = ref('Toutes les destinations')

const filters = [
  'Populaire',
  'Forfaits régionaux',
  'Pays',
  'Villes',
  'Toutes les destinations',
]

const destinations = ref([
  { id: 1, name: 'Abidjan', type: 'eSIM', category: 'Villes', popular: true },
  { id: 2, name: 'Abu Dhabi', type: 'eSIM', category: 'Villes', popular: true },
  { id: 3, name: 'Açores', type: 'eSIM', category: 'Pays', popular: false },
  { id: 4, name: 'Albanie', type: 'eSIM', category: 'Pays', popular: true },
  { id: 5, name: 'Algérie', type: 'eSIM', category: 'Pays', popular: false },
  { id: 6, name: 'Andalousie', type: 'eSIM', category: 'Forfaits régionaux', popular: false },
])

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
  font-weight: 700;
  color: #1f2328;
}

@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }
}
</style>