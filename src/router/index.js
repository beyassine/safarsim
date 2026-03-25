import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Destination from "../pages/Destination.vue"
import allDestinations from "../pages/allDestinations.vue"
import Cart from "../pages/Cart.vue"

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
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})