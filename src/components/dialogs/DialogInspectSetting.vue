<script setup lang="ts">
import { closeIcon, inspectIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'
import InspectItemText from './base/InspectItemText.vue'

defineProps<{
  record: Record<string, any>
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
</script>

<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
    @hide="onDialogHide()"
  >
    <q-toolbar class="bg-info text-white toolbar-height">
      <q-icon :name="inspectIcon" size="sm" class="q-mx-sm" />
      <q-toolbar-title>Inspect Setting</q-toolbar-title>
      <q-btn flat round :icon="closeIcon" @click="onDialogCancel()" />
    </q-toolbar>

    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="row justify-center">
          <div class="page-width-limit">
            <q-list padding>
              <div v-if="record">
                <InspectItemText label="Id" field="id" :record />
                <InspectItemText label="Value" field="value" :record />
              </div>
            </q-list>
            <div class="q-mt-xl" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.toolbar-height {
  max-height: 50px;
}
</style>
