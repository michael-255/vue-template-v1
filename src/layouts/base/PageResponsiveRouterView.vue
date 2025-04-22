<script setup lang="ts">
import { topOfPageIcon } from '@/shared/icons'

/**
 * Responsive page with a page scroller. Additional bottom margin is added to the page content to
 * make more room for the scroller. Normally only used with layouts.
 */
</script>

<template>
  <q-page-container>
    <q-page padding>
      <div class="row justify-center">
        <div class="page-width-limit">
          <RouterView />
        </div>
      </div>

      <q-page-scroller position="bottom">
        <q-btn fab glossy :icon="topOfPageIcon" color="accent" />
      </q-page-scroller>
    </q-page>
  </q-page-container>
</template>
