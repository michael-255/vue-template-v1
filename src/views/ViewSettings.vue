<script setup lang="ts">
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import PageHeading from '@/components/PageHeading.vue'
import useLogger from '@/composables/useLogger'
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { DurationEnum, RouteNameEnum, SettingIdEnum, TableEnum } from '@/shared/enums'
import {
  createIcon,
  debugIcon,
  deleteIcon,
  deleteXIcon,
  loginIcon,
  logoutIcon,
  logsIcon,
  optionsIcon,
  refreshIcon,
  settings2Icon,
  settingsIcon,
  storageIcon,
  userIcon,
  warnIcon,
} from '@/shared/icons'
import { useSettingsStore } from '@/stores/settings'
import { useMeta, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

useMeta({ title: `${appTitle} | Settings` })

const $q = useQuasar()
const { log } = useLogger()
const router = useRouter()
const settingsStore = useSettingsStore()

const isDevMode = import.meta.env.DEV

const logRetentionOptions = [
  DurationEnum['One Week'],
  DurationEnum['One Month'],
  DurationEnum['Three Months'],
  DurationEnum['Six Months'],
  DurationEnum['One Year'],
  DurationEnum.Forever,
]

/**
 * Logs the user out of the application.
 */
function onLogout() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      color: 'warning',
      icon: logoutIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      // TODO: Logout user
      // await supabase.auth.signOut()
      log.info('Successfully logged out')
    } catch (error) {
      log.error('Error logging out', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Resets the app to default settings and logs the user out.
 */
function onResetSettings() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Reset Settings',
      message:
        'Are you sure you want to reset the app to default settings? This will log you out and remove all credentials.',
      color: 'warning',
      icon: refreshIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      // TODO: Logout user
      // await supabase.auth.signOut()
      await localDatabase.table(TableEnum.SETTINGS).clear()
      await localDatabase.initializeSettings()
      log.info('Successfully reset Settings')
    } catch (error) {
      log.error('Error reseting Settings', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Deletes all logs from the local database.
 */
function onDeleteLogs() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Delete Logs',
      message: 'Are you sure you want to delete all Logs?',
      color: 'negative',
      icon: deleteIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      await localDatabase.table(TableEnum.LOGS).clear()
      log.info('Successfully deleted Logs')
    } catch (error) {
      log.error('Error deleting Logs', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Deletes the local database (settings and logs).
 */
function onDeleteLocalDatabase() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Delete Local Database',
      message:
        'Are you sure you want to delete the local database? You must reload the website after this action.',
      color: 'negative',
      icon: deleteXIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      await localDatabase.delete()
      $q.notify({
        message: 'Reload the website now',
        icon: warnIcon,
        color: 'warning',
      })
    } catch (error) {
      log.error('Error deleting local database', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Generates test logs for the application. Only available in development mode.
 */
function onTestLogs() {
  $q.loading.show()

  const testData = {
    userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    userName: 'Test User',
    categories: ['test', 'test2', 'test3', 'test4', 'test5'],
    junk: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quos iure repudiandae ipsa magni reiciendis eius? Ipsam, asperiores veniam minus eum, sequi aspernatur ullam molestiae ex ad deleniti, reiciendis fuga. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quos iure repudiandae ipsa magni reiciendis eius? Ipsam, asperiores veniam minus eum, sequi aspernatur ullam molestiae ex ad deleniti, reiciendis fuga.',
    error: new Error('Deep Error'),
  }

  log.print('Log - Print', testData)
  log.silentDebug('Log - Silent Debug', testData)
  log.debug('Log - Debug', testData)
  log.info('Log - Info', testData)
  log.warn('Log - Warn', testData)
  log.error('Log - Error', new Error('Test Error'))

  $q.loading.hide()
}
</script>

<template>
  <PageHeading :icon="settingsIcon" title="Settings" :go-back-btn="true" />

  <q-list padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="userIcon" />
      User
    </q-item-label>

    <div>
      <q-item>
        <q-item-section top>
          <q-item-label>Email</q-item-label>
          <q-item-label caption> very-log-email-address@test.com </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section top>
          <q-item-label>Id</q-item-label>
          <q-item-label caption> f47ac10b-58cc-4372-a567-0e02b2c3d479 </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-btn
          :disable="$q.loading.isActive"
          :icon="logoutIcon"
          color="primary"
          label="Logout"
          @click="onLogout()"
        />
      </q-item>
    </div>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="loginIcon"
        color="primary"
        label="Goto Login"
        @click="
          localDatabase.table(TableEnum.SETTINGS).put({
            id: SettingIdEnum.LOGIN_DIALOG,
            value: true,
          })
        "
      />
    </q-item>
  </q-list>

  <q-separator />

  <q-list padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="optionsIcon" />
      Options
    </q-item-label>

    <q-item tag="label" :disable="$q.loading.isActive">
      <q-item-section top>
        <q-item-label>Console Logs</q-item-label>
        <q-item-label caption> Show all console logs in the browser console. </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-toggle
          :model-value="settingsStore.consoleLogs"
          @update:model-value="
            localDatabase.table(TableEnum.SETTINGS).put({
              id: SettingIdEnum.CONSOLE_LOGS,
              value: $event,
            })
          "
          :disable="$q.loading.isActive"
          size="lg"
        />
      </q-item-section>
    </q-item>

    <q-item tag="label" :disable="$q.loading.isActive">
      <q-item-section top>
        <q-item-label>Info Popus</q-item-label>
        <q-item-label caption>
          Show popup messages when certain actions have been completed.
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-toggle
          :model-value="settingsStore.infoPopus"
          @update:model-value="
            localDatabase.table(TableEnum.SETTINGS).put({
              id: SettingIdEnum.INFO_POPUPS,
              value: $event,
            })
          "
          :disable="$q.loading.isActive"
          size="lg"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section top>
        <q-item-label>Log Retention</q-item-label>
        <q-item-label caption>
          Duration that logs remain stored until being removed automatically.
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-select
          :model-value="settingsStore.logRetentionDuration"
          @update:model-value="
            localDatabase.table(TableEnum.SETTINGS).put({
              id: SettingIdEnum.LOG_RETENTION_DURATION,
              value: $event,
            })
          "
          :options="logRetentionOptions"
          :disable="$q.loading.isActive"
          dense
          outlined
          label="Duration"
          class="log-retention-width"
        />
      </q-item-section>
    </q-item>
  </q-list>

  <q-separator />

  <q-list padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="storageIcon" />
      Local Data
    </q-item-label>

    <q-item>
      <q-item-section top>
        <q-item-label>Tables</q-item-label>
        <q-item-label caption> View tables for data stored in the local database. </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="logsIcon"
        color="primary"
        label="View Logs"
        @click="router.push({ name: RouteNameEnum.LOGS_TABLE })"
      />
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="settings2Icon"
        color="primary"
        label="View Settings"
        @click="router.push({ name: RouteNameEnum.SETTINGS_TABLE })"
      />
    </q-item>

    <q-item>
      <q-item-section top>
        <q-item-label>Reset Settings</q-item-label>
        <q-item-label caption>
          Resets the app to default settings. This will log you out and remove all credentials.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="refreshIcon"
        color="warning"
        label="Reset Settings"
        @click="onResetSettings()"
      />
    </q-item>

    <q-item>
      <q-item-section top>
        <q-item-label>Delete Logs</q-item-label>
        <q-item-label caption>
          Deletes all logs stored in the local database. This action cannot be undone.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="deleteIcon"
        color="negative"
        label="Delete Logs"
        @click="onDeleteLogs()"
      />
    </q-item>

    <q-item>
      <q-item-section top>
        <q-item-label>Delete Local Database</q-item-label>
        <q-item-label caption>
          Delete the local browser database and all of its data (requires app reload). Only required
          when making modifications to the local database configuration. Does not impact the data on
          Supabase. This action cannot be undone.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="deleteXIcon"
        color="negative"
        label="Delete Local Database"
        @click="onDeleteLocalDatabase()"
      />
    </q-item>
  </q-list>

  <q-separator />

  <q-list v-if="isDevMode" padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="debugIcon" />
      Development
    </q-item-label>

    <q-item>
      <q-item-section top>
        <q-item-label>Test Logs</q-item-label>
        <q-item-label caption> Generate several test logs for the app. </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="createIcon"
        color="accent"
        label="Test Logs"
        @click="onTestLogs()"
      />
    </q-item>
  </q-list>
</template>

<style scoped>
.log-retention-width {
  width: 150px;
}
</style>
