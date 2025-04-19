<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import { appTitle } from '@/shared/constants'
import { examplesPageIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Examples` })
</script>

<template>
  <PageHeading :icon="examplesPageIcon" title="Examples" />

  <p v-for="i in 25" :key="i">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic nihil pariatur doloremque ab,
    perferendis aperiam unde odit minus sed earum, incidunt, atque ullam vel animi necessitatibus
    consequatur dolores! Ducimus, quam.
  </p>
</template>
