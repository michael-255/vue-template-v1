<script setup lang="ts">
import { RouteNameEnum } from '@/shared/enums'
import { errorIcon, examplesPageIcon, gridIcon, infoIcon, warnIcon } from '@/shared/icons'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import PageResponsiveRouterView from './base/PageResponsiveRouterView.vue'

const $q = useQuasar()
const isDesktop = computed(() => $q.screen.gt.xs)
</script>

<template>
  <q-layout view="hHh lpr lfr">
    <q-header bordered>
      <q-tabs class="text-caption" active-color="yellow" outside-arrows mobile-arrows>
        <q-route-tab no-caps :icon="examplesPageIcon" exact :to="{ name: RouteNameEnum.EXAMPLE }">
          <template v-if="isDesktop">Examples</template>
        </q-route-tab>

        <q-route-tab no-caps :icon="infoIcon" exact :to="{ name: RouteNameEnum.EXAMPLE }">
          <template v-if="isDesktop">Information</template>
        </q-route-tab>

        <q-route-tab no-caps :icon="warnIcon" exact :to="{ name: RouteNameEnum.EXAMPLE }">
          <template v-if="isDesktop">Warnings</template>
        </q-route-tab>

        <q-route-tab no-caps :icon="errorIcon" exact :to="{ name: RouteNameEnum.EXAMPLE }">
          <template v-if="isDesktop">Errors</template>
        </q-route-tab>

        <q-route-tab :icon="gridIcon" no-caps exact :to="{ name: RouteNameEnum.DASHBOARD }">
          <template v-if="isDesktop">Dashboard</template>
        </q-route-tab>
      </q-tabs>
    </q-header>

    <PageResponsiveRouterView />
  </q-layout>
</template>
