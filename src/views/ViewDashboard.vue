<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import { appTitle } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { donatePageIcon, examplesPageIcon, gridIcon, settingsIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Dashboard` })

const dashboardButtons = [
  {
    label: 'Settings',
    icon: settingsIcon,
    color: 'primary',
    route: { name: RouteNameEnum.SETTINGS },
  },
  {
    label: 'Reports',
    icon: examplesPageIcon,
    color: 'secondary',
    route: { name: RouteNameEnum.EXAMPLE },
  },
  {
    label: 'Donate',
    icon: donatePageIcon,
    color: 'accent',
    route: { name: RouteNameEnum.EXAMPLE },
  },
  {
    label: 'Fitness',
    icon: gridIcon,
    color: 'positive',
    route: { name: RouteNameEnum.EXAMPLE },
  },
]
</script>

<template>
  <PageHeading :icon="gridIcon" title="Dashboard" />

  <div class="row q-col-gutter-md">
    <div class="col-6" v-for="button in dashboardButtons" :key="button.label">
      <q-btn
        class="dashboard-btn full-width q-py-lg"
        glossy
        stack
        no-caps
        :color="button.color"
        :to="button.route"
      >
        <q-icon :name="button.icon" size="5rem" />
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
