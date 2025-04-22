<script setup lang="ts">
import DialogInspectSetting from '@/components/dialogs/DialogInspectSetting.vue'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { closeIcon, settings2Icon } from '@/shared/icons'
import type { SettingType } from '@/shared/types'
import { recordsCount, tableColumn, visibleColumnsFromTableColumns } from '@/shared/utils'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appTitle} | View Settings` })

const $q = useQuasar()
const { goBack } = useRouting()
const { log } = useLogger()

const labelSingular = 'Setting'
const labelPlural = 'Settings'
const searchFilter: Ref<string> = ref('')
const tableColumns = [tableColumn('id', 'Id'), tableColumn('value', 'Value', 'SETTING')]
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))

const liveData: Ref<SettingType[]> = ref([])
const isLiveQueryFinished = ref(false)

const subscription = localDatabase.liveSettings().subscribe({
  next: (data) => {
    liveData.value = data
    isLiveQueryFinished.value = true
  },
  error: (error) => {
    log.error(`Error loading live ${labelPlural} data`, error as Error)
    isLiveQueryFinished.value = true
  },
})

/**
 * Opens the Inspect Setting dialog using the data from the clicked row.
 */
function onInspectSetting(record: Record<string, any>) {
  return $q.dialog({
    component: DialogInspectSetting,
    componentProps: { record },
  })
}

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <q-table
    fullscreen
    :rows="liveData"
    :columns="tableColumns"
    :visible-columns="visibleColumns"
    :rows-per-page-options="[0]"
    :filter="searchFilter"
    virtual-scroll
    row-key="id"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" class="cursor-pointer" @click="onInspectSetting(props.row)">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>

    <template v-slot:top>
      <div class="row justify-start full-width q-mb-md">
        <div class="col-10 text-h6 text-bold ellipsis">
          <q-icon class="q-pb-xs q-mr-xs" :name="settings2Icon" />
          {{ labelPlural }}
        </div>

        <q-btn
          round
          flat
          class="absolute-top-right q-mr-sm q-mt-sm"
          :icon="closeIcon"
          @click="goBack"
        />
      </div>

      <div class="row justify-start full-width">
        <q-input
          :disable="!liveData.length"
          outlined
          dense
          clearable
          debounce="300"
          v-model="searchFilter"
          placeholder="Search"
          class="full-width"
        />
      </div>
    </template>

    <template v-slot:bottom>
      {{ recordsCount(liveData, labelSingular, labelPlural) }}
    </template>
  </q-table>
</template>
