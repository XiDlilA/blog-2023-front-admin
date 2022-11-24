import { createRouter, createWebHistory } from "vue-router";
import type { Router } from "vue-router";
import type { App } from "vue";
import guard from "@/router/guard";
const history = createWebHistory(import.meta.env.BASE_URL);
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/home/home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/index.vue"),
  },
];
let router = createRouter({
  history: history,
  routes: routes,
});

export function resetRouter() {
  let newRouter: Router;
  newRouter = createRouter({
    history: history,
    routes: routes,
  });
  router = newRouter;
}

export function setupRouter(app: App) {
  guard(router);
  app.use(router);
}

export default router;
