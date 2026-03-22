<template>
    <v-container fluid class="px-0 py-0">
        <v-card elevation="0" class="bg-footer">

            <svg viewBox="0 0 1440 100" class="footer-wave">
                <path d="M0,40 C400,100 1000,0 1440,60 L1440,0 L0,0 Z" fill="#fffbf8" />
            </svg>

            <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16' : 'px-6'">
                <v-row >

                    <!-- LEFT: BRAND -->
                    <v-col cols="12" md="4">

                        <h2 class="logo">SAFAR SIM</h2>

                        <div class="socials mt-6">
                            <v-icon class="mr-3">mdi-facebook</v-icon>
                            <v-icon class="mr-3">mdi-instagram</v-icon>
                            <v-icon class="mr-3">mdi-youtube</v-icon>
                            <v-icon class="mr-3">mdi-twitter</v-icon>
                            <v-icon class="mr-3">mdi-linkedin</v-icon>
                            <v-icon>mdi-tiktok</v-icon>
                        </div>

                    </v-col>


                    <!-- COLUMN 1 -->
                    <v-col cols="6" md="2">
                        <h4 class="footer-title">Entreprise</h4>
                        <ul>
                            <li>À propos</li>
                            <li>Nos offres</li>
                            <li>Avis clients</li>
                            <li>Contact</li>
                        </ul>
                    </v-col>


                    <!-- COLUMN 2 -->
                    <v-col cols="6" md="2">
                        <h4 class="footer-title">Destinations</h4>
                        <ul>
                            <li>eSIM Europe</li>
                            <li>eSIM USA</li>
                            <li>eSIM Maroc</li>
                            <li>eSIM Asie</li>
                            <li>Toutes les destinations</li>
                        </ul>
                    </v-col>


                    <!-- COLUMN 3 -->
                    <v-col cols="6" md="2">
                        <h4 class="footer-title">Légal</h4>
                        <ul>
                            <li>Conditions générales</li>
                            <li>Confidentialité</li>
                            <li>Cookies</li>
                        </ul>
                    </v-col>


                    <!-- COLUMN 4 -->
                    <v-col cols="6" md="2">
                        <h4 class="footer-title">Support</h4>
                        <ul>
                            <li>Centre d’aide</li>
                            <li>Compatibilité eSIM</li>
                            <li>Guide d’installation</li>
                            <li>FAQ</li>
                        </ul>
                    </v-col>

                </v-row>
            </v-container>

            <!-- BOTTOM BAR -->
            <div class="footer-bottom mt-5 text-center">
                <p>
                    Conçu avec ❤️ pour les voyageurs <br> SAFAR SIM © 2026
                </p>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import { useDisplay } from "vuetify";
import footer_bg from "../../assets/footer.jpg";

export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
    },

    data() {
        return {
            footer_bg: footer_bg,
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
.bg-footer {
    background-image: url("../../assets/steps.png");
    background-size: cover;
    background-position: center;
}

.logo {
    font-size: 28px;
    font-weight: bold;
    color: purple;
}

.footer-title {
    font-weight: 600;
    margin-bottom: 12px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin-bottom: 8px;
    color: #555;
    cursor: pointer;
    transition: 0.2s;
}

li:hover {
    color: #000;
}

.socials .v-icon {
    cursor: pointer;
}

.footer-bottom {
    border-top: 1px solid #ddd;
    padding-top: 20px;
    font-size: 14px;
    color: #777;
}
</style>