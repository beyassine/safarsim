<template>
  <v-container class="payment-success py-10">
    <v-sheet rounded="xl" class="success-panel pa-6 pa-md-8">
      <v-icon size="56" color="green-darken-1" class="mb-4">
        mdi-check-circle
      </v-icon>

      <h1 class="text-h4 font-weight-bold mb-3">
        Paiement confirmé
      </h1>

      <p class="text-body-1 text-medium-emphasis mb-6">
        Merci pour votre commande. Nous allons traiter votre eSIM rapidement.
      </p>

      <div v-if="orderId" class="order-reference pa-4 mb-6">
        <div class="text-caption text-medium-emphasis mb-1">
          Référence commande
        </div>
        <div class="font-weight-bold">
          {{ orderId }}
        </div>
      </div>

      <div class="d-flex flex-wrap ga-3">
        <v-btn color="black" rounded="pill" class="text-none" to="/">
          Voir les destinations
        </v-btn>

        <v-btn variant="outlined" rounded="pill" class="text-none" to="/contact">
          Nous contacter
        </v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'PaymentSuccess',

  computed: {
    orderId() {
      return this.$route.query.orderId || ''
    },
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
