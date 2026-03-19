<template>
    <v-container fluid :class="$vuetify.display.smAndUp ? 'px-16 mb-5' : ' px-0 mb-5'">

        <v-card class="esim-section px-8" elevation="0" rounded="xl">

            <v-row align="center">

                <!-- LEFT CONTENT -->
                <v-col cols="12" md="6">

                    <h2 class="section-title mb-4">
                        Pourquoi une eSIM pour voyager ?
                    </h2>

                    <p class="mb-6">
                        Avec une eSIM, restez connecté partout dans le monde sans changer
                        de carte SIM. Activez votre forfait directement depuis votre
                        téléphone et profitez d’une connexion internet dès votre arrivée.

                        Plus besoin de chercher une boutique SIM à l’étranger :
                        tout se fait en quelques secondes.
                    </p>

                    <v-btn color="green-darken-1" size="large" rounded="lg">
                        Plus de détails
                    </v-btn>

                </v-col>


                <!-- RIGHT IMAGE -->
                <v-col cols="12" md="6">

                    <div class="image-wrapper">

                        <v-img src="/img/esim-phone.jpg" height="260" cover rounded="xl" />

                    </div>

                </v-col>

            </v-row>

        </v-card>

    </v-container>
</template>

<script></script>

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