<script setup lang="ts">
import { computed } from 'vue'
import BaseInspectItem from './BaseInspectItem.vue'

const props = defineProps<{
  label: string
  field: string
  record: Record<string, any>
  newlinesToBr?: boolean
}>()

const value = computed(() => {
  if (props?.newlinesToBr) {
    return props.record[props.field].split('\n')
  }
  return props.record[props.field]
})
</script>

<template>
  <BaseInspectItem :label="label">
    <div v-if="value === true" class="text-weight-bold text-positive">Yes</div>

    <div v-else-if="value === false" class="text-weight-bold text-negative">No</div>

    <div v-else-if="value && newlinesToBr">
      <div v-for="line in value" :key="line">{{ line }}<br /></div>
    </div>

    <div v-else-if="value">{{ value }}</div>

    <div v-else class="text-italic text-secondary">-empty-</div>
  </BaseInspectItem>
</template>
