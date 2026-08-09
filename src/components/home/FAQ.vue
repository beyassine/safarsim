<template>
<v-container  fluid :class="$vuetify.display.smAndUp ? 'px-16 pb-10' : 'px-6 pb-10'" >

<!-- TITLE -->
<div class="text-center mb-10">
  <h2 class="section-title text-center">
    {{ $t("home.faq.title") }}
  </h2>
  <p class="text-subtitle-1 text-medium-emphasis">
    {{ $t("home.faq.subtitle") }}
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
    {{ $t(item.question) }}
  </v-expansion-panel-title>

  <v-expansion-panel-text>
    {{ $t(item.answer) }}
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
    {{ $t(item.question) }}
  </v-expansion-panel-title>

  <v-expansion-panel-text>
    {{ $t(item.answer) }}
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
question: "home.faq.items.whatIsEsim.question",
answer: "home.faq.items.whatIsEsim.answer"
},

{
question: "home.faq.items.roaming.question",
answer: "home.faq.items.roaming.answer"
},

{
question: "home.faq.items.speed.question",
answer: "home.faq.items.speed.answer"
},

{
question: "home.faq.items.whatsapp.question",
answer: "home.faq.items.whatsapp.answer"
},

{
question: "home.faq.items.receive.question",
answer: "home.faq.items.receive.answer"
},

{
question: "home.faq.items.phones.question",
answer: "home.faq.items.phones.answer"
},

{
question: "home.faq.items.calls.question",
answer: "home.faq.items.calls.answer"
}

]

const rightFaq = [

{
question: "home.faq.items.why.question",
answer: "home.faq.items.why.answer"
},


{
question: "home.faq.items.dualSim.question",
answer: "home.faq.items.dualSim.answer"
},

{
question: "home.faq.items.delete.question",
answer: "home.faq.items.delete.answer"
},

{
question: "home.faq.items.reuse.question",
answer: "home.faq.items.reuse.answer"
},

{
question: "home.faq.items.usage.question",
answer: "home.faq.items.usage.answer"
},

{
question: "home.faq.items.setup.question",
answer: "home.faq.items.setup.answer"
},

{
question: "home.faq.items.install.question",
answer: "home.faq.items.install.answer"
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
min-width:0;
overflow-wrap:anywhere;
}
</style>
