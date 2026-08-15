<template>
  <v-container class="py-8 cart-page">
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
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1" class="pa-5 summary-card">
        <h2 class="subsection-title mb-4">{{ $t("cart.summary") }}</h2>
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

          <v-divider class="my-4" />

          <div class="d-flex justify-space-between align-center mb-4"
            :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
            <span class="text-h6 font-weight-bold">{{ $t("cart.cartSubtotal") }}</span>
            <span class="text-h6 font-weight-bold">{{ formatMoney(subtotal, totalCurrency) }}</span>
          </div>

        </v-card>

      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1" class="pa-5 contact-card">
        <h2 class="subsection-title mb-4">{{ $t("cart.contactInfo") }}</h2>
          <v-alert
            icon="mdi-information-outline"
            variant="tonal"
            class="mb-4"
          >
          {{ contactNotice }}
        </v-alert>
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
            v-model.trim="customerPhone"
            type="tel"
            :label="$t('cart.phone')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-phone-outline"
            class="mb-4"
            hide-details="auto"
          >
            <template #append-inner>
              <span class="phone-help" tabindex="0">
                <v-icon size="22" color="grey-darken-1">
                  mdi-help-circle-outline
                </v-icon>
                <span class="phone-help-tooltip">
                  {{ $t("cart.phoneHelp") }}
                </span>
              </span>
            </template>
          </v-text-field>
        </v-card>
        <v-card rounded="xl" elevation="1" class="pa-5 payment-card mt-6">
          <h2 class="subsection-title mb-4">{{ $t("cart.paymentAndDelivery") }}</h2>

          <v-radio-group v-model="deliveryType" hide-details>
            <v-radio value="digital" color="primary"
              :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
              <template #label>
                <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
                  <div class="font-weight-bold">{{ $t("cart.digitalQr") }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ $t("cart.digitalQrDescription") }}</div>
                </div>
              </template>
            </v-radio>
            <v-radio value="paper" color="primary" class="mt-3"
              :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
              <template #label>
                <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
                  <div class="font-weight-bold">{{ $t("cart.paperDelivery") }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ $t("cart.paperDeliveryDescription") }}</div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <template v-if="!isPaperDelivery">
            <v-alert type="info" variant="tonal" class="mt-5 mb-4">
              {{ $t("cart.bankTransferNotice") }}
            </v-alert>
          </template>

          <template v-else>
            <v-alert type="info" variant="tonal" class="mt-5 mb-5">
              {{ $t("cart.cashOnDeliveryNotice") }}
            </v-alert>
          </template>

          <v-divider class="my-5" />

          <div class="d-flex justify-space-between mb-3 text-medium-emphasis"
            :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
            <span>{{ $t("cart.cartSubtotal") }}</span>
            <span>{{ formatMoney(subtotal, totalCurrency) }}</span>
          </div>

          <div class="d-flex justify-space-between mb-3 text-medium-emphasis"
            :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
            <span>{{ $t("cart.deliveryFee") }}</span>
            <span>{{ formatMoney(paperDeliveryFee, totalCurrency) }}</span>
          </div>

          <div class="d-flex justify-space-between align-center mb-5"
            :style="$i18n.locale === 'ar' ? { direction: 'ltr', flexDirection: 'row-reverse' } : null">
            <span class="text-h6 font-weight-bold">{{ $t("cart.totalToPay") }}</span>
            <span class="text-h6 font-weight-bold">{{ formatMoney(total, totalCurrency) }}</span>
          </div>

          <v-checkbox
            v-model="termsAccepted"
            color="primary"
            hide-details
            class="policy-acceptance mb-4"
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

          <div class="payment-security mb-4">
            <v-icon size="18">mdi-lock-outline</v-icon>
            <span>{{ $t("cart.paymentSecurityNotice") }}</span>
          </div>
          <div class="accepted-cards mb-5" :aria-label="$t('cart.acceptedCards')">
            <span>{{ $t("cart.acceptedCards") }}</span>
            <b>VISA</b>
            <b>Mastercard</b>
            <b>AMEX</b>
          </div>

          <v-btn block size="large" rounded="pill" class="text-none font-weight-bold buy-button">
            {{ $t("cart.buyButton") }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  CART_UPDATED_EVENT,
} from '@/utils/cart'
import { getLocalizedName } from '@/utils/localizedNames'
import { formatUsd, madToUsd, USD_CURRENCY } from '@/utils/currency'

