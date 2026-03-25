<template>
    <v-app-bar elevation="0" color="white">

        <v-container class="d-flex align-center justify-space-between">
            
            <router-link to="/" class="text-decoration-none logo-link">
            <div class="text-h6 font-weight-bold text-pink-darken-1">   
                SAFAR SIM
            </div>
            </router-link>

            <div class="d-none d-md-flex">
                <router-link class="text-decoration-none text-black" to="/destinations">
                    <v-btn variant="text">Destinations</v-btn>
                </router-link>
                <router-link class="text-decoration-none text-black" to="/">
                    <v-btn variant="text">Comment ca marche ? </v-btn>
                </router-link>
                <router-link class="text-decoration-none text-black" to="/">
                    <v-btn variant="text">Aide</v-btn>
                </router-link>
            </div>
            <router-link to="/cart" class="cart-link">
                <v-badge :model-value="cartCount > 0" :content="cartCount" color="pink" location="top right" offset-x="2" offset-y="2">
                    <v-btn icon variant="text">
                        <v-icon size="28">mdi-cart-outline</v-icon>
                    </v-btn>
                </v-badge>
            </router-link>
        </v-container>

    </v-app-bar>
</template>

<script>
import { getCartCount, CART_UPDATED_EVENT } from '@/utils/cart'

export default {
    name: 'AppHeader',

    data() {
        return {
            cartCount: 0,
        }
    },

    methods: {
        refreshCartCount() {
            this.cartCount = getCartCount()
        },
    },

    mounted() {
        this.refreshCartCount()
        window.addEventListener(CART_UPDATED_EVENT, this.refreshCartCount)
        window.addEventListener('storage', this.refreshCartCount)
    },

    beforeUnmount() {
        window.removeEventListener(CART_UPDATED_EVENT, this.refreshCartCount)
        window.removeEventListener('storage', this.refreshCartCount)
    },
}
</script>

<style scoped>
.logo-link,
.cart-link {
    text-decoration: none;
    color: inherit;
}

.logo-text {
    font-size: 2rem;
    font-weight: 800;
    color: #d81b60;
    letter-spacing: 0.5px;
}
</style>