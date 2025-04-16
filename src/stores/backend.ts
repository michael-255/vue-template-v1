import { SettingIdEnum } from '@/shared/enums'
import type { SettingType } from '@/shared/types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBackendStore = defineStore('backend', () => {
  // State
  const supabase: SupabaseClient = ref(null!)
  const user: Record<string, any> = ref({})
  const settings: Record<string, any> = ref({})

  // Actions
  // ...

  // Getters
  const settingsUserEmail = computed(() => {
    return settings.value.find((s: SettingType) => s.id === SettingIdEnum.USER_EMAIL)
      ?.value as string
  })
  const settingsUserPassword = computed(() => {
    return settings.value.find((s: SettingType) => s.id === SettingIdEnum.USER_PASSWORD)
      ?.value as string
  })
  const settingsProjectUrl = computed(() => {
    return settings.value.find((s: SettingType) => s.id === SettingIdEnum.PROJECT_URL)
      ?.value as string
  })
  const settingsProjectPublicKey = computed(() => {
    return settings.value.find((s: SettingType) => s.id === SettingIdEnum.PROJECT_PUBLIC_KEY)
      ?.value as string
  })
  const settingsConsoleLogs = computed(() => {
    return settings.value.find((s: SettingType) => s.id === SettingIdEnum.CONSOLE_LOGS)
      ?.value as boolean
  })
  const settingsInfoPopups = computed(() => {
    return settings.value.find((s: SettingType) => s.id === SettingIdEnum.INFO_POPUPS)
      ?.value as boolean
  })
  const settingsLogRetentionDuration = computed(() => {
    return settings.value.find((s: SettingType) => s.id === SettingIdEnum.LOG_RETENTION_DURATION)
      ?.value as string
  })

  return {
    // State
    supabase,
    user,
    settings,
    // Actions
    // ...
    // Getters
    settingsUserEmail,
    settingsUserPassword,
    settingsProjectUrl,
    settingsProjectPublicKey,
    settingsConsoleLogs,
    settingsInfoPopups,
    settingsLogRetentionDuration,
  }
})
