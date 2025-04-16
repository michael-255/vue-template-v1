import LayoutMenu from '@/layouts/LayoutMenu.vue'
import { RouteNameEnum } from '@/shared/enums'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: `/home`, // Your default route
      name: RouteNameEnum.MENU_LAYOUT,
      component: LayoutMenu,
      children: [
        {
          path: '/home',
          name: RouteNameEnum.DASHBOARD,
          component: HomeView,
        },
      ],
    },
  ],
})

export default router
