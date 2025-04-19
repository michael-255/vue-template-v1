<script setup lang="ts">
defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <q-toolbar class="bg-transparent text-white q-pr-none">
    <q-toolbar-title>
      <q-icon class="on-left q-pb-xs" :name="icon" />
      {{ title }}
    </q-toolbar-title>
  </q-toolbar>

  <q-separator class="q-mb-md" />
</template>
