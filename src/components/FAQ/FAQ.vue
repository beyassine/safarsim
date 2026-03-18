<template>
<v-container  fluid :class="$vuetify.display.smAndUp ? 'px-16 pb-10' : 'px-6 pb-10'" >

<!-- TITLE -->
<div class="text-center mb-10">
  <h2 class="section-title text-center">
    Questions fréquentes (FAQ)
  </h2>

  <p class="text-subtitle-1 text-medium-emphasis">
    Tout ce que vous devez savoir sur votre SAFAR eSIM
  </p>
</div>

<v-row>

<!-- LEFT COLUMN -->
<v-col cols="12" md="6">

<v-expansion-panels variant="accordion">

<v-expansion-panel
v-for="(item, i) in leftFaq"
:key="i"
>
  <v-expansion-panel-title>
    {{ item.question }}
  </v-expansion-panel-title>

  <v-expansion-panel-text>
    {{ item.answer }}
  </v-expansion-panel-text>
</v-expansion-panel>

</v-expansion-panels>

</v-col>


<!-- RIGHT COLUMN -->
<v-col cols="12" md="6">

<v-expansion-panels variant="accordion">

<v-expansion-panel
v-for="(item, i) in rightFaq"
:key="i"
>
  <v-expansion-panel-title>
    {{ item.question }}
  </v-expansion-panel-title>

  <v-expansion-panel-text>
    {{ item.answer }}
  </v-expansion-panel-text>
</v-expansion-panel>

</v-expansion-panels>

</v-col>

</v-row>

</v-container>
</template>

<script setup>

const leftFaq = [

{
question: "Qu’est-ce qu’une eSIM ?",
answer: "Une eSIM est une carte SIM digitale qui vous permet d’accéder à internet sans carte physique."
},

{
question: "Dois-je activer l’itinérance des données ?",
answer: "Oui, l’itinérance doit être activée pour que votre eSIM fonctionne à l’étranger."
},

{
question: "Quelle vitesse de connexion puis-je avoir ?",
answer: "La vitesse dépend du réseau local, généralement 4G ou 5G selon la destination."
},

{
question: "Puis-je garder mon WhatsApp ?",
answer: "Oui, votre numéro WhatsApp reste inchangé avec une eSIM."
},

{
question: "Quand vais-je recevoir mon eSIM ?",
answer: "Votre eSIM est envoyée instantanément après l’achat par email."
},

{
question: "Quels téléphones sont compatibles?",
answer: "La plupart des smartphones récents sont compatibles eSIM (iPhone, Samsung, etc.)."
},

{
question: "Puis-je appeler ou envoyer des SMS?",
answer: "Nos eSIM sont principalement data-only."
}

]

const rightFaq = [

{
question: "Pourquoi choisir eSIM SAFAR ?",
answer: "Nous offrons une connexion fiable dans plus de 160 destinations avec activation rapide."
},


{
question: "Puis-je utiliser SIM et eSIM ensemble ?",
answer: "Oui, la plupart des téléphones permettent d’utiliser les deux simultanément."
},

{
question: "Comment supprimer une eSIM ?",
answer: "Vous pouvez la supprimer directement depuis les paramètres de votre téléphone."
},

{
question: "Combien de fois puis-je utiliser mon eSIM ?",
answer: "Chaque eSIM est valable pour un seul usage, selon le forfait choisi."
},

{
question: "Comment vérifier ma consommation ?",
answer: "Vous pouvez suivre votre consommation dans les paramètres de votre appareil."
},

{
question: "Quand configurer mon eSIM ?",
answer: "Nous recommandons de l’installer avant votre départ."
},

{
question: "Comment installer mon eSIM ?",
answer: "Scannez le QR code reçu par email et suivez les instructions simples."
},

]

</script>

<style scoped>
.v-expansion-panel{
border-radius:12px !important;
margin-bottom:12px;
border:1px solid #e5e5e5;
}

.v-expansion-panel-title{
font-size:14px;
}
</style>