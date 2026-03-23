<template>
  <div class="search-wrapper mx-auto">
    <div class="search-box">
      <div class="search-left">
        <v-icon size="18" class="mr-2">mdi-map-marker-outline</v-icon>
        <span class="divider">|</span>
        <input
          :value="modelValue"
          type="text"
          class="search-input"
          placeholder="Où voyages-tu ?"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
        />
      </div>

      <v-btn
        icon
        class="search-btn"
        elevation="0"
        @click="$emit('search')"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue', 'search'])
</script>

<style scoped>
.search-wrapper {
  max-width: 600px;
}

.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #dbe6f3;
  border-radius: 16px;
  padding: 10px 14px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
}

.search-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  color: #6b7280;
}

.divider {
  margin-right: 10px;
  color: #b8c0cc;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  color: #1f2328;
  background: transparent;
}

.search-input::placeholder {
  color: #6b7280;
}

.search-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #44e37b !important;
  color: #1b1f23 !important;
}
</style>