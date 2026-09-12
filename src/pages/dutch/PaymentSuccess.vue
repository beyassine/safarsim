<template>
  <v-container class="payment-success py-10">
    <v-sheet rounded="xl" class="success-panel pa-6 pa-md-8">
      <v-icon size="56" color="green-darken-1" class="mb-4">
        mdi-check-circle
      </v-icon>

      <h1 class="text-h4 font-weight-bold mb-3"> Betaling bevestigd </h1>

      <p class="text-body-1 text-medium-emphasis mb-6"> Bedankt voor je bestelling. We verwerken je eSIM zo snel mogelijk. </p>

      <p v-if="customerEmail" class="text-body-1 font-weight-medium mb-6"> Je ontvangt je eSIM direct per e-mail op {{ customerEmail }}.
      </p>

      <div v-if="orderId" class="order-reference pa-4 mb-6">
        <div class="text-caption text-medium-emphasis mb-1"> Bestelnummer </div>
        <div class="font-weight-bold">
          {{ orderId }}
        </div>
      </div>

      <div class="d-flex flex-wrap ga-3">
        <v-btn color="black" rounded="pill" class="text-none" to="/nl/"> Bekijk bestemmingen </v-btn>

        <v-btn variant="outlined" rounded="pill" class="text-none" to="/nl/contact"> Neem contact op </v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>

<script>
import { clearCart, getCart } from '@/utils/cart'
import { posthog } from '@/services/posthog'
import { trackVerifiedPurchase } from '@/services/googleAds'

export default {
  name: 'PaymentSuccess',

  data() {
    return {
      customerEmail: '',
      paymentCaptured: false,
    }
  },

  computed: {
    orderId() {
      return this.$route.query.orderId || this.$route.query.session_id || ''
    },
  },

  async mounted() {
    const sessionId = this.$route.query.session_id
    if (!sessionId) return

    try {
      const apiUrl = String(
        process.env.VUE_APP_STRIPE_API_URL || 'https://safar-stripe.vercel.app'
      ).replace(/\/$/, '')
      const response = await fetch(`${apiUrl}/api/checkout/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.paid) {
        throw new Error(result.error || "Betaling kan niet worden gecontroleerd")
      }
      trackVerifiedPurchase(result)
      this.customerEmail = result.customerEmail || ''
      if (!this.paymentCaptured) {
        const completedCart = getCart()
        posthog.capture('payment_completed', {
          cart_item_count: completedCart.reduce((count, item) => count + Number(item.quantity || 1), 0),
          currency: completedCart[0]?.currency || null,
        })
        this.paymentCaptured = true
        clearCart()
      }
    } catch (error) {
      console.error("Controle van de betaling mislukt", error)
    }
  },
}
</script>

<style scoped>
.payment-success {
  max-width: 760px;
}

.success-panel {
  background: #f7f4f1;
}

.order-reference {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: white;
  overflow-wrap: anywhere;
}
</style>
