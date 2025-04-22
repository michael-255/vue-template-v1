import { SettingIdEnum } from '@/shared/enums'
import type { SettingType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * The default values for each setting are defined in `local-database.ts`
 */
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: [] as SettingType[],
  }),

  /**
   * Destructing the getters from the store will break reactivity.
   * Use settingsStore.{getter} instead.
   */
  getters: {
    // Supabase
    userEmail: (state) => {
      return state.settings.find((s: SettingType) => s.id === SettingIdEnum.USER_EMAIL)
        ?.value as string
    },
    projectUrl: (state) => {
      return state.settings.find((s: SettingType) => s.id === SettingIdEnum.PROJECT_URL)
        ?.value as string
    },
    projectApiKey: (state) => {
      return state.settings.find((s: SettingType) => s.id === SettingIdEnum.PROJECT_API_KEY)
        ?.value as string
    },
    // Internal
    loginDialog: (state) => {
      return state.settings.find((s: SettingType) => s.id === SettingIdEnum.LOGIN_DIALOG)
        ?.value as boolean
    },
    consoleLogs: (state) => {
      return state.settings.find((s: SettingType) => s.id === SettingIdEnum.CONSOLE_LOGS)
        ?.value as boolean
    },
    infoPopus: (state) => {
      return state.settings.find((s: SettingType) => s.id === SettingIdEnum.INFO_POPUPS)
        ?.value as boolean
    },
    logRetentionDuration: (state) => {
      return state.settings.find((s: SettingType) => s.id === SettingIdEnum.LOG_RETENTION_DURATION)
        ?.value as string
    },
  },
})
