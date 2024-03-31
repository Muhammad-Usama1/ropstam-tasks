import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import Cookies from "js-cookie";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
  routes: [
    {
      path: "/",
      name: "signin",
      component: () => import("@/pages/signin/index.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/pages/signup/index.vue"),
    },
    {
      path: "/dashboard",
      redirect: "dashboard",
      meta: { requiresAuth: true }, // Add meta field for route guard
      component: () => import("@/pages/index.vue"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/pages/dashboard/index.vue"),
          meta: { requiresAuth: true }, // Add meta field for route guard
        },
        {
          path: "/category",
          name: "category",
          component: () => import("@/pages/categories/index.vue"),
          meta: { requiresAuth: true }, // Add meta field for route guard
        },
        {
          path: "/details",
          name: "vehicle-details",
          component: () => import("@/pages/vehicles/index.vue"),
          meta: { requiresAuth: true }, // Add meta field for route guard
        },
        {
          path: "/user-list",
          name: "users",
          component: () => import("@/pages/users/index.vue"),
          meta: { requiresAuth: true }, // Add meta field for route guard
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash };
    }
    return { left: 0, top: 0, behavior: "smooth" };
  },
});

// Route guard for checking authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = Cookies.get("token");
    if (!token) {
      next({
        name: "signin", // Redirect to signin page if token is not present
        query: { redirect: "/" }, // Pass the original path as query parameter
      });
    } else {
      next(); // Continue to the requested route
    }
  } else {
    next(); // Continue to the requested route
  }
});

export default router;
