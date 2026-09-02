<template>
  <main class="guide-page" dir="ltr">
    <v-container class="guide-container">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <router-link to="/">Home</router-link><v-icon size="16">mdi-chevron-right</v-icon>
        <span>eSIM guides</span><v-icon size="16">mdi-chevron-right</v-icon><strong>iPhone</strong>
      </nav>
      <header class="guide-hero">
        <div class="guide-device-icon"><v-icon>mdi-apple</v-icon></div><span>eSIM installation guide</span>
        <h1>How to install an eSIM on iPhone</h1>
        <p>Follow these steps to install your SafarSIM eSIM before departure and activate it after reaching your destination.</p>
        <div class="guide-meta"><span><v-icon size="19">mdi-clock-outline</v-icon>About 5 minutes</span><span><v-icon size="19">mdi-wifi</v-icon>Wi-Fi connection recommended</span></div>
      </header>
      <section class="guide-before"><h2>Before you begin</h2><div class="before-grid">
        <div><v-icon>mdi-check-circle</v-icon><span>Check that your phone supports eSIM.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Connect your phone to a stable Wi-Fi network.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Open the email containing your QR code on another screen.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Wait until arrival before enabling data on the new eSIM.</span></div>
      </div></section>
      <section class="guide-steps">
        <div class="guide-section-heading"><span>Installation</span><h2>Install the eSIM on your iPhone</h2></div>
        <article class="guide-step"><div class="step-number">1</div><div><h3>Open Settings</h3><p>Go to Settings, then Cellular or Mobile Data.</p></div></article>
        <article class="guide-step"><div class="step-number">2</div><div><h3>Add an eSIM</h3><p>Tap Add eSIM, then Use QR Code.</p></div></article>
        <article class="guide-step"><div class="step-number">3</div><div><h3>Scan the QR code</h3><p>Scan the code received by email and confirm adding the cellular plan.</p></div></article>
        <article class="guide-step"><div class="step-number">4</div><div><h3>Label your plan</h3><p>Choose a clear label such as “SafarSIM Travel” to identify the new line.</p></div></article>
        <article class="guide-step"><div class="step-number">5</div><div><h3>Set mobile data</h3><p>Keep your usual line for calls and select SafarSIM for mobile data after arrival.</p></div></article>
        <article class="guide-step"><div class="step-number">6</div><div><h3>Enable data roaming</h3><p>Open the SafarSIM line options and enable Data Roaming at your destination.</p></div></article>
      </section>
      <section class="guide-activation"><v-icon>mdi-access-point-network</v-icon><div><h2>After you arrive</h2><p>Enable the SafarSIM line, select it for mobile data and leave network selection on automatic. Connection may take a few minutes.</p></div></section>
      <section class="guide-help"><h2>Need help?</h2><p>Restart your phone and confirm that mobile data and roaming are enabled for SafarSIM.</p><div><router-link to="/guides/compatibility">Check compatibility</router-link><router-link to="/contact">Contact support</router-link></div></section>
    </v-container>
  </main>
</template>
<style src="../../../assets/styles/installation-guide.css"></style>
