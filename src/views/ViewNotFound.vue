<script setup lang="ts">
import { appTitle } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | 404 Not Found` })
</script>

<template>
  <div class="q-mt-md q-ml-md">
    <div class="q-mb-lg">
      <span class="text-h3 q-mr-sm">404</span>
      <span class="text-h6 q-ml-sm">Page Not Found</span>
    </div>
  </div>
</template>
