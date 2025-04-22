<script setup lang="ts">
import { computed } from 'vue'
import BaseInspectItem from './BaseInspectItem.vue'

const props = defineProps<{
  label: string
  field: string
  record: Record<string, any>
}>()

const value = computed(() => {
  return props.record[props.field]
})
</script>

<template>
  <BaseInspectItem :label="label">
    <ul v-if="value && value?.length > 0" class="q-pl-sm q-my-none">
      <li v-for="x in value" :key="x" class="q-ml-sm">
        {{ x }}
      </li>
    </ul>

    <div v-else class="text-italic text-secondary">-empty-</div>
  </BaseInspectItem>
</template>
