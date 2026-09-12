<template>
  <main class="guide-page" dir="ltr">
    <v-container class="guide-container">
      <nav class="guide-breadcrumb" aria-label="Navigatiepad">
        <router-link to="/nl/">Home</router-link><v-icon size="16">mdi-chevron-right</v-icon>
        <span>eSIM-handleidingen</span><v-icon size="16">mdi-chevron-right</v-icon><strong>Android</strong>
      </nav>
      <header class="guide-hero">
        <div class="guide-device-icon"><v-icon>mdi-android</v-icon></div><span>eSIM-installatiehandleiding</span>
        <h1>Zo installeer je een eSIM op Android</h1>
        <p>Volg deze stappen om je SafarSIM eSIM vóór vertrek te installeren en na aankomst op je bestemming te activeren.</p>
        <div class="guide-meta"><span><v-icon size="19">mdi-clock-outline</v-icon>Ongeveer 5 minuten</span><span><v-icon size="19">mdi-wifi</v-icon>Wifiverbinding aanbevolen</span></div>
      </header>
      <section class="guide-before"><h2>Voordat je begint</h2><div class="before-grid">
        <div><v-icon>mdi-check-circle</v-icon><span>Controleer of je telefoon eSIM ondersteunt.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Verbind je telefoon met een stabiel wifinetwerk.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Open de e-mail met je QR-code op een ander scherm.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>Wacht tot aankomst voordat je data op de nieuwe eSIM inschakelt.</span></div>
      </div></section>
      <section class="guide-steps">
        <div class="guide-section-heading"><span>Installatie</span><h2>Installeer de eSIM op je Android-telefoon</h2></div>
        <article class="guide-step"><div class="step-number">1</div><div><h3>Open Instellingen</h3><p>Ga naar Instellingen en vervolgens naar Verbindingen, Netwerk en internet of Simkaarten.</p></div></article>
        <article class="guide-step"><div class="step-number">2</div><div><h3>Voeg een eSIM toe</h3><p>Tik op eSIM toevoegen, Mobiel abonnement toevoegen of Een simkaart downloaden.</p></div></article>
        <article class="guide-step"><div class="step-number">3</div><div><h3>Scan de QR-code</h3><p>Kies de QR-codeoptie, scan de code uit de e-mail en bevestig de download.</p></div></article>
        <article class="guide-step"><div class="step-number">4</div><div><h3>Geef je bundel een naam</h3><p>Geef de nieuwe eSIM de naam ‘SafarSIM Travel’ zodat je deze gemakkelijk herkent.</p></div></article>
        <article class="guide-step"><div class="step-number">5</div><div><h3>Selecteer mobiele data</h3><p>Kies na aankomst SafarSIM als simkaart voor mobiele data.</p></div></article>
        <article class="guide-step"><div class="step-number">6</div><div><h3>Schakel dataroaming in</h3><p>Open de SafarSIM-instellingen en schakel roaming in om verbinding te maken.</p></div></article>
      </section>
      <section class="guide-activation"><v-icon>mdi-access-point-network</v-icon><div><h2>Na aankomst</h2><p>Schakel de SafarSIM-lijn in, selecteer deze voor mobiele data en laat netwerkselectie op automatisch staan. Verbinding maken kan enkele minuten duren.</p></div></section>
      <section class="guide-help"><h2>Hulp nodig?</h2><p>Start je telefoon opnieuw op en controleer of mobiele data en roaming zijn ingeschakeld voor SafarSIM.</p><div><router-link to="/nl/guides/compatibility">Controleer de compatibiliteit</router-link><router-link to="/nl/contact">Neem contact op met de klantenservice</router-link></div></section>
    </v-container>
  </main>
</template>
<style src="../../../assets/styles/installation-guide.css"></style>
