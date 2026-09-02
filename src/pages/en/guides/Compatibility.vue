<template>
  <div class="compatibility-page">
    <v-container class="compatibility-container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb-row mb-6 mt-2 text-body-2 bidi-text" aria-label="Breadcrumb">
        <router-link to="/" class="text-decoration-none"><span class="text-medium-emphasis">Home</span></router-link>
        <span class="mx-2">></span>
        <router-link to="/guides/install-esim-iphone" class="text-decoration-none"><span class="text-medium-emphasis">eSIM guides</span></router-link>
        <span class="mx-2">></span>
        <strong>Compatible devices</strong>
      </nav>

      <div class="mb-8">
        <h1 class="section-title mb-4 bidi-text">Check compatibility</h1>

        <p class="page-text mb-4 bidi-text">
          To use a Safar Sim eSIM, your device must meet these conditions:
        </p>

        <v-row class="d-flex mb-5 conditions-row">
          <v-col class="" cols="12">
            <h3 class="condition-title bidi-text">
              <v-icon
                class="compatibility-check-icon"
                color="green-darken-2"
                icon="mdi-check"
                size="large"
              />
              The device supports eSIM.
            </h3>
          </v-col>

          <v-col class="" cols="12">
            <h3 class="condition-title bidi-text">
              <v-icon
                class="compatibility-check-icon"
                color="green-darken-2"
                icon="mdi-check"
                size="large"
              />
              The device is not locked by an operator or network.
            </h3>
          </v-col>

          <v-col class="" cols="12">
            <h3 class="condition-title bidi-text">
              <v-icon
                class="compatibility-check-icon"
                color="green-darken-2"
                icon="mdi-check"
                size="large"
              />
              The device is not jailbroken on iOS or rooted on Android.
            </h3>
          </v-col>
        </v-row>

        <p class="page-text mb-4 bidi-text">
          You can check our list to see whether the device you want to use is eSIM compatible. Some regional models may not support eSIM.
        </p>

        <v-card rounded="xl" elevation="1" class="pa-5 compatibility-card mb-8">
          <h4 class="subsection-title mb-4 bidi-text">Search compatible phones</h4>
          <v-text-field
            v-model.trim="search"
            label="Search by brand or model"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-magnify"
            hide-details
            clearable
          />
          <div class="phone-results" role="list">
            <button
              v-for="phone in filteredPhoneOptions"
              :key="phone"
              type="button"
              class="phone-result"
              :class="{ selected: selectedPhone === phone }"
              @click="selectPhone(phone)"
            >
              <v-icon size="19">{{ selectedPhone === phone ? 'mdi-check-circle' : 'mdi-cellphone' }}</v-icon>
              <span>{{ phone }}</span>
            </button>
            <p v-if="filteredPhoneOptions.length === 0" class="phone-empty">No compatible phone found</p>
          </div>
          <v-alert v-if="selectedPhone" type="success" variant="tonal" class="mt-4 bidi-text">
            <strong>Compatible phone selected:</strong>
          </v-alert>
          <router-link v-if="selectedPhone" :to="{ path: '/', hash: '#destination-selection' }" class="destination-cta-link">
            <v-btn color="pink" size="large" class="text-none destination-cta" prepend-icon="mdi-earth">View destinations</v-btn>
          </router-link>
        </v-card>


      </div>
    </v-container>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { iosCompatibility, androidCompatibility } from "@/data/deviceCompatibility";

const search = ref("");
const selectedPhone = ref("");
const allPhoneOptions = [...iosCompatibility, ...androidCompatibility]
  .flatMap((group) => group.models.map((model) => `${group.brand} — ${model}`))
  .filter((value, index, values) => values.indexOf(value) === index)
  .sort((a, b) => a.localeCompare(b));

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const filteredPhoneOptions = computed(() => {
  const query = normalize(search.value);
  return query ? allPhoneOptions.filter((phone) => normalize(phone).includes(query)) : allPhoneOptions;
});

function selectPhone(phone) {
  selectedPhone.value = phone;
  search.value = phone;
}
</script>

<style scoped>
.compatibility-page {
  min-height: 100vh;
}

.breadcrumb-row {
  display: flex;
  align-items: center;
}

.breadcrumb-row-ar {
  direction: rtl;
  justify-content: flex-start;
}

.page-title {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
  color: #111111;
}

.page-text {
  font-size: 1.02rem;
  line-height: 1.8;
  color: #2f2f2f;
}

.condition-title {
  font-size: 18px;
  font-weight: 550;
  line-height: 1.4;
  color: #1f2937;
}

:global(html[dir="rtl"] .compatibility-check-icon) {
  margin-inline-end: 6px;
}

.compatibility-tabs {
  border-bottom: 1px solid #d8d1ca;
}

.compatibility-card {
  background: white;
}

