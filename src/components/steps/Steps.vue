<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 pb-10' : 'px-0 pb-10'">
        <v-card elevation="0" class="bg-steps" rounded="xl">
            <v-row fluid class="pa-8" align="center">

                <!-- RIGHT SIDE -->

                <v-col cols="12" md="6">

                    <div class="images-row">

                        <v-img src="/img/mountain.jpg" height="200" width="180" cover rounded="xl" />

                        <v-img src="/img/traveler.jpg" height="200" width="260" cover rounded="xl" />

                    </div>

                </v-col>

                <!-- LEFT SIDE -->

                <v-col  cols="12" md="6">

                    <h2 class="section-title mb-4">
                        Profitez d’internet partout en seulement 3 étapes
                    </h2>
                    <div class="step-card">

                        <div class="step-number">01</div>

                        <v-icon size="40">mdi-cart-outline</v-icon>

                        <div>
                            <p class="step-text">
                                <b>Choisissez votre destination</b> et le nombre de jours
                                pour votre forfait eSIM.
                            </p>
                            <a class="compatibility">
                                Choisir destination →
                            </a>
                        </div>

                    </div>


                    <div class="step-card">

                        <div class="step-number">02</div>

                        <v-icon size="40">mdi-qrcode-scan</v-icon>

                        <div>
                            <p class="step-text">
                                <b>Installez votre eSIM</b> facilement grâce
                                au QR code reçu par e-mail.
                            </p>
                        </div>

                    </div>


                    <div class="step-card">

                        <div class="step-number">03</div>

                        <v-icon size="40">mdi-cellphone-wireless</v-icon>

                        <div>
                            <p class="step-text">
                                <b>Activez votre connexion</b> à votre arrivée
                                et profitez d’internet immédiatement.
                            </p>
                        </div>

                    </div>

                </v-col>
            </v-row>
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
<style scoped>

.bg-steps {
    background-image: url("../../assets/steps.jpg");
    background-size: cover;
    background-position: center;
    min-height: 500px;
}

.images-row {
    display: flex;
    gap: 20px;
}

.step-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 22px;
    border-radius: 16px;
    background: #f3efe9;
    margin-bottom: 20px;
    border: 1px solid purple;
}

.step-number {
    color: #ff4a4a;
    font-weight: 700;
    font-size: 18px;
    width: 40px;
}

.step-text {
    margin: 0;
    font-size: 13px;
}

.compatibility {
    font-size: 13px;
    color: #000;
    text-decoration: underline;
    cursor: pointer;
}
</style>