export default {
  name: 'CartPage',

  data() {
    return {
      cart: [],
      customerEmail: '',
      customerPhone: '',
      customerName: '',
      deliveryType: 'digital',
      digitalChannel: 'whatsapp',
      termsAccepted: false,
    }
  },

  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => {
        return total + Number(item.price) * Number(item.quantity)
      }, 0)
    },

    paperDeliveryFee() {
      return this.isPaperDelivery ? madToUsd(50) : 0
    },

    total() {
      return this.subtotal + this.paperDeliveryFee
    },

    isPaperDelivery() {
      return this.deliveryType === 'paper'
    },

    contactNotice() {
      if (this.isPaperDelivery) return this.$t('cart.paperContactNotice')
      return this.digitalChannel === 'email'
        ? this.$t('cart.emailNotice')
        : this.$t('cart.whatsappNotice')
    },

    totalCurrency() {
      return USD_CURRENCY
    },

    hasValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.customerEmail)
    },

    customerEmailError() {
      if (this.digitalChannel !== 'email' || this.isPaperDelivery || !this.customerEmail || this.hasValidEmail) return ''

      return this.$t('cart.invalidEmail')
    },

  },

  methods: {
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
      const isUsd = item.currency === USD_CURRENCY
      const price = isUsd ? storedPrice : madToUsd(storedPrice)
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
        currency: USD_CURRENCY,
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

    formatMoney(amount) {
      return formatUsd(amount, this.$i18n.locale)
    },

  },

  mounted() {
    this.refreshCart()
    window.addEventListener(CART_UPDATED_EVENT, this.refreshCart)
    window.addEventListener('storage', this.refreshCart)
  },

  beforeUnmount() {
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

.empty-cart,
.summary-card,
.contact-card,
.payment-card {
  background: white;
}

:global(html[dir="rtl"]) .payment-card :deep(.v-radio) {
  width: 100%;
  direction: ltr !important;
  flex-direction: row !important;
}

:global(html[dir="rtl"]) .payment-card :deep(.v-radio .v-selection-control__wrapper) {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  flex: 0 0 auto;
  order: 1;
}

:global(html[dir="rtl"]) .payment-card :deep(.v-radio .v-label) {
  flex: 1;
  order: 0;
  direction: rtl;
  text-align: right;
}

:global(html[dir="rtl"]) .payment-card .d-flex.justify-space-between,
:global(html[dir="rtl"]) .summary-card > .d-flex.justify-space-between {
  direction: ltr !important;
  flex-direction: row-reverse !important;
}

.buy-button {
  background: #d91c58 !important;
  color: white !important;
}

.payment-security {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.82rem;
  line-height: 1.5;
}

.accepted-cards {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: rgba(0, 0, 0, 0.68);
  font-size: 0.78rem;
}

.accepted-cards b {
  padding: 3px 7px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 0.7rem;
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

.phone-help {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
}

.phone-help-tooltip {
  position: absolute;
  right: -14px;
  bottom: calc(100% + 14px);
  z-index: 5;
  width: 270px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(17, 17, 17, 0.96);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.phone-help-tooltip::after {
  content: "";
  position: absolute;
  right: 24px;
  bottom: -9px;
  border-top: 10px solid rgba(17, 17, 17, 0.96);
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
}

.phone-help:hover .phone-help-tooltip,
.phone-help:focus .phone-help-tooltip,
.phone-help:focus-within .phone-help-tooltip {
  opacity: 1;
  transform: translateY(0);
}
</style>
