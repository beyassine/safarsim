<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 pb-10' : 'px-0 pb-10'">
        <v-card class="" color="#fffbf8" elevation="0">
            <v-row fluid align="center" class="mt-5 pa-3">

                <!-- RIGHT SIDE -->

                <v-col :cols="$vuetify.display.smAndUp ? '6' : '12'">
                        <h2 class="section-title text-center mb-5">
                            Profitez d’internet partout en seulement 3 étapes
                        </h2>

                    <v-img :src="barcelona" height="" class="" />

                </v-col>

                <!-- LEFT SIDE -->

                <v-col :cols="$vuetify.display.smAndUp ? '6' : '12'">
                    <div >
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

                            <div class="step-number ">02</div>

                            <v-icon size="40" >mdi-qrcode-scan</v-icon>

                            <div>
                                <p class="step-text">
                                    <b>Installez votre eSIM</b> facilement grâce
                                    au QR code reçu par e-mail.
                                </p>
                            </div>

                        </div>


                        <div class="step-card ">

                            <div class="step-number">03</div>

                            <v-icon size="40">mdi-cellphone-wireless</v-icon>

                            <div>
                                <p class="step-text">
                                    <b>Activez votre connexion</b> à votre arrivée
                                    et profitez d’internet immédiatement.
                                </p>
                            </div>

                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { useDisplay } from "vuetify";
import barcelona from "@/assets/images/home/barcelona.png";


export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
    },

    data() {
        return {
            barcelona: barcelona,
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
.section-title-1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 550;
    line-height: 1.2;
    color: #1f2937;
    padding: 10px;
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
    margin-bottom: 20px;
    border: 1px solid #e5e7eb; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
}

.step-number {
    color: #D81B60;
    font-weight: 700;
    font-size: 20px;
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