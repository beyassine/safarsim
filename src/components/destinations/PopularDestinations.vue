<template>

    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 pb-5' : 'px-6  pb-5'">
        <div class="mb-5" align="center">
            <h2 class="section-title text-center">
                Destinations Populaires
            </h2>

            <p class="text-subtitle-1 text-medium-emphasis">
                Choisissez parmi nos 160 destinations <br>et profitez des forfaits flexibles adaptés à vos besoins de voyage.
            </p>
        </div>

        <v-row class="mb-5">
            <v-col v-for="country in countries" :key="country.slug" :cols="$vuetify.display.smAndUp ? '4' : '12'">
                <DestinationCard :country="country" />
            </v-col>
        </v-row>

        <div class="d-flex align-center justify-center">
            <v-btn class="text-none ma-4" rounded="lg" color="green-darken-1" size="large" variant="flat">
                Voir toutes les destinations
            </v-btn>
        </div>

    </v-container>

</template>

<script>

import countries from "../../data/countries"
import DestinationCard from "./DestinationCard.vue"
import { useDisplay } from "vuetify";

export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
        DestinationCard,
    },

    data() {
        return {
            countries: countries,
        };
    },
    computed: {
    },
    methods: {
    },
    mounted() { },
};
</script>

<style lang="scss" scoped>
.container-destination {
    padding-bottom: 50px;

}
</style>