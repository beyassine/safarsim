<template>
  <main class="guide-page" dir="ltr">
    <v-container class="guide-container">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <router-link to="/fr/">Accueil</router-link><v-icon size="16">mdi-chevron-right</v-icon>
        <span>Guides eSIM</span><v-icon size="16">mdi-chevron-right</v-icon><strong>iPhone</strong>
      </nav>
      <header class="guide-hero">
        <div class="guide-device-icon"><v-icon>mdi-apple</v-icon></div><span>Guide d’installation eSIM</span>
        <h1>Comment installer une eSIM sur iPhone</h1>
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
        <div class="guide-section-heading"><span>Installation</span><h2>Installer l’eSIM sur votre iPhone</h2></div>
        <article class="guide-step"><div class="step-number">1</div><div><h3>Ouvrez les réglages</h3><p>Accédez à Réglages, puis Données cellulaires ou Données mobiles.</p></div></article>
        <article class="guide-step"><div class="step-number">2</div><div><h3>Ajoutez une eSIM</h3><p>Touchez Ajouter une eSIM, puis Utiliser un code QR.</p></div></article>
        <article class="guide-step"><div class="step-number">3</div><div><h3>Scannez le QR code</h3><p>Scannez le QR code reçu par e-mail et confirmez l’ajout du forfait cellulaire.</p></div></article>
        <article class="guide-step"><div class="step-number">4</div><div><h3>Nommez votre forfait</h3><p>Choisissez un nom clair, par exemple « SafarSIM Voyage », pour reconnaître la nouvelle ligne.</p></div></article>
        <article class="guide-step"><div class="step-number">5</div><div><h3>Réglez les données mobiles</h3><p>Conservez votre ligne habituelle pour les appels et choisissez SafarSIM pour les données mobiles à votre arrivée.</p></div></article>
        <article class="guide-step"><div class="step-number">6</div><div><h3>Activez l’itinérance</h3><p>Dans les options de la ligne SafarSIM, activez Itinérance des données à destination.</p></div></article>
      </section>
      <section class="guide-activation"><v-icon>mdi-access-point-network</v-icon><div><h2>À votre arrivée</h2><p>Activez la ligne SafarSIM, sélectionnez-la pour les données mobiles et laissez la sélection du réseau en mode automatique. La connexion peut prendre quelques minutes.</p></div></section>
      <section class="guide-help"><h2>Besoin d’aide ?</h2><p>Redémarrez votre téléphone et vérifiez que les données mobiles ainsi que l’itinérance sont activées sur SafarSIM.</p><div><router-link to="/fr/guides/compatibility">Vérifier la compatibilité</router-link><router-link to="/fr/contact">Contacter le support</router-link></div></section>
    </v-container>
  </main>
</template>
<style src="../../../assets/styles/installation-guide.css"></style>
