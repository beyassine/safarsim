<template>
    <v-card elevation="1" rounded="xl"  :to="{
        name: 'Destination',
        params: { country: country.slug }
    }">
        <div class="d-flex flex-no-wrap justify-space-between align-center ma-3">
            <div class="d-flex flex-no-wrap align-center">
                <v-avatar class="" rounded="1" size="40">
                    <v-img :src="country.image"></v-img>
                </v-avatar>
                <div>
                    <v-card-item>
                        <v-card-title class="card-title">
                            {{ country.name }}
                        </v-card-title>

                        <v-card-subtitle>
                            Á partir de <span class="font-weight-bold text-title-medium text-primary">{{
                                country.price }}</span>
                        </v-card-subtitle>
                    </v-card-item>

                </div>
            </div>
            <div>

                <v-card-actions>
                    <v-btn icon="mdi-arrow-right"></v-btn>
                </v-card-actions>
            </div>
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

</style>