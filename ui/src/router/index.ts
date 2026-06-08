import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: () => import('@/views/Home.vue'),
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
    },
    {
      name: 'DashboardProject',
      path: '/dashboard/projects/:projectId',
      component: () => import('@/views/Dashboard.vue'),
      props: true,
    },
    {
      name: 'Register',
      path: '/register',
      component: () => import('@/views/Register.vue'),
    },
    {
      name: 'Error404',
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/Error404.vue'),
    },
  ],
})

export default router
