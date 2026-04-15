<template>
  <div class="legal-page">
    <v-container class="py-12">
      <div class="text-center mb-8">
        <h1 class="title">Conditions Générales de Vente et d’Utilisation</h1>
        <p class="subtitle">
          Dernière mise à jour : Avril 2026
        </p>
      </div>

      <v-card class="card">
        <section>
          <h2>1. Informations générales</h2>
          <p>
            Le site <strong>www.safarsim.net</strong> est exploité par <strong>SafarSim</strong>.
          </p>
          <p>
            Pour toute question, vous pouvez nous contacter :
          </p>
          <ul>
            <li>Email : contact@safarsim.net</li>
            <li>Téléphone : +212 613 147 245</li>
          </ul>
        </section>

        <section>
          <h2>2. Description du service</h2>
          <p>
            SafarSim propose des forfaits eSIM permettant d’accéder à internet mobile à l’étranger.
            Chaque offre inclut un volume de données et une durée de validité définis.
          </p>
        </section>

        <section>
          <h2>3. Commande et paiement</h2>
          <p>
            Les commandes sont effectuées en ligne via notre site.
          </p>
          <p>
            Notre processus de paiement est géré par notre revendeur Paddle.com.
            Paddle.com agit en tant que Merchant of Record pour toutes les transactions.
          </p>
        </section>

        <section>
          <h2>4. Livraison</h2>
          <p>
            Après paiement, l’eSIM est envoyée instantanément par email sous forme de QR code.
          </p>
        </section>

        <section>
          <h2>5. Responsabilités</h2>
          <p>
            L’utilisateur doit vérifier la compatibilité de son appareil avant achat.
            SafarSim ne garantit pas une couverture parfaite dans toutes les zones.
          </p>
        </section>

        <section>
          <h2>6. Utilisation</h2>
          <p>
            L’utilisateur s’engage à utiliser le service conformément aux lois du pays visité.
          </p>
        </section>

        <section>
          <h2>7. Propriété intellectuelle</h2>
          <p>
            Tous les contenus du site sont la propriété de SafarSim.
          </p>
        </section>

        <section>
          <h2>8. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit applicable au Maroc.
          </p>
        </section>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.legal-page {
  background: linear-gradient(180deg, #f7f3ff 0%, #fffaf7 220px, #ffffff 100%);
  min-height: 100vh;
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