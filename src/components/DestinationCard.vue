<template>
    <v-card elevation="1" rounded="xl" :to="{
        name: 'destinationDetails',
        params: { slug: country.slug }
    }">
        <div class="card-row d-flex justify-space-between align-center ma-3">
            <template v-if="$i18n.locale === 'ar'">
            <button class="arrow-btn ml-3" type="button">
                <v-icon color="" size="22">mdi-arrow-left</v-icon>
            </button>
            <div class="card-content d-flex align-center justify-end">
                <div class="card-copy">
                    <v-card-item>
                        <v-card-title class="card-title">
                            {{ getLocalizedName(country) }}
                        </v-card-title>

                        <v-card-subtitle class="price-subtitle price-subtitle-ar">
                            <bdi dir="ltr" class="text-h6 font-weight-bold text-pink-darken-4">
                                {{ getEntryPrice(country) }} DH
                            </bdi>
                            <span dir="rtl">{{ $t("common.from") }}</span>
                        </v-card-subtitle>
                    </v-card-item>
                </div>
                <div class="flag-wrapper">
                    <v-img  :src="getImage(country)" contain
                        class="flag-img" @error="fallback" />
                </div>
            </div>
            <div class="card-wave-mirror"></div>
            </template>
            <template v-else>
            <div class="card-content d-flex align-center">
                <div class="flag-wrapper">
                    <v-img  :src="getImage(country)" contain
                        class="flag-img" @error="fallback" />
                </div>
                <div class="card-copy">
                    <v-card-item>
                        <v-card-title class="card-title">
                            {{ getLocalizedName(country) }}
                        </v-card-title>

                        <v-card-subtitle class="price-subtitle">
                                <span>{{ $t("common.from") }}</span>
                                <bdi dir="ltr" class="text-h6 font-weight-bold text-pink-darken-4">
                                    {{ getEntryPrice(country) }} DH
                                </bdi>
                        </v-card-subtitle>
                    </v-card-item>
                </div>
            </div>
            <button class="arrow-btn mr-3" type="button">
                <v-icon color="" size="22">mdi-arrow-right</v-icon>
            </button>
            <div class="card-wave"></div>
            </template>
        </div>
    </v-card>

</template>

<script setup>
import { getLocalizedName } from "@/utils/localizedNames"

defineProps({
    country: Object
})

const getEntryPrice = (destination) => {
    const prices = Object.values(destination.plans)
        .map((plan) => (plan && typeof plan === 'object' ? plan.price : plan))
        .filter((price) => price !== null && price !== undefined)
    return Math.min(...prices)
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
.card-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.0;
    color: #1f2937;
}

.card-row {
    direction: ltr;
}

.card-copy {
    min-width: 0;
}

.price-subtitle {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    unicode-bidi: isolate;
}

.price-subtitle-ar {
    direction: ltr;
    text-align: right;
}

.flag-wrapper {
    width: 60px;
    height: 40px;
    display: flex;
    align-items: center;
}

.flag-img {
    width: 100%;
    height: 100%;
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
    right: -130px;
    bottom: 0px;
    width: 220px;
    height: 120px;
    background: #FCE4EC;
    border-radius: 50% 50% 0 0;
    transform: rotate(-45deg);
}

.card-wave-mirror {
    position: absolute;
    left: -130px;
    bottom: 0px;
    width: 220px;
    height: 120px;
    background: #FCE4EC;
    border-radius: 50% 50% 0 0;
    transform: rotate(45deg);
}
</style>
