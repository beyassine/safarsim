<template>
    <v-card elevation="1" rounded="xl" :to="{
        name: 'destinationDetails',
        params: { slug: country.slug }
    }">
        <div class="d-flex  justify-space-between align-center ma-3">
            <div class="d-flex align-center">
                <v-avatar class="" rounded="1" size="40">
                    <v-img :src="country.image"></v-img>
                </v-avatar>
                <div>
                    <v-card-item>
                        <v-card-title class="card-title">
                            {{ country.name }}
                        </v-card-title>

                        <v-card-subtitle>
                            Á partir de <span class="font-weight-bold text-title text-green-darken-4">{{
                                country.price }}</span>
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

</script>

<style scoped>
.card-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.0;
    color: #1f2937;
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