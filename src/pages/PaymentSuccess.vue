<template>
  <v-container class="payment-success py-10">
    <v-sheet rounded="xl" class="success-panel pa-6 pa-md-8">
      <v-icon size="56" color="green-darken-1" class="mb-4">
        mdi-check-circle
      </v-icon>

      <h1 class="text-h4 font-weight-bold mb-3">
        {{ $t("paymentSuccess.title") }}
      </h1>

      <p class="text-body-1 text-medium-emphasis mb-6">
        {{ $t("paymentSuccess.text") }}
      </p>

      <v-alert v-if="verificationError" type="warning" variant="tonal" class="mb-6">
        {{ verificationError }}
      </v-alert>

      <div v-if="orderId" class="order-reference pa-4 mb-6">
        <div class="text-caption text-medium-emphasis mb-1">
          {{ $t("paymentSuccess.orderReference") }}
        </div>
        <div class="font-weight-bold">
          {{ orderId }}
        </div>
      </div>

      <div class="d-flex flex-wrap ga-3">
        <v-btn color="black" rounded="pill" class="text-none" to="/">
          {{ $t("paymentSuccess.viewDestinations") }}
        </v-btn>

        <v-btn variant="outlined" rounded="pill" class="text-none" to="/contact">
          {{ $t("paymentSuccess.contact") }}
        </v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>

<script>
import { clearCart, getCart } from '@/utils/cart'
import { posthog } from '@/services/posthog'

export default {
  name: 'PaymentSuccess',

  data() {
    return {
      verificationError: '',
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
        throw new Error(result.error || 'Unable to verify payment')
      }
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
      console.error('Payment verification failed', error)
      this.verificationError = error.message
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
