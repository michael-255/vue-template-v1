<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import { appTitle } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import {
  donatePageIcon,
  examplesPageIcon,
  gridIcon,
  logsTableIcon,
  settingsIcon,
} from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Dashboard` })

const dashboardButtons = [
  {
    label: 'Settings',
    icon: settingsIcon,
    color: 'secondary',
    route: { name: RouteNameEnum.SETTINGS },
  },
  {
    label: 'Examples',
    icon: examplesPageIcon,
    color: 'primary',
    route: { name: RouteNameEnum.EXAMPLE },
  },
  {
    label: 'Budget',
    icon: donatePageIcon,
    color: 'positive',
    route: { name: RouteNameEnum.EXAMPLE },
  },
  {
    label: 'Fitness',
    icon: logsTableIcon,
    color: 'negative',
    route: { name: RouteNameEnum.EXAMPLE },
  },
]
</script>

<template>
  <PageHeading :icon="gridIcon" title="Dashboard" />

  <div class="row q-col-gutter-md q-pa-sm">
    <div class="col-6" v-for="button in dashboardButtons" :key="button.label">
      <q-btn
        class="dashboard-btn full-width q-py-lg"
        stack
        glossy
        no-caps
        :color="button.color"
        :to="button.route"
      >
        <q-icon :name="button.icon" size="4rem" />
        <div class="q-mt-sm text-h6">{{ button.label }}</div>
      </q-btn>
    </div>
  </div>
</template>

<style scoped>
.dashboard-btn {
  height: 280;
  border-radius: 8px;
}
</style>
