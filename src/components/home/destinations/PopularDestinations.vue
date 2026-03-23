<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 destination-container' : 'px-6 destination-container'">
        <div class="mb-5" align="center">
            <h2 class="section-title text-center">
                Destinations Populaires
            </h2>
            <p class="text-body-smal">
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

import countries from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard.vue";
import { useDisplay } from "vuetify";
import flying_paper from "@/assets/images/home/line.png";

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
            flying_paper: flying_paper,
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
.destination-container {
    position: relative;
    z-index: 1;
}
</style>