.compatibility-card :deep(.v-alert--variant-tonal.v-alert--density-default){color:#279c46 !important;}
.destination-cta-link{display:flex;justify-content:center;margin-top:18px;text-decoration:none}.destination-cta{font-weight:800}

.brand-section {
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e4ddd6;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111111;
}

.models-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.model-chip {
  white-space: normal;
  height: auto !important;
  padding: 8px 10px;
  line-height: 1.4;
}

.search-wrapper :deep(.v-field) {
  border-radius: 14px;
  background: white;
}

@media (max-width: 600px) {
  .page-title {
    font-size: 1.7rem;
  }

  .page-text,
  .condition-title {
    font-size: 0.98rem;
  }

  .models-grid {
    gap: 8px;
  }
}

.phone-results{max-height:380px;overflow-y:auto;margin-top:12px;border:1px solid #e4ddd6;border-radius:14px;background:#fff}.phone-result{width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;border:0;border-bottom:1px solid #eee8e3;background:#fff;color:#26332f;text-align:start;font:inherit;cursor:pointer}.phone-result:last-child{border-bottom:0}.phone-result:hover,.phone-result.selected{background:#fff0f5;color:#d91c58}.phone-result .v-icon{flex:0 0 auto}.phone-empty{padding:20px;margin:0;text-align:center;color:#74666d}.compatibility-page[dir="rtl"] .phone-result{direction:rtl;text-align:right}

/* SafarSIM home-page theme */
.compatibility-page{--guide-ink:#173d37;--guide-pink:#e61c58;--guide-green:#16835f;position:relative;min-height:100vh;padding:28px 0 80px;background:radial-gradient(circle at 100% 6%,rgba(248,202,217,.34),transparent 28%),radial-gradient(circle at 0 72%,rgba(179,225,207,.25),transparent 25%),linear-gradient(145deg,#fff8f3 0%,#fff 68%,#fff 100%);color:var(--guide-ink)}
.compatibility-container{position:relative;z-index:1}
.breadcrumb-row{display:flex;align-items:center;max-width:100%;padding:0;border:0;border-radius:0;background:transparent;color:#687b77}
.breadcrumb-row a:hover span{color:var(--guide-pink)!important}
.section-title{max-width:760px;margin:42px auto 18px!important;text-align:center;color:var(--guide-ink);font-size:clamp(38px,6vw,62px);line-height:1.1;letter-spacing:-.04em;font-weight:950}
.section-title:after{content:"";display:block;width:84px;height:6px;margin:18px auto 0;border-radius:99px;background:linear-gradient(90deg,var(--guide-pink),#f591af)}
.page-text{max-width:760px;margin-inline:auto;text-align:center;color:#667773;font-size:16px;line-height:1.8}
.conditions-row{max-width:820px;margin:30px auto!important;display:grid!important;grid-template-columns:repeat(3,1fr);gap:13px}
.conditions-row .v-col{padding:0!important}
.condition-title{height:100%;display:flex;align-items:flex-start;gap:9px;padding:20px;border:1px solid #eadfe3;border-radius:18px;background:#fff;box-shadow:0 10px 25px rgba(80,36,57,.05);color:var(--guide-ink);font-size:14px;font-weight:750;line-height:1.55}
.condition-title .v-icon{color:var(--guide-green)!important;flex:0 0 auto}
.compatibility-card{max-width:820px;margin:34px auto 0!important;padding:30px!important;border:1px solid #eadfe3!important;border-radius:26px!important;background:#fff!important;box-shadow:0 22px 55px rgba(72,35,53,.1)!important}
.subsection-title{text-align:center;color:var(--guide-ink);font-size:24px;font-weight:900}
.compatibility-card :deep(.v-field){border-radius:16px;background:#fffbf8}
.compatibility-card :deep(.v-field--focused .v-field__outline),.compatibility-card :deep(.v-field--focused .v-icon){color:var(--guide-pink)!important}
.phone-results{margin-top:15px;border-color:#eadfe3;border-radius:16px;box-shadow:inset 0 1px 0 #fff}
.phone-result{min-height:50px;padding:13px 16px;color:#536762;transition:.16s}
.phone-result:hover,.phone-result.selected{background:#fff0f5;color:var(--guide-pink)}
.compatibility-card :deep(.v-alert){border-radius:15px!important;background:#edf9f1!important;color:var(--guide-green)!important}
.destination-cta{min-width:250px!important;border-radius:99px!important;background:var(--guide-pink)!important;color:#fff!important;font-weight:900!important;letter-spacing:0!important;box-shadow:0 12px 25px rgba(230,28,88,.22)}
@media(max-width:700px){.compatibility-page{padding-top:16px}.breadcrumb-row{overflow-x:auto;white-space:nowrap}.section-title{margin-top:32px!important;font-size:36px}.conditions-row{grid-template-columns:1fr;gap:10px}.compatibility-card{padding:20px 14px!important;border-radius:21px!important}.subsection-title{font-size:21px}.phone-results{max-height:330px}.destination-cta-link,.destination-cta{width:100%}}
</style>
