<script setup lang="ts">
import useRouting from '@/composables/useRouting'
import { arrowBackIcon } from '@/shared/icons'

defineProps<{
  icon: string
  title: string
  goBackBtn?: boolean
}>()

const { goBack } = useRouting()
</script>

<template>
  <q-toolbar class="bg-transparent text-white">
    <q-toolbar-title>
      <q-icon class="on-left q-pb-xs" :name="icon" />
      {{ title }}
    </q-toolbar-title>

    <q-btn v-if="goBackBtn" flat round :icon="arrowBackIcon" @click="goBack()" />
  </q-toolbar>

  <q-separator class="q-mb-sm" />
</template>
