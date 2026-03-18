<template>

<v-container>

<h1 class="text-h3 font-weight-bold mb-6">
eSIM for {{country}}
</h1>

<v-card class="pa-6">

<v-row>

<v-col md="4">

<h2>5 Days</h2>
<p>$4.90</p>
<v-btn color="primary">Buy</v-btn>

</v-col>

<v-col md="4">

<h2>10 Days</h2>
<p>$7.90</p>
<v-btn color="primary">Buy</v-btn>

</v-col>

<v-col md="4">

<h2>Unlimited</h2>
<p>$19.90</p>
<v-btn color="primary">Buy</v-btn>

</v-col>

</v-row>

</v-card>

</v-container>

</template>

<script setup>

import { useRoute } from "vue-router"

const route = useRoute()
const country = route.params.country

</script>