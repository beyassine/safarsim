<template>
  <div class="filters-wrapper">
    <div class="filters-scroll">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="filter-chip"
        :class="{ active: modelValue === filter }"
        @click="$emit('update:modelValue', filter)"
      >
        <v-icon
          v-if="modelValue === filter && filter === 'Toutes les destinations'"
          size="16"
          class="mr-2"
        >
          mdi-check
        </v-icon>
        {{ filter }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  filters: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.filters-wrapper {
  display: flex;
  justify-content: center;
}

.filters-scroll {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid #d8dee8;
  background: #fff;
  color: #3a4351;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease;
}

.filter-chip:hover {
  border-color: #bfc8d6;
}

.filter-chip.active {
  background: #1f2328;
  color: #fff;
  border-color: #1f2328;
}

@media (max-width: 768px) {
  .filters-wrapper {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .filters-scroll {
    flex-wrap: nowrap;
    justify-content: flex-start;
    min-width: max-content;
    padding-bottom: 4px;
  }
}
</style>