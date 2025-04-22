<script setup lang="ts">
import { compactDateFromISODate } from '@/shared/utils'
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
    <div v-if="value">
      {{ compactDateFromISODate(value) }}
    </div>

    <div v-else class="text-italic text-secondary">-empty-</div>
  </BaseInspectItem>
</template>
