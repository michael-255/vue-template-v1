<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { SettingIdEnum, TableEnum } from '@/shared/enums'
import { emailSchema, urlSchema } from '@/shared/schemas'
import { useBackendStore } from '@/stores/backend'
import { useSettingsStore } from '@/stores/settings'
import { QSpinnerGears, useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()
const { log } = useLogger()
const settingsStore = useSettingsStore()
const backendStore = useBackendStore()

const password = ref('')
const isFormValid = ref(true)

/**
 *
 */
async function onLogin() {
  try {
    $q.loading.show({
      message: 'Authenticating',
      spinner: QSpinnerGears,
    })

    await backendStore.login(settingsStore.userEmail, password.value)

    log.info('Login successful', {
      userEmail: settingsStore.userEmail,
      userId: backendStore.user?.id,
    })

    // Close the login dialog
    await localDatabase.table(TableEnum.SETTINGS).put({
      id: SettingIdEnum.LOGIN_DIALOG,
      value: false,
    })
  } catch (error) {
    log.error('Error logging in', error as Error)
  } finally {
    password.value = '' // Clear password field after login attempt
    $q.loading.hide()
  }
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
    v-on:keyup.enter="onLogin()"
  >
    <q-card flat bordered class="auth-dialog-width">
      <q-form
        @submit.prevent="onLogin()"
        @validation-error="isFormValid = false"
        @validation-success="isFormValid = true"
      >
        <q-card-section class="text-h6"> {{ appTitle }} </q-card-section>

        <q-card-section>
          <q-input
            outlined
            :model-value="settingsStore.projectUrl"
            @update:model-value="
              localDatabase.table(TableEnum.SETTINGS).put({
                id: SettingIdEnum.PROJECT_URL,
                value: $event,
              })
            "
            :rules="[
              (val: string) => val?.length > 0 || 'Project URL is required',
              (val: string) => urlSchema.safeParse(val).success || 'Project URL is not valid',
            ]"
            :disable="$q.loading.isActive"
            type="text"
            label="Project URL"
          />

          <q-input
            outlined
            :model-value="settingsStore.projectApiKey"
            @update:model-value="
              localDatabase.table(TableEnum.SETTINGS).put({
                id: SettingIdEnum.PROJECT_API_KEY,
                value: $event,
              })
            "
            :rules="[(val: string) => val?.length > 0 || 'Project API Key is required']"
            :disable="$q.loading.isActive"
            type="text"
            label="Project API Key"
          />

          <q-input
            outlined
            :model-value="settingsStore.userEmail"
            @update:model-value="
              localDatabase.table(TableEnum.SETTINGS).put({
                id: SettingIdEnum.USER_EMAIL,
                value: $event,
              })
            "
            :rules="[
              (val: string) => val?.length > 0 || 'Email is required',
              (val: string) => emailSchema.safeParse(val).success || 'Email is not valid',
            ]"
            :disable="$q.loading.isActive"
            type="email"
            label="Email"
          />

          <q-input
            outlined
            v-model="password"
            :rules="[(val: string) => val?.length > 0 || 'Password is required']"
            :disable="$q.loading.isActive"
            type="password"
            label="Password"
          />
        </q-card-section>

        <q-card-actions vertical>
          <q-btn
            :disable="$q.loading.isActive"
            no-caps
            color="primary"
            size="lg"
            label="Login"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.auth-dialog-width {
  width: 500px;
}
</style>
