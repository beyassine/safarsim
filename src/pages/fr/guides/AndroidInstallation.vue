<template>
  <main class="guide-page" dir="ltr">
    <v-container class="guide-container">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <router-link to="/fr/">Accueil</router-link><v-icon size="16">mdi-chevron-right</v-icon>
        <span>Guides eSIM</span><v-icon size="16">mdi-chevron-right</v-icon><strong>Android</strong>
      </nav>
      <header class="guide-hero">
        <div class="guide-device-icon"><v-icon>mdi-android</v-icon></div><span>Guide d’installation eSIM</span>
        <h1>Comment installer une eSIM sur Android</h1>
        <p>Suivez ces étapes pour installer votre eSIM SafarSIM avant le départ et l’activer une fois arrivé à destination.</p>
        <div class="guide-meta"><span><v-icon size="19">mdi-clock-outline</v-icon>Environ 5 minutes</span><span><v-icon size="19">mdi-wifi</v-icon>Connexion Wi-Fi recommandée</span></div>
      </header>
      <section class="guide-before"><h2>Avant de commencer</h2><div class="before-grid">
        <div><v-icon>mdi-check-circle</v-icon><span>Vérifiez que votre téléphone prend en charge l’eSIM.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Connectez votre téléphone à un réseau Wi-Fi stable.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Gardez l’e-mail contenant votre QR code ouvert sur un autre écran.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>N’activez les données de la nouvelle eSIM qu’à votre arrivée.</span></div>
      </div></section>
      <section class="guide-steps">
        <div class="guide-section-heading"><span>Installation</span><h2>Installer l’eSIM sur votre téléphone Android</h2></div>
        <article class="guide-step"><div class="step-number">1</div><div><h3>Ouvrez les paramètres</h3><p>Accédez à Paramètres, puis Connexions, Réseau et Internet ou Cartes SIM.</p></div></article>
        <article class="guide-step"><div class="step-number">2</div><div><h3>Ajoutez une eSIM</h3><p>Touchez Ajouter une eSIM, Ajouter un forfait mobile ou Télécharger une carte SIM.</p></div></article>
        <article class="guide-step"><div class="step-number">3</div><div><h3>Scannez le QR code</h3><p>Choisissez QR code, scannez le code reçu par e-mail puis confirmez le téléchargement.</p></div></article>
        <article class="guide-step"><div class="step-number">4</div><div><h3>Nommez votre forfait</h3><p>Renommez la nouvelle eSIM « SafarSIM Voyage » afin de l’identifier facilement.</p></div></article>
        <article class="guide-step"><div class="step-number">5</div><div><h3>Sélectionnez les données mobiles</h3><p>À votre arrivée, choisissez SafarSIM comme carte SIM utilisée pour les données mobiles.</p></div></article>
        <article class="guide-step"><div class="step-number">6</div><div><h3>Activez l’itinérance</h3><p>Ouvrez les réglages de SafarSIM et activez l’itinérance des données.</p></div></article>
      </section>
      <section class="guide-activation"><v-icon>mdi-access-point-network</v-icon><div><h2>À votre arrivée</h2><p>Activez la ligne SafarSIM, sélectionnez-la pour les données mobiles et laissez la sélection du réseau en mode automatique. La connexion peut prendre quelques minutes.</p></div></section>
      <section class="guide-help"><h2>Besoin d’aide ?</h2><p>Redémarrez votre téléphone et vérifiez que les données mobiles ainsi que l’itinérance sont activées sur SafarSIM.</p><div><router-link to="/fr/guides/compatibility">Vérifier la compatibilité</router-link><router-link to="/fr/contact">Contacter le support</router-link></div></section>
    </v-container>
  </main>
</template>
<style src="../../../assets/styles/installation-guide.css"></style>
