<template>
  <div class="refund-page">
    <v-container class="py-12">
      
      <div class="text-center mb-10">
        <div class="eyebrow">SAFAR SIM</div>
        <h1 class="page-title">Politique de Remboursement</h1>
      </div>

      <v-card class="card">
        <section>
          <h2>1. Produits numériques</h2>
          <p>
            Les eSIM sont des produits numériques livrés instantanément.
          </p>
        </section>

        <section>
          <h2>2. Garantie</h2>
          <p>
            Nous offrons une garantie de remboursement sous 14 jours si le service ne fonctionne pas.
          </p>
        </section>

        <section>
          <h2>3. Cas remboursables</h2>
          <ul>
            <li>eSIM non reçue</li>
            <li>eSIM non fonctionnelle</li>
          </ul>
        </section>

        <section>
          <h2>4. Non remboursable</h2>
          <ul>
            <li>Appareil non compatible</li>
            <li>Mauvaise utilisation</li>
            <li>Consommation du forfait</li>
          </ul>
        </section>

        <section>
          <h2>5. Demande</h2>
          <p>
            Envoyez votre demande à contact@safarsim.net avec les détails.
          </p>
        </section>

        <section>
          <h2>6. Délai</h2>
          <p>
            Les remboursements sont traités sous 5 à 10 jours ouvrés.
          </p>
        </section>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.refund-page {
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


.title {
  font-size: 32px;
  font-weight: 800;
  color: #241437;
}

.subtitle {
  color: #6b7280;
}

.card {
  max-width: 900px;
  margin: auto;
  padding: 30px;
  border-radius: 20px;
}

section {
  margin-bottom: 24px;
}

h2 {
  color: #6f42c1;
  font-weight: 800;
  margin-bottom: 10px;
}
</style>