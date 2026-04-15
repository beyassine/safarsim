import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Destination from "../pages/Destination.vue"
import allDestinations from "../pages/allDestinations.vue"
import Region from "../pages/Region.vue"
import Cart from "../pages/Cart.vue"
import Compatibility from "../pages/compatibilityPage.vue"
import Help from "../pages/Help.vue"
import Princg from "../pages/PricingPage.vue"
import PrivacyPolicy from "@/pages/PrivacyPolicy.vue"
import RefundPolicy from "@/pages/RefundPolicy.vue"
import TermsOfService from "@/pages/TermsOfService.vue"


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/destinations",
    name: "allDestinations",
    component: allDestinations
  },
  {
    path: "/destinations/:slug",
    name: "destinationDetails",
    component: Destination
  },
  {
    path: "/regions/:slug",
    name: "regionDetails",
    component: Region
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart
  },
  {
    path: "/compatibility",
    name: "compatibility",
    component: Compatibility,
  },
  {
    path: "/help",
    name: "help",
    component: Help,
  },
  {
    path: "/pricing",
    name: "pricing",
    component: Princg,
  },
  {
    path: "/privacy-policy",
    name: "privacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/refund-policy",
    name: "refundPolicy",
    component: RefundPolicy,
  },
  {
    path: "/terms-of-service",
    name: "termsOfService",
    component: TermsOfService,
  },
]


export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})