<template>
  <section v-if="consent.visible" ref="banner" class="consent-banner" role="region"
    :aria-label="$t('consent.title')" aria-describedby="consent-description" tabindex="-1"
    @keydown.esc="closeConsentSettings">
    <div class="consent-copy">
      <p id="consent-description">{{ $t('consent.description') }}</p>
    </div>
    <div class="consent-actions">
      <button type="button" data-consent="accept" @click="choose(true)">{{ $t('consent.accept') }}</button>
      <button type="button" data-consent="reject" @click="choose(false)">{{ $t('consent.reject') }}</button>
    </div>
  </section>
</template>

<script>
import { consentState, chooseConsent, closeConsentSettings } from '../../services/consent'

export default {
  name: 'ConsentBanner',
  setup() {
    return { consent: consentState, closeConsentSettings }
  },
  watch: {
    'consent.visible'(visible) {
      if (visible) {
        this.returnFocus = document.activeElement
        this.$nextTick(() => this.$refs.banner?.focus())
      } else if (this.returnFocus?.isConnected) {
        this.returnFocus.focus()
      }
    },
  },
  methods: {
    choose(marketing) { chooseConsent(marketing) },
  },
}
</script>

<style scoped>
.consent-banner {
  position: fixed;
  z-index: 2400;
  inset-inline-end: 16px;
  bottom: max(12px, env(safe-area-inset-bottom));
  width: min(440px, calc(100% - 32px));
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  background: #fffbf8;
  color: #2f1b2a;
  border: 1px solid #dec7d1;
  border-radius: 16px;
  box-shadow: 0 6px 32px #2f1b2a26;
  text-align: start;
  max-height: 80vh;
  overflow-y: auto;
}
.consent-copy { flex: 1; }
.consent-copy p { font-size: 14px; line-height: 1.5; margin: 0; }
.consent-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.consent-actions button {
  flex: 1 1 0;
  padding: 8px 10px;
  min-height: 44px;
  background: #7d1948;
  color: white;
  border: 1px solid #7d1948;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.consent-actions button:hover { background: #601238; }
.consent-actions [data-consent="reject"] { background: #eee9ed; color: #47333e; border-color: #d5c8cf; }
.consent-actions [data-consent="reject"]:hover { background: #e0d7dd; }
.consent-banner :focus-visible { outline: 3px solid #2f1b2a; outline-offset: 3px; }
@media (max-width: 599px) {
  .consent-banner { inset-inline: 8px; width: auto; padding: 10px 12px; gap: 8px; }
  .consent-actions { width: 100%; }
}
</style>
