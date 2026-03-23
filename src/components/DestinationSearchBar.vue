<template>
  <div ref="searchWrapper" class="destination-search-wrapper">
    <div class="destination-search-bar">
      <div class="search-left">
        <v-icon size="18" class="search-icon">mdi-map-marker-outline</v-icon>
        <span class="divider">|</span>

        <input
          :value="query"
          type="text"
          class="search-input"
          :placeholder="placeholder"
          @focus="handleFocus"
          @input="onInput"
        />
      </div>

      <button class="search-btn" type="button" @click="handleSearchClick">
        <v-icon color="white" size="22">mdi-magnify</v-icon>
      </button>
    </div>

    <div
      v-if="showResults && displayedDestinations.length"
      class="search-results"
    >
      <div class="results-label">
        {{ (query || '').trim() ? resultsLabel : popularLabel }}
      </div>

      <div
        v-for="item in displayedDestinations"
        :key="item.slug"
        class="search-result-item"
        @click="selectDestination(item)"
      >
        <v-avatar size="42" rounded="lg" class="result-avatar">
          <v-img :src="item.image" cover />
        </v-avatar>

        <div class="result-text">
          <div class="result-name">{{ item.name }}</div>
          <div class="result-subtitle">
            {{ item.region || 'Destination' }}
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

const filteredDestinations = computed(() => {
  const term = (query.value || '').trim().toLowerCase()

  if (!term) return []

  return props.destinations
    .filter((item) => item.name.toLowerCase().includes(term))
    .slice(0, props.maxResults)
})

const displayedDestinations = computed(() => {
  if (!(query.value || '').trim()) {
    return props.popularDestinations.slice(0, props.maxPopular)
  }

  return filteredDestinations.value
})

function handleFocus() {
  showResults.value = true
}

function onInput(event) {
  const value = event.target.value || ''
  query.value = value
  showResults.value = true
  emit('update:query', value)
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

.search-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background:#43A047;
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