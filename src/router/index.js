import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Destination from "../pages/Destination.vue"

const routes = [
  {
    path: "/",
    component: Home
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