<script setup lang="ts">
import useRouting from '@/composables/useRouting'
import { appTitle } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { arrowBackIcon, settingsIcon } from '@/shared/icons'

const { goBack } = useRouting()
</script>

<template>
  <q-layout view="hHh lpr lfr">
    <q-toolbar class="layout-header-height bg-primary text-white shadow-1">
      <q-btn
        v-show="$route.name !== RouteNameEnum.DASHBOARD"
        flat
        round
        :icon="arrowBackIcon"
        @click="goBack"
      />
      <q-btn
        v-show="$route.name === RouteNameEnum.DASHBOARD"
        flat
        round
        :icon="settingsIcon"
        :to="{ name: RouteNameEnum.SETTINGS }"
      />

      <q-separator vertical inset class="q-mx-sm" />

      <q-toolbar-title>
        <span @click="$router.push({ name: RouteNameEnum.DASHBOARD })" class="cursor-pointer">
          {{ appTitle }}
        </span>
      </q-toolbar-title>
    </q-toolbar>

    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>
