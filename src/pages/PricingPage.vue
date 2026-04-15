<template>
  <div class="pricing-page">
    <v-container class="py-12 py-md-16">
      <div class="text-center mb-10">
        <div class="eyebrow">SAFAR SIM</div>
        <h1 class="page-title">Nos Tarifs eSIM</h1>
        <p class="page-subtitle">
          Des forfaits simples, flexibles et adaptés à vos voyages, avec des prix
          transparents selon chaque destination.
        </p>
      </div>

      <v-row class="mb-10" justify="center">
        <v-col cols="12" md="4">
          <v-card class="feature-card" elevation="0">
            <div class="feature-icon">🌍</div>
            <h3>190+ destinations</h3>
            <p>
              Restez connecté dans le monde entier avec des forfaits adaptés à chaque pays et région.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="feature-card" elevation="0">
            <div class="feature-icon">⚡</div>
            <h3>Activation rapide</h3>
            <p>
              Recevez votre eSIM par email et installez-la en quelques minutes avant ou pendant votre voyage.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="feature-card" elevation="0">
            <div class="feature-icon">💸</div>
            <h3>Prix transparents</h3>
            <p>
              Pas de frais cachés. Le prix affiché est le prix que vous payez pour votre forfait eSIM.
            </p>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="pricing-card mb-10" elevation="0">
        <div class="pricing-header">
          <h2>Comment fonctionnent nos prix ?</h2>
          <p>
            Les tarifs varient selon la destination, la quantité de données et la durée du forfait.
            Vous trouverez sur SafarSim des offres adaptées aux courts séjours comme aux voyages plus longs.
          </p>
        </div>

        <div class="pricing-block">
          <h3>Ce qui influence le tarif</h3>
          <ul class="pricing-list">
            <li>La destination choisie</li>
            <li>Le nombre de Go inclus dans le forfait</li>
            <li>La durée de validité du forfait</li>
            <li>Le type d’offre : pays unique ou région</li>
          </ul>
        </div>

        <div class="pricing-block">
          <h3>Ce qui est inclus</h3>
          <ul class="pricing-list">
            <li>Une eSIM prête à installer</li>
            <li>Un QR code envoyé par email</li>
            <li>Une connexion internet 4G / 5G selon le réseau local</li>
            <li>La possibilité de garder votre numéro WhatsApp</li>
          </ul>
        </div>

        <div class="pricing-note">
          <p>
            Les prix affichés ci-dessous correspondent à nos forfaits disponibles pour certaines destinations populaires.
          </p>
        </div>
      </v-card>

      <div class="section-header text-center mb-6">
        <h2>Destinations populaires</h2>
        <p>
          Consultez quelques-unes de nos destinations les plus demandées avec leurs tarifs eSIM.
        </p>
      </div>

      <v-row>
        <v-col
          v-for="destination in popularDestinations"
          :key="destination.slug"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card class="destination-card" elevation="0">
            <v-img
              :src="getImage(destination)"
              :alt="destination.name"
              height="190"
              cover
              class="destination-image"
              @error="fallback"
            />

            <div class="destination-content">
              <div class="destination-top">
                <div class="destination-name-wrap">
                  <span class="flag">{{ destination.flag }}</span>
                  <h3>{{ destination.name }}</h3>
                </div>
                <div class="from-price">
                  À partir de <span>{{ getEntryPrice(destination) }} Dh</span>
                </div>
              </div>

              <div class="plans-preview">
                <div
                  v-for="plan in getTopPlans(destination)"
                  :key="plan.label"
                  class="plan-row"
                >
                  <span class="plan-label">{{ plan.label }}</span>
                  <span class="plan-value">{{ plan.price }} Dh</span>
                </div>
              </div>

              <v-btn
                class="destination-btn"
                color="deep-purple-accent-4"
                rounded="xl"
                block
                :to="`/destinations/${destination.slug}`"
              >
                Voir l’offre
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div class="text-center mt-10">
        <v-btn
          color="pink-darken-1"
          size="large"
          rounded="xl"
          class="cta-btn"
          to="/destinations"
        >
          Voir toutes les destinations
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
const popularDestinations = [
  {
    name: "France",
    slug: "france",
    flag: "🇫🇷",
    image: "/images/destinations/france.jpg",
    popular: true,
    iso: "FR",
    plans: {
      "1GB_7days": 60,
      "5GB_30days": 135,
      "10GB_30days": 160,
      "20GB_30days": 200,
      "50GB_30days": 320
    }
  },
  {
    name: "Espagne",
    slug: "espagne",
    flag: "🇪🇸",
    image: "/images/destinations/espagne.jpg",
    popular: true,
    iso: "ES",
    plans: {
      "1GB_7days": 60,
      "5GB_30days": 140,
      "10GB_30days": 170,
      "20GB_30days": 220,
      "50GB_30days": 335
    }
  },
  {
    name: "Turquie",
    slug: "turquie",
    flag: "🇹🇷",
    image: "/images/destinations/turquie.jpg",
    popular: true,
    iso: "TR",
    plans: {
      "1GB_7days": 65,
      "5GB_30days": 140,
      "10GB_30days": 155,
      "20GB_30days": 190,
      "50GB_30days": 285
    }
  },
  {
    name: "Italie",
    slug: "italie",
    flag: "🇮🇹",
    image: "/images/destinations/italie.jpg",
    popular: true,
    iso: "IT",
    plans: {
      "1GB_7days": 60,
      "5GB_30days": 135,
      "10GB_30days": 160,
      "20GB_30days": 200,
      "50GB_30days": 320
    }
  },
  {
    name: "Émirats arabes unis",
    slug: "emirats-arabes-unis",
    flag: "🇦🇪",
    image: "/images/destinations/emirats-arabes-unis.jpg",
    popular: true,
    iso: "AE",
    plans: {
      "1GB_7days": 75,
      "5GB_30days": 185,
      "10GB_30days": 250,
      "20GB_30days": 365,
      "50GB_30days": 695
    }
  },
  {
    name: "Arabie saoudite",
    slug: "arabie-saoudite",
    flag: "🇸🇦",
    image: "/images/destinations/arabie-saoudite.jpg",
    popular: true,
    iso: "SA",
    plans: {
      "1GB_7days": 70,
      "5GB_30days": 170,
      "10GB_30days": 230,
      "20GB_30days": 305,
      "50GB_30days": 610
    }
  },
  {
    name: "Égypte",
    slug: "egypte",
    flag: "🇪🇬",
    image: "/images/destinations/egypte.jpg",
    popular: true,
    iso: "EG",
    plans: {
      "1GB_7days": 80,
      "5GB_30days": 200,
      "10GB_30days": 250,
      "20GB_30days": 350,
      "50GB_30days": 645
    }
  },
  {
    name: "États-Unis",
    slug: "etats-unis",
    flag: "🇺🇸",
    image: "/images/destinations/etats-unis.jpg",
    popular: true,
    iso: "US",
    plans: {
      "1GB_7days": 65,
      "5GB_30days": 165,
      "10GB_30days": 210,
      "20GB_30days": 300,
      "50GB_30days": 550
    }
  },
  {
    name: "Canada",
    slug: "canada",
    flag: "🇨🇦",
    image: "/images/destinations/canada.jpg",
    popular: true,
    iso: "CA",
    plans: {
      "1GB_7days": 75,
      "5GB_30days": 205,
      "10GB_30days": 285,
      "20GB_30days": 430,
      "50GB_30days": 810
    }
  }
]

