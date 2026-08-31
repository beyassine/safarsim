<template>
  <div class="compatibility-page">
    <v-container class="py-8 py-md-12" style="max-width: 980px">
      <!-- Breadcrumb -->
      <div
        v-if="true"
        class="breadcrumb-row breadcrumb-row-ar mb-6 mt-2 text-body-2 bidi-text"
      >
        <router-link to="/" class="text-decoration-none">
          <span class="text-medium-emphasis">الرئيسية</span>
        </router-link>
        <span class="mx-2">&lt;</span>
        <strong>الأجهزة المتوافقة</strong>
      </div>
      <div v-else class="breadcrumb-row mb-6 mt-2 text-body-2 bidi-text">
        <router-link to="/" class="text-decoration-none">
          <span class="text-medium-emphasis">الرئيسية</span>
        </router-link>
        <span class="mx-2">></span>
        <strong>الأجهزة المتوافقة</strong>
      </div>

      <div class="mb-8">
        <h1 class="section-title mb-4 bidi-text">تحقق من التوافق</h1>

        <p class="page-text mb-4 bidi-text">
          لاستخدام شريحة ⁨eSIM⁩ من ⁨Safar Sim⁩، يجب أن يستوفي الجهاز الشروط التالية:
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
              يدعم الجهاز شرائح ⁨eSIM⁩.
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
              الجهاز غير مقفل من طرف شركة اتصالات أو شبكة معينة.
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
              الجهاز غير مكسور الحماية على ⁨iOS⁩ أو معدّل بصلاحيات ⁨root⁩ على ⁨Android⁩.
            </h3>
          </v-col>
        </v-row>

        <p class="page-text mb-4 bidi-text">
          يمكنك الاطلاع على قائمتنا للتحقق مما إذا كان الجهاز الذي تريد استخدامه متوافقاً مع ⁨eSIM⁩. يرجى ملاحظة أن بعض الإصدارات الإقليمية قد لا تدعم ⁨eSIM⁩.
        </p>

        <v-card rounded="xl" elevation="1" class="pa-5 compatibility-card mb-8">
          <h4 class="subsection-title mb-4 bidi-text">توافق الهاتف</h4>
          <v-alert
            :type="hasSelectedCompatiblePhone ? 'success' : 'info'"
            variant="tonal"
            class="mb-4 bidi-text"
          >
            <span>
              {{ hasSelectedCompatiblePhone
                ? "هاتفك متوافق مع eSIM."
                : "يرجى اختيار طراز هاتفك. يجب أن يكون الهاتف من جيل حديث لدعم eSIM." }}
            </span>
          </v-alert>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="phoneModel"
                :items="phoneModelOptions"
                label="طراز الهاتف"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-cellphone"
                :menu-props="{ maxHeight: 320 }"
                hide-details="auto"
                @update:model-value="phoneSubmodel = ''"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="phoneSubmodel"
                :items="phoneSubmodelOptions"
                label="الطراز الفرعي"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-cellphone-check"
                :menu-props="{ maxHeight: 320 }"
                hide-details="auto"
                :disabled="!phoneModel"
                no-data-text="لم يتم العثور على أي طراز"
              />
            </v-col>
          </v-row>
        </v-card>

        <v-alert class="mt-10 pa-6 text-center" variant="tonal" rounded="lg" >
          <p class="mb-3 bidi-text">
            <strong>هل وجدت جهازك متوافقاً؟ 📱</strong>
          </p>

          <p class="mb-4 bidi-text">
            لم يبقَ سوى اختيار وجهتك والاستمتاع باتصال إنترنت فوري مع ⁨eSIM⁩ <strong class="text-pink-darken-1 font-weight-bold"><bdi dir="ltr">SAFAR SIM</bdi></strong>.
          </p>
          <router-link :to="{ path: '/', hash: '#destination-selection' }" class="text-decoration-none">
            <v-btn color="pink" size="large" class="text-none bidi-text" prepend-icon="mdi-earth">
              عرض الوجهات
            </v-btn>
          </router-link>
        </v-alert>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { iosCompatibility, androidCompatibility } from "@/data/deviceCompatibility";

const search = ref("");
const phoneModel = ref("");
const phoneSubmodel = ref("");

// on fusionne iOS + Android dans une seule liste
const allDevices = [...iosCompatibility, ...androidCompatibility];

const formatDeviceBrand = (brand) => {
  const normalizedBrand = String(brand || "").trim();
  const specialBrands = {
    oppo: "OPPO",
  };

  if (normalizedBrand.toLowerCase() === "apple") {
    return "iPhone";
  }

  if (specialBrands[normalizedBrand.toLowerCase()]) {
    return specialBrands[normalizedBrand.toLowerCase()];
  }

  return normalizedBrand
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

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

const deviceCompatibilityGroups = computed(() => {
  const groups = new Map();
  const priorityBrands = ["iphone", "samsung", "oppo", "huawei", "xiaomi"];

  allDevices.forEach((group) => {
    const brand = formatDeviceBrand(group.brand);
    const key = brand.toLowerCase();
    const existing = groups.get(key) || {
      brand,
      models: new Set(),
    };

    group.models.forEach((model) => {
      existing.models.add(model);
    });

    groups.set(key, existing);
  });

  return Array.from(groups.values())
    .map((group) => ({
      brand: group.brand,
      models: Array.from(group.models).sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => {
      const aPriority = priorityBrands.indexOf(a.brand.toLowerCase());
      const bPriority = priorityBrands.indexOf(b.brand.toLowerCase());

      if (aPriority !== -1 || bPriority !== -1) {
        if (aPriority === -1) return 1;
        if (bPriority === -1) return -1;
        return aPriority - bPriority;
      }

      return a.brand.localeCompare(b.brand);
    });
});

const phoneModelOptions = computed(() =>
  deviceCompatibilityGroups.value.map((group) => group.brand)
);

const phoneSubmodelOptions = computed(() =>
  deviceCompatibilityGroups.value.find((group) => group.brand === phoneModel.value)?.models || []
);

const hasSelectedCompatiblePhone = computed(() =>
  Boolean(phoneModel.value && phoneSubmodel.value)
);

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
</style>
