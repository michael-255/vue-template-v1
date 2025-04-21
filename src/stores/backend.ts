import type { SupabaseClient } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useBackendStore = defineStore('backend', () => {
  const supabase: Ref<SupabaseClient> = ref(null!)
  const user: Ref<Record<string, any>> = ref(null!)

  return {
    supabase: supabase.value,
    user: user.value,
  }
})