function getEntryPrice(destination) {
  const prices = Object.values(destination.plans)
  return Math.min(...prices)
}

function formatPlanLabel(key) {
  const [data, duration] = key.split("_")
  return `${data.replace("GB", " Go")} / ${duration.replace("days", " jours")}`
}

function getTopPlans(destination) {
  return Object.entries(destination.plans)
    .slice(0, 3)
    .map(([key, price]) => ({
      label: formatPlanLabel(key),
      price
    }))
}

const getImage = (item) => {
  if (item.type === "region") {
    return require(`@/assets/images/flags/regions/regions.png`);
  }

  try {
    return require(`@/assets/images/flags/${item.iso.toLowerCase()}.svg`);
  } catch (e) {
    return item.image;
  }
};

const fallback = (event) => {
  event.target.src = require('@/assets/images/flags/default.png');
};

</script>

<style scoped>
.pricing-page {
  background: linear-gradient(180deg, #f7f3ff 0%, #fffaf7 220px, #ffffff 100%);
  min-height: 100vh;
}

.eyebrow {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
  font-weight: 800;
  color: #241437;
  margin-bottom: 12px;
}

.page-subtitle {
  max-width: 760px;
  margin: 0 auto;
  color: #6b7280;
  font-size: 1rem;
}

.feature-card {
  height: 100%;
  padding: 28px 22px;
  border-radius: 22px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 45px rgba(84, 51, 142, 0.08);
  text-align: center;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.feature-card h3 {
  color: #241437;
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

.pricing-card {
  max-width: 980px;
  margin: 0 auto;
  border-radius: 24px;
  padding: 32px 24px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 20px 60px rgba(84, 51, 142, 0.08);
}

.pricing-header h2,
.pricing-block h3,
.section-header h2 {
  color: #6f42c1;
  font-weight: 800;
}

.pricing-header h2,
.section-header h2 {
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.pricing-header p,
.section-header p {
  color: #374151;
  line-height: 1.85;
}

.pricing-block + .pricing-block {
  margin-top: 30px;
}

.pricing-list {
  padding-left: 20px;
  color: #374151;
  line-height: 1.9;
}

.pricing-note {
  margin-top: 28px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #faf7ff;
  border: 1px solid #eee7fb;
}

.pricing-note p {
  margin: 0;
  color: #6b7280;
  line-height: 1.7;
}

.destination-card {
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid #eee7fb;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 16px 45px rgba(84, 51, 142, 0.08);
  height: 100%;
}

.destination-image {
  border-bottom: 1px solid #f1ebfc;
}

.destination-content {
  padding: 20px;
}

.destination-top {
  margin-bottom: 18px;
}

.destination-name-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.destination-name-wrap h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #241437;
  margin: 0;
}

.flag {
  font-size: 1.35rem;
}

.from-price {
  color: #6b7280;
  font-size: 0.95rem;
}

.from-price span {
  color: #6f42c1;
  font-weight: 800;
}

.plans-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.plan-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 14px;
  background: #faf7ff;
  border: 1px solid #eee7fb;
}

.plan-label {
  color: #374151;
  font-size: 0.95rem;
}

.plan-value {
  color: #241437;
  font-weight: 800;
}

.destination-btn,
.cta-btn {
  text-transform: none;
  font-weight: 700;
}

.cta-btn {
  padding-inline: 28px;
}

@media (min-width: 960px) {
  .pricing-card {
    padding: 42px 40px;
  }
}
</style>