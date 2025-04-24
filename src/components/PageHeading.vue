<script setup lang="ts">
defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <q-toolbar class="q-pr-xs">
    <q-toolbar-title>
      <q-icon class="on-left q-pb-xs" :name="icon" />
      {{ title }}
    </q-toolbar-title>

    <slot />
  </q-toolbar>

  <q-separator class="q-mb-sm" />
</template>
