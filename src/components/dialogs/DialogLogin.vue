<script setup lang="ts">
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { SettingIdEnum, TableEnum } from '@/shared/enums'
import { useSettingsStore } from '@/stores/settings'
import { ref } from 'vue'

const settingsStore = useSettingsStore()

const text = ref('')

async function onCloseLoginDialog() {
  await localDatabase.table(TableEnum.SETTINGS).put({
    id: SettingIdEnum.LOGIN_DIALOG,
    value: false,
  })
}
</script>

<template>
  <q-dialog
    :model-value="Boolean(settingsStore.loginDialog)"
    @update:model-value="
      localDatabase.table(TableEnum.SETTINGS).put({
        id: SettingIdEnum.LOGIN_DIALOG,
        value: true,
      })
    "
    persistent
    v-on:keyup.enter="onCloseLoginDialog()"
  >
    <q-card flat bordered class="auth-dialog-width">
      <q-card-section class="text-h6"> {{ appTitle }} </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Project URL" />
      </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Project Anon API Key" />
      </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Email" />
      </q-card-section>

      <q-card-section>
        <q-input outlined v-model="text" label="Password" />
      </q-card-section>

      <q-card-actions vertical class="q-mt-md">
        <q-btn no-caps color="primary" size="lg" label="Login" @click="onCloseLoginDialog()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.auth-dialog-width {
  width: 500px;
}
</style>
