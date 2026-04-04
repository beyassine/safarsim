<template>
    <v-card elevation="1" rounded="xl" :to="{
        name: 'destinationDetails',
        params: { slug: country.slug }
    }">
        <div class="d-flex  justify-space-between align-center ma-3">
            <div class="d-flex align-center">
                <div class="flag-wrapper">
                    <v-img  :src="getImage(country)" contain
                        class="flag-img" @error="fallback" />
                </div>
                <div>
                    <v-card-item>
                        <v-card-title class="card-title">
                            {{ country.name }}
                        </v-card-title>

                        <v-card-subtitle>
                            Á partir de <span class=" text-h6 font-weight-bold text-pink-darken-4"> {{
                                getEntryPrice(country) }} DH</span>
                        </v-card-subtitle>
                    </v-card-item>

                </div>
            </div>
            <button class="arrow-btn mr-3" type="button">
                <v-icon color="" size="22">mdi-arrow-right</v-icon>
            </button>
            <div class="card-wave"></div>
        </div>
    </v-card>

</template>

<script setup>

defineProps({
    country: Object
})

const getEntryPrice = (destination) => {
    const prices = Object.values(destination.plans)
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
</style>