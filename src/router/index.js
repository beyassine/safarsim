import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Destination from "../pages/Destination.vue"
import allDestinations from "../pages/allDestinations.vue"

const routes = [
  {
    path: "/",
    component: Home
  },  
  {
    path: "/destinations",
    component: allDestinations
  },
  {
    path: "/esim/:country",
    name: "Destination",
    component: Destination
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})