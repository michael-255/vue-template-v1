<script setup lang="ts">
import { RouteNameEnum } from '@/shared/enums'
</script>

<template>
  <h5>Dashboard</h5>

  <q-btn
    color="primary"
    label="Go to Example"
    :to="{ name: RouteNameEnum.EXAMPLE }"
    class="q-mt-md"
  />

  <p v-for="i in 25" :key="i">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic nihil pariatur doloremque ab,
    perferendis aperiam unde odit minus sed earum, incidunt, atque ullam vel animi necessitatibus
    consequatur dolores! Ducimus, quam.
  </p>
</template>
