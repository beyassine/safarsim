<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 pb-10' : 'px-0 pb-10'">

        <v-card elevation="0" class="" color="#fffbf8" rounded="xl">
            <div>
                <v-row fluid align="center">

                    <!-- IMAGES -->
                    <v-col class="px-8 " :cols="$vuetify.display.smAndUp ? '6' : '12'">

                        <h2 class="section-title text-center mb-4">
                            Pourquoi SAFAR SIM ?
                        </h2>
                        <v-img :src="paris" height="" class="" />

                    </v-col>

                    <!-- CONTENT -->
                    <v-col class="pa-8" :cols="$vuetify.display.smAndUp ? '6' : '12'">
                        <p class="mb-4">
                            Avec eSIM SAFAR SIM, profitez d’internet mobile dès votre arrivée,
                            sans changer de carte SIM ni payer de frais d’itinérance.
                        </p>

                        <p class="mb-6">
                            Installez votre eSIM en quelques secondes et connectez-vous
                            dans plus de 160 destinations.
                            Gardez votre numéro WhatsApp et naviguez comme un local.
                        </p>
                        <v-btn class="text-none" block rounded="lg" color="pink-darken-1" size="large" variant="flat">
                            Choisir ma destination
                        </v-btn>
                    </v-col>
                </v-row>
            </div>

            <div class="d-flex align-center justify-center">
            </div>
        </v-card>

    </v-container>
</template>
<script>
import { useDisplay } from "vuetify";
import paris from "@/assets/images/home/paris.png";

export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
    },

    data() {
        return {
            paris: paris,
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

.compatibility {
    font-size: 18px;
    color: #000;
    text-decoration: underline;
    cursor: pointer;
}
</style>