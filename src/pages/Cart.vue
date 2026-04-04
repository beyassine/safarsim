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

          <v-divider class="mb-4" />

          <v-btn block prepend-icon="mdi-whatsapp" color="green-darken-1" size="large" rounded="pill"
            class="text-none font-weight-bold mb-3" @click="checkout">
            Continuer par WhatsApp
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getCart,
  getCartTotal,
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
    }
  },

  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    },

    total() {
      return this.subtotal
    },
  },

  methods: {
    refreshCart() {
      this.cart = getCart()
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
    checkout() {
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
    }
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

.flag-emoji {
  font-size: 2rem;
  line-height: 1;
}

.quantity-box {
  border-radius: 999px;
}
</style>