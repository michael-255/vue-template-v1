<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { LocalTableEnum, SettingIdEnum } from '@/shared/enums'
import { closeIcon } from '@/shared/icons'
import { emailSchema, urlSchema } from '@/shared/schemas'
import { useBackendStore } from '@/stores/backend'
import { useSettingsStore } from '@/stores/settings'
import { QSpinnerGears, useQuasar } from 'quasar'
import { ref } from 'vue'
import DialogConfirm from './DialogConfirm.vue'

const $q = useQuasar()
const { log } = useLogger()
const settingsStore = useSettingsStore()
const backendStore = useBackendStore()

const password = ref('')
const isFormValid = ref(true)

/**
 * Log the user into the Supabase backend.
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
    await localDatabase.table(LocalTableEnum.SETTINGS).put({
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

/**
 * Cancels the login if the user wants to remain logged outwhile using parts of the app.
 */
async function onCancelLogin() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Cancel Login',
      message:
        "The application will not function correctly if you don't login. Are you sure you want to continue?",
      color: 'negative',
      icon: closeIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    await localDatabase.table(LocalTableEnum.SETTINGS).put({
      id: SettingIdEnum.LOGIN_DIALOG,
      value: false,
    })
  })
}
</script>

<template>
  <q-dialog
    :model-value="Boolean(settingsStore.loginDialog)"
    @update:model-value="
      localDatabase.table(LocalTableEnum.SETTINGS).put({
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
        <q-toolbar class="q-pr-xs">
          <q-toolbar-title>
            {{ appTitle }}
          </q-toolbar-title>

          <q-btn flat round :icon="closeIcon" @click="onCancelLogin()" />
        </q-toolbar>

        <q-card-section>
          <q-input
            :model-value="settingsStore.projectUrl"
            @update:model-value="
              localDatabase.table(LocalTableEnum.SETTINGS).put({
                id: SettingIdEnum.PROJECT_URL,
                value: $event,
              })
            "
            :rules="[
              (val: string) => val?.length > 0 || 'Project URL is required',
              (val: string) => urlSchema.safeParse(val).success || 'Project URL is not valid',
            ]"
            :disable="$q.loading.isActive"
            outlined
            clearable
            type="text"
            label="Project URL"
          />

          <q-input
            :model-value="settingsStore.projectApiKey"
            @update:model-value="
              localDatabase.table(LocalTableEnum.SETTINGS).put({
                id: SettingIdEnum.PROJECT_API_KEY,
                value: $event,
              })
            "
            :rules="[(val: string) => val?.length > 0 || 'Project API Key is required']"
            :disable="$q.loading.isActive"
            outlined
            clearable
            type="text"
            label="Project API Key"
          />

          <q-input
            :model-value="settingsStore.userEmail"
            @update:model-value="
              localDatabase.table(LocalTableEnum.SETTINGS).put({
                id: SettingIdEnum.USER_EMAIL,
                value: $event,
              })
            "
            :rules="[
              (val: string) => val?.length > 0 || 'Email is required',
              (val: string) => emailSchema.safeParse(val).success || 'Email is not valid',
            ]"
            :disable="$q.loading.isActive"
            outlined
            clearable
            type="email"
            label="Email"
          />

          <q-input
            v-model="password"
            :rules="[(val: string) => val?.length > 0 || 'Password is required']"
            :disable="$q.loading.isActive"
            outlined
            clearable
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
