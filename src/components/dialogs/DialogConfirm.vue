<script setup lang="ts">
import { lockIcon, unlockIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

const props = defineProps<{
  title: string
  message: string
  color: string
  icon: string
  requiresUnlock: boolean
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const toggle = ref(false)
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" v-on:keyup.enter="onDialogOK">
    <q-card class="q-dialog-plugin">
      <q-card-section :class="`bg-${props.color} text-white q-pt-sm q-pb-xs`">
        <q-icon :name="icon" size="sm" class="q-pb-sm q-mr-md" />
        <span class="text-h6">{{ title }}</span>
      </q-card-section>

      <q-card-section class="q-mt-lg">{{ message }}</q-card-section>

      <q-card-section v-if="requiresUnlock">
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Unlock Required</q-item-label>
            <q-item-label caption> Toggle this operation on to proceed. </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle
              v-model="toggle"
              :color="color"
              size="xl"
              :unchecked-icon="lockIcon"
              :checked-icon="unlockIcon"
            />
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="onDialogCancel" />
        <q-btn
          v-if="requiresUnlock"
          :disable="!toggle"
          flat
          label="Confirm"
          :color="toggle ? 'negative' : 'grey'"
          @click="onDialogOK"
        />
        <q-btn v-else flat label="Confirm" :color="color" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
