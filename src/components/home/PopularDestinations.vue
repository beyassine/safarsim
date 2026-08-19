<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 destination-container' : 'px-6 destination-container'">
        <div class="mb-5" align="center">
            <h2 class="section-title text-center">
                {{ $t("home.popular.title") }}
            </h2>
            <p class="text-medium-emphasis text-center">
                {{ $t("home.popular.subtitle") }}
            </p>
        </div>

        <v-row class="mb-5">
            <v-col v-for="country in countries" :key="country.slug" :cols="$vuetify.display.smAndUp ? '4' : '12'">
                <DestinationCardRegion v-if="country.type === 'region'" :country="country" />
                <DestinationCard v-else :country="country" />
            </v-col>
        </v-row>

        <div class="d-flex align-center justify-center">

            <router-link class="text-decoration-none text-black" to="/destinations">
                <v-btn class="text-none ma-4" rounded="lg" color="green-darken-1" prepend-icon="mdi-earth" size="large" variant="flat">
                    {{ $t("common.viewDestinations") }}
                </v-btn>
            </router-link>
        </div>

    </v-container>

</template>

<script>

import popularDestinations from "@/data/popularDestinations.json";
import { destinations, regions } from "@/services/catalog";
import DestinationCard from "@/components/DestinationCard.vue";
import DestinationCardRegion from "@/components/DestinationCardRegion.vue";
import { useDisplay } from "vuetify";
import flying_paper from "@/assets/images/home/line.png";

export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
        DestinationCard,
        DestinationCardRegion,
    },

    data() {
        const europe = regions.find((region) => region.slug === "europe");
        const popularCountries = popularDestinations
            .filter((popularDestination) => popularDestination.slug !== "arabie-saoudite")
            .map((popularDestination) => {
                return destinations.find((destination) => destination.slug === popularDestination.slug)
                    || popularDestination;
            });

        return {
            countries: europe ? [europe, ...popularCountries] : popularCountries,
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
