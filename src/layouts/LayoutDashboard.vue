<script setup lang="ts">
import useRouting from '@/composables/useRouting'
import { appTitle } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { arrowBackIcon, settingsIcon } from '@/shared/icons'
import PageResponsiveRouterView from './base/PageResponsiveRouterView.vue'

const { goBack } = useRouting()
</script>

<template>
  <q-layout view="hHh lpr lfr">
    <q-header bordered class="row justify-center">
      <q-toolbar class="page-width-limit bg-primary text-white">
        <q-toolbar-title>
          <span @click="$router.push({ name: RouteNameEnum.DASHBOARD })" class="cursor-pointer">
            {{ appTitle }}
          </span>
        </q-toolbar-title>

        <q-btn
          v-show="$route.name !== RouteNameEnum.DASHBOARD"
          flat
          round
          :icon="arrowBackIcon"
          @click="goBack()"
        />
        <q-btn
          v-show="$route.name === RouteNameEnum.DASHBOARD"
          flat
          round
          :icon="settingsIcon"
          :to="{ name: RouteNameEnum.SETTINGS }"
        />
      </q-toolbar>
    </q-header>

    <PageResponsiveRouterView />
  </q-layout>
</template>
