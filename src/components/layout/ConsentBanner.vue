<template>
  <section v-if="consent.visible" ref="banner" class="consent-banner" role="region"
    aria-labelledby="consent-title" aria-describedby="consent-description" tabindex="-1"
    @keydown.esc="closeConsentSettings">
    <div class="consent-copy">
      <h2 id="consent-title">{{ $t('consent.title') }}</h2>
      <p id="consent-description">{{ $t('consent.description') }}</p>
      <router-link :to="privacyPath">{{ $t('footer.privacy') }}</router-link>
    </div>
    <div class="consent-actions">
      <button type="button" data-consent="accept" @click="choose(true)">{{ $t('consent.accept') }}</button>
      <button type="button" data-consent="reject" @click="choose(false)">{{ $t('consent.reject') }}</button>
      <button v-if="consent.choice !== null" type="button" class="consent-close"
        @click="closeConsentSettings">{{ $t('consent.close') }}</button>
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
  computed: {
    privacyPath() {
      return `${this.$i18n.locale === 'en' ? '' : '/' + this.$i18n.locale}/privacy-policy`
    },
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
  inset-inline: 16px;
  bottom: max(16px, env(safe-area-inset-bottom));
  max-width: 1000px;
  margin-inline: auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
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
.consent-copy h2 { font-size: 18px; margin-bottom: 8px; }
.consent-copy p { font-size: 14px; line-height: 1.6; margin-bottom: 8px; }
.consent-copy a { color: #7d1948; font-size: 14px; text-decoration: underline; }
.consent-actions { display: flex; flex-direction: column; gap: 8px; min-width: 200px; }
.consent-actions button {
  padding: 10px 16px;
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
.consent-actions .consent-close { background: transparent; color: #7d1948; }
.consent-banner :focus-visible { outline: 3px solid #2f1b2a; outline-offset: 3px; }
@media (max-width: 599px) {
  .consent-banner { inset-inline: 12px; padding: 16px; flex-direction: column; gap: 14px; }
  .consent-actions { width: 100%; }
}
</style>
