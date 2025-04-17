<script setup lang="ts">
import PageResponsive from '@/components/page/PageResponsive.vue'
import { RouteNameEnum } from '@/shared/enums'
</script>

<template>
  <page-responsive>
    <h5>Dashboard</h5>

    <q-btn
      color="primary"
      label="Go to Example"
      :to="{ name: RouteNameEnum.EXAMPLE }"
      class="q-mt-md"
    ></q-btn>
  </page-responsive>
</template>
