<template>
  <div class="compatibility-page">
    <v-container class="py-8 py-md-12" style="max-width: 980px">
      <!-- Breadcrumb -->
      <div class="mb-6 mt-2 text-body-2">
        <router-link to="/" class="text-decoration-none">
          <span class="text-medium-emphasis">Acceuil</span>
        </router-link>
        <span class="mx-2">></span>
        <strong>Appareils Compatibles</strong>
      </div>

      <div class="mb-8">
        <h1 class="section-title mb-4">Vérifier la compatibilité</h1>

        <p class="page-text mb-4">
          Pour utiliser une eSIM Safar Sim, un appareil doit remplir les conditions suivantes :
        </p>

        <ul class="conditions-list mb-5">
          <li>L’appareil prend en charge les eSIM.</li>
          <li>L’appareil n’est pas verrouillé par un opérateur ou par le réseau.</li>
          <li>L’appareil n’est pas jailbreaké (iOS) ou rooté (Android).</li>
        </ul>

        <p class="page-text mb-4">
          Vous pouvez consulter notre liste pour vérifier si l’appareil que vous souhaitez utiliser
          est compatible eSIM. Notez que certains modèles régionaux peuvent ne pas prendre en charge l’eSIM.
        </p>
        <v-alert class="mt-10 pa-6 text-center" variant="tonal" rounded="lg" >
          <p class="mb-3">
            <strong>Vous avez trouvé votre appareil compatible ? 📱</strong>
          </p>

          <p class="mb-4">
            Il ne vous reste plus qu’à choisir votre destination et profiter d’une
            connexion internet immédiate avec eSIM <strong class="text-pink-darken-1 font-weight-bold"> SAFAR SIM</strong>.
          </p>
          <router-link  to="/destinations" class="text-decoration-none">
            <v-btn color="pink" size="large" class="text-none" prepend-icon="mdi-earth">
              Voir les destinations
            </v-btn>
          </router-link>
        </v-alert>
      </div>

      <div class="search-wrapper mb-8">
        <v-text-field v-model="search" density="comfortable" variant="outlined" rounded="lg" hide-details
          prepend-inner-icon="mdi-magnify" placeholder="Rechercher votre appareil" bg-color="white" clearable />
      </div>

      <div v-if="filteredDevices.length">
        <div v-for="group in filteredDevices" :key="group.brand" class="brand-section">
          <div class="brand-header">
            <h2 class="brand-title">{{ group.brand }}</h2>
            <span class="brand-count">{{ group.models.length }} modèle(s)</span>
          </div>

          <div class="models-grid">
            <v-chip v-for="model in group.models" :key="model" class="model-chip" variant="outlined" rounded="lg">
              {{ model }}
            </v-chip>
          </div>
        </div>
      </div>

      <v-alert v-else type="info" variant="tonal" rounded="lg">
        Aucun appareil trouvé       

        <p class="page-text">
          <strong>Vous ne trouvez pas votre appareil ?</strong>
          Notre liste est mise à jour régulièrement, mais elle n’est pas exhaustive — vérifiez auprès
          du fabricant pour confirmer la compatibilité eSIM.
        </p>

      </v-alert>
    </v-container>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { iosCompatibility, androidCompatibility } from "@/data/deviceCompatibility";

const search = ref("");

// on fusionne iOS + Android dans une seule liste
const allDevices = [...iosCompatibility, ...androidCompatibility];

const normalize = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const filteredDevices = computed(() => {
  const q = normalize(search.value);

  if (!q) return allDevices;

  return allDevices
    .map((group) => {
      const brandMatch = normalize(group.brand).includes(q);

      if (brandMatch) return group;

      const models = group.models.filter((model) =>
        normalize(model).includes(q)
      );

      return {
        ...group,
        models,
      };
    })
    .filter((group) => group.models.length > 0);
});
</script>

<style scoped>
.compatibility-page {
  background: #f7f3ef;
  min-height: 100vh;
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

.conditions-list {
  padding-left: 1.25rem;
  color: #2f2f2f;
}

.conditions-list li {
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

.compatibility-tabs {
  border-bottom: 1px solid #d8d1ca;
}

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
  .conditions-list li {
    font-size: 0.98rem;
  }

  .models-grid {
    gap: 8px;
  }
}
</style>