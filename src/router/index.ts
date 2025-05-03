import LayoutEmpty from '@/layouts/LayoutEmpty.vue'
import LayoutMenu from '@/layouts/LayoutMenu.vue'
import { localDatabase } from '@/services/local-database'
import { LocalTableEnum, RouteNameEnum, SettingIdEnum } from '@/shared/enums'
import { useBackendStore } from '@/stores/backend'
import ViewDashboard from '@/views/ViewDashboard.vue'
import ViewSettings from '@/views/ViewSettings.vue'
import { createRouter, createWebHistory } from 'vue-router'

const publicRoutes = [RouteNameEnum.DASHBOARD, RouteNameEnum.SETTINGS, RouteNameEnum.NOT_FOUND]

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

router.beforeEach(async (to, from, next) => {
  const backendStore = useBackendStore()

  const requiresAuth = !publicRoutes.includes(to.name as RouteNameEnum)

  if (!backendStore.isAuthenticated && requiresAuth) {
    // Open login dialog
    await localDatabase.table(LocalTableEnum.SETTINGS).put({
      id: SettingIdEnum.LOGIN_DIALOG,
      value: true,
    })

    next()
  } else {
    // User is authenticated or route doesn't require auth
    next()
  }
})

export default router
