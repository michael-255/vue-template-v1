<script setup lang="ts">
import PageHeading from '@/components/PageHeading.vue'
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { DurationEnum, SettingIdEnum, TableEnum } from '@/shared/enums'
import {
  deleteIcon,
  logoutIcon,
  optionsIcon,
  refreshIcon,
  settingsIcon,
  storageIcon,
  userIcon,
} from '@/shared/icons'
import { useSettingsStore } from '@/stores/settings'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Settings` })

const settingsStore = useSettingsStore()

const logRetentionOptions = [
  DurationEnum['One Week'],
  DurationEnum['One Month'],
  DurationEnum['Three Months'],
  DurationEnum['Six Months'],
  DurationEnum['One Year'],
  DurationEnum.Forever,
]
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
        <q-btn :disable="$q.loading.isActive" :icon="logoutIcon" color="primary" label="Logout" />
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
        <q-item-label>Reset Settings</q-item-label>
        <q-item-label caption>
          Resets the app configuration to the default settings. This will log you out and remove all
          credentials.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-btn
        :disable="$q.loading.isActive"
        :icon="refreshIcon"
        color="warning"
        label="Reset Settings"
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
      />
    </q-item>
  </q-list>
</template>

<style scoped>
.log-retention-width {
  width: 150px;
}
</style>
