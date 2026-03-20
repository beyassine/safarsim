<template>

<v-autocomplete
:items="countries"
label="Où voyagez-vous ?"
item-title="name"
item-value="slug"
prepend-inner-icon="mdi-map-marker-outline"
variant="solo"
color="white"
rounded
@update:modelValue="go"
/>

</template>

<script setup>

import { useRouter } from "vue-router"
import countries from "../../data/countries"

const router = useRouter()

function go(country){
router.push("/esim/" + country)
}

</script>