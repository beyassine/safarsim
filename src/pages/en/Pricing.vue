<template>
  <div class="pricing-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="eyebrow"><bdi dir="ltr">SAFAR SIM</bdi></div>
        <h1 class="page-title">Our eSIM Pricing</h1>
        <p class="page-subtitle">
          Simple, flexible plans adapted to your travels, with transparent prices for each destination.
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
          <h2>How do our prices work?</h2>
          <p>
            Prices vary depending on the destination, data amount and plan duration. On SafarSim you will find offers adapted to short stays and longer trips.
          </p>
        </div>

        <div class="pricing-block">
          <h3>What influences the price</h3>
          <ul class="pricing-list" :class="{ 'pricing-list--rtl': false }">
            <li v-for="item in $tm('pricing.influences')" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="pricing-block">
          <h3>What is included</h3>
          <ul class="pricing-list" :class="{ 'pricing-list--rtl': false }">
            <li v-for="item in $tm('pricing.included')" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="pricing-note">
          <p>
            The prices shown below correspond to our available plans for some popular destinations.
          </p>
        </div>
      </v-card>

      <div class="section-header text-center mb-6">
        <h2>Popular destinations</h2>
        <p>
          View some of our most requested destinations with their eSIM prices.
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

            <div class="destination-content" :class="{ 'destination-content--rtl': false }">
              <div class="destination-top">
                <div class="destination-name-wrap">
                  <span class="flag">{{ destination.flag }}</span>
                  <h3>{{ getDestinationName(destination) }}</h3>
                </div>
                <div class="from-price" :class="{ 'from-price--rtl': false }">
                  <span class="from-price-label">From</span>
                  <span class="from-price-value" dir="ltr">{{ formatPriceFromMad(getEntryPrice(destination), 'en') }}</span>
                </div>
              </div>

              <div class="plans-preview">
                <div
                  v-for="plan in getTopPlans(destination)"
                  :key="plan.label"
                  class="plan-row"
                >
                  <span class="plan-label">{{ plan.label }}</span>
                  <span class="plan-value">{{ formatPriceFromMad(plan.price, 'en') }}</span>
                </div>
              </div>

              <v-btn
                class="destination-btn"
                color="pink-darken-1"
                size="large"
                rounded="xl"
                block
                :to="`/destinations/${destination.slug}`"
              >
                View offer
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
          View all destinations
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import popularDestinations from "@/data/popularDestinations.json"
import { destinations } from "@/services/catalog"
import { getLocalizedName } from "@/utils/localizedNames"
import { formatPriceFromMad } from "@/utils/currency"

function getEntryPrice(destination) {
  const canonicalDestination = destinations.find((item) => item.slug === destination.slug) || destination
  const prices = Object.values(canonicalDestination.plans)
    .map((plan) => (plan && typeof plan === "object" ? plan.price : plan))
    .filter((price) => price !== null && price !== undefined)
  return Math.min(...prices)
}

function formatPlanLabel(key) {
  const [data, duration] = key.split("_")
  return data + " / " + duration.replace("days", "days")
}

function getTopPlans(destination) {
  const canonicalDestination = destinations.find((item) => item.slug === destination.slug) || destination
  return Object.entries(canonicalDestination.plans)
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
  return getLocalizedName(destination, 'en')
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

.pricing-list--rtl {
  direction: rtl;
  text-align: right;
  padding-right: 20px;
  padding-left: 0 !important;
}

.pricing-list--rtl li {
  direction: rtl;
  text-align: right;
  padding-right: 10px;
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
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: #6b7280;
  font-size: 0.95rem;
}

.from-price-value {
  color: #6f42c1;
  font-weight: 800;
}

.destination-content--rtl,
.destination-content--rtl .destination-top {
  direction: rtl;
  text-align: right;
}

.from-price--rtl {
  direction: rtl;
  flex-direction: row;
  justify-content: flex-start;
  text-align: right;
}

.from-price--rtl .from-price-label {
  order: 1;
  direction: rtl;
}

.from-price--rtl .from-price-value {
  order: 2;
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

.destination-btn {
  min-height: 52px;
  font-size: 1rem;
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
