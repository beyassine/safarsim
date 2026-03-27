import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Destination from "../pages/Destination.vue"
import allDestinations from "../pages/allDestinations.vue"
import Cart from "../pages/Cart.vue"
import Compatibility from "../pages/compatibilityPage.vue"
import Help from "../pages/Help.vue"

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
  }
]


export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})