<template>
  <v-container class="py-8 cart-page" :class="{ 'numbered-checkout': showStepNumbers }">
    <div v-if="cart.length === 0">
      <v-card rounded="xl" elevation="0" class="pa-8 empty-cart text-center">
        <v-icon size="56" class="mb-4">mdi-cart-outline</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">{{ $t("cart.emptyTitle") }}</h2>
        <p class="text-body-1 mb-5">
          {{ $t("cart.emptyText") }}
        </p>

        <v-btn color="black" rounded="pill" class="text-none" to="/">
          {{ $t("common.viewDestinations") }}
        </v-btn>
      </v-card>
    </div>

    <v-row v-else>
      <v-col cols="12" md="6" class="summary-column">
        <v-card rounded="xl" elevation="1" class="pa-5 summary-card">
        <div class="cart-step-title mb-4" :class="{ 'cart-step-title--rtl': $i18n.locale === 'ar' }">
          <span v-if="showStepNumbers" class="cart-step-number">4</span>
          <h2 class="subsection-title">{{ $t("cart.summary") }}</h2>
        </div>
          <div v-for="(item, index) in cart" :key="item.id" class="cart-line py-4">
            <div
              v-if="$i18n.locale === 'ar'"
              class="cart-layout-row d-flex justify-space-between align-start"
            >
              <v-btn icon variant="text" @click="removeItem(item.id)">
                <v-icon>mdi-close</v-icon>
              </v-btn>

              <div class="cart-item-details cart-item-details-ar">
                <div class="text-right">
                  <div class="cart-item-title-ar d-flex align-center justify-end mb-1">
                    <div class="text-h6 font-weight-bold">
                      {{ getCartItemName(item) }}
                    </div>
                    <div class="flag-emoji ml-3">{{ item.flag }}</div>
                  </div>

                  <div class="text-h6 mt-1 mb-1">
                    {{ item.days }} {{ $t("destinationsPage.days") }} • {{ item.dataLabel }} 
                  </div>
                  
                </div>
              </div>
            </div>

            <div v-else class="cart-layout-row d-flex justify-space-between align-start">
              <div class="d-flex align-start">
                <div class="flag-emoji mr-3">{{ item.flag }}</div>

                <div>
                  <div class="text-h6 font-weight-bold mb-1">
                    {{ getCartItemName(item) }}
                  </div>

                  <div class="text-h6 mb-1">
                    {{ item.dataLabel }} • {{ item.days }} {{ $t("destinationsPage.days") }}
                  </div>
                </div>
              </div>

              <v-btn icon variant="text" @click="removeItem(item.id)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>

            <div
              v-if="$i18n.locale === 'ar'"
              class="cart-layout-row d-flex justify-space-between align-center mt-5 flex-wrap ga-3"
            >
              <div class="text-h6 font-weight-bold">
                {{ formatMoney(item.price * item.quantity, item.currency) }}
              </div>

              <div class="quantity-box d-flex align-center">
                <v-btn icon size="small" variant="outlined" @click="decrease(item.id)">
                  <v-icon size="18">mdi-minus</v-icon>
                </v-btn>

                <span class="mx-4 font-weight-bold">{{ item.quantity }}</span>

                <v-btn icon size="small" variant="outlined" @click="increase(item.id)">
                  <v-icon size="18">mdi-plus</v-icon>
                </v-btn>
              </div>
            </div>

            <div v-else class="cart-layout-row d-flex justify-space-between align-center mt-5 flex-wrap ga-3">
              <div class="quantity-box d-flex align-center">
                <v-btn icon size="small" variant="outlined" @click="decrease(item.id)">
                  <v-icon size="18">mdi-minus</v-icon>
                </v-btn>

                <span class="mx-4 font-weight-bold">{{ item.quantity }}</span>

                <v-btn icon size="small" variant="outlined" @click="increase(item.id)">
                  <v-icon size="18">mdi-plus</v-icon>
                </v-btn>
              </div>

              <div class="text-h6 font-weight-bold">
                {{ formatMoney(item.price * item.quantity, item.currency) }}
              </div>
            </div>

            <v-divider v-if="index < cart.length - 1" class="mt-4" />
          </div>

          <template v-if="!showStepNumbers">
            <v-divider class="my-4" />
            <div class="coupon-row mb-4">
              <v-text-field v-model.trim="couponCode" :label="$t('cart.couponCode')" variant="outlined"
                density="compact" rounded="lg" hide-details="auto" :error-messages="couponError"
                :messages="couponApplied ? $t('cart.couponApplied') : ''" @keyup.enter="applyCoupon" />
              <v-btn variant="outlined" rounded="lg" class="text-none" @click="applyCoupon">
                {{ $t('cart.applyCoupon') }}
              </v-btn>
            </div>
            <div v-if="couponApplied" class="d-flex justify-space-between align-center mb-3 coupon-discount">
              <span>{{ $t('cart.discount') }} ({{ couponDiscountPercent }}%)</span>
              <span>-{{ formatMoney(discountAmount, totalCurrency) }}</span>
            </div>
            <div class="d-flex justify-space-between align-center"
              :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
              <span class="text-h6 font-weight-bold">{{ $t("cart.cartSubtotal") }}</span>
              <span class="text-h6 font-weight-bold">{{ formatMoney(total, totalCurrency) }}</span>
            </div>
          </template>

          <template v-if="showStepNumbers">
            <v-divider class="my-4" />

            <div class="compatibility-section" :class="{ 'compatibility-rtl': $i18n.locale === 'ar' }">
              <v-checkbox
                v-model="compatibilityConfirmed"
                color="primary"
                hide-details
                class="compatibility-confirmation"
              >
                <template #label>
                  <span class="compatibility-label-content">
                    {{ $t('cart.compatibilityConfirmed') }}
                    <router-link class="compatibility-link" to="/compatibility" target="_blank" @click.stop>
                      {{ $t("cart.checkCompatibilityLink") }}
                      <v-icon size="15">mdi-open-in-new</v-icon>
                    </router-link>
                  </span>
                </template>
              </v-checkbox>
            </div>

            <v-checkbox
              v-model="termsAccepted"
              color="primary"
              hide-details
              class="policy-acceptance mb-4"
              :class="{ 'policy-acceptance--rtl': $i18n.locale === 'ar' }"
            >
              <template #label>
                <span>
                  {{ $t("cart.acceptPoliciesPrefix") }}
                  <router-link to="/terms-of-service" target="_blank" @click.stop>{{ $t("footer.terms") }}</router-link>,
                  <router-link to="/refund-policy" target="_blank" @click.stop>{{ $t("footer.refund") }}</router-link>,
                  <router-link to="/digital-delivery-policy" target="_blank" @click.stop>{{ $t("footer.digitalDelivery") }}</router-link>
                  {{ $t("cart.acceptPoliciesAnd") }}
                  <router-link to="/privacy-policy" target="_blank" @click.stop>{{ $t("footer.privacy") }}</router-link>.
                </span>
              </template>
            </v-checkbox>

            <v-divider class="mb-5" />

            <div class="coupon-row mb-4">
              <v-text-field v-model.trim="couponCode" :label="$t('cart.couponCode')" variant="outlined"
                density="compact" rounded="lg" hide-details="auto" :error-messages="couponError"
                :messages="couponApplied ? $t('cart.couponApplied') : ''" @keyup.enter="applyCoupon" />
              <v-btn variant="outlined" rounded="lg" class="text-none" @click="applyCoupon">
                {{ $t('cart.applyCoupon') }}
              </v-btn>
            </div>
            <div v-if="couponApplied" class="d-flex justify-space-between align-center mb-3 coupon-discount">
              <span>{{ $t('cart.discount') }} ({{ couponDiscountPercent }}%)</span>
              <span>-{{ formatMoney(discountAmount, totalCurrency) }}</span>
            </div>

            <div class="d-flex justify-space-between align-center mb-4"
              :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
              <span class="text-h6 font-weight-bold">{{ $t("cart.cartSubtotal") }}</span>
              <span class="text-h6 font-weight-bold">{{ formatMoney(total, totalCurrency) }}</span>
            </div>

            <v-alert v-if="checkoutError" type="error" variant="tonal" class="mb-4">
              {{ checkoutError }}
            </v-alert>

            <v-btn
              block
              size="large"
              rounded="pill"
              class="text-none font-weight-bold buy-button"
              :loading="isCheckingOut"
              :disabled="isCheckingOut"
              @click="startCheckout"
            >
              {{ $t("cart.buyButton") }}
            </v-btn>

            <div class="payment-security mt-5" :class="{ 'payment-security--rtl': $i18n.locale === 'ar' }">
              <v-icon size="18">mdi-lock-outline</v-icon>
              <span>{{ $t("cart.paymentSecurityNotice") }}</span>
            </div>
          </template>

        </v-card>

      </v-col>

      <v-col cols="12" md="6" class="contact-column">
        <v-card rounded="xl" elevation="1" class="pa-5 contact-card">
        <div class="cart-step-title mb-4" :class="{ 'cart-step-title--rtl': $i18n.locale === 'ar' }">
          <span v-if="showStepNumbers" class="cart-step-number">3</span>
          <h2 class="subsection-title">{{ $t("cart.contactInfo") }}</h2>
        </div>
          <v-text-field
            v-model.trim="customerName"
            :label="$t('cart.fullName')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-account-outline"
            class="mb-4"
            hide-details="auto"
          />

          <v-text-field
            v-model.trim="customerEmail"
            type="email"
            :label="$t('cart.emailLabel')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-email-outline"
            class="mb-4"
            :error-messages="customerEmailError"
            hide-details="auto"
          />

          <v-text-field
            v-model.trim="customerEmailConfirmation"
            type="email"
            :label="$t('cart.confirmEmail')"
            variant="outlined"
            color="blue"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-email-check-outline"
            class="mb-4"
            :error-messages="customerEmailConfirmationError"
            hide-details="auto"
          />
        </v-card>

        <v-card v-if="!showStepNumbers" rounded="xl" elevation="1" class="pa-5 mt-4 checkout-card">
          <h2 class="checkout-card-title mb-4">{{ $t("cart.confirmOrder") }}</h2>

          <div class="compatibility-section" :class="{ 'compatibility-rtl': $i18n.locale === 'ar' }">
            <v-checkbox
              v-model="compatibilityConfirmed"
              color="primary"
              hide-details
              class="compatibility-confirmation"
            >
              <template #label>
                <span class="compatibility-label-content">
                  {{ $t('cart.compatibilityConfirmed') }}
                <router-link class="compatibility-link" to="/compatibility" target="_blank" @click.stop>
                  {{ $t("cart.checkCompatibilityLink") }}
                  <v-icon size="15">mdi-open-in-new</v-icon>
                </router-link>
                </span>
              </template>
            </v-checkbox>
          </div>

          <v-checkbox
            v-model="termsAccepted"
            color="primary"
            hide-details
            class="policy-acceptance mb-4"
            :class="{ 'policy-acceptance--rtl': $i18n.locale === 'ar' }"
          >
            <template #label>
              <span>
                {{ $t("cart.acceptPoliciesPrefix") }}
                <router-link to="/terms-of-service" target="_blank" @click.stop>{{ $t("footer.terms") }}</router-link>,
                <router-link to="/refund-policy" target="_blank" @click.stop>{{ $t("footer.refund") }}</router-link>,
                <router-link to="/digital-delivery-policy" target="_blank" @click.stop>{{ $t("footer.digitalDelivery") }}</router-link>
                {{ $t("cart.acceptPoliciesAnd") }}
                <router-link to="/privacy-policy" target="_blank" @click.stop>{{ $t("footer.privacy") }}</router-link>.
              </span>
            </template>
          </v-checkbox>

          <v-divider class="mb-5" />

          <div class="d-flex justify-space-between align-center mb-4"
            :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
            <span class="text-h6 font-weight-bold">{{ $t("cart.cartSubtotal") }}</span>
            <span class="text-h6 font-weight-bold">{{ formatMoney(subtotal, totalCurrency) }}</span>
          </div>

          <v-alert v-if="checkoutError" type="error" variant="tonal" class="mb-4">
            {{ checkoutError }}
          </v-alert>

          <v-btn
            block
            size="large"
            rounded="pill"
            class="text-none font-weight-bold buy-button"
            :loading="isCheckingOut"
            :disabled="isCheckingOut"
            @click="startCheckout"
          >
            {{ $t("cart.buyButton") }}
          </v-btn>

          <div class="payment-security mt-5" :class="{ 'payment-security--rtl': $i18n.locale === 'ar' }">
            <v-icon size="18">mdi-lock-outline</v-icon>
            <span>{{ $t("cart.paymentSecurityNotice") }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card
      v-if="showEmbeddedPayment"
      ref="embeddedPaymentCard"
      rounded="xl"
      elevation="1"
      class="pa-3 pa-sm-5 mt-5 embedded-payment-card"
    >
      <h2 class="checkout-card-title mb-2">{{ embeddedPaymentTitle }}</h2>
      <div class="payment-security mb-4" :class="{ 'payment-security--rtl': $i18n.locale === 'ar' }">
        <v-icon size="18">mdi-lock-outline</v-icon>
        <span>{{ $t("cart.paymentSecurityNotice") }}</span>
      </div>
      <div ref="embeddedCheckout" class="stripe-embedded-checkout" />
    </v-card>

  </v-container>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  CART_UPDATED_EVENT,
} from '@/utils/cart'
import { getLocalizedName } from '@/utils/localizedNames'
import { formatMoney as formatCurrency, getPreferredCurrency, MAD_CURRENCY, MAD_TO_USD_RATE } from '@/utils/currency'
import { posthog } from '@/services/posthog'

