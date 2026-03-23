<template>
  <div class="destination-card">
    <div class="card-left">
      <div class="icon-box">
        <v-icon color="#1683c7" size="24">mdi-map-marker-outline</v-icon>
      </div>

      <div class="text-content">
        <div class="label">{{ destination.type }}</div>
        <div class="title">{{ destination.name }}</div>
      </div>
    </div>

    <button class="arrow-btn" type="button">
      <v-icon size="22">mdi-arrow-right</v-icon>
    </button>

    <div class="card-wave"></div>
  </div>
</template>

<script setup>
defineProps({
  destination: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.destination-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 114px;
  padding: 24px 24px 20px;
  background: #fff;
  border: 1px solid #e6eaf0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.06);
}

.card-left {
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 2;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(180deg, #dff4ff 0%, #eaf8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cfe9f7;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.95rem;
  color: #555e6b;
  margin-bottom: 2px;
}

.title {
  font-size: 1.9rem;
  line-height: 1.1;
  font-weight: 500;
  color: #23272f;
}

.arrow-btn {
  position: relative;
  z-index: 2;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #2b313a;
}

.card-wave {
  position: absolute;
  right: -10px;
  bottom: -22px;
  width: 220px;
  height: 80px;
  background: #f5f7fb;
  border-radius: 50% 50% 0 0;
  transform: rotate(-8deg);
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
}
</style>