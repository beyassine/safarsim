<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 pb-' : 'px-0 pb-10'" >

        <v-card elevation="0" class="bg-marketing" rounded="xl">
                <div >
                    <v-row  fluid class="pa-8" align="center">
                        
                        <!-- IMAGES -->
                        <v-col cols="12" md="5">

                            <v-row>
                                <v-col cols="6">
                                    <v-img src="/img/plane.jpg" height="260" cover rounded="xl" />
                                </v-col>

                                <v-col cols="6">
                                    <v-img src="/img/traveler.jpg" height="260" cover rounded="xl" />
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- CONTENT -->
                        <v-col cols="12" md="7">

                            <h2 class="section-title mb-4">
                                Pourquoi SAFAR eSIM ?
                            </h2>

                            <p class="mb-4">
                                Avec eSIM SAFAR, profitez d’internet mobile dès votre arrivée,
                                sans changer de carte SIM ni payer de frais d’itinérance.
                            </p>

                            <p class="mb-6">
                                Installez votre eSIM en quelques secondes et connectez-vous
                                dans plus de 160 destinations.
                                Gardez votre numéro WhatsApp et naviguez comme un local.
                            </p>

                            <v-btn color="light-blue-darken-4 text-none" size="large" rounded="lg" class="mb-6">
                                Acheter une eSIM
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
        </v-card>

    </v-container>
</template>
<script>
import { useDisplay } from "vuetify";

export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
    },

    data() {
        return {
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
.bg-marketing {
    background-image: url("../../assets/marketing.png");
    background-size: cover;
    background-position: center;
    min-height: 500px;
}

.brand {
    color: #01579B;
}

.info-row {
    opacity: 0.85;    
    font-size: 16px;
}

.section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 550;
    line-height: 1.2;
    color: #1f2937;
    margin-bottom: 50px;
}
</style>