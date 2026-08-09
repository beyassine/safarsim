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

          <!-- PayPal is temporarily disabled while verification is pending.
          <div class="d-flex justify-space-between mb-4 charged-currency">
            <span>PayPal débitera ::</span>
            <strong>{{ paypalTotalUsd }} USD</strong>
          </div>
          -->

        </v-card>

      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1" class="pa-5 compatibility-card mb-6">
        <h4 class="subsection-title mb-4">{{ $t("cart.phoneCompatibility") }}</h4>
        <div
          v-for="(entry, compatibilityIndex) in compatibilityEntries"
          :key="entry.key"
          :class="{ 'mb-6': compatibilityIndex < compatibilityEntries.length - 1 }"
        >
          <div v-if="compatibilityEntries.length > 1" class="font-weight-bold mb-3">
            <bdi dir="ltr">eSIM {{ compatibilityIndex + 1 }}</bdi>
            <span> — {{ getCartItemName(entry.item) }}</span>
          </div>
          <p v-if="compatibilityEntries.length > 1" class="text-body-2 text-medium-emphasis mb-3">
            {{ $t('cart.checkPhoneForEsim', { number: compatibilityIndex + 1 }) }}
          </p>
          <v-alert
            :type="isCompatibilityComplete(entry.key) ? 'success' : 'info'"
            variant="tonal"
            class="mb-4 compatibility-alert"
          >
            <i18n-t
              v-if="$i18n.locale === 'ar'"
              :keypath="isCompatibilityComplete(entry.key) ? 'cart.compatiblePhone' : 'cart.selectPhone'"
              tag="span"
              dir="rtl"
            >
              <template #esim>
                <bdi dir="ltr">eSIM</bdi>
              </template>
            </i18n-t>
            <span v-else>{{ compatibilityMessageFor(entry.key) }}</span>
          </v-alert>

          <v-select
            v-model="compatibilitySelections[entry.key].phoneModel"
            :items="phoneModelOptions"
            :label="$t('cart.phoneModel')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-cellphone"
            :menu-props="{ maxHeight: 320 }"
            class="mb-4"
            hide-details="auto"
            @update:model-value="compatibilitySelections[entry.key].phoneSubmodel = ''"
          />

          <v-autocomplete
            v-model="compatibilitySelections[entry.key].phoneSubmodel"
            :items="phoneSubmodelOptionsFor(entry.key)"
            :label="$t('cart.phoneSubmodel')"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            prepend-inner-icon="mdi-cellphone-check"
            :menu-props="{ maxHeight: 320 }"
            hide-details="auto"
            :disabled="!compatibilitySelections[entry.key].phoneModel"
            :no-data-text="$t('cart.noModel')"
          />
        </div>
        </v-card>
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

          <v-btn block prepend-icon="mdi-whatsapp" size="large" rounded="pill"
            class="text-none font-weight-bold whatsapp-checkout-button" @click="checkoutWhatsApp">
            {{ $t("cart.whatsappCheckout") }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3500">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import { iosCompatibility, androidCompatibility } from '@/data/deviceCompatibility'
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  CART_UPDATED_EVENT,
} from '@/utils/cart'
import { getLocalizedName } from '@/utils/localizedNames'

