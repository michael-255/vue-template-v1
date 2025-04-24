<script setup lang="ts">
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import PageHeading from '@/components/PageHeading.vue'
import useLogger from '@/composables/useLogger'
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { DurationEnum, LocalTableEnum, RouteNameEnum, SettingIdEnum } from '@/shared/enums'
import {
  closeIcon,
  createIcon,
  debugIcon,
  deleteIcon,
  deleteXIcon,
  exportFileIcon,
  importFileIcon,
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
import { logSchema, settingSchema } from '@/shared/schemas'
import type { BackupType, LogType, SettingType } from '@/shared/types'
import { useBackendStore } from '@/stores/backend'
import { useSettingsStore } from '@/stores/settings'
import { exportFile, QSpinnerGears, useMeta, useQuasar } from 'quasar'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appTitle} | Settings` })

const $q = useQuasar()
const { log } = useLogger()
const router = useRouter()
const settingsStore = useSettingsStore()
const backendStore = useBackendStore()

const isDevMode = import.meta.env.DEV
const importFile: Ref<File | null> = ref(null)
const logRetentionOptions = [
  DurationEnum['One Week'],
  DurationEnum['One Month'],
  DurationEnum['Three Months'],
  DurationEnum['Six Months'],
  DurationEnum['One Year'],
  DurationEnum.Forever,
]

/**
 * Handles rejected files during import and logs a warning.
 */
function onRejectedFile(entries: any) {
  const name = entries?.[0]?.file?.name
  const size = entries?.[0]?.file?.size
  const type = entries?.[0]?.file?.type
  log.warn(`Cannot import ${name}`, { name, size, type })
  importFile.value = null! // Clear input
}

/**
 * Logs the user out of the application.
 */
function onLogout() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      color: 'negative',
      icon: logoutIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      await backendStore.logout()
      log.info('Successfully logged out')
    } catch (error) {
      log.error('Error logging out', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Imports all data from a backup JSON file into the app database.
 */
function onImportBackup() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Import',
      message: 'Import backup local data from a JSON file into the local database?',
      color: 'info',
      icon: importFileIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()

      if (!importFile.value) {
        log.warn('No file selected for import')
        return
      }

      const backup = JSON.parse(await importFile.value.text()) as BackupType

      log.silentDebug('backup:', backup)

      const importSettings = backup?.settings ?? []
      const importLogs = backup?.logs ?? []

      const validLogs: LogType[] = []
      const validSettings: SettingType[] = []
      const invalidLogs: Partial<LogType>[] = []
      const invalidSettings: Partial<SettingType>[] = []

      // Validate each Log
      for (let i = 0; i < importLogs.length; i++) {
        const record = importLogs[i]
        if (logSchema.safeParse(record).success) {
          validLogs.push(logSchema.parse(record)) // Clean record with parse
        } else {
          invalidLogs.push(record)
        }
      }

      // Validate each Setting
      for (let i = 0; i < importSettings.length; i++) {
        const record = importSettings[i]
        if (settingSchema.safeParse(record).success) {
          validSettings.push(settingSchema.parse(record)) // Clean record with parse
        } else {
          invalidSettings.push(record)
        }
      }

      // Put settings into the local database over existing settings
      await Promise.all(
        validSettings.map((record) => localDatabase.table(LocalTableEnum.SETTINGS).put(record)),
      )

      log.info('Successfully imported Settings', {
        valid: validSettings.length,
        invalid: invalidSettings.length,
      })

      await localDatabase.table(LocalTableEnum.LOGS).bulkAdd(validLogs)

      log.info('Successfully imported Logs', {
        valid: validLogs.length,
        invalid: invalidLogs.length,
      })

      importFile.value = null // Clear input
    } catch (error) {
      log.error('Error during import', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Exports all app data into a backup JSON file.
 */
function onExportBackup() {
  const appNameSlug = appTitle.toLowerCase().split(' ').join('-')
  const date = new Date().toISOString().split('T')[0]
  const filename = `${appNameSlug}-${date}.json`

  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Export',
      message: `Export local data into the backup file ${filename}?`,
      color: 'info',
      icon: exportFileIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()

      // NOTE: Some tables have a custom export method and Logs are ignored
      const backup: BackupType = {
        appTitle: appTitle,
        createdAt: new Date().toISOString(),
        settings: await localDatabase.table(LocalTableEnum.SETTINGS).toArray(),
        logs: await localDatabase.table(LocalTableEnum.LOGS).toArray(),
      }

      log.silentDebug('backup:', backup)

      const backupJson = JSON.stringify(backup)

      const exported = exportFile(filename, backupJson, {
        encoding: 'UTF-8',
        mimeType: 'application/json',
      })

      if (exported === true) {
        log.info('Backup downloaded successfully', { filename })
      } else {
        throw new Error('Browser denied file download')
      }
    } catch (error) {
      log.error('Export failed', error as Error)
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
      await backendStore.logout()
      await localDatabase.table(LocalTableEnum.SETTINGS).clear()
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
      await localDatabase.table(LocalTableEnum.LOGS).clear()
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
  $q.loading.show({
    message: 'Testing Logs',
    spinner: QSpinnerGears,
  })

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
  <PageHeading :icon="settingsIcon" title="Settings">
    <q-btn round flat :icon="closeIcon" :to="{ name: RouteNameEnum.DASHBOARD }" />
  </PageHeading>

  <q-list padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="userIcon" />
      User
    </q-item-label>

    <div v-if="backendStore.isAuthenticated">
      <q-item>
        <q-item-section top>
          <q-item-label>Email</q-item-label>
          <q-item-label caption> {{ backendStore.user?.email }} </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section top>
          <q-item-label>Id</q-item-label>
          <q-item-label caption> {{ backendStore.user?.id }} </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-btn
          :disable="$q.loading.isActive"
          :icon="logoutIcon"
          color="negative"
          label="Logout"
          @click="onLogout()"
        />
      </q-item>
    </div>

    <div v-else>
      <q-item>
        <q-item-section top>
          <q-item-label>No User Found</q-item-label>
          <q-item-label caption>Please login using the required Supabase credentials.</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-btn
          :disable="$q.loading.isActive"
          :icon="loginIcon"
          color="primary"
          label="Login"
          @click="
            localDatabase.table(LocalTableEnum.SETTINGS).put({
              id: SettingIdEnum.LOGIN_DIALOG,
              value: true,
            })
          "
        />
      </q-item>
    </div>
  </q-list>

  <q-separator />

  <q-list padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="optionsIcon" />
      Options
    </q-item-label>

    <q-item tag="label" :disable="$q.loading.isActive">
      <q-item-section top>
        <q-item-label>Dark Mode</q-item-label>
        <q-item-label caption> Enable dark mode theme for the application. </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-toggle
          :model-value="settingsStore.darkMode"
          @update:model-value="
            localDatabase.table(LocalTableEnum.SETTINGS).put({
              id: SettingIdEnum.DARK_MODE,
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
        <q-item-label>Console Logs</q-item-label>
        <q-item-label caption> Show all console logs in the browser console. </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-toggle
          :model-value="settingsStore.consoleLogs"
          @update:model-value="
            localDatabase.table(LocalTableEnum.SETTINGS).put({
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
            localDatabase.table(LocalTableEnum.SETTINGS).put({
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
            localDatabase.table(LocalTableEnum.SETTINGS).put({
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
        <q-item-label>Import</q-item-label>
        <q-item-label caption>
          Import your local data from a JSON file. The app expects the data in the file to be
          structured the same as the exported version.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item class="q-mb-sm">
      <q-item-section top>
        <q-file
          v-model="importFile"
          :disable="$q.loading.isActive"
          label="Import File"
          clearable
          dense
          outlined
          accept="application/json"
          @rejected="onRejectedFile($event)"
        >
          <template v-slot:before>
            <q-btn
              :disable="!importFile || $q.loading.isActive"
              :icon="importFileIcon"
              color="primary"
              @click="onImportBackup()"
            />
          </template>
        </q-file>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section top>
        <q-item-label>Export</q-item-label>
        <q-item-label caption> Export your local data as a JSON file. </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        color="primary"
        label="Export as JSON"
        :icon="exportFileIcon"
        :disable="$q.loading.isActive"
        @click="onExportBackup()"
      />
    </q-item>

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
        color="info"
        label="View Logs"
        @click="router.push({ name: RouteNameEnum.LOGS_TABLE })"
      />
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="settings2Icon"
        color="info"
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

  <q-separator v-if="isDevMode" />

  <q-list v-if="isDevMode" padding>
    <q-item-label header>
      <q-icon class="on-left" size="sm" :name="debugIcon" />
      Development
    </q-item-label>

    <q-item>
      <q-item-section top>
        <q-item-label>Test Logger</q-item-label>
        <q-item-label caption> Generate several test logs for the app. </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="createIcon"
        color="accent"
        label="Test Logger"
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
