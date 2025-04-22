<script setup lang="ts">
import DialogInspectLog from '@/components/dialogs/DialogInspectLog.vue'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import { localDatabase } from '@/services/local-database'
import { appTitle } from '@/shared/constants'
import { closeIcon, columnsIcon, logsIcon, searchIcon } from '@/shared/icons'
import type { LogType } from '@/shared/types'
import {
  columnOptionsFromTableColumns,
  hiddenTableColumn,
  recordsCount,
  tableColumn,
  visibleColumnsFromTableColumns,
} from '@/shared/utils'
import { useMeta, useQuasar, type QTableColumn } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appTitle} | View Logs` })

const $q = useQuasar()
const { goBack } = useRouting()
const { log } = useLogger()

const labelSingular = 'Log'
const labelPlural = 'Logs'
const searchFilter: Ref<string> = ref('')
const tableColumns = [
  hiddenTableColumn('id'),
  tableColumn('id', 'Id', 'UUID'),
  tableColumn('created_at', 'Created Date', 'ISO-DATE'),
  tableColumn('log_level', 'Log Level'),
  tableColumn('label', 'Label', 'TEXT'),
  tableColumn('details', 'Details', 'OBJECT'),
]
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))

const liveData: Ref<LogType[]> = ref([])
const isLiveQueryFinished = ref(false)

const subscription = localDatabase.liveLogs().subscribe({
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
 * Opens the Inspect Log dialog using the data from the clicked row.
 */
function onInspectLog(record: Record<string, any>) {
  return $q.dialog({
    component: DialogInspectLog,
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
        <q-th
          v-for="col in props.cols"
          v-show="col.name !== 'hidden'"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" class="cursor-pointer" @click="onInspectLog(props.row)">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>

    <template v-slot:top>
      <div class="row justify-start full-width q-mb-md">
        <div class="col-10 text-h6 text-bold ellipsis">
          <q-icon class="q-pb-xs q-mr-xs" :name="logsIcon" />
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
        >
          <template v-slot:after>
            <q-select
              v-model="visibleColumns"
              :options="columnOptions"
              :disable="!liveData.length"
              multiple
              dense
              options-dense
              emit-value
              map-options
              option-value="name"
              display-value=""
              bg-color="primary"
            >
              <template v-slot:append>
                <q-icon color="white" :name="columnsIcon" />
              </template>
            </q-select>
          </template>

          <template v-slot:append>
            <q-icon :name="searchIcon" />
          </template>
        </q-input>
      </div>
    </template>

    <template v-slot:bottom>
      {{ recordsCount(liveData, labelSingular, labelPlural) }}
    </template>
  </q-table>
</template>