export default {
  name: 'CartPage',

  data() {
    return {
      cart: [],
      paypalLoaded: false,
      paypalLoading: false,
      paypalError: '',
      paypalConfig: null,
      paypalButtonRenderKey: 0,
      paypalButtons: null,
      paypalRenderTimeout: null,
      paypalRendering: false,
      pendingOrderId: '',
      customerEmail: '',
      customerPhone: '',
      customerName: '',
      deliveryType: 'digital',
      digitalChannel: 'whatsapp',
      compatibilitySelections: {},
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },
    }
  },

  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => {
        return total + Number(item.price) * Number(item.quantity)
      }, 0)
    },

    paperDeliveryFee() {
      return this.isPaperDelivery ? 50 : 0
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
      const currencies = new Set(this.cart.map(item => item.currency || 'DH'))
      return currencies.size === 1 ? Array.from(currencies)[0] : ''
    },

    madToUsdRate() {
      return Number(process.env.VUE_APP_MAD_TO_USD_RATE || 0.108)
    },

    paypalTotalUsd() {
      return (this.total * this.madToUsdRate).toFixed(2)
    },

    cartPayload() {
      return this.cart.map(item => ({
        id: item.id,
        destinationName: this.getCartItemName(item),
        dataLabel: item.dataLabel,
        days: item.days,
        quantity: Number(item.quantity),
        unitPrice: Number(item.price),
        totalPrice: Number(item.price) * Number(item.quantity),
        esimGoBundleName: item.esimGoBundleName,
        flag: item.flag,
      }))
    },

    customerPayload() {
      return {
        email: this.customerEmail,
        phone: this.customerPhone,
        name: this.customerName,
      }
    },

    deliveryPayload() {
      return {
        type: this.deliveryType,
        digitalChannel: this.isPaperDelivery ? null : this.digitalChannel,
        paymentMethod: this.isPaperDelivery ? 'cash_on_delivery' : 'bank_transfer',
        fee: this.paperDeliveryFee,
      }
    },

    compatibilityPayload() {
      return this.compatibilityEntries.map((entry, index) => ({
        esimNumber: index + 1,
        cartItemId: entry.item.id,
        destinationName: this.getCartItemName(entry.item),
        unitNumber: entry.unitNumber,
        ...this.compatibilitySelections[entry.key],
      }))
    },

    compatibilityEntries() {
      return this.cart.flatMap(item => Array.from(
        { length: Number(item.quantity) },
        (_, unitIndex) => ({
          key: `${item.id}:${unitIndex + 1}`,
          item,
          unitNumber: unitIndex + 1,
        })
      ))
    },

    deviceCompatibilityGroups() {
      const groups = new Map()
      const priorityBrands = ['iphone', 'samsung', 'oppo', 'huawei', 'xiaomi']

      ;[...iosCompatibility, ...androidCompatibility].forEach(group => {
        const brand = this.formatDeviceBrand(group.brand)
        const key = brand.toLowerCase()
        const existing = groups.get(key) || {
          brand,
          models: new Set(),
        }

        group.models.forEach(model => {
          existing.models.add(model)
        })

        groups.set(key, existing)
      })

      return Array.from(groups.values())
        .map(group => ({
          brand: group.brand,
          models: Array.from(group.models).sort((a, b) => a.localeCompare(b)),
        }))
        .sort((a, b) => {
          const aPriority = priorityBrands.indexOf(a.brand.toLowerCase())
          const bPriority = priorityBrands.indexOf(b.brand.toLowerCase())

          if (aPriority !== -1 || bPriority !== -1) {
            if (aPriority === -1) return 1
            if (bPriority === -1) return -1
            return aPriority - bPriority
          }

          return a.brand.localeCompare(b.brand)
        })
    },

    phoneModelOptions() {
      return this.deviceCompatibilityGroups.map(group => group.brand)
    },

    hasSelectedCompatiblePhone() {
      return this.compatibilityEntries.length > 0 && this.compatibilityEntries.every(entry => (
        this.isCompatibilityComplete(entry.key)
      ))
    },

    hasValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.customerEmail)
    },

    hasValidPhone() {
      return Boolean(this.customerPhone.trim())
    },

    isPaymentReady() {
      const hasRequiredContact = this.digitalChannel === 'email' && !this.isPaperDelivery
        ? this.hasValidEmail
        : this.hasValidPhone
      const hasCustomerName = Boolean(this.customerName.trim())

      return this.hasSelectedCompatiblePhone && hasRequiredContact && hasCustomerName
    },

    customerEmailError() {
      if (this.digitalChannel !== 'email' || this.isPaperDelivery || !this.customerEmail || this.hasValidEmail) return ''

      return this.$t('cart.invalidEmail')
    },

    paypalButtonContainerId() {
      return `paypal-button-container-${this.paypalButtonRenderKey}`
    },
  },

  methods: {
    syncCompatibilitySelections() {
      const selections = {}

      this.compatibilityEntries.forEach(entry => {
        selections[entry.key] = this.compatibilitySelections[entry.key] || {
          phoneModel: '',
          phoneSubmodel: '',
        }
      })

      this.compatibilitySelections = selections
    },

    isCompatibilityComplete(key) {
      const selection = this.compatibilitySelections[key]
      return Boolean(selection?.phoneModel && selection?.phoneSubmodel)
    },

    compatibilityMessageFor(key) {
      return this.$t(this.isCompatibilityComplete(key) ? 'cart.compatiblePhone' : 'cart.selectPhone')
    },

    phoneSubmodelOptionsFor(key) {
      const phoneModel = this.compatibilitySelections[key]?.phoneModel
      return this.deviceCompatibilityGroups.find(group => group.brand === phoneModel)?.models || []
    },

    showMessage(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color,
      }
    },

    async refreshCart() {
      const cart = getCart()
      const normalizedCart = cart
        .map(this.normalizeCartItem)
        .filter(Boolean)

      if (normalizedCart.length !== cart.length) {
        localStorage.setItem('cart', JSON.stringify(normalizedCart))
      }

      this.cart = normalizedCart
      this.syncCompatibilitySelections()
      console.log('Cart refreshed:', this.cart)

      if (this.paypalLoaded) {
        await this.$nextTick()
        this.schedulePayPalButtonsRender()
      }
    },

    normalizeCartItem(item) {
      const price = item.price && typeof item.price === 'object'
        ? Number(item.price.price)
        : Number(item.price)
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
        currency: 'DH',
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

    formatDeviceBrand(brand) {
      const normalizedBrand = String(brand || '').trim()
      const specialBrands = {
        oppo: 'OPPO',
      }

      if (normalizedBrand.toLowerCase() === 'apple') {
        return 'iPhone'
      }

      if (specialBrands[normalizedBrand.toLowerCase()]) {
        return specialBrands[normalizedBrand.toLowerCase()]
      }

      return normalizedBrand
        .toLowerCase()
        .replace(/\b\w/g, character => character.toUpperCase())
    },

    formatMoney(amount, currency = 'DH') {
      const value = Number(amount)
      const formatted = currency === 'USD'
        ? value.toFixed(2)
        : Number.isInteger(value) ? value : value.toFixed(2)
      return currency ? `${formatted} ${currency}` : formatted
    },

    paymentValidationMessage() {
      if (!this.hasSelectedCompatiblePhone) {
        return this.$t('cart.selectCompatiblePhone')
      }

      if (this.digitalChannel === 'email' && !this.isPaperDelivery && !this.hasValidEmail) {
        return this.$t('cart.invalidEmail')
      }

      if (!this.hasValidPhone) {
        return this.$t('cart.enterPhone')
      }

      if (!this.customerName.trim()) {
        return this.$t('cart.enterFullName')
      }

      return this.$t('cart.completeRequired')
    },

    checkoutWhatsApp() {
      if (!this.cart.length) return
      if (!this.isPaymentReady) {
        this.showMessage(this.paymentValidationMessage(), 'error')
        return
      }

      const phoneNumber = '212613147245'

      const lines = [
        this.$t('cart.whatsappGreeting'),
        '',
        this.$t('cart.whatsappIntro'),
        '',
        ...this.cart.map((item, index) => {
          const lineTotal = item.price * item.quantity
          return `${index + 1}. ${this.getCartItemName(item)} - ${item.dataLabel} - ${item.days} ${this.$t('destinationsPage.days')} - ${this.$t('cart.quantity')}: ${item.quantity} - ${this.$t('cart.unitPrice')}: ${this.formatMoney(item.price, item.currency)} - ${this.$t('cart.total')}: ${this.formatMoney(lineTotal, item.currency)}`
        }),
        '',
        ...this.compatibilityPayload.map(compatibility => (
          `${this.$t('cart.whatsappCompatiblePhone')} ${compatibility.esimNumber} (${compatibility.destinationName}) : ${compatibility.phoneModel} ${compatibility.phoneSubmodel}`
        )),
        `Email : ${this.customerEmail || this.$t('cart.notProvided')}`,
        `${this.$t('cart.phone')} : ${this.customerPhone || this.$t('cart.notProvided')}`,
        `${this.$t('cart.deliveryMethod')} : ${this.$t(this.isPaperDelivery ? 'cart.paperDelivery' : 'cart.digitalQr')}`,
        ...(!this.isPaperDelivery ? [
          `${this.$t('cart.digitalChannel')} : ${this.digitalChannel === 'email' ? this.$t('common.email') : 'WhatsApp'}`,
          `${this.$t('cart.paymentMethod')} : ${this.$t('cart.bankTransfer')}`,
        ] : [
          `${this.$t('cart.paymentMethod')} : ${this.$t('cart.cashOnDelivery')}`,
          `${this.$t('cart.fullName')} : ${this.customerName}`,
          `${this.$t('cart.paperDeliveryFee')} : ${this.formatMoney(this.paperDeliveryFee, this.totalCurrency)}`,
        ]),
        '',
        `${this.$t('cart.cartTotal')} : ${this.formatMoney(this.total, this.totalCurrency)}`,
        '',
        this.$t('cart.whatsappThanks')
      ]

      const message = encodeURIComponent(lines.join('\n'))
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

      window.open(whatsappUrl, '_blank')
    },

    async loadPayPalScript() {
      const paypalConfig = await this.loadPayPalConfig()
      const scriptSrc = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=${paypalConfig.currency}&intent=${paypalConfig.intent}&components=buttons`

      if (window.paypal && this.isPayPalScriptLoaded(scriptSrc)) {
        this.paypalLoaded = true
        await this.$nextTick()
        this.schedulePayPalButtonsRender()
        return
      }

      const existingScript = document.getElementById('paypal-sdk-script')
      if (existingScript) {
        if (existingScript.src !== scriptSrc) {
          existingScript.remove()
          delete window.paypal
        } else if (window.paypal) {
          this.paypalLoaded = true
          await this.$nextTick()
          this.schedulePayPalButtonsRender()
          return
        } else {
          this.paypalLoading = true
          existingScript.addEventListener('load', async () => {
            this.paypalLoading = false
            this.paypalLoaded = true
            await this.$nextTick()
            this.schedulePayPalButtonsRender()
          }, { once: true })
          return
        }
      }

      this.paypalLoading = true
      this.paypalError = ''

      try {
        const script = document.createElement('script')
        script.id = 'paypal-sdk-script'
        script.src = scriptSrc
        script.async = true

        script.onload = async () => {
          this.paypalLoading = false
          this.paypalLoaded = true
          await this.$nextTick()
          this.schedulePayPalButtonsRender()
        }

        script.onerror = () => {
          this.paypalLoading = false
          this.paypalError = 'Impossible de charger PayPal.'
        }

        document.body.appendChild(script)
      } catch (error) {
        this.paypalLoading = false
        this.paypalError = 'Erreur lors du chargement de PayPal.'
      }
    },

    async loadPayPalConfig() {
      if (this.paypalConfig) return this.paypalConfig

      const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/paypal/config`)
      this.paypalConfig = response.data

      return this.paypalConfig
    },

    isPayPalScriptLoaded(scriptSrc) {
      const existingScript = document.getElementById('paypal-sdk-script')
      return existingScript?.src === scriptSrc
    },

    closePayPalButtons() {
      if (this.paypalButtons?.close) {
        try {
          this.paypalButtons.close()
        } catch (error) {
          console.warn('Unable to close PayPal buttons:', error)
        }
      }

      this.paypalButtons = null
    },

    schedulePayPalButtonsRender() {
      clearTimeout(this.paypalRenderTimeout)

      this.paypalRenderTimeout = setTimeout(() => {
        this.renderPayPalButtons()
      }, 75)
    },

    async renderPayPalButtons() {
      if (!window.paypal || !this.cart.length) return
      if (this.paypalRendering) return

      this.paypalRendering = true
      this.closePayPalButtons()
      this.paypalButtonRenderKey += 1
      await this.$nextTick()

      const container = document.getElementById(this.paypalButtonContainerId)
      if (!container) {
        this.paypalRendering = false
        return
      }

      const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          shape: 'pill',
          label: 'paypal',
        },

        createOrder: async () => {
          try {
            if (!this.isPaymentReady) {
              this.showMessage(this.paymentValidationMessage(), 'error')
              throw new Error('Customer information is incomplete')
            }
            const response = await axios.post(
              `${process.env.VUE_APP_API_URL}/api/paypal/create-order`,
              {
                cart: this.cartPayload,
                customer: this.customerPayload,
                compatibility: this.compatibilityPayload,
                delivery: this.deliveryPayload,
              }
            )

            this.pendingOrderId = response.data.orderId

            return response.data.id
          } catch (error) {
        const errorMessage = error.response?.data?.error || this.$t('cart.paypalCreateOrderError')
            console.error('Create order error:', error.response?.data || error)
            this.showMessage(errorMessage, 'error')
            throw error
          }
        },

        onApprove: async (data) => {
          try {
            const response = await axios.post(
              `${process.env.VUE_APP_API_URL}/api/paypal/capture-order`,
              {
                orderID: data.orderID,
                localOrderId: this.pendingOrderId,
                cart: this.cartPayload,
                customer: this.customerPayload,
                compatibility: this.compatibilityPayload,
                delivery: this.deliveryPayload,
              }
            )

            console.log('Payment captured:', response.data)

            this.cart = []
            localStorage.removeItem('cart')

            this.$router.push({
              name: 'PaymentSuccess',
              query: {
                orderId: response.data.orderId,
              },
            })
          } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erreur lors de la confirmation du paiement PayPal.'
            console.error('Capture order error:', error.response?.data || error)
            this.showMessage(errorMessage, 'error')
          }
        },

        onError: (err) => {
          console.error('PayPal SDK error:', err)
          this.showMessage(this.$t('cart.paypalGenericError'), 'error')
        },

        onCancel: () => {
          this.showMessage(this.$t('cart.paypalCancelled'))
        },
      })

      this.paypalButtons = buttons

      try {
        await buttons.render(`#${this.paypalButtonContainerId}`)
      } finally {
        this.paypalRendering = false
      }
    },
  },

  mounted() {
    this.refreshCart()
    // PayPal is temporarily disabled while verification is pending.
    // this.loadPayPalScript()

    window.addEventListener(CART_UPDATED_EVENT, this.refreshCart)
    window.addEventListener('storage', this.refreshCart)
  },

  beforeUnmount() {
    clearTimeout(this.paypalRenderTimeout)
    this.closePayPalButtons()
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
.compatibility-card,
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

.whatsapp-checkout-button {
  background: #d91c58 !important;
  color: white !important;
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

.compatibility-alert bdi {
  unicode-bidi: isolate;
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
