<template>
  <div ref="searchWrapper" class="destination-search-wrapper">
    <div class="destination-search-bar">
      <div class="search-left">
        <v-icon size="18" class="search-icon">mdi-map-marker-outline</v-icon>
        <span class="divider">|</span>

        <input :value="query" type="text" class="search-input" :placeholder="placeholder" @focus="handleFocus"
          @input="onInput" />
      </div>

      <button v-if="query" class="clear-btn" type="button" @click="clearSearch" aria-label="Effacer la recherche">
        <v-icon size="18">mdi-close</v-icon>
      </button>

      <button class="search-btn" type="button" @click="handleSearchClick">
        <v-icon color="white" size="22">mdi-magnify</v-icon>
      </button>
    </div>

    <div v-if="showResults && displayedDestinations.length" class="search-results">
      <div class="results-label">
        {{ safeQuery ? resultsLabel : popularLabel }}
      </div>

      <div v-for="item in displayedDestinations" :key="item.slug" class="search-result-item"
        @click="selectDestination(item)">

        <div class="flag-wrapper">
          <v-img :src="getImage(item)" contain class="flag-img" @error="fallback" />
        </div>

        <div class="result-text">
          <div class="result-name">{{ item.name }}</div>
          <div class="result-subtitle">
            {{ item.region || 'Destination' }}
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="showResults && safeQuery && !displayedDestinations.length" class="search-results">
      <div class="results-label">{{ resultsLabel }}</div>
      <div class="no-results">Aucune destination trouvée</div>
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
  placeholder: {
    type: String,
    default: 'Où voyages-tu ?',
  },
  maxResults: {
    type: Number,
    default: 8,
  },
  maxPopular: {
    type: Number,
    default: 5,
  },
  popularLabel: {
    type: String,
    default: 'Destinations populaires',
  },
  resultsLabel: {
    type: String,
    default: 'Résultats',
  },
})

const emit = defineEmits(['select', 'search', 'update:query'])

const query = ref('')
const showResults = ref(false)
const searchWrapper = ref(null)

function normalizeText(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/[\s-]+/g, '')
}

function singularizeWord(word) {
  if (!word) return ''

  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y'
  }

  if (word.endsWith('es') && word.length > 3) {
    return word.slice(0, -2)
  }

  if (word.endsWith('s') && word.length > 2) {
    return word.slice(0, -1)
  }

  return word
}

function buildSearchVariants(text) {
  const normalized = normalizeText(text)

  if (!normalized) return []

  const variants = new Set([
    normalized,
    singularizeWord(normalized),
  ])

  return [...variants].filter(Boolean)
}

const safeQuery = computed(() => (query.value || '').trim())

const filteredDestinations = computed(() => {
  const termVariants = buildSearchVariants(query.value)

  if (!termVariants.length) return []

  return props.destinations
    .filter((item) => {
      const name = normalizeText(item.name)
      const region = normalizeText(item.region)
      const iso = normalizeText(item.iso)

      return termVariants.some((term) => {
        return (
          name.includes(term) ||
          region.includes(term) ||
          iso.includes(term)
        )
      })
    })
    .slice(0, props.maxResults)
})

const displayedDestinations = computed(() => {
  if (!safeQuery.value) {
    return props.popularDestinations.slice(0, props.maxPopular)
  }

  return filteredDestinations.value
})

function handleFocus() {
  showResults.value = true
}

function onInput(event) {
  const value = event?.target?.value || ''
  query.value = value
  showResults.value = true
  emit('update:query', value)
}

function clearSearch() {
  query.value = ''
  showResults.value = true
  emit('update:query', '')
}

function selectDestination(item) {
  query.value = item.name
  showResults.value = false
  emit('update:query', item.name)
  emit('select', item)
}

function handleSearchClick() {
  emit('search', query.value)
}

function handleClickOutside(event) {
  if (searchWrapper.value && !searchWrapper.value.contains(event.target)) {
    showResults.value = false
  }
}

const getImage = (item) => {
  if (item.type === 'region') {
    return item.image
  }

  try {
    return require(`@/assets/images/flags/${item.iso.toLowerCase()}.svg`)
  } catch (e) {
    return item.image
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
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  z-index: 50;
}

.destination-search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 18px;
  padding: 10px 12px 10px 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.search-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.search-icon {
  color: #2b2f38;
  margin-right: 8px;
}

.divider {
  color: #b8bfca;
  margin-right: 10px;
  font-size: 16px;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #222;
}

.search-input::placeholder {
  color: #7a7f87;
}

.clear-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.search-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: #43A047;
  color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.search-btn:hover {
  transform: scale(1.02);
}

.search-results {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.14);
  border: 1px solid #edf1f6;
  overflow: hidden;
  max-height: 360px;
  overflow-y: auto;
  z-index: 100;
}

.results-label {
  padding: 16px 18px 10px;
  font-size: 13px;
  font-weight: 700;
  color: #8a90a0;
  margin-left: 8px;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-result-item:hover {
  background: #f8fafc;
}

.result-avatar {
  flex-shrink: 0;
}

.result-text {
  min-width: 0;
}

.result-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.result-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.no-results {
  padding: 16px 18px 20px;
  font-size: 14px;
  color: #6b7280;
}

.flag-wrapper {
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
}

.flag-img {
    width: 100%;
    height: 100%;
}


@media (max-width: 600px) {
  .destination-search-wrapper {
    max-width: 100%;
  }

  .destination-search-bar {
    border-radius: 16px;
    padding: 8px 10px 8px 14px;
  }

  .search-btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .search-input {
    font-size: 15px;
  }
}
</style>