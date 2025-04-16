import type { SupabaseClient } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBackendStore = defineStore('backend', () => {
  // State
  const supabase: SupabaseClient = ref(null!)
  const user: Record<string, any> = ref({})
  const settings: Record<string, any> = ref({})

  // Actions

  // Getters

  return {
    // State
    supabase,
    user,
    settings,
    // Actions
    // ...
    // Getters
    // ...
  }
})