const PROMO_CODES = new Map([
  ['issam92', 10],
  ['sep26', 20],
])

export default {
  name: 'CartPage',

  props: {
    showStepNumbers: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      cart: [],
      customerEmail: '',
      customerEmailConfirmation: '',
      customerName: '',
      compatibilityConfirmed: false,
      termsAccepted: false,
      isCheckingOut: false,
      checkoutError: '',
      showEmbeddedPayment: false,
      embeddedCheckout: null,
      couponCode: '',
      couponApplied: false,
      couponDiscountPercent: 0,
      couponError: '',
    }
  },

  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => {
        return total + Number(item.price) * Number(item.quantity)
      }, 0)
    },

    totalCurrency() {
      return getPreferredCurrency()
    },

    discountAmount() {
      if (!this.couponApplied) return 0
      const discountedTotal = this.cart.reduce((total, item) => {
        const multiplier = (100 - this.couponDiscountPercent) / 100
        const discountedUnitPrice = Math.round(Number(item.price) * 100 * multiplier) / 100
        return total + discountedUnitPrice * Number(item.quantity)
      }, 0)
      return Number((this.subtotal - discountedTotal).toFixed(2))
    },

    total() {
      return Number((this.subtotal - this.discountAmount).toFixed(2))
    },

    hasValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.customerEmail)
    },

    customerEmailError() {
      if (!this.customerEmail || this.hasValidEmail) return ''

      return this.$t('cart.invalidEmail')
    },

    customerEmailConfirmationError() {
      if (!this.customerEmailConfirmation || this.customerEmailConfirmation === this.customerEmail) return ''

      return this.$t('cart.emailsMismatch')
    },

    embeddedPaymentTitle() {
      return {
        ar: 'الدفع الآمن',
        fr: 'Paiement sécurisé',
        en: 'Secure payment',
      }[this.$i18n.locale] || 'Secure payment'
    },

  },

  watch: {
    couponCode(value) {
      if (this.couponApplied && PROMO_CODES.get(value.trim().toLowerCase()) !== this.couponDiscountPercent) {
        this.couponApplied = false
        this.couponDiscountPercent = 0
        this.couponError = ''
      }
    },
  },

  methods: {
    applyCoupon() {
      const discountPercent = PROMO_CODES.get(this.couponCode.trim().toLowerCase()) || 0
      this.couponApplied = discountPercent > 0
      this.couponDiscountPercent = discountPercent
      this.couponError = discountPercent ? '' : this.$t('cart.invalidCoupon')
    },

    async refreshCart() {
      const cart = getCart()
      const normalizedCart = cart
        .map(this.normalizeCartItem)
        .filter(Boolean)

      if (JSON.stringify(normalizedCart) !== JSON.stringify(cart)) {
        localStorage.setItem('cart', JSON.stringify(normalizedCart))
      }

      this.cart = normalizedCart
      console.log('Cart refreshed:', this.cart)

    },

    normalizeCartItem(item) {
      const storedPrice = item.price && typeof item.price === 'object'
        ? Number(item.price.price)
        : Number(item.price)
      const preferredCurrency = getPreferredCurrency()
      const sourceCurrency = item.currency || MAD_CURRENCY
      let price = storedPrice
      if (sourceCurrency !== preferredCurrency) {
        price = preferredCurrency === MAD_CURRENCY
          ? Number((storedPrice / MAD_TO_USD_RATE).toFixed(2))
          : Number((storedPrice * MAD_TO_USD_RATE).toFixed(2))
      }
      const quantity = Number(item.quantity || 1)
      const days = Number(item.days)

      if (
        !item.destinationName ||
        !item.dataLabel ||
        !Number.isFinite(days) ||
        days < 1 ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return null
      }

      return {
        ...item,
        days,
        names: item.names,
        price,
        currency: preferredCurrency,
        quantity,
      }
    },

    increase(itemId) {
      increaseQuantity(itemId)
      this.refreshCart()
    },

    decrease(itemId) {
      decreaseQuantity(itemId)
      this.refreshCart()
    },

    removeItem(itemId) {
      removeFromCart(itemId)
      this.refreshCart()
    },

    getCartItemName(item) {
      return getLocalizedName(item, this.$i18n.locale) || item.destinationName
    },

    emptyCart() {
      clearCart()
      this.refreshCart()
    },

    formatMoney(amount, currency = this.totalCurrency) {
      return formatCurrency(amount, currency, this.$i18n.locale)
    },

    formatCheckoutItemName(item) {
      const parts = [
        this.getCartItemName(item),
        item.dataLabel,
        `${item.days} ${this.$t('destinationsPage.days')}`,
      ]

      if (this.$i18n.locale !== 'ar') return parts.join(' · ')

      // Keep Arabic and Latin/number segments from being visually reordered by Stripe.
      return parts.map((part) => `\u2068${part}\u2069`).join(' · ')
    },

    async startCheckout() {
      this.checkoutError = ''

      if (!this.customerName || !this.hasValidEmail || this.customerEmailConfirmation !== this.customerEmail) {
        this.checkoutError = this.$t('cart.checkoutContactError')
        return
      }
      if (!this.compatibilityConfirmed) {
        this.checkoutError = this.$t('cart.checkoutCompatibilityError')
        return
      }
      if (!this.termsAccepted) {
        this.checkoutError = this.$t('cart.checkoutTermsError')
        return
      }

      const lineItems = this.cart.map((item) => ({
        name: this.formatCheckoutItemName(item),
        destinationName: this.getCartItemName(item),
        destinationNameEnglish: item.names?.en || item.destinationName,
        dataLabel: item.dataLabel,
        days: item.days,
        esimGoBundleName: item.esimGoBundleName,
        currency: item.currency,
        unitAmount: Math.round(Number(item.price) * 100),
        quantity: item.quantity,
      }))

      this.isCheckingOut = true
      try {
        const publishableKey = String(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY || '').trim()
        if (!publishableKey) {
          throw new Error('Stripe publishable key is not configured')
        }

        const apiUrl = String(
          process.env.VUE_APP_STRIPE_API_URL || 'https://safar-stripe.vercel.app'
        ).replace(/\/$/, '')
        const response = await fetch(`${apiUrl}/api/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: this.customerEmail,
            customerName: this.customerName,
            locale: this.$i18n.locale,
            orderReference: `SAFAR-${Date.now()}`,
            couponCode: this.couponApplied ? this.couponCode.trim().toLowerCase() : '',
            lineItems,
          }),
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok || !result.clientSecret) {
          throw new Error(result.error || this.$t('cart.checkoutError'))
        }

        posthog.capture('checkout_started', {
          cart_item_count: this.cart.reduce((count, item) => count + item.quantity, 0),
          cart_total: this.total,
          currency: this.totalCurrency,
          coupon_applied: this.couponApplied,
          discount_percent: this.couponDiscountPercent,
        })

        if (this.embeddedCheckout) {
          this.embeddedCheckout.destroy()
          this.embeddedCheckout = null
        }

        this.showEmbeddedPayment = true
        await this.$nextTick()

        const stripe = await loadStripe(publishableKey)
        if (!stripe) throw new Error(this.$t('cart.checkoutError'))

        this.embeddedCheckout = await stripe.createEmbeddedCheckoutPage({
          clientSecret: result.clientSecret,
          onComplete: () => {
            this.$router.push({
              path: '/payment-success',
              query: { session_id: result.id },
            })
          },
        })
        this.embeddedCheckout.mount(this.$refs.embeddedCheckout)
        this.isCheckingOut = false

        this.$nextTick(() => {
          this.$refs.embeddedPaymentCard?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      } catch (error) {
        console.error('Stripe Checkout failed', error)
        this.checkoutError = error.message || this.$t('cart.checkoutError')
        this.isCheckingOut = false
      }
    },

  },

  mounted() {
    this.refreshCart()
    window.addEventListener(CART_UPDATED_EVENT, this.refreshCart)
    window.addEventListener('storage', this.refreshCart)
  },

  beforeUnmount() {
    if (this.embeddedCheckout) this.embeddedCheckout.destroy()
    window.removeEventListener(CART_UPDATED_EVENT, this.refreshCart)
    window.removeEventListener('storage', this.refreshCart)
  },
}
</script>

<style scoped>
.app {
  background-color: white !important;
}

.cart-page {
  max-width: 1100px;
  min-height: 100vh;
}

@media (max-width: 959px) {
  .cart-page:not(.numbered-checkout) .summary-column,
  .numbered-checkout .contact-column {
    order: 1;
  }

  .cart-page:not(.numbered-checkout) .contact-column,
  .numbered-checkout .summary-column {
    order: 2;
  }
}

.empty-cart,
.summary-card,
.contact-card {
  background: white;
}

.embedded-payment-card {
  background: white;
  scroll-margin-top: 24px;
}

.stripe-embedded-checkout {
  min-height: 420px;
}

:global(html[dir="rtl"] .summary-card > .d-flex.justify-space-between) {
  direction: ltr !important;
  flex-direction: row-reverse !important;
}

.buy-button {
  background: #d91c58 !important;
  color: white !important;
}

.cart-step-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-step-title .subsection-title {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 800;
}

.checkout-card-title {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 800;
  font-family: inherit;
}

.cart-step-title--rtl {
  width: 100%;
  direction: rtl;
  justify-content: flex-start;
  text-align: right;
}

.cart-step-title--rtl .subsection-title {
  text-align: right;
}

.cart-step-number {
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #d91c58;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}

:global(html[dir="rtl"] .cart-step-title) {
  direction: rtl;
  text-align: right;
}

.compatibility-section {
  padding: 2px 0 0;
}

.compatibility-divider {
  margin: 4px 0 12px;
}

.compatibility-confirmation {
  margin: 4px 0 0;
  font-size: 0.88rem;
}

.compatibility-confirmation :deep(.v-selection-control) {
  min-height: 32px;
}

.compatibility-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 700;
}

.compatibility-label-content {
  line-height: 1.7;
}

.compatibility-rtl {
  direction: rtl;
  text-align: right;
}

.compatibility-rtl .compatibility-confirmation :deep(.v-selection-control) {
  direction: rtl !important;
  text-align: right;
}

.compatibility-rtl .compatibility-confirmation :deep(.v-label) {
  justify-content: flex-start;
  text-align: right;
}

.payment-security {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.82rem;
  line-height: 1.5;
}

.payment-security--rtl {
  direction: rtl;
  justify-content: flex-start;
  text-align: right;
}

.policy-acceptance--rtl :deep(.v-selection-control) {
  direction: rtl !important;
  text-align: right;
}

.policy-acceptance--rtl :deep(.v-label) {
  justify-content: flex-start;
  text-align: right;
}

:global(html[dir="rtl"] .policy-acceptance .v-selection-control),
:global(html[dir="rtl"] .compatibility-confirmation .v-selection-control) {
  direction: rtl;
  text-align: right;
}

:global(html[dir="rtl"] .policy-acceptance .v-label),
:global(html[dir="rtl"] .compatibility-confirmation .v-label) {
  justify-content: flex-start;
  text-align: right;
}

:global(html[dir="rtl"] .payment-security) {
  direction: rtl;
  justify-content: flex-start;
  text-align: right;
}

.cart-line:first-of-type {
  padding-top: 0 !important;
}

.cart-layout-row {
  direction: ltr;
}

.cart-item-details {
  min-width: 0;
}

.cart-item-details-ar {
  direction: ltr;
}

.cart-item-details-ar .text-right {
  direction: rtl;
}

.cart-item-title-ar {
  direction: ltr;
}

.charged-currency {
  font-size: 0.925rem;
  color: rgba(0, 0, 0, 0.68);
}

.flag-emoji {
  font-size: 2rem;
  line-height: 1;
}

.quantity-box {
  border-radius: 999px;
}

.coupon-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.coupon-row .v-input {
  min-width: 0;
  flex: 1;
}

.coupon-discount {
  color: #16834b;
  font-weight: 700;
}

@media (max-width: 480px) {
  .coupon-row {
    flex-direction: column;
  }

  .coupon-row .v-input,
  .coupon-row .v-btn {
    width: 100%;
  }
}

</style>
