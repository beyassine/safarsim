<template>
    <v-container fluid class="px-0">

        <v-card elevation="0" class="hero-card">

                <div class="overlay">

                    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 fill-height d-flex align-center' : 'px-6  fill-height'" >
                        <v-row >

                            <v-col class="mt-5" :cols="$vuetify.display.smAndUp ? '6' : '12'">

                                <div class="hero">
                                    <h1 class="hero-title">
                                        Voyagez Connecté avec <span class="accent"> SAFAR SIM</span> 
                                    </h1>

                                    <p class="hero-subtitle">
                                        Installez votre eSIM en quelques secondes et profitez d’une
                                        connexion internet fiable dans plus de 160 destinations.
                                    </p>
                                </div>

                                <DestinationSearch />

                            </v-col>

                            <v-col class="mt-5" :cols="$vuetify.display.smAndUp ? '6' : '12'">
                                
                        <v-img src="/img/mountain.jpg" height="200" width="180" cover rounded="xl" />
                            </v-col>

                        </v-row>
                    </v-container>

                </div>
                <svg class="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,60 C480,120 960,0 1440,60 L1440,120 L0,120 Z" fill="#fffbf8" />
                </svg>
        </v-card>

    </v-container>

</template>

<script>
import DestinationSearch from "./DestinationSearch.vue";
import hero from "../../assets/hero.jpg";
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
            hero: hero,
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.hero-card {
    border-radius: 0;
    margin-bottom: 10px;
    background-image: url("../../assets/hero.jpg");
    background-size: cover;
    background-position: center;
    min-height: 500px;

}

.hero-image {
    position: relative;
}

.overlay {
    height: 100%;
    width: 100%;
    display: flex;
}

.hero-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 36px;
    font-weight: 550;
    line-height: 1.2;
    color: #1f2937;
    margin-bottom: 10px;
}

.hero-title .accent {
    color: purple;
    font-size: 28px;
    font-weight: bold;
    /* red/pink like holafly */
}

.hero-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    font-weight: 450;
    line-height: 1.6;
    max-width: 600px;
}

.hero-wave {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 100px;
    z-index: 1;
    fill: #fffbf8;
}
</style>