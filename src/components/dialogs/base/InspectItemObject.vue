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
    <div v-if="value && Object.keys(value).length > 0">
      <div v-for="(v, k) in value" :key="k">
        <span class="text-amber">{{ k }}:</span> {{ v }}
      </div>
    </div>

    <div v-else class="text-italic text-secondary">-empty-</div>
  </BaseInspectItem>
</template>
