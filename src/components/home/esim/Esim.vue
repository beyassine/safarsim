<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 mb-5' : ' px-0 mb-5'">

        <v-card class="esim-section px-8" elevation="0" rounded="xl">
            <v-row align="center">
                <!-- LEFT CONTENT -->
                <v-col :cols="$vuetify.display.smAndUp ? '6' : '12'">

                    <h2 class="section-title text-center ">
                        {{ $t("home.apps.title") }}
                    </h2>
                    <v-img :src="app_icons" height="" class="mb-5" />
                </v-col>
                <!-- RIGHT IMAGE -->
                <v-col :cols="$vuetify.display.smAndUp ? '6' : '12'">

                    <p class="mb-6">
                        {{ $t("home.apps.text") }}
                    </p>
                </v-col>
            </v-row>

        </v-card>

    </v-container>
</template>

<script>
import { useDisplay } from "vuetify";
import app_icons from "@/assets/images/home/app_icons.png";

export default {
    name: "Header",

    setup() {
        const { display } = useDisplay();
    },

    components: {
    },

    data() {
        return {
            app_icons: app_icons,
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
.esim-section {
    background: #fffbf8;
}

.features {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    font-size: 16px;
    opacity: 1;
}

.image-wrapper {
    position: relative;
    display: inline-block;
}

.icon {
    position: absolute;
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.icon1 {
    top: 30px;
    left: -20px;
}

.icon2 {
    top: -20px;
    right: -20px;
}

.icon3 {
    bottom: -20px;
    right: 40px;
}
</style>
