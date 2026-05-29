<template>
  <v-container class="py-8 cart-page">
    <h1 class="section-title mb-6">Mon panier</h1>

    <div v-if="cart.length === 0">
      <v-card rounded="xl" elevation="0" class="pa-8 empty-cart text-center">
        <v-icon size="56" class="mb-4">mdi-cart-outline</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Votre panier est vide</h2>
        <p class="text-body-1 mb-5">
          Ajoutez un forfait eSIM pour continuer.
        </p>

        <v-btn color="black" rounded="pill" class="text-none" to="/">
          Voir les destinations
        </v-btn>
      </v-card>
    </div>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card v-for="item in cart" :key="item.id" rounded="xl" elevation="1" class="mb-4 pa-4 cart-item">
          <div class="d-flex justify-space-between align-start">
            <div class="d-flex align-start">
              <div class="flag-emoji mr-3">{{ item.flag }}</div>

              <div>
                <div class="text-h6 font-weight-bold mb-1">
                  {{ item.destinationName }}
                </div>

                <div class="text-body-1 mb-1">
                  {{ item.dataLabel }} • {{ item.days }} jours : {{ item.price }} DHs
                </div>
              </div>
            </div>

            <v-btn icon variant="text" @click="removeItem(item.id)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="d-flex justify-space-between align-center mt-5 flex-wrap ga-3">
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
              {{ item.price * item.quantity }} DH
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="0" class="pa-5 summary-card">
          <h2 class="text-h6 font-weight-bold mb-4">Résumé</h2>

          <div class="d-flex justify-space-between mb-2">
            <span>Sous-total</span>
            <strong>{{ subtotal }} DH</strong>
          </div>

          <div class="d-flex justify-space-between mb-4">
            <span>Total</span>
            <strong>{{ total }} DH</strong>
          </div>

          <!-- PayPal is temporarily disabled while verification is pending.
          <div class="d-flex justify-space-between mb-4 charged-currency">
            <span>PayPal débitera ::</span>
            <strong>{{ paypalTotalUsd }} USD</strong>
          </div>
          -->

          <v-divider class="mb-4" />

          <v-text-field
            v-model.trim="customerEmail"
            type="email"
            label="Email"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            hide-details="auto"
          />

          <!-- PayPal buttons are temporarily disabled while verification is pending.
          <div class="mb-4">
            <div class="text-subtitle-1 font-weight-bold mb-2">
              Paiement sécurisé par PayPal
            </div>

            <div v-if="paypalLoading" class="text-body-2 text-medium-emphasis">
              Chargement de PayPal...
            </div>

            <div v-if="paypalError" class="text-body-2 text-red mb-2">
              {{ paypalError }}
            </div>

            <div id="paypal-button-wrapper">
              <div :id="paypalButtonContainerId" :key="paypalButtonRenderKey"></div>
            </div>
          </div>
          -->

          <v-btn block prepend-icon="mdi-whatsapp" color="green-darken-1" size="large" rounded="pill"
            class="text-none font-weight-bold mb-3" @click="checkoutWhatsApp">
            Continuer par WhatsApp
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
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  CART_UPDATED_EVENT,
} from '@/utils/cart'

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

    total() {
      return this.subtotal
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
        destinationName: item.destinationName,
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
      }
    },

    hasValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.customerEmail)
    },

    paypalButtonContainerId() {
      return `paypal-button-container-${this.paypalButtonRenderKey}`
    },
  },

  methods: {
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
        price,
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

    emptyCart() {
      clearCart()
      this.refreshCart()
    },

    checkoutWhatsApp() {
      if (!this.cart.length) return

      const phoneNumber = '212613147245'

      const lines = [
        'Bonjour,',
        '',
        'Je souhaite commander les eSIM suivantes :',
        '',
        ...this.cart.map((item, index) => {
          const lineTotal = item.price * item.quantity
          return `${index + 1}. ${item.destinationName} - ${item.dataLabel} - ${item.days} jours - Quantité: ${item.quantity} - Prix unitaire: ${item.price} DH - Total: ${lineTotal} DH`
        }),
        '',
        `Total panier : ${this.total} DH`,
        '',
        'Merci.'
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
            if (!this.hasValidEmail) {
              this.showMessage('Veuillez entrer une adresse email valide.', 'error')
              throw new Error('Customer email is required')
            }
            const response = await axios.post(
              `${process.env.VUE_APP_API_URL}/api/paypal/create-order`,
              {
                cart: this.cartPayload,
                customer: this.customerPayload,
              }
            )

            this.pendingOrderId = response.data.orderId

            return response.data.id
          } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erreur lors de la création de la commande PayPal.'
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
          this.showMessage('Une erreur PayPal est survenue.', 'error')
        },

        onCancel: () => {
          this.showMessage('Paiement annulé.')
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
.cart-page {
  max-width: 1100px;
}

.empty-cart,
.summary-card {
  background: #f7f4f1;
}

.cart-item {
  background: white;
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
</style>
