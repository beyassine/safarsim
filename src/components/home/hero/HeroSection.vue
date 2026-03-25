<template>
    <v-container fluid class="px-0">

        <v-card elevation="0" class="hero-card">

            <div class="overlay">

                <v-container fluid
                    :class="$vuetify.display.smAndUp ? 'px-16 fill-height d-flex align-center' : 'px-6  fill-height'">
                    <v-row class="mt-5 pb-15">

                        <v-col :cols="$vuetify.display.smAndUp ? '6' : '12'">

                            <div class="hero mb-5">
                                <h1 class="hero-title text-center">
                                    Voyagez Connecté partout dans le monde
                                </h1>

                                <p class="hero-subtitle text-center">
                                    Installez votre eSIM <span class="accent">SAFAR SIM</span> et
                                    profitez d’une connexion internet fiable oú que vous soyez
                                </p>
                            </div>
                            <v-row class="d-flex mb-5 info-row">
                                <v-col class="text-center" cols="12">
                                    <h3 class="info-title"> <v-icon color="green-darken-2" icon="mdi-check"
                                            size="large"></v-icon> Activation en 2 minutes</h3>
                                </v-col>

                                <v-col class="text-center" cols="12">
                                    <h3 class="info-title"> <v-icon color="green-darken-2" icon="mdi-check"
                                            size="large"></v-icon> Sans carte SIM physique</h3>
                                </v-col>

                                <v-col class="text-center" cols="12">
                                    <h3 class="info-title"> <v-icon color="green-darken-2" icon="mdi-check"
                                            size="large"></v-icon> Plus de 160 destinations</h3>
                                </v-col>

                            </v-row>

                        </v-col>

                        <v-col class="align-self-center" :cols="$vuetify.display.smAndUp ? '6' : '12'">

                            <DestinationSearch :destinations="destinations" :popularDestinations="popularDestinations"
                                @select="goToDestination" />
                        </v-col>

                    </v-row>
                </v-container>

            </div>
            <svg class="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
                <path d="M0,60 C480,120 960,0 1440,60 L1440,120 L0,120 Z" fill="#fffbf8" />
            </svg>
        </v-card>

    </v-container>

</template>

<script>
import DestinationSearch from "@/components/DestinationSearchBar.vue";
import destinations from "@/data/destinations.json";
import PopularDestinations from "@/data/popularDestinations.json";
import router from "@/router";
import { useDisplay } from "vuetify";

export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
        DestinationSearch,
    },

    data() {
        return {
            destinations: destinations,
            popularDestinations: PopularDestinations,
        };
    },
    computed: {
    },
    methods: {
        goToDestination(destination) {
            router.push({ name: "destinationDetails", params: { slug: destination.slug } })
        },
    },
    mounted() { },
};
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.hero-card {
    border-radius: 0;
    background-image: url("@/assets/images/bg/hero.png");
    background-size: cover;
    background-position: center;
    min-height: 500px;
    overflow: visible;
    position: relative;
    z-index: 20;
}

.hero-image {
    position: relative;
}

.hero-title img,
.hero-title .v-img {
    vertical-align: middle;
}

.overlay {
    height: 100%;
    width: 100%;
    display: flex;
}

.hero-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 30px;
    font-weight: 550;
    line-height: 1.2;
    color: #1f2937;
    margin-bottom: 10px;
}

.hero-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 450;
    line-height: 1.6;
}

.accent {
    color: #D81B60;
    font-size: 20px;
    font-weight: 550;
}

.info-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    font-weight: 550;
    line-height: 1;
    color: #1f2937;
    margin-bottom: 2px;
}


.hero-wave {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1;
    fill: #fffbf8;
}
</style>