import LayoutEmpty from '@/layouts/LayoutEmpty.vue'
import LayoutMenu from '@/layouts/LayoutMenu.vue'
import { RouteNameEnum } from '@/shared/enums'
import ViewDashboard from '@/views/ViewDashboard.vue'
import ViewSettings from '@/views/ViewSettings.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutEmpty,
      children: [
        {
          path: '/',
          name: RouteNameEnum.DASHBOARD,
          component: ViewDashboard,
        },
        {
          path: '/settings',
          name: RouteNameEnum.SETTINGS,
          component: ViewSettings,
        },
        {
          path: '/:pathMatch(.*)*', // 404 Not Found. Part of default route path.
          name: RouteNameEnum.NOT_FOUND,
          component: () => import('@/views/ViewNotFound.vue'),
        },
      ],
    },
    {
      path: '/example',
      component: LayoutMenu,
      children: [
        {
          path: '/example',
          name: RouteNameEnum.EXAMPLE,
          component: () => import('@/views/example/ViewExampleHome.vue'),
        },
      ],
    },
    // Fullscreen tables cannot use layouts
    {
      path: '/settings-table',
      name: RouteNameEnum.SETTINGS_TABLE,
      component: () => import('@/views/ViewTableSettings.vue'),
    },
    {
      path: '/logs-table',
      name: RouteNameEnum.LOGS_TABLE,
      component: () => import('@/views/ViewTableLogs.vue'),
    },
  ],
})

export default router
