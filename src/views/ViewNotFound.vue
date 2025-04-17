<script setup lang="ts">
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appTitle } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} - 404 Not Found` })
</script>

<template>
  <page-responsive>
    <div class="q-mt-md q-ml-md">
      <div class="q-mb-lg">
        <span class="text-h3 q-mr-sm">404</span>
        <span class="text-h6 q-ml-sm">Page Not Found</span>
      </div>
    </div>
  </page-responsive>
</template>
