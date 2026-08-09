<template>
    <v-container fluid class="px-0 py-0">
        <v-card elevation="0" class="bg-footer">

            <svg viewBox="0 0 1440 100" class="footer-wave">
                <path d="M0,40 C400,100 1000,0 1440,60 L1440,0 L0,0 Z" fill="#fffbf8" />
            </svg>

            <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16' : 'px-6'">
                <v-row>

                    <!-- LEFT: BRAND -->
                    <v-col cols="12" md="4">
                        <div>
                            <v-img :src="logo" alt="SafarSim" height="60" width="160" contain />
                        </div>

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
                        <h4 class="footer-title">{{ $t("footer.company") }}</h4>
                        <ul>
                            <router-link class="text-decoration-none" to="/about">
                            <li>{{ $t("footer.about") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/pricing">
                                <li>{{ $t("footer.pricing") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/contact">
                                <li>{{ $t("footer.contact") }}</li>
                            </router-link>
                        </ul>
                    </v-col>


                    <!-- COLUMN 2 -->
                    <v-col cols="6" md="2">
                        <h4 class="footer-title">{{ $t("footer.destinations") }}</h4>
                        <ul>
                            <router-link class="text-decoration-none" to="/regions/europe">
                            <li>{{ $t("footer.esimEurope") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/destinations/arabie-saoudite">
                            <li>{{ $t("footer.esimSaudiArabia") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/destinations/turquie">
                            <li>{{ $t("footer.esimTurkey") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/destinations">
                            <li>{{ $t("footer.allDestinations") }}</li>
                            </router-link>
                        </ul>
                    </v-col>


                    <!-- COLUMN 3 -->
                    <v-col cols="6" md="2">
                        <h4 class="footer-title">{{ $t("footer.legal") }}</h4>
                        <ul>
                            <router-link class="text-decoration-none" to="/terms-of-service">
                                <li>{{ $t("footer.terms") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/privacy-policy">
                                <li>{{ $t("footer.privacy") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/refund-policy">
                                <li>{{ $t("footer.refund") }}</li>
                            </router-link>
                        </ul>
                    </v-col>


                    <!-- COLUMN 4 -->
                    <v-col cols="6" md="2">
                        <h4 class="footer-title">{{ $t("footer.support") }}</h4>
                        <ul>
                            <router-link class="text-decoration-none" to="/help">
                                <li>{{ $t("footer.help") }}</li>
                            </router-link>
                            <router-link class="text-decoration-none" to="/compatibility">
                                <li>{{ $t("footer.compatibility") }}</li>
                            </router-link>
                        </ul>
                    </v-col>

                </v-row>
            </v-container>

            <!-- BOTTOM BAR -->
            <div class="footer-bottom mt-5 text-center">
                <p>
                    {{ $t("footer.bottom") }} <br> {{ $t("footer.copyright") }}
                </p>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import { useDisplay } from "vuetify";
import footer_bg from "@/assets/images/bg/footer.png";

import logo from "@/assets/logo.png";

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
            logo: logo,
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
    background-image: url("@/assets/images/bg/footer.png");
    background-size: cover;
    background-position: center;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
}

.bg-footer :deep(.v-row),
.bg-footer :deep(.v-col) {
    min-width: 0;
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
