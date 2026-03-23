<template>
  <div class="destination-search-wrapper mb-5">
    <div class="destination-search">
      <v-text-field
        v-model="query"
        label="Où allez-vous ?"
        variant="outlined"
        rounded="xl"
        prepend-inner-icon="mdi-map-marker-outline"
        hide-details
        clearable
        class="search-input"
        @focus="handleFocus"
        @update:model-value="handleInput"
      />

      <div
        v-if="showResults && displayedDestinations.length"
        class="search-results"
      >
        <div class="results-label ma-2">
          {{ (query || '').trim() ? 'Résultats' : 'Destinations populaires' }}
        </div>

        <div
          v-for="item in displayedDestinations"
          :key="item.slug"
          class="search-result-item"
          @click="selectDestination(item)"
        >
          <v-avatar size="36" rounded="lg">
            <v-img :src="item.image" cover />
          </v-avatar>

          <div class="result-text">
            <div class="result-name">{{ item.name }}</div>
            <div class="result-subtitle">{{ item.region || 'Destination' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  destinations: {
    type: Array,
    default: () => [],
  },
  popularDestinations: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])

const query = ref('')
const showResults = ref(false)

const filteredDestinations = computed(() => {
  const term = (query.value || '').trim().toLowerCase()

  if (!term) return []

  return props.destinations
    .filter((item) => item.name.toLowerCase().includes(term))
    .slice(0, 8)
})

const displayedDestinations = computed(() => {
  if (!(query.value || '').trim()) {
    return props.popularDestinations.slice(0, 5)
  }

  return filteredDestinations.value
})

function handleFocus() {
  showResults.value = true
}

function handleInput(value='') {
  query.value = value 
  showResults.value = true
}

function selectDestination(item) {
  query.value = item.name
  showResults.value = false
  emit('select', item)
}

function handleClickOutside(event) {
  const root = document.querySelector('.destination-search-wrapper')
  if (root && !root.contains(event.target)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.destination-search-wrapper {
  position: relative;
  z-index: 100;
}

.destination-search {
  position: relative;
  z-index: 100;
}

.search-input :deep(.v-field) {
  background: white;
  border-radius: 30px;
}

.search-input :deep(.v-field__outline) {
  opacity: 0.3;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 200;
  background: white;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  max-height: 320px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-result-item:hover {
  background: #f7f7fb;
}

.result-text {
  min-width: 0;
}

.result-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f1f1f;
}

.result-subtitle {
  font-size: 12px;
  color: #777;
}
.results-label {
  padding: 14px 18px 8px;
  font-size: 12px;
  font-weight: 700;
  color: #8c8ca3;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}
</style>