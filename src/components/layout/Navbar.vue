<template>
    <v-app-bar app elevation="0" color="white" height="72" class="navbar">
        <v-container class="nav-wrapper d-flex align-center justify-space-between">
            <!-- MOBILE LEFT -->
            <div class="d-flex d-md-none align-center">
                <v-btn icon variant="text" @click="drawer = !drawer">
                    <v-icon size="30">
                        {{ drawer ? 'mdi-close' : 'mdi-menu' }}
                    </v-icon>
                </v-btn>
            </div>

            <!-- DESKTOP LEFT LOGO -->
            <div class="d-none d-md-flex align-center">
                <router-link to="/" class="text-decoration-none logo-link">
                    <v-img :src="logo" alt="SafarSim" height="40" width="130" contain />
                </router-link>
            </div>

            <!-- DESKTOP CENTER LINKS -->
            <div class="d-none d-md-flex nav-links">
                <router-link class="text-decoration-none text-black" to="/destinations">
                    <v-btn variant="text">Destinations</v-btn>
                </router-link>

                <router-link class="text-decoration-none text-black" to="/compatibility">
                    <v-btn variant="text">Compatibilité eSIM</v-btn>
                </router-link>

                <router-link class="text-decoration-none text-black" to="/">
                    <v-btn variant="text">Aide</v-btn>
                </router-link>
            </div>

            <!-- MOBILE CENTER LOGO -->
            <div class="mobile-logo d-flex d-md-none">
                <router-link to="/" class="logo-link">
                    <v-img :src="logo" alt="SafarSim" height="40" width="130" contain />
                </router-link>
            </div>

            <!-- RIGHT CART -->
            <div class="d-flex align-center">
                <v-menu location="bottom end">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="text" icon class="">
                            <v-icon  class="">mdi-web</v-icon>
                        </v-btn>
                    </template>

                    <v-list density="compact">
                        <v-list-item @click="setLang('fr')">
                            <v-list-item-title>Français</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="setLang('ar')">
                            <v-list-item-title>العربية</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                
                <router-link to="/cart" class="cart-link">
                    <v-badge :model-value="cartCount > 0" :content="cartCount" color="pink" location="top right"
                        offset-x="2" offset-y="2">
                        <v-btn icon variant="text">
                            <v-icon size="28">mdi-cart-outline</v-icon>
                        </v-btn>
                    </v-badge>
                </router-link>
            </div>
        </v-container>
    </v-app-bar>
    <v-expand-transition>
        <div v-if="drawer" class="mobile-menu">

            <div class="menu-search">
                <DestinationSearch :destinations="destinations" :popularDestinations="popularDestinations"
                    @select="goToDestination" />
            </div>

            <router-link to="/destinations" class="menu-item" @click="drawer = false">
                <span>Destinations</span>
                <v-icon>mdi-arrow-right</v-icon>
            </router-link>

            <router-link to="/compatibility" class="menu-item" @click="drawer = false">
                <span>Compatibilité eSIM</span>
                <v-icon>mdi-arrow-right</v-icon>
            </router-link>

            <router-link to="/help" class="menu-item" @click="drawer = false">
                <span>Aide</span>
                <v-icon>mdi-arrow-right</v-icon>
            </router-link>

        </div>
    </v-expand-transition>
</template>

<script>
import { getCartCount, CART_UPDATED_EVENT } from '@/utils/cart'
import DestinationSearch from '@/components/DestinationSearchBar.vue'
import destinations from "@/data/destinations.json";
import PopularDestinations from "@/data/popularDestinations.json";
import { applyLanguage } from "@/i18n";

import logo from '@/assets/logo.png'

export default {
    name: 'AppHeader',
    components: {
        DestinationSearch,
    },
    computed: {
        currentLang() {
            return this.$i18n.locale
        }
    },

    data() {
        return {
            logo: logo,
            cartCount: 0,
            drawer: false,
            destinations: destinations,
            popularDestinations: PopularDestinations,
        }
    },

    methods: {
        refreshCartCount() {
            this.cartCount = getCartCount()
        },
        goToDestination(destination) {
            this.drawer = false
            this.$router.push({ name: "destinationDetails", params: { slug: destination.slug } })
        },
        setLang(lang) {
            applyLanguage(lang)
        }
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

.navbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-wrapper {
    position: relative;
}

.nav-links {
    gap: 8px;
}

.mobile-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
}

@media (max-width: 959px) {
    .mobile-logo .text-h6 {
        font-size: 1.55rem !important;
        letter-spacing: 0.3px;
    }
}

.mobile-menu {
    position: fixed;
    top: 72px;
    left: 0;
    width: 100%;
    height: calc(100vh - 72px);
    background: white;
    z-index: 2000;
    overflow-y: auto;
}

.menu-search {
    padding: 16px;
}

.menu-item {
    min-height: 70px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    color: #1f2940;
    font-size: 1.25rem;
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>