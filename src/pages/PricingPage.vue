<template>
  <div class="pricing-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="eyebrow"><bdi dir="ltr">SAFAR SIM</bdi></div>
        <h1 class="page-title">{{ $t("pricing.title") }}</h1>
        <p class="page-subtitle">
          {{ $t("pricing.subtitle") }}
        </p>
      </div>

      <v-row class="mb-10" justify="center">
        <v-col v-for="feature in $tm('pricing.features')" :key="feature.title" cols="12" md="4">
          <v-card class="feature-card" elevation="0">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>
              {{ feature.text }}
            </p>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="pricing-card mb-10" elevation="0">
        <div class="pricing-header">
          <h2>{{ $t("pricing.howTitle") }}</h2>
          <p>
            {{ $t("pricing.howText") }}
          </p>
        </div>

        <div class="pricing-block">
          <h3>{{ $t("pricing.influencesTitle") }}</h3>
          <ul class="pricing-list">
            <li v-for="item in $tm('pricing.influences')" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="pricing-block">
          <h3>{{ $t("pricing.includedTitle") }}</h3>
          <ul class="pricing-list">
            <li v-for="item in $tm('pricing.included')" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="pricing-note">
          <p>
            {{ $t("pricing.note") }}
          </p>
        </div>
      </v-card>

      <div class="section-header text-center mb-6">
        <h2>{{ $t("pricing.popularTitle") }}</h2>
        <p>
          {{ $t("pricing.popularText") }}
        </p>
      </div>

      <v-row>
        <v-col
          v-for="destination in popularDestinations"
          :key="destination.slug"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card class="destination-card" elevation="0">
            <v-img
              :src="getImage(destination)"
              :alt="destination.name"
              height="190"
              cover
              class="destination-image"
              @error="fallback"
            />

            <div class="destination-content">
              <div class="destination-top">
                <div class="destination-name-wrap">
                  <span class="flag">{{ destination.flag }}</span>
                  <h3>{{ getDestinationName(destination) }}</h3>
                </div>
                <div class="from-price">
                  {{ $t("pricing.from") }} <span>{{ formatUsdPrice(getEntryPrice(destination)) }} USD</span>
                </div>
              </div>

              <div class="plans-preview">
                <div
                  v-for="plan in getTopPlans(destination)"
                  :key="plan.label"
                  class="plan-row"
                >
                  <span class="plan-label">{{ plan.label }}</span>
                  <span class="plan-value">{{ formatUsdPrice(plan.price) }} USD</span>
                </div>
              </div>

              <v-btn
                class="destination-btn"
                color="deep-purple-accent-4"
                rounded="xl"
                block
                :to="`/destinations/${destination.slug}`"
              >
                {{ $t("pricing.offer") }}
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div class="text-center mt-10">
        <v-btn
          color="pink-darken-1"
          size="large"
          rounded="xl"
          class="cta-btn"
          to="/destinations"
        >
          {{ $t("pricing.allDestinations") }}
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import popularDestinations from "@/data/popularDestinations.json"
import { getLocalizedName } from "@/utils/localizedNames"
import i18n from "@/i18n"

function getEntryPrice(destination) {
  const prices = Object.values(destination.plans)
    .map((plan) => (plan && typeof plan === "object" ? plan.price : plan))
    .filter((price) => price !== null && price !== undefined)
  return Math.min(...prices)
}

function formatUsdPrice(price) {
  return Number(price).toFixed(2)
}

function formatPlanLabel(key) {
  const [data, duration] = key.split("_")
  return data + " / " + duration.replace("days", i18n.global.t("pricing.days"))
}

function getTopPlans(destination) {
  return Object.entries(destination.plans)
    .slice(0, 3)
    .map(([key, plan]) => {
      const price = plan && typeof plan === "object" ? plan.price : plan

      return {
        label: formatPlanLabel(key),
        price
      }
    })
}

function getDestinationName(destination) {
  return getLocalizedName(destination, i18n.global.locale)
}

const getImage = (item) => {
  if (item.type === "region") {
    return require(`@/assets/images/flags/regions/regions.png`);
  }

  try {
    return require(`@/assets/images/flags/${item.iso.toLowerCase()}.svg`);
  } catch (e) {
    return item.image;
  }
};

const fallback = (event) => {
  event.target.src = require('@/assets/images/flags/default.png');
};

</script>

<style scoped>
.pricing-page {
  background: linear-gradient(180deg, #f7f3ff 0%, #fffaf7 220px, #ffffff 100%);
  min-height: 100vh;
}

.eyebrow {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
  font-weight: 800;
  color: #241437;
  margin-bottom: 12px;
}

.page-subtitle {
  max-width: 760px;
  margin: 0 auto;
  color: #6b7280;
  font-size: 1rem;
}

.feature-card {
  height: 100%;
  padding: 28px 22px;
  border-radius: 22px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 45px rgba(84, 51, 142, 0.08);
  text-align: center;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.feature-card h3 {
  color: #241437;
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

.pricing-card {
  max-width: 980px;
  margin: 0 auto;
  border-radius: 24px;
  padding: 32px 24px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 20px 60px rgba(84, 51, 142, 0.08);
}

.pricing-header h2,
.pricing-block h3,
.section-header h2 {
  color: #6f42c1;
  font-weight: 800;
}

.pricing-header h2,
.section-header h2 {
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.pricing-header p,
.section-header p {
  color: #374151;
  line-height: 1.85;
}

.pricing-block + .pricing-block {
  margin-top: 30px;
}

.pricing-list {
  padding-left: 20px;
  color: #374151;
  line-height: 1.9;
}

.pricing-note {
  margin-top: 28px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #faf7ff;
  border: 1px solid #eee7fb;
}

.pricing-note p {
  margin: 0;
  color: #6b7280;
  line-height: 1.7;
}

.destination-card {
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 16px 45px rgba(84, 51, 142, 0.08);
  height: 100%;
}

.destination-image {
  border-bottom: 1px solid #f1ebfc;
}

.destination-content {
  padding: 20px;
}

.destination-top {
  margin-bottom: 18px;
}

.destination-name-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.destination-name-wrap h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #241437;
  margin: 0;
}

.flag {
  font-size: 1.35rem;
}

.from-price {
  color: #6b7280;
  font-size: 0.95rem;
}

.from-price span {
  color: #6f42c1;
  font-weight: 800;
}

.plans-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.plan-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 14px;
  background: #faf7ff;
  border: 1px solid #eee7fb;
}

.plan-label {
  color: #374151;
  font-size: 0.95rem;
}

.plan-value {
  color: #241437;
  font-weight: 800;
}

.destination-btn,
.cta-btn {
  text-transform: none;
  font-weight: 700;
}

.cta-btn {
  padding-inline: 28px;
}

@media (min-width: 960px) {
  .pricing-card {
    padding: 42px 40px;
  }
}
</style>
